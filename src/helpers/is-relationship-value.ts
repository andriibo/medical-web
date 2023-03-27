import { RelationshipValues } from '~/enums/relationship.enum'

export const isRelationshipValue = (value: RelationshipValues | ''): value is RelationshipValues =>
  (value as RelationshipValues) !== undefined
