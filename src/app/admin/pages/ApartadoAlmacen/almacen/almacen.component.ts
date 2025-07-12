import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlmacenService } from '../../../services/almacen.service';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-almacen',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {

  productoForm: FormGroup;
  loading = false;
  mensaje = '';
  showMessage = false;
  messageType = '';
  productosTemp: any[] = [];

  private searchSubject = new Subject<string>();

  constructor(private fb: FormBuilder,
    private almacenService: AlmacenService,
    private authService: AuthService,
    private router: Router,
    private productoService: ProductoService) {
      this.productoForm = this.fb.group({
        id: [''],
        codigo: ['', Validators.required],
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        keywords: [''],
        cajas: ['', [Validators.required, Validators.min(1)]],
        cantidad_por_caja: ['', [Validators.required, Validators.min(1)]],
        precio_dolares: ['', [Validators.required, Validators.min(0)]],
        porcentaje_ganancia: ['2', [Validators.required, Validators.min(0)]],
        foto: [''],
        alt_texto: [''],
        estado: [1]
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.realizarBusqueda(term);
    });
  }

  registrarProducto() {
    if (this.productoForm.valid) {
      // Add the product to temporary list
      this.almacenService.agregarProductoTemp({
        id: this.productoForm.get('id')?.value,
        codigo: this.productoForm.get('codigo')?.value,
        nombre: this.productoForm.get('nombre')?.value,
        descripcion: this.productoForm.get('descripcion')?.value,
        keywords: this.productoForm.get('keywords')?.value,
        cajas: this.productoForm.get('cajas')?.value,
        cantidad_por_caja: this.productoForm.get('cantidad_por_caja')?.value,
        precio_dolares: this.productoForm.get('precio_dolares')?.value,
        porcentaje_ganancia: this.productoForm.get('porcentaje_ganancia')?.value,
        estado: 1
      });

      this.productosTemp = this.almacenService.obtenerProductosTemp();
      this.mostrarMensaje('Producto agregado a la lista', 'success');
      this.productoForm.reset({
        porcentaje_ganancia: '2',
        estado: 1
      });
    } else {
      // Show which fields are invalid
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          this.mostrarMensaje(`Por favor complete todos los campos requeridos`, 'error');
        }
      });
    }
  }

  enviarProductos() {
    if (this.productosTemp.length === 0) {
      this.mostrarMensaje('Agregue al menos un producto', 'error');
      return;
    }

    const userId = this.authService.currentUserValue?.id || 1;

    this.loading = true;
    this.almacenService.registrarProductos(userId).subscribe({
      next: (response) => {
        this.mostrarMensaje('Productos registrados exitosamente', 'success');
        this.almacenService.limpiarProductosTemp();
        this.productosTemp = [];
        this.loading = false;

        this.router.navigate(['/dashboard/almacen-historial']);
      },
      error: (error) => {
        this.mostrarMensaje('Error al registrar los productos', 'error');
        this.loading = false;
      }
    });
  }

  eliminarProductoTemp(index: number) {
    this.productosTemp.splice(index, 1);
    this.mostrarMensaje('Producto eliminado de la lista', 'success');
  }

  mostrarMensaje(mensaje: string, tipo: string) {
    this.mensaje = mensaje;
    this.messageType = tipo;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  codigoBusqueda: string = '';
  productoExistente: any = null;

  productosEncontrados: any[] = [];
  mostrarSelect: boolean = false;
  
  buscarProducto() {
    this.searchSubject.next(this.codigoBusqueda);
  }

  private realizarBusqueda(term: string) {
    if (!term.trim()) {
      this.productosEncontrados = [];
      this.mostrarSelect = false;
      return;
    }
  
    this.productoService.getProductos(1, 10, term).subscribe({
      next: (response) => {
        if (response.productos && response.productos.length > 0) {
          this.productosEncontrados = response.productos;
          this.mostrarSelect = true;
        } else {
          this.productosEncontrados = [];
          this.mostrarSelect = false;
          this.productoExistente = null;
        }
      },
      error: (error) => {
        this.mostrarMensaje('Error al buscar el producto', 'error');
      }
    });
  }
  
  seleccionarProducto(producto: any) {
    this.productoExistente = producto

    this.productoForm.get('codigo')?.disable();
    this.productoForm.get('nombre')?.disable();
    this.productoForm.get('descripcion')?.disable();
    this.productoForm.get('keywords')?.disable();
    this.productoForm.get('cantidad_por_caja')?.disable();
    this.productoForm.get('precio_dolares')?.disable();
    this.productoForm.get('porcentaje_ganancia')?.disable();
    
    this.productoForm.patchValue({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      keywords: producto.keywords,
      foto: producto.foto,
      alt_texto: producto.alt_texto,
      cantidad_por_caja: producto.cantidad_por_caja,
      precio_dolares: producto.precio_dolares,
      porcentaje_ganancia: producto.porcentaje_ganancia || '2'
    });

    console.log('Producto seleccionado:', this.productoForm.value);

    this.productoForm.get('codigo')?.disable();
    this.productoForm.get('nombre')?.disable();
    this.productoForm.get('descripcion')?.disable();
    this.productoForm.get('keywords')?.disable();
    this.mostrarSelect = false;
    this.mostrarMensaje('Producto seleccionado', 'success');
  }

  nuevoProducto() {
    this.productoExistente = null;

    this.productoForm.get('codigo')?.enable();
    this.productoForm.get('nombre')?.enable();
    this.productoForm.get('descripcion')?.enable();
    this.productoForm.get('keywords')?.enable();
    this.productoForm.get('cantidad_por_caja')?.enable();
    this.productoForm.get('precio_doalres')?.enable();
    this.productoForm.get('porcentaje_ganancia')?.enable();

    this.productoForm.reset({
      porcentaje_ganancia: '2',
      estado: 1
    });
    this.productoForm.enable();
  }

}
