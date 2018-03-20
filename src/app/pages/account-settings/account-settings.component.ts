import { Component, ViewChild, Inject, ElementRef, Renderer2, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements AfterViewInit {

  // QueryList + @ViewChildren + ElementRef
  @ViewChildren('selector') allThemes: QueryList<ElementRef>;

  constructor(
    @Inject(DOCUMENT) private _document,
    private renderer: Renderer2,
    private _ajustesService: SettingsService) {}

  ngAfterViewInit () {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: ElementRef) {

    this.applyCheck(link);
    this._ajustesService.aplicarTema(tema);

    // this._document.getElementById('theme').setAttribute('href', url);
    this.renderer.setAttribute(this._document.getElementById('theme'), 'href', this._ajustesService.ajustes.temaUrl);

  }

  private applyCheck( link: ElementRef ) {
    const theme: ElementRef = this.allThemes.find(ref => ref.nativeElement.classList.contains('working'));

    if (theme) {
      this.renderer.removeClass(theme.nativeElement, 'working' );
    }

    this.renderer.addClass( link, 'working' );

    /* const selectors: any = this._document.getElementsByClassName('selector');
    for (const ref of selectors) {
      ref.classList.remove('working');
    }
    this.renderer.addClass( link, 'working' );*/


    /**
     *private applyCheck( link: ElementRef ) {
        const selectors: any = document.getElementsByClassName('selector');

        for (const ref of selectors) {
            ref.classList.remove('working');
        }

        link.classList.add('working');
      }
    */
  }

  colocarCheck() {
    const tema = this._ajustesService.ajustes.tema;

    const theme: ElementRef = this.allThemes.find(ref => ref.nativeElement.getAttribute('data-theme') === tema);

    if (theme) {
      this.renderer.addClass(theme.nativeElement, 'working' );
    }

    /* const selectors: any = this._document.getElementsByClassName('selector');

    const tema = this._ajustesService.ajustes.tema;

    for (const ref of selectors) {
      if (ref.getAttribute('data-theme') === tema) {
        console.log(ref);
        this.renderer.addClass( ref, 'working' );
        break;
      }
    }*/
  }
}
