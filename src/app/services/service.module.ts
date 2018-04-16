import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, SharedService, SidebarService, UsuarioService } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuard } from '../services/service.index';

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
    LoginGuard
  ],
  declarations: []
})
export class ServiceModule { }
