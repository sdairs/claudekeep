-- Enable RLS
alter table chats enable row level security;

-- Policy for selecting chats (existing policy, shown for reference)
create policy "Users can view their own chats"
on chats for select
to authenticated
using (
  owner = auth.uid()
);

create policy "Anyone can view public chats"
on chats for select
to authenticated
using (
  public = true
);

-- Policy for updating chats
create policy "Users can update their own chats"
on chats for update
to authenticated
using (
  owner = auth.uid()
)
with check (
  owner = auth.uid()
);

-- Policy for deleting chats
create policy "Users can delete their own chats"
on chats for delete
to authenticated
using (
  owner = auth.uid()
);
