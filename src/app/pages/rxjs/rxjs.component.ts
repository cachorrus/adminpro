import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresaObservable()
    .subscribe(
      numero => console.log('contador', numero),
      error => console.error('Error:', error),
      () => console.log('Terminó')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La página se va ha cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( observer => {
      let contador = 0;

      const intervalo = setInterval( () => {
        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        /*if (contador === 3) {
          clearInterval(intervalo);
          observer.complete();
        }*/

        /* if (contador === 2) {
          // clearInterval(intervalo);
          observer.error('Auxilio perro!');
        } */

      }, 500);
    }).pipe(
      retry(2),
      map( (res: any) => {

        return res.valor;

      }),
      filter( (valor, index) => {

        if ( (valor % 2) === 1) {
          return true;
        } else {
          return false;
        }

      })
    );
  }

}
