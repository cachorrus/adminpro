import { Injectable } from '@angular/core';
import { Hospital } from '../../../models/hospital.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class HospitalService {

  constructor(private http: HttpClient) { }

  private requestHeaders() {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    return headers;

  }

  cargarHospitales(desde: number = 0) {
    const url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get(url);
  }

  buscarHospital(search: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + search;

    return this.http.get(url)
        .pipe(
          map( (resp: any) => {
            return resp.hospitales;
          })
        );
  }

  actualizarHospital(hospital: Hospital) {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id;

    return this.http.put(url, hospital, {headers: this.requestHeaders() })
        .pipe(
          map( (resp: any) => {
            Swal('Usuario actualizado', hospital.nombre, 'success');
            return true;
          })
        );
  }

  borrarHospital(id: string) {
    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.delete(url, { headers: this.requestHeaders()} )
        .pipe(
          map( (resp: any) => {
            Swal('Hospital eliminado: ', resp.hospital.nombre, 'success');
            return true;
          })
        );
  }

  crearHospital(hospital: Hospital) {
    const url = URL_SERVICIOS + '/hospital';

    return this.http.post(url, hospital, { headers: this.requestHeaders() });
  }

}
