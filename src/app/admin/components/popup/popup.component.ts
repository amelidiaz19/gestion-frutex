import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Información';
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() context: any = {};
  @Input() popupClass: string = 'max-w-md';
  @Output() closePopup = new EventEmitter<void>();

  onClose() {
    this.closePopup.emit();
  }
}
