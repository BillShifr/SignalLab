# Skill: Safe Prisma Database Migration

Use this skill when adding or modifying database models in Signal Lab.

## Rules

1. **Never** use `prisma db push` in production
2. **Always** generate a named migration: `npx prisma migrate dev --name <descriptive-name>`
3. **Never** manually edit migration SQL files unless you know what you're doing
4. **Always** back up data before destructive migrations

## Workflow: Add a New Field

### Step 1: Update schema

File: `backend/prisma/schema.prisma`

```prisma
model ScenarioRun {
  // ... existing fields
  newField   String?    // add here (nullable for safe migration)
}
```

### Step 2: Generate migration (local dev)

```bash
cd backend
npx prisma migrate dev --name add-new-field-to-scenario-run
```

This creates `backend/prisma/migrations/<timestamp>_add-new-field-to-scenario-run/migration.sql`.

### Step 3: Verify migration SQL

Check `migration.sql` – ensure it's additive (ALTER TABLE ... ADD COLUMN).

### Step 4: Regenerate Prisma client

```bash
npx prisma generate
```

### Step 5: Update TypeScript types

Prisma auto-generates types. Update any service code that creates/reads the new field.

### Step 6: Deploy (production / Docker)

The `entrypoint.sh` runs `prisma migrate deploy` on container startup – no manual step needed.

## Workflow: Rename a Column (Breaking Change)

1. Add new column (nullable) in one migration
2. Backfill data via a data migration script
3. Update application code to use new column
4. Drop old column in a separate migration after verification

## Common Commands

```bash
# View current migration status
npx prisma migrate status

# Reset local dev database (NEVER in production)
npx prisma migrate reset

# Open Prisma Studio (local dev)
npx prisma studio
```

## Validation Checklist

- [ ] Schema change is additive (new nullable columns) or planned (breaking change workflow)
- [ ] Migration name is descriptive: `add-X-to-Y`, `remove-Z-from-W`, `create-new-model`
- [ ] `prisma generate` run after schema change
- [ ] Service code updated if new fields are used
- [ ] Migration committed to git alongside schema change
