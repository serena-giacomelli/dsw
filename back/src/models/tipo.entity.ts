import { Cascade, Entity, OneToMany, Property, Collection, ManyToMany} from "@mikro-orm/core"
import { Producto } from "./prod.entity.js"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Marca } from "./marca.entity.js"

@Entity()
export class Tipo extends BaseEntity {

    @Property()
    nombre!: string
    
    @Property()
    descripcion!: string

    @OneToMany(() => Producto, prod => prod.tipo, {cascade:[Cascade.ALL]})
    productos = new Collection<Producto>(this)

    @ManyToMany(() => Marca, marca => marca.tipos)
    marcas = new Collection<Marca>(this)
  }
