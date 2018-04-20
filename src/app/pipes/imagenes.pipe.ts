import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagenes'
})
export class ImagenesPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    // default img
    if (!img) {
      return url + '/usuario/xxx';
    }

    // imagen google
    if (img.indexOf('https') >= 0 ) {
      return img;
    }

    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;

      case 'medico':
        url += '/medicos/' + img;
        break;

      case 'hospital':
        url += '/hospitales/' + img;
        break;

      default:
        url += '/usuarios/xxx';
        console.log('tipo no válido. usuario, medico, hospital');
        break;
    }

    return url;
  }

}
