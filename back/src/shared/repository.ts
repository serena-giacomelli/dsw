/*de mysql */
export interface Repository <T> {
    findAll(): Promise<T[] | undefined>
    findOne(item: {id: string}): Promise<T | undefined>
    add(item: T): Promise<T | undefined>
    update(item: {id: string}, entity: T): Promise<T | undefined>
    remove(item: {id: string}): Promise<void>
}