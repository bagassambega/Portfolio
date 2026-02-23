import * as migration_20260222_154250_org_experience from './20260222_154250_org_experience';
import * as migration_20260223_022520_publication_enhancement from './20260223_022520_publication_enhancement';

export const migrations = [
  {
    up: migration_20260222_154250_org_experience.up,
    down: migration_20260222_154250_org_experience.down,
    name: '20260222_154250_org_experience',
  },
  {
    up: migration_20260223_022520_publication_enhancement.up,
    down: migration_20260223_022520_publication_enhancement.down,
    name: '20260223_022520_publication_enhancement'
  },
];
