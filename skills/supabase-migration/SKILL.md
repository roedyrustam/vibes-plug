---
name: supabase-migration
description: A skill to create or apply a Supabase database migration.
---

# Supabase Migration Skill

When the user asks to create or apply a database migration for Supabase, follow these instructions:

1. **Check Environment**: Ensure `supabase/migrations` directory exists. Run `list_dir` on it if needed.
2. **Review Available MCP Commands**: Utilize the Supabase MCP integration.
   - For listing existing migrations, use `mcp_supabase-mcp-server_list_migrations` with `project_id`.
   - Before executing migration queries on the server directly, confirm the SQL is correct.
3. **Execute Command**: 
   - Write the SQL script to a local migration file located in `supabase/migrations/` using `write_to_file`. Use standard timestamps or `supabase migration new` command to get the filename.
   - Run `npx supabase migration up` to test locally or use the remote MCP `apply_migration` if the user wants it applied remotely.
4. **Final Step**: Confirm with the user that the migration successfully completed.
