export interface Usuario {
    id: number;
    dni_empleado: string;
    nombre: string;
    apellido: string;
    email: string;
    passwd: string;
    ultima_conexion?: Date;
}

export interface UsuarioResponse {
    totalUsuarios: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    usuarios: Usuario[];
}