
export class Producto {
    constructor(
      public nombre: string,
      public cantidad: number,
      public descripcion: string,
      public id : number,
      public id_tipo_producto: number,
      public precio: number,
      public precio_oferta: number
    ) {}
  }