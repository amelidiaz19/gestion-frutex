import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableComponent } from '../../admin/components/table/table.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductoEC } from '../../admin/models/ProductoEC';
import { ProductoService } from '../../admin/services/producto.service';
import { PopupComponent } from '../../admin/components/popup/popup.component';
import { LinePipe } from '../../admin/models/Pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagenComponent } from '../../admin/components/imagen/imagen.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, TableComponent, PopupComponent, LinePipe, ReactiveFormsModule, ImagenComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  productoForm!: FormGroup;
  
  private productosSubject = new BehaviorSubject<ProductoEC[]>([]);
  productos$ = this.productosSubject.asObservable();

  searchTerm = '';
  loading = false;
  totalProducts = 0;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  @ViewChild('codigoTemplate') codigoTemplate: any;
  @ViewChild('nombreTemplate') nombreTemplate: any;
  @ViewChild('descripcionTemplate') descripcionTemplate: any;
  @ViewChild('cajasTemplate') cajasTemplate: any;
  @ViewChild('cantidadXcajaTemplate') cantidadXcajaTemplate: any;
  @ViewChild('stockTemplate') stockTemplate: any;
  @ViewChild('editarTemplate') editarTemplate: any;

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { key: 'codigo', header: 'Código', template: this.codigoTemplate },
        { key: 'nombre', header: 'Nombre', template: this.nombreTemplate },
        { key: 'descripcion', header: 'Descripción', template: this.descripcionTemplate },
        { key: 'cajas', header: 'Cajas', template: this.cajasTemplate },
        { key: 'cantidad_por_caja', header: 'Unid. x Caja', template: this.cantidadXcajaTemplate },
        { key: 'stock', header: 'Stock', template: this.stockTemplate },
        { key: 'actions', header: 'Acción', template: this.editarTemplate }
      ];
      this.cdr.detectChanges();
    }, 0);
  }

  constructor(private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.productoForm = this.fb.group({
      id: [{value: 0, disabled: true}],
      codigo: ['', Validators.required],
      nombre:['', Validators.required],
      descripcion: ['', Validators.required],
      cajas: [0, Validators.required],
      cantidad_por_caja: [0, Validators.required],
      stock_actual: [{value: 0, disabled: true}, Validators.required],
      precio_dolares: [0, Validators.required],
      porcentaje_ganancia: [0, Validators.required],
      estado: ['Activo', Validators.required],
      url_slug: [''],
      keywords: [''],
      foto: [''],
    });

    this.productoForm.get('cajas')?.valueChanges.subscribe(() => {
      this.updateStockActual();
    });

    this.productoForm.get('cantidad_por_caja')?.valueChanges.subscribe(() => {
      this.updateStockActual();
    });
    
    this.loadProducts();
  }

  private updateStockActual() {
    const cajas = this.productoForm.get('cajas')?.value || 0;
    const cantidadPorCaja = this.productoForm.get('cantidad_por_caja')?.value || 0;
    const stockActual = cajas * cantidadPorCaja;
    
    this.productoForm.patchValue({
      stock_actual: stockActual
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formData = {
        ...this.productoForm.getRawValue(),
        id: this.selectedProduct.id  // Ensure we have the ID
      };

      this.productoService.updateProducto(formData).subscribe({
        next: (response) => {
          // Handle success
          console.log('Producto actualizado:', response);
          this.loadProducts();
        },
        error: (error) => {
          // Handle error
          console.error('Error al actualizar:', error);
        }
      });
    }
  }

  loadProducts() {
    this.loading = true;

    this.productoService.getProductosECINFO(
      this.currentPage, 
      this.itemsPerPage, 
      this.searchTerm
    ).subscribe(
      response => {
        if (response && response.productos) {
          this.totalProducts = response.totalProductos;
          this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.itemsPerPage));
          this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);
          
          this.productosSubject.next(response.productos);
          this.loading = false;

          console.log('Products loaded:', response.productos);
        }
      },
      error => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    );
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number) {
    const validPage = Math.max(1, Math.min(page, this.totalPages));
    if (validPage !== this.currentPage) {
      this.currentPage = validPage;
      this.loadProducts();
    }
  }

  showProductModal = false;
  selectedProduct: any = null;

  openProductModal(item: any) {
    this.selectedProduct = item;

    this.productoForm.patchValue({
      id: item.id || 0,
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      cajas: item.cajas || 0,
      cantidad_por_caja: item.cantidad_por_caja || 0,
      stock_actual: item.stock_actual || 0,
      precio_dolares: item.precio_dolares || 0,
      porcentaje_ganancia: item.porcentaje_ganancia || 0,
      estado: item.estado || 'Activo',
      url_slug: item.url_slug || '',
      keywords: item.keywords || '',
      foto: item.foto || '',
    });

    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }
}
