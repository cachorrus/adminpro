import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { pipeDef } from '@angular/core/src/view/provider';
import { Pipe } from '@angular/core/src/metadata/directives';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

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
  }

  estaLogueado() {
    return ( this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.initVariables();
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logOut() {
    this.initVariables();

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
              .pipe(
                map( (resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario);
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
                map( (resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario);
                  return true;
                })
              );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
              .pipe(
                map( (resp: any) => {
                  Swal('Usuario creado', usuario.email, 'success');
                  return resp.usuario;
              }));
  }

  actualizarUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario/' + usuario._id;

    return this.http.put(url, usuario, {headers: this.requestHeaders()})
              .pipe(
                map( (resp: any) => {

                  if ( usuario._id === this.usuario._id) {
                    this.guardarStorage(resp._id, this.token, resp.usuario);
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
                  this.guardarStorage(this.usuario._id, this.token, this.usuario);
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
              map( (resp: any) => {
                return resp.usuarios;
              })
            );
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuario/' + id;

    return this.http.delete(url, { headers: this.requestHeaders()})
              .pipe(
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
