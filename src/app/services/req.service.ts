import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { API } from '../config/api.config';
import { Request } from '../models/request';

@Injectable({
  providedIn: 'root'
})
export class ReqService {

  constructor(private http: HttpClient) { }

  post(obj: FormGroup) {
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    return this.http.post(`${API.baseUrl}/pedidos`, obj, header)
  }

  put(obj: Request, id: number) {
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}
    return this.http.put(`${API.baseUrl}/pedidos/${id}`, obj)
  }

  getRequestForUser() {
    let user = localStorage.getItem('user')
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    return this.http.get<any>(`${API.baseUrl}/pedidos/user/${user}`, header)
  }

  getRequestForCompany() {
    let user = localStorage.getItem('user')
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    return this.http.get<any>(`${API.baseUrl}/pedidos/company/${user}`, header)
  }

  getDateUser(user: string){
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}
    return this.http.get<JSON>(`${API.baseUrl}/usuarios/${user}`, header)
  }
}
