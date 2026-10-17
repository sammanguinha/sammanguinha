-- V20 Pomar Vivo: chat comunitario em tempo real. Additive, sem alterar as tabelas existentes.
create table if not exists public.sm_live_messages (
  id bigint generated always as identity primary key,
  handle text not null check(handle ~ '^[a-z0-9._]{1,30}$'),
  room text not null default 'praca' check(room in ('praca','defesa','rpg')),
  body text not null check(char_length(body) between 2 and 180),
  status text not null default 'ok' check(status in ('ok','hidden')),
  created_at timestamptz not null default now()
);
create index if not exists sm_live_room_timeline on public.sm_live_messages(room, created_at desc, id desc) where status='ok';
create index if not exists sm_live_handle_rate on public.sm_live_messages(handle,created_at desc);
alter table public.sm_live_messages enable row level security;
revoke all on table public.sm_live_messages from public, anon, authenticated;
grant select on table public.sm_live_messages to anon, authenticated;
drop policy if exists "v20_read_approved_live" on public.sm_live_messages;
create policy "v20_read_approved_live" on public.sm_live_messages for select to anon, authenticated using (status='ok');

create table if not exists public.sm_live_reports (
  message_id bigint not null references public.sm_live_messages(id) on delete cascade,
  handle text not null check(handle ~ '^[a-z0-9._]{1,30}$'),
  reason text not null check(reason in ('ofensa','spam','dados_pessoais','outro')),
  created_at timestamptz not null default now(),
  primary key (message_id, handle)
);
alter table public.sm_live_reports enable row level security;
revoke all on table public.sm_live_reports from public, anon, authenticated;

create or replace function public.sm_live_send(p_handle text,p_token text,p_room text,p_body text)
returns bigint language plpgsql security definer set search_path = public, extensions as $$
declare h text := lower(btrim(coalesce(p_handle,''))); t text := btrim(coalesce(p_body,'')); out_id bigint;
begin
  perform public.auth_profile(h,p_token);
  if p_room not in ('praca','defesa','rpg') then raise exception 'sala_invalida'; end if;
  if char_length(t)<2 or char_length(t)>180 then raise exception 'tamanho_2_a_180'; end if;
  if t ~ '[[:cntrl:]]' then raise exception 'caracter_invalido'; end if;
  if t ~* '(https?://|www[.]|[[:alnum:]._%+-]+@[[:alnum:].-]+[.][[:alpha:]]{2,}|(?:[0-9][^0-9]*){11,})' then raise exception 'sem_links_ou_contatos'; end if;
  if t ~* '\m(pornografia|nazista|pedofilia|estupro|suicid[aá]r)\M' then raise exception 'mensagem_inadequada'; end if;
  perform pg_advisory_xact_lock(hashtext('sm_live_send:'||h));
  if exists(select 1 from public.sm_live_messages where handle=h and created_at>now()-interval '7 seconds') then raise exception 'espere_7_segundos'; end if;
  if (select count(*) from public.sm_live_messages where handle=h and created_at>now()-interval '5 minutes')>=8 then raise exception 'limite_5_minutos'; end if;
  if exists(select 1 from public.sm_live_messages where handle=h and lower(body)=lower(t) and created_at>now()-interval '3 minutes') then raise exception 'mensagem_repetida'; end if;
  insert into public.sm_live_messages(handle,room,body) values (h,p_room,t) returning id into out_id;
  return out_id;
end $$;
revoke all on function public.sm_live_send(text,text,text,text) from public;
grant execute on function public.sm_live_send(text,text,text,text) to anon, authenticated;

create or replace function public.sm_live_report(p_handle text,p_token text,p_id bigint,p_reason text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare h text:=lower(btrim(coalesce(p_handle,'')));
begin
  perform public.auth_profile(h,p_token);
  if p_reason not in ('ofensa','spam','dados_pessoais','outro') then raise exception 'motivo_invalido'; end if;
  if not exists(select 1 from public.sm_live_messages where id=p_id and status='ok' and handle<>h) then raise exception 'mensagem_indisponivel'; end if;
  if (select count(*) from public.sm_live_reports where handle=h and created_at>now()-interval '1 hour')>=5 then raise exception 'limite_denuncias'; end if;
  insert into public.sm_live_reports(message_id,handle,reason) values(p_id,h,p_reason) on conflict do nothing;
  if (select count(*) from public.sm_live_reports where message_id=p_id)>=3 then
    update public.sm_live_messages set status='hidden' where id=p_id;
  end if;
  return true;
end $$;
revoke all on function public.sm_live_report(text,text,bigint,text) from public;
grant execute on function public.sm_live_report(text,text,bigint,text) to anon, authenticated;

create or replace function public.sm_live_admin_set(p_pw text,p_id bigint,p_status text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.admin_ok(p_pw) then raise exception 'credencial_invalida'; end if;
  if p_status not in ('ok','hidden') then raise exception 'status_invalido'; end if;
  update public.sm_live_messages set status=p_status where id=p_id;
end $$;
revoke all on function public.sm_live_admin_set(text,bigint,text) from public;
grant execute on function public.sm_live_admin_set(text,bigint,text) to anon, authenticated;

do $$
begin
  if not exists(select 1 from pg_publication where pubname='supabase_realtime') then
    execute 'create publication supabase_realtime';
  end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sm_live_messages') then
    execute 'alter publication supabase_realtime add table public.sm_live_messages';
  end if;
end $$;
