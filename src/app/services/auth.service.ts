import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../config/api.config';
import { Credenciais } from '../models/cretenciais';
import { JwtHelperService } from '@auth0/angular-jwt'
import { RegisterCPF } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  authenticate(creds: Credenciais){
    return this.http.post(`${API.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

  register(register: RegisterCPF){
    return this.http.post(`${API.baseUrl}/usuarios`, register)
  }

  successfulllogin(authToken: string, user: string, profile: string){
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', user);
    localStorage.setItem('profile', profile);
  }

  isAuthenticated(){
    let token = localStorage.getItem('token')
    if(token != null){
      return !this.jwtService.isTokenExpired(token)
    }
    return false
  }

  logout(){
    localStorage.clear();
  }

  getDateUser(){
    let user = localStorage.getItem('user')
    let token = localStorage.getItem('token')
    var header = { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}
    return this.http.get<JSON>(`${API.baseUrl}/usuarios/${user}`, header)
  }
}
