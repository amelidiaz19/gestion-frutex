export interface ApiResponseEC {
    totalProductos: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    productos: ProductoEC[];
}

export interface ProductoEC {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    url_slug: string;
    keywords: string | null;
    precio_yuanes: string;
    porcentaje_ganancia: number;
    foto: string;
    estado: string;
    created_at: string;
    updated_at: string;
}