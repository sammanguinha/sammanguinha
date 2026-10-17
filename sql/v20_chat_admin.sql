create or replace function public.sm_live_admin_list(p_pw text)
returns table(id bigint, handle text, room text, body text, status text, created_at timestamptz, reports bigint)
language plpgsql security definer set search_path=public,extensions as $$
begin
  if not public.admin_ok(p_pw) then raise exception 'credencial_invalida'; end if;
  return query
  select m.id,m.handle,m.room,m.body,m.status,m.created_at,
    (select count(*) from public.sm_live_reports r where r.message_id=m.id)
  from public.sm_live_messages m order by m.created_at desc limit 100;
end $$;
revoke all on function public.sm_live_admin_list(text) from public;
grant execute on function public.sm_live_admin_list(text) to anon, authenticated;