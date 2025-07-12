import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { InventarioComponent } from "../pages/ApartadoInventario/inventario.component";
import { NgModule } from "@angular/core";
import { routes } from "../../app.routes";
import { LayoutComponent } from "./layout/layout.component";
import { UsuarioComponent } from "../pages/usuario/usuario.component";
import { ProductosComponent } from "../../website/productos/productos.component";
import { AlmacenComponent } from "../pages/ApartadoAlmacen/almacen/almacen.component";
import { AlmacenDetalleComponent } from "../pages/ApartadoAlmacen/almacen-detalle/almacen-detalle.component";
import { PedidosComponent } from "../pages/pedidos/pedidos.component";
import { MovimientosComponent } from "../pages/movimientos/movimientos.component";
import { ClienteComponent } from "../pages/cliente/cliente.component";

export default [
    {
      path: '', component: LayoutComponent,
      children: [
        { path: '', component: DashboardComponent},
        { path: 'admin-usuario', component: UsuarioComponent},
        { path: 'pedidos', component: PedidosComponent},
        { path: 'inventario', component: InventarioComponent},
        { path: 'productos', component: ProductosComponent},
        { path: 'almacen', component: AlmacenComponent},
        { path: 'almacen-historial', component: AlmacenDetalleComponent},
        { path: 'movimientos', component: MovimientosComponent},
        { path: 'clientes', component: ClienteComponent}
      ]
    },
  
  ] as Routes;
  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }  