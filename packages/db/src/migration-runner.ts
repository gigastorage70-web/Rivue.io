import { D1Database } from './d1-client';
import { D1_MIGRATIONS } from './migrations-data';

export interface MigrationRecord {
  id: string;
  name: string;
  applied_at: string;
}

export class D1MigrationRunner {
  constructor(private db: D1Database) {}

  async runMigrations(): Promise<string[]> {
    // 1. Ensure migrations tracking table exists
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS _d1_migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL
      );
    `);

    // 2. Fetch applied migrations
    const applied = await this.db
      .prepare('SELECT id FROM _d1_migrations ORDER BY applied_at ASC;')
      .all<{ id: string }>();

    const appliedIds = new Set((applied.results || []).map((r) => r.id));
    const appliedNow: string[] = [];

    // 3. Execute embedded migrations in sequence
    for (const migration of D1_MIGRATIONS) {
      if (appliedIds.has(migration.id)) {
        continue;
      }

      // Execute migration script
      await this.db.exec(migration.sql);

      // Record in _d1_migrations
      await this.db
        .prepare('INSERT INTO _d1_migrations (id, name, applied_at) VALUES (?, ?, ?);')
        .bind(migration.id, migration.name, new Date().toISOString())
        .run();

      appliedNow.push(migration.id);
    }

    return appliedNow;
  }
}
