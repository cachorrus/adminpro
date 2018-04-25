import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { GOOGLE_CLIENT_ID } from '../config/config';

declare function init_plugins();
declare const gapi: any; // google-api


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  constructor(
    private router: Router,
    private _usuarioService: UsuarioService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    init_plugins();
    this.attachSignin();

    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 1) {
      this.recuerdame = true;
    }

  }

  googleInit() {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        const auth2 = gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          });
        resolve(auth2);
      });
    });
  }

  attachSignin() {
    this.googleInit().then((auth2: any) => {
      const element = document.getElementById('btnGoogle');
      auth2.attachClickHandler(element, {}, (googleUser) => {
        // const profile = googleUser.getBasicProfile();
        // console.log(profile);
        const token = googleUser.getAuthResponse().id_token;

        this.zone.run( () => {
          this._usuarioService.loginGoogle( token )
            .subscribe( resp => {
              this.router.navigate(['/dashboard']);
              // window.location.href = '#/dashboard';
            });
        });

      });
    });
  }

  ingresar(forma: NgForm) {

   if (forma.invalid) {
     return;
   }

   const usuario = new Usuario(
     null,
     forma.value.email,
     forma.value.password
   );

   this._usuarioService.login(usuario, forma.value.recuerdame)
            .subscribe( resp =>  {
              this.router.navigate(['/dashboard']);
            });
  }

}
