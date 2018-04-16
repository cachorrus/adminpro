import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) { }

  canActivate(): boolean {

    if (this._usuarioService.estaLogueado()) {
      console.log('PASÓ EL GUARD');
      return true;
    } else {
      console.log('BLOQUEADO POR EL GUARD');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
