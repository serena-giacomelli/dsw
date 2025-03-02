import { Cascade, Entity, Property, Collection, ManyToMany, ManyToOne, Rel} from "@mikro-orm/core"
import { Sucursal } from "./sucursal.entity.js"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Provincia } from "./provincia.entity.js"

@Entity()
export class Localidad extends BaseEntity {

    @Property()
    nombre!: string

    @ManyToMany(() => Sucursal, sucursal => sucursal.localidades, {owner:true, cascade:[Cascade.ALL]})
    sucursales = new Collection<Sucursal>(this)
 
    @ManyToOne(() => Provincia, {nullable:false})
    provincia!: Rel<Provincia> }