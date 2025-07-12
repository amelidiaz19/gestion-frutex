import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { ClienteService } from '../../services/cliente.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  imports: [TableComponent, PopupComponent, FormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit{

  showPopup = false;
  newCliente = {
    dni_cliente: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    distrito: '',
    referencia: '',
    metodo_pago: 'efectivo',
    tipo_entrega: 'recojo',
    notas: ''
  };

  isEditing = false;
  selectedCliente: any = null;
  customActionConfig = {
    showView: true,
    showEdit: false,
    showDelete: false
  };

  @ViewChild('dniTemplate') dniTemplate!: TemplateRef<any>;
  @ViewChild('nombreTemplate') nombreTemplate!: TemplateRef<any>;
  @ViewChild('apellidoTemplate') apellidoTemplate!: TemplateRef<any>;
  @ViewChild('emailTemplate') emailTemplate!: TemplateRef<any>;
  @ViewChild('telefonoTemplate') telefonoTemplate!: TemplateRef<any>;
  @ViewChild('distritoTemplate') distritoTemplate!: TemplateRef<any>;

  clientes: any[] = [];
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  loading = false;

  emailError = false;
  errorMessage = '';

  columns = [
    { key: 'dni_cliente', header: 'DNI', template: null as unknown as TemplateRef<any> },
    { key: 'nombre', header: 'Nombre', template: null as unknown as TemplateRef<any> },
    { key: 'apellido', header: 'Apellido', template: null as unknown as TemplateRef<any> },
    { key: 'email', header: 'Email', template: null as unknown as TemplateRef<any> },
    { key: 'telefono', header: 'Teléfono', template: null as unknown as TemplateRef<any> },
    { key: 'distrito', header: 'Distrito', template: null as unknown as TemplateRef<any> }
  ];

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.loadClientes();
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'dni_cliente', header: 'DNI', template: this.dniTemplate },
      { key: 'nombre', header: 'Nombre', template: this.nombreTemplate },
      { key: 'apellido', header: 'Apellido', template: this.apellidoTemplate },
      { key: 'email', header: 'Email', template: this.emailTemplate },
      { key: 'telefono', header: 'Teléfono', template: this.telefonoTemplate },
      { key: 'distrito', header: 'Distrito', template: this.distritoTemplate }
    ];
  }

  loadClientes() {
    this.loading = true;
    this.clienteService.getClientes(this.currentPage, 10)
      .subscribe({
        next: (response) => {
          this.clientes = response.clientes;
          this.totalItems = response.totalClientes;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClientes();
  }

  onSearch(term: string) {
    this.currentPage = 1;
    this.clienteService.getClientes(this.currentPage, 10, term)
      .subscribe({
        next: (response) => {
          this.clientes = response.clientes;
          this.totalItems = response.totalClientes;
          this.totalPages = response.totalPages;
        },
        error: (error) => {
          console.error('Error searching clients:', error);
        }
      });
  }

  onCreateClick() {
    this.isEditing = false;
    this.selectedCliente = null;
    this.showPopup = true;
  }

  onViewClick(cliente: any) {
    this.isEditing = true;
    this.selectedCliente = { ...cliente };
    this.showPopup = true;
  }

  onClosePopup() {
    this.showPopup = false;
    this.isEditing = false;
    this.selectedCliente = null;
    this.emailError = false;
    this.resetForm();
  }

  resetForm() {
    this.newCliente = {
      dni_cliente: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      calle: '',
      numero: '',
      distrito: '',
      referencia: '',
      metodo_pago: 'efectivo',
      tipo_entrega: 'recojo',
      notas: ''
    };
  }

  onSubmit() {
    if (this.isEditing && this.selectedCliente) {
      this.clienteService.editarCliente(this.selectedCliente.dni_cliente, this.selectedCliente).subscribe({
        next: () => {
          this.loadClientes();
          this.onClosePopup();
          this.emailError = false;
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error updating client:', error);
          if (error.error?.message) {
            this.emailError = true;
            this.errorMessage = error.error.message;
          }
        }
      });
    } else {
      this.clienteService.createCliente(this.newCliente).subscribe({
        next: () => {
          this.loadClientes();
          this.onClosePopup();
        },
        error: (error) => {
          console.error('Error creating client:', error);
        }
      });
    }
  }

}
