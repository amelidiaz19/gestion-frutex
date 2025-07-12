import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  @Input() label: string = 'Toggle me';
  @Output() orderStockChange = new EventEmitter<number>();

  isChecked: boolean = true;

  toggleSwitch() {
    this.isChecked = !this.isChecked;
    // 0 izqueirda, 1 derecha
    this.orderStockChange.emit(this.isChecked ? 1 : 0);
  }
}
