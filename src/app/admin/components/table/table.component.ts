import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  header: string;
  template: TemplateRef<any> | null;  // Cambiar aquí: solo permitir TemplateRef o null
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalPages: number = 1;
  @Input() loading: boolean = false;
  @Input() loadingText: string = 'Loading...';
  @Input() showCheckbox: boolean = false;
  //@Input() showActions: boolean = false;
  @Input() showSearch: boolean = false;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() editItem = new EventEmitter<any>();
  @Output() viewItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() rowDoubleClick = new EventEmitter<any>();
  @Output() pdfItem = new EventEmitter<any>();

  @Input() customActionConfig: {
    showView?: boolean;
    showPdf?: boolean;
  } = {};

  get showActions(): boolean {
    return this.customActionConfig.showView || this.customActionConfig.showPdf || false;
  }

  selectedItems: Set<any> = new Set();
  Math = Math;

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchTermChange.emit(value);
  }

  onSelectAll(event: any) {
    if (event.target.checked) {
      this.items.forEach(item => this.selectedItems.add(item));
    } else {
      this.selectedItems.clear();
    }
    this.selectionChange.emit(Array.from(this.selectedItems));
  }

  onSelect(item: any) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
    this.selectionChange.emit(Array.from(this.selectedItems));
  }

  isSelected(item: any): boolean {
    return this.selectedItems.has(item);
  }
  
  onRowDoubleClick(item: any) {
    this.rowDoubleClick.emit(item);
  }

  private extractId(item: any): string | number | null {
    const idKeys = [
      'id',  
      'COD_INT', 
      'dni_cliente',0
    ];

    for (const key of idKeys) {
      if (item.hasOwnProperty(key) && item[key] != null) {
        return item[key];
      }
    }

    console.warn('No ID found in item:', item);
    return null;
  }

  item: any;

  onViewItem(item: any) {
    const itemId = this.extractId(item);
    this.viewItem.emit(item);
  }

  onPdfItem(item: any) {
    const itemId = this.extractId(item);
    this.pdfItem.emit(item);
  }
  
}
