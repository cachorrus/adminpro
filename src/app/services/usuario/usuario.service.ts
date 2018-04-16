import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router
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

  guardarStorage(resp: any) {
    localStorage.setItem('id', resp.id);
    localStorage.setItem('token', resp.token);
    localStorage.setItem('usuario', JSON.stringify(resp.usuario));

    this.usuario = resp.usuario;
    this.token = resp.token;
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
                  this.guardarStorage(resp);
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
                  this.guardarStorage(resp);
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

}
