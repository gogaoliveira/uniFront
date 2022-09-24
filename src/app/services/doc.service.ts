import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../config/api.config';
import { Rg } from '../models/rg';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(private http: HttpClient) { }

postRg(rg: Rg){
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}
    return this.http.post(`${API.baseUrl}/documentos/rg`, rg, header)
  }
}