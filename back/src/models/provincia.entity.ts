import { Entity, OneToMany, Property, Collection, Cascade} from "@mikro-orm/core"
import { Localidad } from "./localidad.entity.js"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"

@Entity()
export class Provincia extends BaseEntity {

    @Property()
    nombre!: string

    @OneToMany(() => Localidad, localidad => localidad.provincia, {cascade:[Cascade.ALL]})
    localidades = new Collection<Localidad>(this)
}
