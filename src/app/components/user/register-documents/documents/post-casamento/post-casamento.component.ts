import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/config/api.config';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-casamento',
  templateUrl: './post-casamento.component.html',
  styleUrls: ['./post-casamento.component.css']
})
export class PostCasamentoComponent implements OnInit {

  casamento: FormGroup
  documents: String[] = []
  hasCasamento: boolean = false
  documentId: number
  photo1: File = null
  photo2: File = null

  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private serviceDoc: DocService,
    private toast: ToastrService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initializeForm()
    this.serviceAuth.getDateUser()
      .subscribe({
        next: (response) => {
          this.documents = response['documents']
          for (let i = 0; i < this.documents.length; i++) {
            if (this.documents[i]['type'] == 'CERTIDAO_CASAMENTO') {
              this.hasCasamento = true
              this.documentId = this.documents[i]['id']
              this.casamento.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                nomeConjuge: this.documents[i]['nomeConjuge'],
                cpfConjuge: this.documents[i]['cpfConjuge'],
                nascimentoConjuge: this.dataFormat(this.documents[i]['nascimentoConjuge']),
                cidadeNascimentoConjuge: this.documents[i]['cidadeNascimentoConjuge'],
                paiConjunge: this.documents[i]['paiConjunge'],
                maeConjuge: this.documents[i]['maeConjuge'],
                dataCasamento: this.dataFormat(this.documents[i]['dataCasamento']),
                regimeBens: this.documents[i]['regimeBens'],
                observacoes: this.documents[i]['observacoes']
              })

            }
          }
        }
      })
  }

  initializeForm() {
    this.casamento = this.formBuilder.group({
      type: ['CERTIDAO_CASAMENTO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      nomeConjuge: ['', [Validators.minLength(3), Validators.required]],
      cpfConjuge: ['', [Validators.minLength(11), Validators.required]],
      nascimentoConjuge: [null, Validators.required],
      cidadeNascimentoConjuge: ['', [Validators.minLength(3), Validators.required]],
      paiConjunge: ['', [Validators.minLength(3), Validators.required]],
      maeConjuge: ['', [Validators.minLength(3), Validators.required]],
      dataCasamento: [null, Validators.required],
      regimeBens: ['', [Validators.required]],
      observacoes: ['', [Validators.minLength(3), Validators.required]],
    })
  }

  onChangePhoto1(event) {
    this.photo1 = event.target.files[0]
  }

  onChangePhoto2(event) {
    this.photo2 = event.target.files[0]
  }

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    let token = localStorage.getItem('token')

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Authorization', `Bearer ${token}`)

    let formData: FormData = new FormData()
    formData.append('photo1', this.photo1)
    formData.append('photo2', this.photo2)

    this.http.post(`${API.baseUrl}/documentos/casamento`, this.casamento.value, { headers: headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.documentId = Number(response.headers.get('idDocument'))
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          } else {
            this.http.post(`${API.baseUrl}/documentos/casamento/img/${this.documentId}`, formData, { headers })
              .subscribe({
                next: () => {
                  this.toast.info('sucesso')
                  this.router.navigate(['cadastrar'])
                },
                error: (error) => {
                  console.log("Erro: " + error)
                  this.toast.error('Erro')
                }
              })
          }
        },
        error: (error) => {
          console.log("Erro: " + error)
          this.toast.error('Erro')
        }
      })
  }

  put() {
    let token = localStorage.getItem('token')

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Authorization', `Bearer ${token}`)

    let formData: FormData = new FormData()
    formData.append('photo1', this.photo1)
    formData.append('photo2', this.photo2)

    this.serviceDoc.update(this.casamento.value, this.documentId, "casamento")
      .subscribe({
        next: () => {
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          }else{
            this.http.post(`${API.baseUrl}/documentos/casamento/img/${this.documentId}`, formData, { headers })
              .subscribe({
                next: () => {
                  this.toast.info('sucesso')
                  this.router.navigate(['cadastrar'])
                },
                error: (error) => {
                  console.log("Erro: " + error)
                  this.toast.error('Erro')
                }
              })
          }
        },
        error: () => {
          this.toast.error('Erro')
        }
      })
  }

  delete() {
    if (confirm("Deseja Excluir Certidão de Casamento cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Certidão de Casamento excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Certidão de Casamento')
          }
        })

    }
  }

}
