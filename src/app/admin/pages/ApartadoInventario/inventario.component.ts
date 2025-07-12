import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject} from 'rxjs';
import { TableColumn,TableComponent } from '../../components/table/table.component';
import { SwitchComponent } from '../../components/switch/switch.component';
import { Producto } from '../../models/Producto';
import { ProductoService } from '../../services/producto.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { Router } from '@angular/router';
import { LinePipe } from '../../models/Pipe';
import { environment } from '../../../../environments/environment';

interface StoredProduct {
  product?: { id: number };
  producto?: { id: number };
  tipo_venta: 'caja' | 'docena' | 'unidad';
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  imports: [ CommonModule, FormsModule, TableComponent, PopupComponent, LinePipe]
})
export class InventarioComponent implements OnInit {

  orderStock: number = 1;
  // Popup related properties
  selectedItem: any = null;
  isPopupVisible: boolean = false;

  onViewItem(item: any) {
    this.selectedItem = item;
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
    this.selectedItem = null;
  }
  

  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();
  
  loading: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProducts: number = 0;
  totalPages: number = 1;

  // Notification properties
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationColor: string = 'blue';

  @ViewChild('imagenTemplate') imagenTemplate: any;

  @ViewChild('codigoTemplate') codigoTemplate: any;
  @ViewChild('nombreTemplate') descripcionTemplate: any;
  @ViewChild('cajasTemplate') cajasTemplate: any;
  @ViewChild('cantidadXcajaTemplate') cantidadXcajaTemplate: any;
  @ViewChild('stockTemplate') stockTemplate: any;
  @ViewChild('porcentajeTemplate') porcentajeTemplate: any;
  @ViewChild('itemDetailsTemplate') itemDetailsTemplate: any;

  @ViewChild('precioCajaTemplate') precioCajaTemplate: any;
  @ViewChild('precioDocenaTemplate') precioDocenaTemplate: any;
  @ViewChild('precioUnidadTemplate') precioUnidadTemplate: any;

  columns: TableColumn[] = [];

  showPorcentajeModal = false;
  selectedProduct: any = null;
  newPorcentaje: number = 0;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { key: 'imagen', header: 'Imagen', template: this.imagenTemplate },
        { key: 'codigo', header: 'Código', template: this.codigoTemplate },
        { key: 'descripcion', header: 'Descripción', template: this.descripcionTemplate },
        { key: 'cajas', header: 'Cajas', template: this.cajasTemplate },
        { key: 'cantidad_por_caja', header: 'Unid. x Caja', template: this.cantidadXcajaTemplate },
        { key: 'stock', header: 'Stock', template: this.stockTemplate },
        { key: 'precio_caja', header: 'P. Caja', template: this.precioCajaTemplate },
        { key: 'precio_docena', header: 'P. Docena', template: this.precioDocenaTemplate },
        { key: 'precio_unidad', header: 'P. Unidad', template: this.precioUnidadTemplate }
      ];
      this.cdr.detectChanges();
    }, 0);
}

  ngOnInit(): void {
    this.loadProducts();
  }

  getImageUrl(url: string): string {
    if (url?.startsWith('http')) {
      return url;
    }
    return `${environment.IMG_URL}/uploads/img/${url}`;
  }

  handleImageError(event: any) {
    event.target.src = 'https://importaciones-sarmiento.com/error.svg';
  }

  

  loadProducts() {
    this.loading = true;

    this.productoService.getProductos(
      this.currentPage, 
      this.itemsPerPage, 
      this.searchTerm,
      this.orderStock
    ).subscribe(
      response => {
        if (response && response.productos) {
          this.totalProducts = response.totalProductos;
          this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.itemsPerPage));
          this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);
          
          this.productosSubject.next(response.productos);
          this.loading = false;
        }
      },
      error => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    );
  }

  onPageChange(page: number) {
    const validPage = Math.max(1, Math.min(page, this.totalPages));
    if (validPage !== this.currentPage) {
      this.currentPage = validPage;
      this.loadProducts();
    }
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadProducts();
  }
  
  selectedProductForQuotation: Producto | null = null;
  selectedTipoVenta: 'caja' | 'docena' | 'unidad' | null = null;
  cantidadPersonalizada: number = 1;
  showQuotationPopup: boolean = false;

  onDoubleClickProduct(producto: Producto, tipoVenta: 'caja' | 'docena' | 'unidad') {
    this.selectedProductForQuotation = producto;
    this.selectedTipoVenta = tipoVenta;

    this.ngZone.run(() => {
      setTimeout(() => {
        const unidadesPorCaja = producto?.cantidad_por_caja ?? 0;
        const mitadCaja = Math.floor(unidadesPorCaja / 2);

        if (tipoVenta === 'caja') {
          this.cantidadPersonalizada = mitadCaja;
        } else if (tipoVenta === 'docena') {
          this.cantidadPersonalizada = 12;
        } else {
          this.cantidadPersonalizada = 1;
        }
        
        this.cdr.detectChanges();
      });
    });

    this.showQuotationPopup = true;
  }

  getRemainingQuantityByType(tipoVenta: string): string {
    if (!this.selectedProductForQuotation) return '0';
    
    const stockDisponible = this.selectedProductForQuotation.stock_actual ?? 0;
    const existingUnits = this.getExistingQuantity(this.selectedProductForQuotation.id, tipoVenta);
    const remainingUnits = stockDisponible - existingUnits;
  
    const totalExistingUnits = this.getTotalExistingQuantity(this.selectedProductForQuotation.id);
    const totalRemaining = stockDisponible - totalExistingUnits;
    let message = `Stock total disponible: ${totalRemaining} unidades. `;
  
    switch(tipoVenta) {
      case 'caja':
        if (remainingUnits < 50) { // Minimum for box price
          return message + '0 unidades (mínimo 50 unidades por caja)';
        }
        return message + `Puede agregar hasta ${remainingUnits} unidades en caja`;
      case 'docena':
        if (remainingUnits < 12) {
          return message + '0 unidades (mínimo una docena)';
        }
        if (remainingUnits >= 50) {
          const maxDocena = 49 - existingUnits; // Up to 49 units for dozen price
          return message + `Puede agregar hasta ${maxDocena} unidades en docena`;
        }
        return message + `Puede agregar hasta ${remainingUnits} unidades en docena`;
      default: // unidad
        if (remainingUnits < 1 || existingUnits >= 11) {
          return message + '0 unidades disponibles por unidad';
        }
        const maxUnidades = Math.min(remainingUnits, 11 - existingUnits);
        return message + `Puede agregar hasta ${maxUnidades} unidades individuales`;
    }
  }

  getTotalExistingQuantity(productId: number | undefined): number {
    if (!productId) return 0;
    const existingProductsJson = localStorage.getItem('selectedQuotationProducts');
    if (!existingProductsJson) return 0;

    const existingProducts = JSON.parse(existingProductsJson);
    return existingProducts.reduce((total: number, p: any) => {
      if (p.product?.id === productId) {
        return total + (p.cantidad || 0);
      }
      return total;
    }, 0);
  }

  isAddButtonDisabled(): boolean {
    if (!this.selectedProductForQuotation || !this.selectedTipoVenta) return true;
    
    const stockDisponible = this.selectedProductForQuotation.stock_actual ?? 0;
    
    // Get total existing quantity across all sale types
    const totalExistingUnits = this.getTotalExistingQuantity(this.selectedProductForQuotation.id);
    // Get existing quantity for current sale type
    const existingUnits = this.getExistingQuantity(this.selectedProductForQuotation.id, this.selectedTipoVenta);
    
    const totalQuantity = this.cantidadPersonalizada + existingUnits;
    const totalOverallQuantity = totalExistingUnits + this.cantidadPersonalizada;
  
    // Check if total quantity across all types exceeds stock
    if (totalOverallQuantity > stockDisponible || this.cantidadPersonalizada <= 0) return true;
  
    switch(this.selectedTipoVenta) {
      case 'caja':
        return totalQuantity < 50; // Minimum 50 units for box price
      case 'docena':
        return totalQuantity < 12 || totalQuantity >= 50; // Between 12 and 49 units for dozen price
      default: // unidad
        return totalQuantity >= 12 || existingUnits >= 11; // Up to 11 units for unit price
    }
  }

  getExistingQuantity(productId: number | undefined, tipoVenta: string): number {
    if (!productId) return 0;
    const existingProductsJson = localStorage.getItem('selectedQuotationProducts');
    if (!existingProductsJson) return 0;

    const existingProducts = JSON.parse(existingProductsJson);
    const existingProduct = existingProducts.find(
      (p: any) => p.product?.id === productId && p.tipo_venta === tipoVenta
    );

    return existingProduct ? existingProduct.cantidad : 0;
  }

  validarCantidad() {
    if (!this.selectedProductForQuotation || !this.selectedTipoVenta) return;
  
    const stockDisponible = this.selectedProductForQuotation.stock_actual ?? 0;
    const existingQuantity = this.getExistingQuantity(this.selectedProductForQuotation.id, this.selectedTipoVenta);
    const totalQuantity = this.cantidadPersonalizada + existingQuantity;
  
    // Validate stock first
    if (totalQuantity > stockDisponible) {
      this.cantidadPersonalizada = stockDisponible - existingQuantity;
      if (this.cantidadPersonalizada <= 0) {
        this.showToast(`Ya tiene la cantidad máxima disponible en stock (${existingQuantity} unidades)`, 'red');
        this.cantidadPersonalizada = 0;
        return;
      }
      this.showToast('Se ha ajustado la cantidad al máximo disponible', 'blue');
      return;
    }
  
    // Validate ranges by sale type
    if (this.selectedTipoVenta === 'caja') {
      if (totalQuantity < 50) {
        this.cantidadPersonalizada = 50 - existingQuantity;
        if (this.cantidadPersonalizada <= 0) {
          this.showToast(`Ya tiene ${existingQuantity} unidades. Cantidad mínima para caja es 50`, 'red');
          this.cantidadPersonalizada = 0;
        } else {
          this.showToast(`La cantidad mínima para precio por caja es 50 unidades`, 'blue');
        }
      }
    } 
    else if (this.selectedTipoVenta === 'docena') {
      if (totalQuantity < 12) {
        this.cantidadPersonalizada = 12 - existingQuantity;
        if (this.cantidadPersonalizada <= 0) {
          this.showToast(`Ya tiene ${existingQuantity} unidades. Cantidad mínima para docena es 12`, 'red');
          this.cantidadPersonalizada = 0;
        } else {
          this.showToast('La cantidad mínima para precio por docena es 12 unidades', 'blue');
        }
      }
      if (totalQuantity >= 50) {
        this.cantidadPersonalizada = 49 - existingQuantity;
        if (this.cantidadPersonalizada <= 0) {
          this.showToast(`Ya tiene ${existingQuantity} unidades. Debe usar precio por caja`, 'red');
          this.cantidadPersonalizada = 0;
        } else {
          this.showToast('Para esta cantidad, debe usar precio por caja', 'blue');
        }
      }
    }
    else { // unidad
      if (totalQuantity >= 12) {
        this.cantidadPersonalizada = 11 - existingQuantity;
        if (this.cantidadPersonalizada <= 0) {
          this.showToast(`Ya tiene ${existingQuantity} unidades. Debe usar precio por docena o caja`, 'red');
          this.cantidadPersonalizada = 0;
        } else {
          this.showToast('Para esta cantidad, debe usar precio por docena o caja', 'blue');
        }
      }
    }
  }

    calcularPrecio() {
      if (!this.selectedProductForQuotation || !this.selectedTipoVenta) return 0;
  
      const precioCaja = Number(this.selectedProductForQuotation?.precio_caja || 0);
      const precioDocena = Number(this.selectedProductForQuotation?.precio_docena || 0);
      const precioUnidad = Number(this.selectedProductForQuotation?.precio_unidad || 0);
  
      let precioFinal = 0;
      if (this.selectedTipoVenta === 'caja') {
        precioFinal = precioCaja;
      } else if (this.selectedTipoVenta === 'docena') {
        precioFinal = precioDocena;
      } else {
        precioFinal = precioUnidad;
      }

      console.log("precio enviado: ", precioFinal);
  
      return Number((precioFinal * this.cantidadPersonalizada).toFixed(2));
    }

    agregarAListaCotizacion() {
      if (!this.selectedProductForQuotation || !this.selectedTipoVenta) return;
  
      const existingProductsJson = localStorage.getItem('selectedQuotationProducts');
      const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
  
      // Check if product with same ID and sale type exists
      const existingProductIndex = existingProducts.findIndex(
        (p: any) => p.product?.id === this.selectedProductForQuotation?.id && 
                    p.tipo_venta === this.selectedTipoVenta
      );
  
      if (existingProductIndex !== -1) {
        // Update existing product quantity
        existingProducts[existingProductIndex].cantidad += this.cantidadPersonalizada;
        this.showToast(`Se actualizó la cantidad del producto ${this.selectedProductForQuotation.codigo}`, 'blue');
      } else {
        // Add new product
        const newCotizacionProduct = {
          product: this.selectedProductForQuotation,  // Changed from 'producto' to 'product'
          tipo_venta: this.selectedTipoVenta,
          cantidad: this.cantidadPersonalizada,
          precioVenta: this.calcularPrecio()
        };
        existingProducts.push(newCotizacionProduct);
        this.showToast(`Producto ${this.selectedProductForQuotation.codigo} agregado a la cotización`, 'blue');
      }
  
      localStorage.setItem('selectedQuotationProducts', JSON.stringify(existingProducts));
      this.showQuotationPopup = false;
    }

  // Method to show toast notification
  showToast(message: string, color: string = 'blue') {
    this.ngZone.run(() => {
      this.notificationMessage = message;
      this.notificationColor = color;
      this.showNotification = true;

      // Hide notification after 3 seconds
      setTimeout(() => {
        this.showNotification = false;
        this.cdr.detectChanges();
      }, 3000);
    });
  }

  closeQuotationPopup() {
    this.showQuotationPopup = false;
    this.selectedProductForQuotation = null;
    this.selectedTipoVenta = null;
    this.cantidadPersonalizada = 1;
  }

  Cotizacion() {
    this.router.navigate(['/dashboard/cotizacion']);
  }

  NuevoProducto(){
    this.router.navigate(['/dashboard/almacen']);
  }

}
