import { Producto } from "../models/prod.entity";
const producto = [new Producto('Mueble living', '25', 'Todo mueble que se usa en el living', '2f8f74cf-48d9-484e-9d82-234c30dee7cb'),
];
export class ProductoRepository {
    findAll() {
        return producto;
    }
    findOne(item) {
        return producto.find((producto) => producto.codigo === item.codigo);
    }
    add(item) {
        producto.push(item);
        return item;
    }
    update(item) {
        const ProdIdx = producto.findIndex((producto) => producto.codigo === producto.codigo);
        if (ProdIdx !== -1) {
            producto[ProdIdx] = { ...producto[ProdIdx], ...item };
        }
        return producto[ProdIdx];
    }
    delet(item) {
        const prodIdx = producto.findIndex((producto) => producto.codigo === item.codigo);
        if (prodIdx !== -1) {
            const deletedProd = producto[prodIdx];
            producto.splice(prodIdx, 1);
            return deletedProd;
        }
    }
}
//# sourceMappingURL=prod.repository.js.map