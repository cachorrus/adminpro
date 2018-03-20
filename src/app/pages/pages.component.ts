import { Component, OnInit, Renderer2 } from '@angular/core';
import { SettingsService } from '../services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor(public _ajustes: SettingsService, private renderer: Renderer2) {
    this.renderer.setAttribute(document.getElementById('theme'), 'href', this._ajustes.ajustes.temaUrl);
  }

  ngOnInit() {
    init_plugins();
  }

}
