import { TipoProducto } from "../models/tipo.entity.js";
const tipoproducto = [new TipoProducto('Mueble living', 'Todo mueble que se usa en el living', '2f8f74cf-48d9-484e-9d82-234c30dee7cb'),
];
export class TipoProductoRepository {
    findAll() {
        return tipoproducto;
    }
    findOne(item) {
        return tipoproducto.find((tipo) => tipo.id === item.id);
    }
    add(item) {
        tipoproducto.push(item);
        return item;
    }
    update(item) {
        const TipoIdx = tipoproducto.findIndex((tipo) => tipo.id === tipo.id);
        if (TipoIdx !== -1) {
            tipoproducto[TipoIdx] = { ...tipoproducto[TipoIdx], ...item };
        }
        return tipoproducto[TipoIdx];
    }
    delet(item) {
        const tipoIdx = tipoproducto.findIndex((tipo) => tipo.id === item.id);
        if (tipoIdx !== -1) {
            const deletedTipo = tipoproducto[tipoIdx];
            tipoproducto.splice(tipoIdx, 1);
            return deletedTipo;
        }
    }
}
//# sourceMappingURL=tipo.repository.js.map