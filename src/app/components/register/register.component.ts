import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/models/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  register: Register ={
    nome: '',
    email: '',
    inscricao: '',
    password: ''
  }

  passwordConfirm: String
  confirm: boolean

  nome      = new FormControl(null, Validators.minLength(3));
  email     = new FormControl(null, Validators.email);
  inscricao = new FormControl(null, Validators.maxLength(14));
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  login(){
    this.router.navigate(['login'])
  }

  validaSenha(){
    this.confirm = this.register.password === "" && this.passwordConfirm === undefined
    return this.register.password == this.passwordConfirm || this.confirm
  }
  

  validaCampos(){
    return (this.nome.valid && 
            this.email.valid && 
            this.inscricao.valid &&
            this.register.password == this.passwordConfirm &&
            !this.confirm
            );
  }

}
