import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Medico } from '../../../models/medico.model';

@Injectable()
export class MedicoService {

  constructor(
    private http: HttpClient
  ) { }

  private getHttpHeaders() {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    return headers;
  }

  cargarMedicos(desde: number = 0) {
    const url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(url, { headers: this.getHttpHeaders()});

  }

  buscarMedico(search: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + search;

    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          return resp.medicos;
        })
      );
  }

  borrarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.delete(url, { headers: this.getHttpHeaders() })
          .pipe(
            map( (resp: any) => {
              Swal('Médico eliminado', 'el médico ' + resp.medico.nombre + ' se eliminó', 'success');
              return true;
            })
          );
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      url += '/' + medico._id;

      return this.http.put(url, medico, { headers: this.getHttpHeaders()})
              .pipe(
                map( (resp: any) => {
                  Swal('Médico Actualizado', resp.medico.nombre, 'success');
                  return resp.medico;
                })
              );


    } else {

      return this.http.post(url, medico, { headers: this.getHttpHeaders()})
              .pipe(
                map( (resp: any) => {
                  Swal('Médico Creado', resp.medico.nombre, 'success');
                  return resp.medico;
                })
              );
    }


  }

  obtenerMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return  resp.medico;
      }
    ));
  }

}
