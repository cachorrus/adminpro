import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {of} from 'rxjs/observable/of';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService, MedicoService } from '../../services/service.index';
import { Subject } from 'rxjs/Subject';
import { tap, distinctUntilChanged, debounceTime, switchMap, filter, catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  cargando = false;
  hospitalTypeahead = new BehaviorSubject<string>('');
  medico: Medico = new Medico();
  selectedHospital: Hospital = new Hospital('');

  constructor(
    private _medicoService: MedicoService,
    private _hospitalService: HospitalService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe( param => {

      const id = param['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
        .subscribe( (resp: any) => {
          this.medico.img = resp.medicos.img;
    });
  }

  guardarMedico(forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    this.medico.hospital = this.selectedHospital._id;

    this._medicoService.guardarMedico(this.medico)
            .subscribe( (resp: any) => {
              this.medico._id =  resp._id;
              this.router.navigate(['/medico', this.medico._id]);
              }
            );

  }

  private cargarMedico(id: string) {
    this._medicoService.obtenerMedico(id)
          .subscribe( (medico: any) => {
            this.hospitalTypeahead.next(medico.hospital.nombre);
            // this.hospitales.push(medico.hospital);
            this.selectedHospital = medico.hospital;
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
          });
  }

  private cargarHospitales() {
    try {
        this.hospitalTypeahead.pipe(
        filter((term) => term && term.trim().length >= 3),
        tap(() => this.cargando = true),
        distinctUntilChanged(),
        debounceTime(200),
        switchMap( (term) => {
            return this._hospitalService.buscarHospital(term.trim()).pipe(
              catchError(() => of({items: []})));
        }),
    ).subscribe(data => {
        // console.log('data: ', data);
        this.hospitales = data;
        this.cargando = false;
        this.cd.markForCheck();
    }, (error) => {
        // console.log(error);
        this.cargando = false;
        this.hospitales = [];
        this.cd.markForCheck();
    });

  } catch (error) {
    console.error(error);
  }
}

hospitalSeleccionado(hospital: Hospital) {
  this.selectedHospital = hospital;
}

cambiarImagen() {
  this._modalUploadService.mostrarModal('medicos', this.medico._id);
}

}
