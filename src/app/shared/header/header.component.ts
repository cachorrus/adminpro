import { Component, OnInit, Renderer2 } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  buscar(search: string) {
    this.router.navigate(['/busqueda', search]);
  }

  focusSearch() {
    const element = this.renderer.selectRootElement('#search');
    setTimeout(() => element.select(), 0);
    setTimeout(() => element.focus(), 0);
  }


}
