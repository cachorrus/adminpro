import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _usuarioServices: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      passwordConfirm: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password', 'passwordConfirm') });

    this.forma.setValue({
      nombre: 'test',
      email: 'test@test.com',
      password: '123456',
      passwordConfirm: '123456',
      condiciones: true
    });

  }

  sonIguales(campo1: string, campo2: string) {
    return ( group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }


  registrarUsuario() {

    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      Swal('Importante', 'Debe de aceptar las condiciones', 'warning');
      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password
    );

    this._usuarioServices.crearUsuario(usuario)
      .subscribe( resp => {
        this.router.navigate(['/login']);
      });

  }
}
