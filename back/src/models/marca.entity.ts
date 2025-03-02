import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Empresa } from "./empresa.entity.js";
import { Tipo } from "./tipo.entity.js";
import { Sucursal } from "./sucursal.entity.js";

@Entity()
export class Marca extends BaseEntity {
    @Property({nullable:false})
    nombre!: string
      
    @Property()
    cuil!: string

    @Property()
    telefono!: string

    @ManyToOne (() => Empresa , {nullable:false})
    empresa!: Rel <Empresa>

    @ManyToMany(() => Tipo, tipo => tipo.marcas, {owner:true})
    tipos = new Collection<Tipo>(this)

    @ManyToMany(() => Sucursal, sucursal => sucursal.marcas)
    sucursales = new Collection<Sucursal>(this)
  }