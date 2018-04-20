import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros: number = 0;
  desde: number = 0;
  cargando: boolean = false;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {

    this.cargando = true;

    this._medicoService.cargarMedicos(this.desde)
        .subscribe( (resp: any) => {
          this.medicos = resp.medicos;
          this.totalRegistros = resp.total;
          this.cargando = false;
        });

  }

  buscarMedico(search: string) {
    if ( search.trim().length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedico(search.trim())
        .subscribe( (medicos: any) => this.medicos = medicos);
  }

  borrarMedico(medico: Medico) {
    Swal({
      title: '¿Estas seguro?',
      text: '¡No podrás reverir esto!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminalo!'
    }).then((result) => {
      if (result.value) {
        this._medicoService.borrarMedico(medico._id)
            .subscribe( () => {
              this.cargarMedicos();
            });
      }
    });
  }

  cambiarDesde(desde: number) {
    const pagina = this.desde + desde;

    if (pagina >= this.totalRegistros) {
      return;
    }

    if (pagina < 0 ) {
      return;
    }

    this.desde = pagina;

    this.cargarMedicos();

  }

}
