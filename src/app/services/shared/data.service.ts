import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
// http://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

}
