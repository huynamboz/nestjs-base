import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  PaginationDto,
  PaginationMetaDto,
  PaginatedResponseDto,
} from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  /**
   * Create paginated response
   */
  createPaginatedResponse<T>(
    data: T[],
    total: number,
    paginationDto: PaginationDto,
  ): PaginatedResponseDto<T> {
    const { page = 1, limit = 10 } = paginationDto;
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return {
      data,
      meta,
    };
  }

  /**
   * Apply pagination to TypeORM query builder
   */
  applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return queryBuilder.skip(skip).take(limit);
  }

  /**
   * Apply search filter to query builder
   */
  applySearch<T>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string,
    searchFields: string[],
  ): SelectQueryBuilder<T> {
    if (!searchTerm || searchFields.length === 0) {
      return queryBuilder;
    }

    const searchConditions = searchFields
      .map((field, index) => {
        const paramName = `search_${index}`;
        return `${field} ILIKE :${paramName}`;
      })
      .join(' OR ');

    return queryBuilder.andWhere(`(${searchConditions})`).setParameters(
      searchFields.reduce(
        (params, field, index) => {
          params[`search_${index}`] = `%${searchTerm}%`;
          return params;
        },
        {} as Record<string, string>,
      ),
    );
  }

  /**
   * Get paginated results from repository
   */
  async getPaginatedResults<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    searchFields: string[] = [],
    additionalConditions: Record<string, any> = {},
    relations: string[] = [],
  ): Promise<PaginatedResponseDto<T>> {
    const { page = 1, limit = 10, search } = paginationDto;

    // Create query builder
    let queryBuilder = repository.createQueryBuilder();

    // Add relations if provided
    if (relations.length > 0) {
      relations.forEach(relation => {
        // For simple relations, use leftJoinAndSelect
        // For nested relations like 'user.role', we need to handle differently
        if (relation.includes('.')) {
          const [parent, child] = relation.split('.');
          queryBuilder.leftJoinAndSelect(parent, parent)
                     .leftJoinAndSelect(`${parent}.${child}`, `${parent}_${child}`);
        } else {
          queryBuilder.leftJoinAndSelect(relation, relation);
        }
      });
    }

    // Apply search if provided
    if (search && searchFields.length > 0) {
      queryBuilder = this.applySearch(queryBuilder, search, searchFields);
    }

    // Apply additional conditions
    Object.entries(additionalConditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
      }
    });

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder = this.applyPagination(queryBuilder, paginationDto);

    // Get data
    const data = await queryBuilder.getMany();

    // Create paginated response
    return this.createPaginatedResponse(data, total, paginationDto);
  }
}
