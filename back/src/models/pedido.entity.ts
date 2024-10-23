export class Pedido {
    constructor(
      public id: number, 
      public fecha_pedido: Date, 
      public total: number, 
      public tipo_entrega:string, 
      public estado:string,
      public id_usuario:number,
      public id_transportista:number,
    )   {}
  }
