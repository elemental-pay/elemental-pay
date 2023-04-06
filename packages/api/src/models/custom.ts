import { models } from 'elemental-orm';
import { FieldMetadata } from 'elemental-orm/lib/models/fields/types';

class _TextArrayField extends models.Field {
  metadata: FieldMetadata = {
    type: 'TEXT[]',
    constraints: [],
    // mod: ':value',
  };

  constructor(options: any) {
    super(options);
  }
}

export const TextArrayField = (options?: any) => new _TextArrayField(options);
