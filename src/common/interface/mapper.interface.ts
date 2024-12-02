export interface Mapper<DomainModle, DbEntity> {
  toDomain(entity: DbEntity): DomainModle;
  toEntity(domain: DomainModle): DbEntity;
}
