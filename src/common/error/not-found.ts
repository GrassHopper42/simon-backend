export class EntityNotFoundError extends Error {
  constructor(entityName: string, id: any) {
    super(`${entityName} with id ${id} not found`);
  }
}
