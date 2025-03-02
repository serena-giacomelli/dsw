import { Cascade, Entity, Property, Collection, ManyToMany, ManyToOne, Rel} from "@mikro-orm/core"
import { Pedido } from "./pedido.entity.js";
import { Producto } from "./prod.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"

@Entity()
export class LineaPed extends BaseEntity {

    @Property()
    cantidad!: string

    @Property()
    precio_unitario!: number

    @ManyToMany(() => Producto, producto => producto.lineasPed, {owner:true, cascade:[Cascade.ALL]})
    productos = new Collection<Producto>(this)

    @ManyToOne(() => Pedido, {nullable:false}) 
    pedido!: Rel<Pedido> 
  }
