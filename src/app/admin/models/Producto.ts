export interface ApiResponse {
    totalProductos: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    productos: Producto[];
}

export interface Producto {
    id: number;
    codigo: string;
    descripcion: string;
    cajas: number;
    cantidad_por_caja: number;
    precio_yuanes: number;
    porcentaje_ganancia: number;
    foto?: string;
    created_at: Date;
    // Campos calculados de la vista
    stock_actual?: number;
    precio_costo_soles?: number;
    precio_caja?: number;
    precio_docena?: number;
    precio_unidad?: number;
}