import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "./pedido.entity.js";

@Entity()
export class Transportista extends BaseEntity {
      
    @Property({nullable:false})
    nombre!: string
      
    @Property()
    contacto?: string

    @OneToMany(() => Pedido, pedido => pedido.transportista, {cascade:[Cascade.ALL]})
    pedidos = new Collection<Pedido>(this)
  }