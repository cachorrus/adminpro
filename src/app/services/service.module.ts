import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService,
  SharedService,
  SidebarService,
  UsuarioService,
  SubirArchivoService,
  HospitalService
  } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuard } from '../services/service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { MedicoService } from './medico/medico.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    LoginGuard,
    SubirArchivoService,
    ModalUploadService,
    HospitalService,
    MedicoService
  ],
  declarations: []
})
export class ServiceModule { }
