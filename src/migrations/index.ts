import * as migration_20260222_111401_project_type_collection from './20260222_111401_project_type_collection';

export const migrations = [
  {
    up: migration_20260222_111401_project_type_collection.up,
    down: migration_20260222_111401_project_type_collection.down,
    name: '20260222_111401_project_type_collection'
  },
];
