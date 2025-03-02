import { Entity, ManyToMany, Property, Collection, ManyToOne, OneToMany, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "./usuarios.entity.js";
import { Transportista } from "./transportista.entity.js";
import { LineaPed } from "./lineaPed.entity.js";
import { Pago } from "./pago.entity.js";

@Entity()
export class Pedido extends BaseEntity {

    @Property({nullable: false, unique: true})
    fecha_pedido!: Date

    @Property()
    total!: number

    @Property()
    tipo_entrega!: string

    @Property()
    estado!: string

    @ManyToMany(() => Usuario, usuario => usuario.pedidos)
    usuarios = new Collection<Usuario>(this)

    @ManyToOne(() => Transportista, {nullable: true})
    transportista!: Rel<Transportista>

    @OneToMany(() => LineaPed, lineaPed => lineaPed.pedido)
    lineasPed = new Collection<LineaPed>(this)

    @ManyToMany(() => Pago, pago => pago.pedidos)
    pagos = new Collection<Pago>(this)

}