import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../../models/usuario.model';
import { Medico } from '../../../models/medico.model';
import { Hospital } from '../../../models/hospital.model';
import { Router } from '@angular/router';
import { DataService } from '../../services/service.index';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _dataService: DataService
  ) {
    activatedRoute.params.subscribe( param => {
      const termino = param['termino'];

      if (termino) {
        this.buscar(termino);
      }
    }
    );
   }

  ngOnInit() {
  }

  buscar(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get(url).subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    });
  }

  editarMedico(medico: Medico) {
    this.router.navigate(['/medico', medico._id]);
  }

  editarUsuario(usuario: Usuario) {
    this._dataService.changeMessage(usuario.email);
    this.router.navigate(['/usuarios']);
  }

  editarHospital(hospital: Hospital) {
    this._dataService.changeMessage(hospital.nombre);
    this.router.navigate(['/hospitales']);
  }
}
