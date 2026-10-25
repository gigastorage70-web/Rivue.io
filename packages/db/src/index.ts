export * from './seed';
export * from './repository';
export * from './d1-client';
export * from './migration-runner';
export * from './d1-repository';

import { RivueD1Repository } from './d1-repository';

// Global shared repository instance (singleton for Node / Next.js)
let globalRepo: RivueD1Repository | null = null;

export function getD1Repository(): RivueD1Repository {
  if (!globalRepo) {
    globalRepo = new RivueD1Repository();
  }
  return globalRepo;
}
