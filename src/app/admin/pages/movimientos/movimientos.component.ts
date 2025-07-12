import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Venta, VentaService } from '../../services/venta.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-movimientos',
  imports: [CommonModule, TableComponent],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css'
})
export class MovimientosComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  totalItems = 0;

  totalPages = 1;
  loading = false;

  customActionConfig = {
    showView: true
  };

  columns: any[] = [];
  ventas: Venta[] = [];
  currentPage = 1;
  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('fechaTemplate') fechaTemplate!: TemplateRef<any>;
  @ViewChild('clienteTemplate') clienteTemplate!: TemplateRef<any>;
  @ViewChild('tipoTemplate') tipoTemplate!: TemplateRef<any>;
  @ViewChild('estadoTemplate') estadoTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') totalTemplate!: TemplateRef<any>;
  @ViewChild('metodosTemplate') metodosTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { key: 'id_venta', header: 'ID', template: this.idTemplate },
        { key: 'fecha_venta', header: 'Fecha', template: this.fechaTemplate },
        { key: 'nombre_cliente', header: 'Cliente', template: this.clienteTemplate },
        { key: 'tipo_venta', header: 'Tipo', template: this.tipoTemplate },
        { key: 'estado', header: 'Estado', template: this.estadoTemplate },
        { key: 'total', header: 'Total', template: this.totalTemplate },
        { key: 'metodos_pago', header: 'Método de Pago', template: this.metodosTemplate }
      ];
    });
  }

  constructor(private ventaService: VentaService) {}

  ngOnInit() {
    this.loadVentas();
  }

  searchTerm = '';

  loadVentas(page: number = 1) {
    this.loading = true;
    this.ventaService.getVentas(page, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.ventas = response.ventas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalVentas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadVentas();
  }

  showDetailsPopup = false;
  selectedVenta: any = null;

  async verDetalles(id: number) {
    try {
      const response = await this.ventaService.getVentaById(id).toPromise();
      if (response.success) {
        this.selectedVenta = response.venta;
        this.showDetailsPopup = true;
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
    }
  }

}
