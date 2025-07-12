import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { FormsModule } from '@angular/forms';
import { TableColumn, TableComponent } from '../../components/table/table.component';

type EstadoType = 'en_proceso' | 'confirmado' | 'entregado' | 'anulado';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit  {

  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('fechaTemplate') fechaTemplate!: TemplateRef<any>;
  @ViewChild('clienteTemplate') clienteTemplate!: TemplateRef<any>;
  @ViewChild('estadoTemplate') estadoTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') totalTemplate!: TemplateRef<any>;
  @ViewChild('accionTemplate') accionTemplate!: TemplateRef<any>;

  pedidos: any[] = [];
  columns: TableColumn[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';
  selectedPedido: any = null;
  estadoOptions: EstadoType[] = ['en_proceso', 'confirmado', 'entregado', 'anulado'];

  customActionConfig = {
    showView: true,
    showEdit: false,
    showDelete: false
  };

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.loadPedidos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { key: 'id', header: 'N° PEDIDO', template: this.idTemplate },
        { key: 'fecha_creacion', header: 'FECHA', template: this.fechaTemplate },
        { key: 'cliente_nombre', header: 'CLIENTE', template: this.clienteTemplate },
        { key: 'estado', header: 'ESTADO', template: this.estadoTemplate },
        { key: 'total', header: 'TOTAL', template: this.totalTemplate },
        { key: 'accion', header: 'ACCIÓN', template: this.accionTemplate }
      ];
    });
  }

  loadPedidos() {
    this.loading = true;
    this.pedidosService.getAllPedidos(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response) => {
        this.pedidos = response.pedidos;
        this.totalItems = response.totalPedidos;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pedidos:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPedidos();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadPedidos();
  }

  updateEstado(pedidoId: number, newEstado: string) {
    console.log('Updating pedido:', pedidoId, 'with estado:', newEstado);
    this.pedidosService.updatePedidoStatus(pedidoId, newEstado as any).subscribe({
      next: () => {
        this.loadPedidos();
      },
      error: (error) => {
        console.error('Error updating estado:', error);
      }
    });
  }

  getEstadoClass(estado: EstadoType): string {
    const classes: Record<EstadoType, string> = {
      'en_proceso': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'entregado': 'bg-green-100 text-green-800',
      'anulado': 'bg-red-100 text-red-800'
    };
    return classes[estado];
  }

  getEstadoText(estado: EstadoType): string {
    const estadoMap = {
      'en_proceso': 'En Proceso',
      'confirmado': 'Confirmado',
      'entregado': 'Entregado',
      'anulado': 'Anulado'
    };
    return estadoMap[estado];
  }

  openModal(pedido: any) {
    this.selectedPedido = pedido;
  }

  closeModal() {
    this.selectedPedido = null;
  }

  openSections = {
    cliente: true,
    entrega: true,
    productos: true
  };

  toggleSection(section: 'cliente' | 'entrega' | 'productos') {
    this.openSections[section] = !this.openSections[section];
  }

}
