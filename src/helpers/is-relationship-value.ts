import { RelationshipKeys } from '~/enums/relationship.enum'

export const isRelationshipValue = (value: RelationshipKeys | ''): value is RelationshipKeys =>
  (value as RelationshipKeys) !== undefined
