import { Entity, Property, Collection, ManyToMany} from "@mikro-orm/core"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Marca } from "./marca.entity.js";
import { Localidad } from "./localidad.entity.js";

@Entity()
export class Sucursal extends BaseEntity {

    @Property()
    direccion!: string
    
    @Property()
    contacto!: string

    @ManyToMany(() => Marca, marca => marca.sucursales, {owner:true})
    marcas = new Collection<Marca>(this)

    @ManyToMany(() => Localidad, localidad => localidad.sucursales)
    localidades = new Collection<Localidad>(this)
  }
