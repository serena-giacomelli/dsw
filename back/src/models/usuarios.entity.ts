import { Entity, Property, ManyToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "./pedido.entity.js";
import { Pago } from "./pago.entity.js";

@Entity()
export class Usuario extends BaseEntity {

    @Property({nullable:false})  
    nombre !:  string

    @Property({nullable:false})
    apellido!:  string

    @Property({nullable:false})
    dni!: string

    @Property({nullable:false}) 
    fechaNacimiento!: string

    @Property({nullable:false}) 
    mail!: string

    @ManyToMany(() => Pedido, pedido => pedido.usuarios, {cascade:[Cascade.ALL], owner: true}) //en una relacion muchos a muchos, uno de los lados debe ser owner, osea que tiene que tener la FK})
    pedidos = new Collection<Pedido>(this)

    @ManyToMany(() => Pago , pago => pago.usuarios)
    pagos = new Collection<Pago>(this)
  }