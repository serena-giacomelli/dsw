export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  ENTREGADO: 'entregado',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
} as const;

export type EstadoPedido = typeof ESTADOS_PEDIDO[keyof typeof ESTADOS_PEDIDO];

export const COLORES_ESTADO = {
  [ESTADOS_PEDIDO.PENDIENTE]: '#f39c12',
  [ESTADOS_PEDIDO.ENTREGADO]: '#3498db',
  [ESTADOS_PEDIDO.COMPLETADO]: '#27ae60',
  [ESTADOS_PEDIDO.CANCELADO]: '#e74c3c'
};

export const TEXTOS_ESTADO = {
  [ESTADOS_PEDIDO.PENDIENTE]: 'Pendiente',
  [ESTADOS_PEDIDO.ENTREGADO]: 'Entregado',
  [ESTADOS_PEDIDO.COMPLETADO]: 'Completado',
  [ESTADOS_PEDIDO.CANCELADO]: 'Cancelado'
};

export const getEstadoColor = (estado: string): string => {
  return COLORES_ESTADO[estado as EstadoPedido] || '#95a5a6';
};

export const getEstadoTexto = (estado: string): string => {
  return TEXTOS_ESTADO[estado as EstadoPedido] || estado;
};
