import { Entity, Cascade, Property, Collection, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "./pedido.entity.js";
import { Usuario } from "./usuarios.entity.js";

@Entity()
export class Pago extends BaseEntity {

    @Property()
    estado!: string

    @Property()
    metodo_pago!: number

    @ManyToMany(() => Pedido, pedido => pedido.pagos, {owner:true, cascade:[Cascade.ALL]})
    pedidos = new Collection<Pedido>(this)

    @ManyToMany(() => Usuario, usuario => usuario.pagos, {owner:true, cascade:[Cascade.ALL]})
    usuarios = new Collection<Usuario>(this)




}