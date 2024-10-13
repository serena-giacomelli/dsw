var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Entity, OneToMany, Property, Collection } from '@mikro-orm/core';
import { Usuario } from "./usuarios.entity.js";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
export let Pedido = class Pedido extends BaseEntity {
    constructor() {
        super(...arguments);
        //! obligatorio ?opcional
        this.pedidos = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "fecha_pedido", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Pedido.prototype, "total", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Pedido.prototype, "tipo_entrega", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Pedido.prototype, "estado", void 0);
__decorate([
    OneToMany(() => Usuario, usuario => usuario.pedidos, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Pedido.prototype, "pedidos", void 0);
Pedido = __decorate([
    Entity()
], Pedido);
//# sourceMappingURL=pedido.entity.js.map