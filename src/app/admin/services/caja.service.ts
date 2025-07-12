import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Common interfaces
interface MetodoPago {
  metodo: string;
  monto: number;
}

interface Producto {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Cuadre Rango interfaces
interface ResumenPago {
  fecha?: string;
  metodo_pago: string;
  total: string;
  cantidad_transacciones: number;
}

interface Venta {
  hora: string;
  total: number | string;
  cliente: string;
  vendedor: string;
  tipo_venta: string;
  metodos_pago: MetodoPago[];
  productos: Producto[];
}

interface ResumenDia {
  fecha: string;
  total_ventas: number;
  venta_total: string;
  resumen_pagos: ResumenPago[];
  ventas: Venta[];
}

interface CuadreRangoResponse {
  success: boolean;
  fechaInicio: string;
  fechaFin: string;
  resumen: ResumenDia[];
}

// Cuadre Diario interfaces
interface DetalleVenta {
  id_venta: number;
  hora: string;
  total: string;
  tipo_venta: string;
  cliente: string;
  vendedor: string;
  metodos_pago: MetodoPago[];
  productos: Producto[];
}

interface CuadreDiarioResponse {
  success: boolean;
  resumen: {
    fecha: string;
    total_ventas: number;
    venta_total: string;
    resumen_pagos: ResumenPago[];
    detalle_ventas: DetalleVenta[];
  };
}

// Resumen Métodos de Pago interfaces
interface DetalleVentaMetodoPago {
  id_venta: number;
  monto: number;
  hora: string;
  cliente: string;
}

interface ResumenMetodoPago {
  metodo_pago: string;
  cantidad_ventas: number;
  total: string;
  detalle_ventas: DetalleVentaMetodoPago[];
}

interface ResumenMetodosPagoResponse {
  success: boolean;
  fecha: string;
  resumen: ResumenMetodoPago[];
}

// Ventas por Vendedor interfaces
interface DetalleVentaVendedor {
  id_venta: number;
  hora: string;
  total: number;
  cliente: string;
  tipo_venta: string;
}

interface ResumenVendedor {
  id_usuario: number;
  vendedor: string;
  total_ventas: number;
  venta_total: string;
  detalle_ventas: DetalleVentaVendedor[];
}

interface VentasPorVendedorResponse {
  success: boolean;
  fecha: string;
  resumen: ResumenVendedor[];
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private apiUrl = environment.API_URL + '/api/caja';

  constructor(private http: HttpClient) { }

  getCuadreRango(fechaInicio: string, fechaFin: string): Observable<CuadreRangoResponse> {
    const params = { fechaInicio, fechaFin };
    return this.http.get<CuadreRangoResponse>(`${this.apiUrl}/cuadre-rango`, { params });
  }

  getCuadreDiario(fecha: string): Observable<CuadreDiarioResponse> {
    const params = { fecha };
    return this.http.get<CuadreDiarioResponse>(`${this.apiUrl}/cuadre-diario`, { params });
  }

  getResumenMetodosPago(fecha: string): Observable<ResumenMetodosPagoResponse> {
    const params = { fecha };
    return this.http.get<ResumenMetodosPagoResponse>(`${this.apiUrl}/resumen-metodos-pago`, { params });
  }

  getVentasPorVendedor(fecha: string): Observable<VentasPorVendedorResponse> {
    const params = { fecha };
    return this.http.get<VentasPorVendedorResponse>(`${this.apiUrl}/ventas-por-vendedor`, { params });
  }
}
