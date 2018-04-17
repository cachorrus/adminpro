import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadService {

  tipo: string;
  id: string;

  public oculto: string = 'd-none';

  notificacion = new EventEmitter<any>();

  constructor() {}

  ocultarModal() {
    this.tipo = null;
    this.id = null;
    this.oculto = 'd-none';
  }

  mostrarModal(tipo: string, id: string) {
    this.tipo = tipo;
    this.id = id;
    this.oculto = '';
  }

}
