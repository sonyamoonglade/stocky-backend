import { QueryBuilder } from "../../xander_qb/QueryBuilder";


export abstract class Repository<T> {


  abstract save(dto: any): Promise<T | undefined>

  abstract getById(id: number| string): Promise<T | undefined>

  abstract delete(id: number): Promise<void | undefined>

  abstract update(id: number, updated: Partial<T | undefined>): Promise<T>

}



