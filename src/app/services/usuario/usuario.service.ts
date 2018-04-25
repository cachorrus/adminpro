import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { pipeDef } from '@angular/core/src/view/provider';
import { Pipe } from '@angular/core/src/metadata/directives';
import { catchError } from 'rxjs/operators/catchError';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  initVariables() {
    this.token = '';
    this.usuario = null;
    this.menu = [];
  }

  estaLogueado() {
    return ( this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.initVariables();
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.initVariables();

    this.router.navigate(['/login']);
    // window.location.href = '#/login';
  }

  renuevaToken() {
    const url = URL_SERVICIOS + '/login/renuevatoken';

    return this.http.get(url, { headers: this.requestHeaders() })
            .pipe(
              catchError(err => {
                this.router.navigate(['/login']);
                return this.handleError(err);
              }),
              map( (resp: any) => {

                this.token = resp.token;
                localStorage.setItem('token', this.token);
                console.log('token renovado');

                return true;
              })
            );
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
              .pipe(
                map( (resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                  return true;
                })
              );
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario)
              .pipe(
                catchError( this.handleError),
                map( (resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                  return true;
                })
              );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('Error: ', error.error);
      /* console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.parse(JSON.stringify(error))}`);
      */

      if (error.error.errors) {
        Swal(error.error.mensaje, error.error.errors.message, 'error');
      } else {
        Swal('Error', error.error.mensaje, 'error');
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
              .pipe(
                catchError( this.handleError),
                map( (resp: any) => {
                  Swal('Usuario creado', usuario.email, 'success');
                  return resp.usuario;
              }));
  }

  actualizarUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario/' + usuario._id;

    return this.http.put(url, usuario, {headers: this.requestHeaders()})
              .pipe(
                catchError( this.handleError),
                map( (resp: any) => {

                  if ( usuario._id === this.usuario._id) {
                    this.guardarStorage(resp._id, this.token, resp.usuario, this.menu);
                  }

                  Swal('Usuario actualizado', usuario.nombre, 'success');

                  return true;
                })
              );
  }

  cambiarImagen( archivo: File, id: string) {
    this._subirArchivoService.fileUpload(archivo, 'usuarios', id)
                .subscribe( (resp: any) => {
                  this.usuario.img = resp.usuarios.img;
                  this.guardarStorage(this.usuario._id, this.token, this.usuario, this.menu);
                  Swal('Imagen actualizado', this.usuario.nombre, 'success');
                  return true;
                });
  }

  private requestHeaders() {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    return headers;

  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url, {headers: this.requestHeaders()} );
  }

  buscarUsuario(search: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + search;

    return this.http.get(url)
            .pipe(
              catchError( this.handleError),
              map( (resp: any) => {
                return resp.usuarios;
              })
            );
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuario/' + id;

    return this.http.delete(url, { headers: this.requestHeaders()})
              .pipe(
                catchError( this.handleError),
                map( (resp: any) => {
                  Swal(
                    '¡Eliminado!',
                    'Usuario ' + resp.usuario.nombre +  ' eliminado',
                    'success'
                  );

                  return true;
                })
              );
  }

}
