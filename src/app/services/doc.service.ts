import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { API } from '../config/api.config';
import { Rg } from '../models/rg';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(private http: HttpClient) { }

  post(obj: FormGroup, doc: string) {
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}
    return this.http.post(`${API.baseUrl}/documentos/${doc}`, obj, header)
  }

  update(obj: FormGroup, id: number, doc: string) {
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    return this.http.put(`${API.baseUrl}/documentos/${doc}/${id}`, obj, header)
  }

  updatePriv(obj: any, id: number, doc: string) {
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    console.log('url')
    console.log(`${API.baseUrl}/documentos/${doc}/${id}`)
    return this.http.put(`${API.baseUrl}/documentos/${doc}/${id}`, obj, header)
  }


  delete(id: number){
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    return this.http.delete(`${API.baseUrl}/documentos/${id}`, header)
  }
}
