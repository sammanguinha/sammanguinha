-- V21: Casa dos Guardiões. Layout decorativo privado, identidade pelo mesmo @/token do jogo.
create table if not exists public.sm21_player_homes (
  handle text primary key references public.profiles(handle) on delete cascade,
  state jsonb not null default '{"theme":"bosque","floor":"carvalho","placed":[],"owned":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.sm21_player_homes enable row level security;
revoke all on public.sm21_player_homes from PUBLIC, anon, authenticated;
create or replace function public.sm21_house_load(p_handle text, p_token text)
returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare h text:=lower(btrim(coalesce(p_handle,''))); result jsonb;
begin
  perform public.auth_profile(h,p_token);
  select state into result from public.sm21_player_homes where handle=h;
  return coalesce(result,'{"theme":"bosque","floor":"carvalho","placed":[],"owned":[]}'::jsonb);
end $$;
revoke all on function public.sm21_house_load(text,text) from public;
grant execute on function public.sm21_house_load(text,text) to anon,authenticated;

create or replace function public.sm21_house_save(p_handle text,p_token text,p_state jsonb)
returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare
 h text:=lower(btrim(coalesce(p_handle,'')));
 furniture jsonb; obj jsonb; key text; x int; y int;
 seen text[]:=array[]::text[]; allowed text[]:=array[
 'cama','mesa','estante','planta','tapete','lampiao','cristal','bau','lareira',
 'aquario','gato','trono','reliquias','livros','bandeira','espelho'];
 ownership text[]:=array[]::text[];
begin
 perform public.auth_profile(h,p_token);
 if p_state is null or jsonb_typeof(p_state)<>'object' or length(p_state::text)>6000 then raise exception 'casa_invalida'; end if;
 if p_state->>'theme' not in ('bosque','astral','amanhecer') then raise exception 'tema_invalido'; end if;
 if p_state->>'floor' not in ('carvalho','marmore','musgo') then raise exception 'piso_invalido'; end if;
 if coalesce(jsonb_typeof(p_state->'placed'),'null')<>'array' or jsonb_array_length(p_state->'placed')>24 then raise exception 'moveis_invalidos'; end if;
 if coalesce(jsonb_typeof(p_state->'owned'),'null')<>'array' or jsonb_array_length(p_state->'owned')>16 then raise exception 'inventario_invalido'; end if;
 for obj in select value from jsonb_array_elements(p_state->'owned')
 loop
  if jsonb_typeof(obj)<>'string' or (obj#>>'{}') <> all(allowed) then raise exception 'item_invalido'; end if;
  if (obj#>>'{}')=any(ownership) then raise exception 'item_duplicado';end if;
  ownership:=array_append(ownership,obj#>>'{}');
 end loop;
 for furniture in select value from jsonb_array_elements(p_state->'placed')
 loop
  if jsonb_typeof(furniture)<>'object' or furniture->>'id' <> all(allowed) or jsonb_typeof(furniture->'x')<>'number' or jsonb_typeof(furniture->'y')<>'number' then raise exception 'movel_invalido'; end if;
  key:=furniture->>'id';x:=(furniture->>'x')::int;y:=(furniture->>'y')::int;
  if x<0 or x>11 or y<0 or y>5 then raise exception 'posicao_invalida';end if;
  if not (key=any(ownership)) and not (key=any(array['cama','mesa','estante','planta','tapete','lampiao'])) then raise exception 'item_nao_adquirido'; end if;
  if (x::text||':'||y::text)=any(seen) then raise exception 'colisao_de_moveis'; end if;
  seen:=array_append(seen,x::text||':'||y::text);
 end loop;
 insert into public.sm21_player_homes(handle,state)
 values(h,jsonb_build_object('theme',p_state->'theme','floor',p_state->'floor','placed',p_state->'placed','owned',p_state->'owned'))
 on conflict(handle) do update set state=excluded.state,updated_at=now();
 return (select state from public.sm21_player_homes where handle=h);
end $$;
revoke all on function public.sm21_house_save(text,text,jsonb) from public;
grant execute on function public.sm21_house_save(text,text,jsonb) to anon,authenticated;
