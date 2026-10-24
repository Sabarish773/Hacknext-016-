import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
});

let ready: Promise<void> | null = null;

function init(): Promise<void> {
    if (!ready) {
        ready = pool
            .query(
                `CREATE TABLE IF NOT EXISTS app_state (id TEXT PRIMARY KEY, data JSONB NOT NULL);
         CREATE TABLE IF NOT EXISTS app_files (name TEXT PRIMARY KEY, data BYTEA NOT NULL);`
            )
            .then(() => undefined)
            .catch((e) => {
                ready = null;
                throw e;
            });
    }
    return ready;
}

export async function loadState(): Promise<Record<string, unknown> | null> {
    await init();
    const r = await pool.query('SELECT data FROM app_state WHERE id = $1', ['main']);
    return r.rows[0]?.data ?? null;
}

export async function saveState(state: unknown): Promise<void> {
    await init();
    await pool.query(
        `INSERT INTO app_state (id, data) VALUES ('main', $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        [JSON.stringify(state)]
    );
}

export async function putFile(name: string, data: Buffer): Promise<void> {
    await init();
    await pool.query(
        `INSERT INTO app_files (name, data) VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET data = EXCLUDED.data`,
        [name, data]
    );
}

export async function getFile(name: string): Promise<Buffer | null> {
    await init();
    const r = await pool.query('SELECT data FROM app_files WHERE name = $1', [name]);
    return r.rows[0]?.data ?? null;
}

export async function removeFile(name: string): Promise<boolean> {
    await init();
    const r = await pool.query('DELETE FROM app_files WHERE name = $1', [name]);
    return (r.rowCount ?? 0) > 0;
}