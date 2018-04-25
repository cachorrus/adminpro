import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CanActivateChild } from '@angular/router/src/interfaces';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';

@Injectable()
export class VerificaTokenGuard implements CanActivateChild {

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivateChild(): Promise<boolean> | boolean  {

    const token = this._usuarioService.token;
    const payload = JSON.parse(atob( token.split('.')[1] ));

    const expirado = this.expirado(payload.exp);

    if (expirado) {
      return false;
    } else {
      // renovar token
      return this.verificaRenueva(payload.exp);
    }

  }

  verificaRenueva( fechaExp: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {

      const tokenExp = new Date(fechaExp * 1000); // convertir a fecha
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000)); // 1h

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
            .subscribe(() => {
              resolve(true);
            }, () => {
              this.router.navigate(['/login']);
              reject(false);
            });
      }
    });
  }

  expirado( fechaExp: Number) {
    const fechaActual = new Date().getTime() / 1000; // convertir a milisegundos

    if (fechaExp < fechaActual) {
      return true;
    } else {
      return false;
    }
  }

}
