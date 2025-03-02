import { Entity, OneToMany, Property, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Marca } from "./marca.entity.js";

@Entity()
export class Empresa extends BaseEntity {

      @Property({nullable:false})
       nombre!: string 

      @Property({nullable:false})
       razonSocial!: string

      @Property({nullable:false})
       cuil!:string
       
      @Property()
       sitioWeb?:string

      @OneToMany(() => Marca, marca => marca.empresa, {cascade:[Cascade.ALL]})
      marcas = new Collection<Marca>(this)
  }