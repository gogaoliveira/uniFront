import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from 'src/app/models/cretenciais';
import { RegisterCPF } from 'src/app/models/register';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  checked = false

  register: RegisterCPF = {
    name: '',
    email: '',
    cpf: '',
    password: '',
    profile: []
  }

  creds: Credenciais = {
    email: '',
    password: ''
  }

  passwordConfirm: string
  confirm: boolean
  inscricao: String
  mask: string = '000.000.000-00'
  placeholder: string = 'Ex. 123.456.789-11'
  tipoInscricao: string = 'CPF'
  rbInscricao: string = 'CPF'

  nome = new FormControl(null, Validators.minLength(3));
  email = new FormControl(null, Validators.email);

  constructor(
    private router: Router,
    private service: AuthService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {

  }

  login() {
    this.router.navigate(['login'])
  }

  check(){
    this.checked = this.checked == false ? true : false 
  }

  validaSenha() {
    this.confirm = this.register.password === "" && this.passwordConfirm === undefined
    return this.register.password == this.passwordConfirm || this.confirm
  }


  validaCampos() {
    return (this.nome.valid &&
      this.email.valid &&
      this.register.password == this.passwordConfirm &&
      !this.confirm &&
      this.checked
    );
  }

  ajustaInscricao() {
    this.tipoInscricao = this.rbInscricao
    if (this.rbInscricao == 'CPF') {
      this.mask = '000.000.000-00'
      this.placeholder = 'Ex. 123.456.789-11'
    }
    if (this.rbInscricao == 'CNPJ') {
      this.mask = '00.000.000/0000-00'
      this.placeholder = 'Ex. 11.111.111/0001-11'
    }
  }

  newRegister() {
    if (this.rbInscricao == 'CPF') {
      this.register.cpf = this.inscricao
      this.register.profile = [2]
      this.service.register(this.register)
        .subscribe({
          next: () => {
            this.creds.email = this.register.email,
              this.creds.password = this.register.password
            this.logar()
          },
          error: (error) => {
            this.toast.error('Erro ao tentar cadastrar', 'Erro')
          }
        })
    }
    if (this.rbInscricao == 'CNPJ') {
      this.register.cpf = this.inscricao
      this.register.profile = [1]
      this.service.register(this.register)
        .subscribe({
          next: () => {
            this.creds.email = this.register.email,
              this.creds.password = this.register.password
            this.logar()
          },
          error: (error) => {
            this.toast.error('Erro ao tentar cadastrar', 'Erro')
          }
        })
    }
  }

  logar() {
    this.service.authenticate(this.creds)
      .subscribe({
        next: (resposta) => {
          this.service.successfulllogin(
            resposta.headers.get('Authorization').substring(7),
            resposta.headers.get('user'),
            resposta.headers.get('profile').substring(6, 13));
          this.router.navigate(['home']);
        },
        error: () => {
          this.toast.error('Erro ao acessar o sistema', 'login'),
            this.creds.password = ''
        }
      });
  }

  termos(){
    const host: string = location.origin;
    const url: string= host  + String(this.router.createUrlTree(['termos']));
    window.open(url, '_blank');
  }

}
