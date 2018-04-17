import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor(
    private _cargarArchivoService: SubirArchivoService,
    public _modalUploadServices: ModalUploadService
  ) {

   }

  ngOnInit() {}

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._modalUploadServices.ocultarModal();
  }

  seleccionarImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      Swal('Solo imágenes', 'El archivo seleccionado no es una imágen', 'error');
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);

    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }

  subirImagen() {
    this._cargarArchivoService.fileUpload(this.imagenSubir, this._modalUploadServices.tipo, this._modalUploadServices.id)
              .subscribe( (resp: any) => {
                this._modalUploadServices.notificacion.emit(resp);
                this.cerrarModal();
              });
  }

}
