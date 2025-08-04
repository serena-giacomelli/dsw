import { Entity, ManyToMany, ManyToOne, Property, Collection, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Tipo } from "./tipo.entity.js";
import { LineaPed } from "./lineaPed.entity.js";

@Entity()
export class Producto extends BaseEntity {
      @Property({nullable:false})
      nombre!: string
      
      @Property()
      cantidad!: number
      
      @Property()
      descripcion!: string
      
      @Property()
      precio!: number
      
      @Property({nullable:true})
      precio_oferta?: number

      @Property({nullable:false})
      imagen!: string

      @ManyToOne(() => Tipo, {nullable:false})
      tipo!: Rel<Tipo>

      @ManyToMany(() => LineaPed, lineaPed => lineaPed.productos)
      lineasPed = new Collection<LineaPed>(this)
      
  }