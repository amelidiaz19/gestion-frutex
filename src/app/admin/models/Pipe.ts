import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'Pipe',
  standalone: true
})
export class LinePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    const converted = value.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(converted);
  }
}