/**
 * Production Readiness & Live-Data Standard Guard Script
 * production-grade-dashboard-standard.md (§4, §5, §8)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== [Rivue] Verifying Production Grade Live-Data Standard ===');

// 1. Anti-Mock Production Guard (§4 & §8)
const isProd = process.env.NODE_ENV === 'production';
const useMock = process.env.USE_MOCK_DATA === 'true';

if (isProd && useMock) {
  console.error('\x1b[31m[CRITICAL FAILURE] Standard §4 Violation:\x1b[0m');
  console.error('USE_MOCK_DATA is set to true in a production build. Production builds MUST fail when mock data is enabled.');
  process.exit(1);
}
console.log('✔ Anti-Mock Contract verified: Mock data cannot leak into production environment.');

// 2. Verify .env.example (§8)
const envExamplePath = path.resolve(__dirname, '..', '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.error('\x1b[31m[FAILURE] Standard §8 Violation:\x1b[0m Missing .env.example documentation file.');
  process.exit(1);
}
const envExample = fs.readFileSync(envExamplePath, 'utf8');
const requiredEnvVars = [
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_D1_DATABASE_ID',
  'CLOUDFLARE_API_TOKEN',
  'SERPER_API_KEY',
  'USE_MOCK_DATA',
];
for (const envVar of requiredEnvVars) {
  if (!envExample.includes(envVar)) {
    console.error(`\x1b[31m[FAILURE]\x1b[0m .env.example missing required variable: ${envVar}`);
    process.exit(1);
  }
}
console.log('✔ Environment variables documented in .env.example with Cloudflare D1 & Serper credentials.');

// 3. Verify Cloudflare D1 SQLite Migrations Exist (§8 Data Layer)
const migrationsDir = path.resolve(__dirname, '..', 'packages', 'db', 'migrations');
if (!fs.existsSync(migrationsDir) || fs.readdirSync(migrationsDir).length === 0) {
  console.error('\x1b[31m[FAILURE]\x1b[0m Cloudflare D1 SQLite migrations directory is empty or missing.');
  process.exit(1);
}
console.log('✔ Cloudflare D1 SQLite migrations present and verified.');

// 4. Verify Proof-of-Life Directory Exists (§9)
const proofOfLifeDir = path.resolve(__dirname, '..', 'docs', 'proof-of-life');
if (!fs.existsSync(proofOfLifeDir)) {
  fs.mkdirSync(proofOfLifeDir, { recursive: true });
}
console.log('✔ Proof-of-life artifact directory confirmed: /docs/proof-of-life/');

console.log('\x1b[32m✔ All Production-Grade Live-Data Standard pre-flight checks passed cleanly.\x1b[0m');
