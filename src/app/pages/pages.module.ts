import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Rutas child
import { PAGE_ROUTES } from './pages.routing';

// Modulos
import { SharedModule } from '../shared/shared.module';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PAGE_ROUTES
  ],
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    PagesComponent
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ]
})
export class PagesModule { }
