-- V22 Fundação dos Reinos: backup e sincronização de casas V21.
-- Não altera sm21_player_homes (esquema legado incompatível) nem as tabelas de pontuação.
-- Identidade: tokens existentes do jogo são validados exclusivamente por auth_profile.
create table if not exists public.sm22_home_state (
  handle text primary key references public.profiles(handle) on delete cascade,
  revision bigint not null default 1 check (revision between 1 and 9223372036854775806),
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.sm22_home_state enable row level security;
revoke all on public.sm22_home_state from public, anon, authenticated;

-- Leitura somente pelo RPC autenticado com a chave do @.
create or replace function public.sm22_house_load(p_handle text, p_token text)
returns jsonb language plpgsql security definer
set search_path = public, extensions, pg_temp as $$
declare h text:=lower(btrim(coalesce(p_handle,''))); rec public.sm22_home_state%rowtype;
begin
  perform public.auth_profile(h,p_token);
  select * into rec from public.sm22_home_state where handle=h;
  if not found then return null; end if;
  return jsonb_build_object(
    'revision',rec.revision,
    'state',rec.state,
    'updated_at',rec.updated_at
  );
end $$;
revoke all on function public.sm22_house_load(text,text) from public;
grant execute on function public.sm22_house_load(text,text) to anon, authenticated;

-- Escrita por comparação de revisão. Mudanças simultâneas geram house_conflict sem perda de dados.
create or replace function public.sm22_house_save(
 p_handle text,p_token text,p_expected_revision bigint,p_state jsonb
)
returns jsonb language plpgsql security definer
set search_path = public, extensions, pg_temp as $$
declare
 h text:=lower(btrim(coalesce(p_handle,'')));
 rev bigint;
 obj jsonb; pair record; item_id text; pos text;
 xx numeric; yy numeric; n numeric;
 seen text[]:=array[]::text[];
 allowed text[]:=array['bed','table','fern','fireplace','library','crystal','banner','lantern','rug','throne'];
 placed_counts jsonb:='{}'::jsonb;
 max_counts jsonb:='{"bed":2,"table":2,"fern":8,"fireplace":2,"library":4,"crystal":5,"banner":4,"lantern":7,"rug":4,"throne":1}'::jsonb;
 clean jsonb;
begin
 perform public.auth_profile(h,p_token);
 if p_expected_revision is null or p_expected_revision<0 then raise exception 'house_revision_invalid'; end if;
 if p_state is null or jsonb_typeof(p_state)<>'object' or octet_length(p_state::text)>12000 then
  raise exception 'house_invalid_state';
 end if;
 if p_state->>'theme' not in ('twilight','spring','midnight')
   or p_state->>'floor' not in ('planks','stone','garden') then raise exception 'house_invalid_theme'; end if;
 if jsonb_typeof(p_state->'items') <> 'array'
    or jsonb_array_length(p_state->'items') > 54 then raise exception 'house_invalid_items'; end if;
 if jsonb_typeof(p_state->'inventory') <> 'object' then raise exception 'house_invalid_inventory'; end if;
 for pair in select key,value from jsonb_each(p_state->'inventory')
 loop
  if not pair.key=any(allowed) or jsonb_typeof(pair.value)<>'number' then
   raise exception 'house_invalid_inventory_item';
  end if;
  n:=(pair.value#>>'{}')::numeric;
  if n<0 or n>99 or n<>trunc(n) then raise exception 'house_invalid_inventory_count'; end if;
 end loop;
 for obj in select value from jsonb_array_elements(p_state->'items')
 loop
  if jsonb_typeof(obj)<>'object'
    or coalesce(obj->>'id','') <> all(allowed)
    or jsonb_typeof(obj->'x')<>'number'
    or jsonb_typeof(obj->'y')<>'number' then
    raise exception 'house_invalid_furniture';
  end if;
  item_id:=obj->>'id';
  xx:=(obj->>'x')::numeric; yy:=(obj->>'y')::numeric;
  if xx<>trunc(xx) or yy<>trunc(yy) or xx<0 or xx>8 or yy<0 or yy>5 then
    raise exception 'house_invalid_position';
  end if;
  pos:=xx::text||':'||yy::text;
  if pos=any(seen) then raise exception 'house_furniture_collision'; end if;
  seen:=array_append(seen,pos);
  placed_counts:=jsonb_set(placed_counts,array[item_id],
    to_jsonb(coalesce((placed_counts->>item_id)::integer,0)+1));
  if (placed_counts->>item_id)::int > (max_counts->>item_id)::int then
    raise exception 'house_furniture_limit';
  end if;
 end loop;
 if p_state->>'restDay' is not null and p_state->>'restDay' !~ '^([0-9]{4}-[0-9]{2}-[0-9]{2}|)$' then
   raise exception 'house_invalid_rest_day';
 end if;
 if p_state->'visits' is not null then
  if jsonb_typeof(p_state->'visits')<>'number' then raise exception 'house_invalid_visits'; end if;
  n:=(p_state->>'visits')::numeric;
  if n<>trunc(n) or n<0 or n>1000000 then raise exception 'house_invalid_visits'; end if;
 end if;

 -- Sanitiza campos: dados de fontes não confiáveis não podem adicionar objetos executáveis.
 clean:=jsonb_build_object(
  'version',1,'theme',p_state->'theme','floor',p_state->'floor',
  'items',p_state->'items','inventory',p_state->'inventory',
  'restDay',coalesce(p_state->'restDay','""'::jsonb),
  'visits',coalesce(p_state->'visits','0'::jsonb)
 );
 select revision into rev from public.sm22_home_state where handle=h for update;
 if found then
  if rev<>p_expected_revision then raise exception 'house_conflict'; end if;
  update public.sm22_home_state
     set revision=rev+1,state=clean,updated_at=now()
   where handle=h
   returning revision into rev;
 else
  if p_expected_revision<>0 then raise exception 'house_conflict'; end if;
  insert into public.sm22_home_state(handle,revision,state)
  values(h,1,clean) on conflict do nothing
  returning revision into rev;
  if not found then raise exception 'house_conflict'; end if;
 end if;
 return jsonb_build_object('revision',rev,'state',clean,'updated_at',now());
end $$;
revoke all on function public.sm22_house_save(text,text,bigint,jsonb) from public;
grant execute on function public.sm22_house_save(text,text,bigint,jsonb) to anon, authenticated;
