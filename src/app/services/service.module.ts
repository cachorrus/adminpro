import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService,
  SharedService,
  SidebarService,
  UsuarioService,
  SubirArchivoService } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuard } from '../services/service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

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
    ModalUploadService
  ],
  declarations: []
})
export class ServiceModule { }
