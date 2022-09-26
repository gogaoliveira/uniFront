import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-documents',
  templateUrl: './register-documents.component.html',
  styleUrls: ['./register-documents.component.css']
})
export class RegisterDocumentsComponent implements OnInit {

  documents: String[] = []
  name: String

  itens: String[] = [
    "CARTEIRA_MOTORISTA",
    "CARTEIRA_TRABALHO",
    "CERTIDAO_CASAMENTO",
    "CERTIDAO_NASCIMENTO",
    "CPF",
    "ENDERECO",
    "OUTROS",
    "RG",
    "TITULO_ELEITOR"
  ]

  CARTEIRA_MOTORISTA: boolean = false
  CARTEIRA_TRABALHO: boolean = false
  CERTIDAO_CASAMENTO: boolean = false
  CERTIDAO_NASCIMENTO: boolean = false
  CPF: boolean = false
  ENDERECO: boolean = false
  OUTROS: boolean = false
  RG: boolean = false
  TITULO_ELEITOR: boolean = false

  boleanos: boolean[] = [
    this.CARTEIRA_MOTORISTA,
    this.CARTEIRA_TRABALHO,
    this.CERTIDAO_CASAMENTO,
    this.CERTIDAO_NASCIMENTO,
    this.CPF,
    this.ENDERECO,
    this.OUTROS,
    this.RG,
    this.TITULO_ELEITOR
  ]


  constructor(
    private serviceAuth: AuthService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.serviceAuth.getDateUser()
      .subscribe({
        next: (response) => {
          this.documents = response['documents']
          for (let d = 0; d < this.documents.length; d++) {
            for (let i = 0; i < this.boleanos.length; i++) {
              if (this.documents[d]['type'] == this.itens[i]) {
                this.boleanos[i]= true
              }
            }
          }
        },
        error: () => {
          this.toast.error('Erro ao buscar dados', 'Erro')
        }
      })

  }

  post(page: string) {
    this.router.navigate([`post${page}`])
  }


}
