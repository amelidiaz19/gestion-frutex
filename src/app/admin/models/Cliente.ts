export interface Cliente {
    dni_cliente: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
}

export interface ClienteResponse {
    totalClientes: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    clientes: Cliente[];
}