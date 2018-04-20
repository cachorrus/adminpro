import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = false;
  constructor(
    public _hospitalesService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
          .subscribe(resp => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalesService.cargarHospitales(this.desde)
                      .subscribe( (resp: any) => {
                        this.hospitales =  resp.hospitales;
                        this.totalRegistros = resp.total;
                        this.cargando = false;
                      });
  }

  buscarHospital(search: string) {

    if (search.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalesService.buscarHospital(search)
            .subscribe( (hospitales: Hospital[]) => {

              this.hospitales = hospitales;
              this.cargando = false;

            });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;

    this.cargarHospitales();
  }

  actualizarHospital(hospital: Hospital) {
    if (hospital.nombre.trim().length <= 0 ) {
      Swal('Alerta', 'nombre requerido', 'error');
      return;
    }

    this._hospitalesService.actualizarHospital(hospital).subscribe();
  }

  mostrarModal(id: string) {

    this._modalUploadService.mostrarModal('hospitales', id);

  }

  borrarHospital(hospital: Hospital) {

    Swal({
      title: '¿Estas seguro?',
      text: '¡No podrás revertir esto!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, borralo!'
    }).then((result) => {
      if (result.value) {

        this._hospitalesService.borrarHospital(hospital._id)
            .subscribe( (resp: any) => {

              this.cargarHospitales();

            });
      }
    });
  }

async crearHospital() {
  const {value: name} = await Swal({
    title: '¿Cual es el nombre del hospital?',
    input: 'text',
    inputPlaceholder: 'Ingresa un nombre',
    showCancelButton: true,
    inputValidator: (value) => {
      return !value && '¡Campo requerido!';
    }
  });

  if (name) {

    const hospital = new Hospital(name);

    this._hospitalesService.crearHospital(hospital)
          .subscribe( (resp: any) => {
            this.cargarHospitales();
            Swal({
              position: 'top-end',
              type: 'success',
              title: 'Hospital creado',
              showConfirmButton: false,
              timer: 1500
            });
          });
  }
}


}
