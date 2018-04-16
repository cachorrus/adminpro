import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable()
export class SubirArchivoService {

  constructor(private http: HttpClient) { }

  fileUpload(fileItem: File, tipo: string, id: string) {
    const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
    const formData: FormData = new FormData();

    formData.append('imagen', fileItem, fileItem.name);

    /*const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true // for progress data
    });

    return this.http.request(req);*/

    return this.http.put(url, formData, { reportProgress: true });
  }

}
