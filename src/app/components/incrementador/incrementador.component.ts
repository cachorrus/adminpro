import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @Input() progreso: number;
  @Input() leyenda: string;
  @Output() actualizaValor: EventEmitter<number>;
  @ViewChild('txtProgreso') txtProgreso: ElementRef;

  constructor() {
    this.progreso = 50;
    this.leyenda = 'leyenda';
    this.actualizaValor = new EventEmitter();
  }

  ngOnInit() {
  }

  onChange(newValue: number) {
    this.progreso = 0;
    this.cambiarValor(newValue);
  }

  cambiarValor(valor: number) {
    this.progreso = this.progreso + valor;
    if (this.progreso >= 100) {
      this.progreso = 100;
    }
    if (this.progreso <= 0) {
      this.progreso = 0;
    }

    this.actualizaValor.emit( this.progreso );

    this.txtProgreso.nativeElement.value = this.progreso;
    this.txtProgreso.nativeElement.focus();

    return;
  }
}
