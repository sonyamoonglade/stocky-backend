import { filter, QueryBuilder } from "../../xander_qb/QueryBuilder";


export abstract class Repository<T> {


  abstract save(dto: any, ...rest: any): Promise<T | undefined>

  abstract getById(id: number| string): Promise<T | undefined>

  abstract delete(id: number | string): Promise<void | undefined>

  abstract update(id: number, updated: Partial<T | undefined>): Promise<T>

  abstract get(expression: filter<T>): Promise<T[]>

}



