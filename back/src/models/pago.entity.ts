import { Entity, Cascade, Property, Collection, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "./pedido.entity.js";
import { Usuario } from "./usuarios.entity.js";

@Entity()
export class Pago extends BaseEntity {

    @Property()
    estado!: string // 'pendiente', 'aprobado', 'rechazado'

    @Property()
    metodo_pago!: number // 1 = transferencia, 2 = tarjeta

    @Property({ nullable: true })
    monto?: number // Monto del pago

    @Property({ nullable: true })
    fecha_pago?: Date // Fecha del pago

    @Property({ nullable: true })
    comprobante_transferencia?: string // Para transferencias, URL o descripción del comprobante

    @Property({ nullable: true })
    numero_referencia?: string // Número de referencia de la transferencia o transacción

    @Property({ nullable: true })
    comentarios_admin?: string // Comentarios del admin al aprobar/rechazar

    @Property({ nullable: true })
    fecha_aprobacion?: Date // Fecha de aprobación/rechazo

    @ManyToMany(() => Pedido, pedido => pedido.pagos, {owner:true, cascade:[Cascade.ALL]})
    pedidos = new Collection<Pedido>(this)

    @ManyToMany(() => Usuario, usuario => usuario.pagos, {owner:true, cascade:[Cascade.ALL]})
    usuarios = new Collection<Usuario>(this)

}