import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { TableColumn, TableComponent } from '../../components/table/table.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, TableComponent, PopupComponent, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  Usuarios$ = new BehaviorSubject<Usuario[]>([]);
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  selectedUsuarios: Usuario[] = [];

  showPopup = false;
  newUsuario = {
    dni_empleado: '',
    nombre: '',
    apellido: '',
    email: '',
    passwd: ''
  };

  @ViewChild('idTemplate') idTemplate: any;
  @ViewChild('nombreTemplate') nombreTemplate: any;
  @ViewChild('apellidoTemplate') apellidoTemplate: any;
  @ViewChild('correoTemplate') correoTemplate: any;
  @ViewChild('ultimaConexionTemplate') ultimaConexionTemplate: any;

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', template: null as any },
    { key: 'nombre', header: 'Nombre', template: null as any },
    { key: 'apellido', header: 'Apellido', template: null as any },
    { key: 'correo', header: 'Correo', template: null as any },
    { key: 'ultimaConexion', header: 'Última Conexión', template: null as any }
  ];

  currentUser: any;

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.loadUsuarios();
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'id', header: 'ID', template: this.idTemplate },
      { key: 'nombre', header: 'Nombre', template: this.nombreTemplate },
      { key: 'apellido', header: 'Apellido', template: this.apellidoTemplate },
      { key: 'correo', header: 'Correo', template: this.correoTemplate },
      { key: 'ultimaConexion', header: 'Ultima Conexión', template: this.ultimaConexionTemplate }
    ];
    this.cdr.detectChanges();
  }

  loadUsuarios() {
    this.loading = true;
    this.usuarioService.getUsuarios()
      .subscribe({
        next: (response) => {
          this.Usuarios$.next(response);
          this.totalItems = response.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando Usuarios:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsuarios();
  }

  onCreateClick() {
    this.showPopup = true;
  }

  onClosePopup() {
    this.showPopup = false;
    this.newUsuario = {
      dni_empleado: '',
      nombre: '',
      apellido: '',
      email: '',
      passwd: ''
    };
  }

  onSubmit() {
    if (!this.newUsuario.nombre || !this.newUsuario.dni_empleado ||!this.newUsuario.apellido || !this.newUsuario.email || !this.newUsuario.passwd) {
      alert('Todos los campos son requeridos');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    console.log('Current User:', currentUser);

    if (!currentUser) {
      alert('No se encontró información del usuario actual');
      return;
    }

    const registroData = {
      ...this.newUsuario,
      usuario: {
        id: currentUser.id
      }
    };

    console.log('Registro Data:', registroData);

    this.usuarioService.registrarUsuario(registroData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Usuario registrado exitosamente');
          this.onClosePopup();
          this.loadUsuarios();
        } else {
          alert(response.error || 'Error al registrar usuario');
        }
      },
      error: (error) => {
        if (error.status === 403) {
          alert('No tiene autorización para registrar usuarios');
        } else {
          console.error('Error:', error);
          alert(error.error?.error || 'Error al registrar usuario');
        }
      }
    });
  }
}
