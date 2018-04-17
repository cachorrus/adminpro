import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor(
    private _usuarioService: UsuarioService,
    private _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
          .subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde)
                      .subscribe( (resp: any) => {
                        this.usuarios =  resp.usuarios;
                        this.totalRegistros = resp.total;
                        this.cargando = false;
                      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;

    this.cargarUsuarios();
  }

  buscarUsuario(search: string) {

    if (search.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuario(search)
            .subscribe( (usuarios: Usuario[]) => {

              this.usuarios = usuarios;
              this.cargando = false;

            });
  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this._usuarioService.usuario._id) {
      Swal('No puede borrar usuario', 'No se puede borrrar a si mismo', 'error');
      return;
    }

    Swal({
      title: '¿Estas seguro?',
      text: '¡No podrás revertir esto!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, borralo!'
    }).then((result) => {
      if (result.value) {

        this._usuarioService.borrarUsuario(usuario._id)
            .subscribe( (resp: any) => {

              this.cargarUsuarios();

            });
      }
    });
  }

  actualizarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
              .subscribe( resp => {

              });
  }

}
