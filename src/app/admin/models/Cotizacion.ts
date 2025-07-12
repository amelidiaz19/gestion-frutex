export interface Cotizacion {
  id?: string;
  fecha: string;
  
  cliente: {
    numero_documento: string;
    razon_social_nombres: string;
    cliente_direccion: string;
    codigo_tipo_entidad: string;
  };

  productos: Array<{
    product: any;
    cantidad: number;
    tipo_venta: 'caja' | 'docena' | 'unidad';
    cambiosPersonalizados?: {
      precioVenta?: number;
      descripcion_personalizada?: string;
    };
  }>;
  
  totales: {
    totalItems: number;
    totalAmount: number;
    totalUtilidad: number;
  };

  vendedor: string;
}