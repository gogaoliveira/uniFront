import { JsonPipe } from '@angular/common';
import { HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  documents: String[] = []
  name: String
  profile: String
  private: string
  hasDoc: boolean

  constructor(
    private router: Router,
    private service: AuthService,
    private docService: DocService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.service.getDateUser()
      .subscribe({
        next: (response) => {
          this.documents = this.sortJSON(response['documents'], 'type') 
          this.name = response['name']
          this.profile = response['profile']
          this.hasDoc = (this.documents.length == 0)
        },
        error: () => {
          this.toast.error('Erro ao tentar cadastrar', 'Erro')
        }
      })
  }

  dataFormat(date: Date) {
    var data = new Date(date),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'),
      ano = data.getFullYear();
    return dia + "-" + mes + "-" + ano;
  }

  buscarDoc() {
    this.router.navigate(['buscar'])
  }

  pedidosDoc() {
    this.router.navigate(['pedidosempresa'])
  }

  atualizaPrivacidade(doc: string, privateDocument: string, id: number) {
    this.private = privateDocument == "N" ? "S" : "N"
    var index = this.documents.findIndex(obj => obj['type'] == doc)
    this.documents[index]['privateDocument'] = this.private
    switch (doc) {
      case "CPF":
        doc = "cpf"
        break;

      case "CARTEIRA_MOTORISTA":
        doc = "motorista"
        break;

      case "CARTEIRA_TRABALHO":
        doc = "trabalho"
        break;

      case "CERTIDAO_CASAMENTO":
        doc = "casamento"
        break;

      case "CERTIDAO_NASCIMENTO":
        doc = "nascimento"
        break;

      case "ENDERECO":
        doc = "endereco"
        break;

      case "OUTROS":
        doc = "outros"
        break;

      case "RG":
        doc = "rg"
        break;

      case "TITULO_ELEITOR":
        doc = "eleitor"
        break;

    }

    const body = {"privateDocument": this.private}
    this.docService.updatePriv(body, id, doc)
      .subscribe({
        next: () => {
          this.toast.info('Sucesso!')
        },
        error: () => {
          this.toast.error('Erro')
        }
      })

  }

  sortJSON(arr, key: string) {
    return arr.sort(function(a, b){
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
    
  }


}
