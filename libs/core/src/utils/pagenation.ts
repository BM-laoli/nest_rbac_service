import {
  EntityManager,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

interface InterPageInfo {
  page: number;
  pageSize: number;
  total?: number;
}

const DoPagenation = async <T>(
  pageInfo: InterPageInfo,
  entityManager: EntityManager,
  repository,
  where?: FindOptionsWhere<T>,
  relations?: FindOptionsRelationByString | FindOptionsRelations<T>,
) => {
  const { page, pageSize } = pageInfo;
  const repositoryValue = entityManager.getRepository<T>(repository);
  const [list, total] = await repositoryValue.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: where,
    relations: relations,
  });
  const pageInfoRes: InterPageInfo = {
    page: Number(page),
    pageSize: Number(pageSize),
    total: Number(total),
  };
  return {
    list,
    pageInfo: pageInfoRes,
  };
};

export { DoPagenation, InterPageInfo };
