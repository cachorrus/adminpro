import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label: string = '';

  constructor(
    private router: Router,
    private titulo: Title,
    private meta: Meta
  ) {

    this.getDataRoute().subscribe( data => {

        this.label = data.titulo;
        titulo.setTitle(this.label);

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.label
        };

        this.meta.updateTag(metaTag);

      });
  }

  ngOnInit() {
  }

  getDataRoute() {
    return this.router.events
      .pipe(
        filter( evento => evento instanceof ActivationEnd ),
        filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
        map( (evento: ActivationEnd) => evento.snapshot.data )
      );
  }

}
