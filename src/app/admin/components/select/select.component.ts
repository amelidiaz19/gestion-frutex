import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccionar...';
  @Input() selectedValue: any = null;
  @Output() selectedValueChange = new EventEmitter<any>();

  onChange(event: any) {
    const value = event?.target?.value ?? event;
    this.selectedValue = value === '' ? null : value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
