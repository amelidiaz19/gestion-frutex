import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlmacenService } from '../../../services/almacen.service';
import { CommonModule } from '@angular/common';
import { TableColumn, TableComponent } from '../../../components/table/table.component';

@Component({
  selector: 'app-almacen-detalle',
  imports: [CommonModule, TableComponent],
  templateUrl: './almacen-detalle.component.html',
  styleUrl: './almacen-detalle.component.css'
})
export class AlmacenDetalleComponent implements OnInit{

  @ViewChild('fechaTemplate') fechaTemplate!: TemplateRef<any>;
  @ViewChild('codigoTemplate') codigoTemplate!: TemplateRef<any>;
  @ViewChild('productoTemplate') productoTemplate!: TemplateRef<any>;
  @ViewChild('cajasTemplate') cajasTemplate!: TemplateRef<any>;
  @ViewChild('unidadesCajaTemplate') unidadesCajaTemplate!: TemplateRef<any>;
  @ViewChild('precioTemplate') precioTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') totalTemplate!: TemplateRef<any>;
  @ViewChild('empleadoTemplate') empleadoTemplate!: TemplateRef<any>;

  historial: any[] = [];
  columns: TableColumn[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';

  constructor(private almacenService: AlmacenService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { key: 'fecha_ingreso', header: 'Fecha', template: this.fechaTemplate },
        { key: 'producto_codigo', header: 'Código', template: this.codigoTemplate },
        { key: 'producto_nombre', header: 'Producto', template: this.productoTemplate },
        { key: 'cantidad_cajas', header: 'Cajas', template: this.cajasTemplate },
        { key: 'cantidad_por_caja', header: 'Unid/Caja', template: this.unidadesCajaTemplate },
        { key: 'precio_unitario', header: 'Precio Dolar', template: this.precioTemplate },
        { key: 'total_valor', header: 'Total Pagado', template: this.totalTemplate },
        { key: 'empleado', header: 'Empleado', template: this.empleadoTemplate }
      ];
    });
  }

  cargarHistorial() {
    this.loading = true;
    this.error = '';
    
    this.almacenService.obtenerHistorial(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.historial = response.data;
          this.totalItems = response.totalRegistros;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cargarHistorial();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.cargarHistorial();
  }

}
