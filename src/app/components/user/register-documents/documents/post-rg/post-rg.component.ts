import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { API } from 'src/app/config/api.config';

import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-rg',
  templateUrl: './post-rg.component.html',
  styleUrls: ['./post-rg.component.css']
})
export class PostRgComponent implements OnInit {


  rg: FormGroup
  documents: String[] = []
  hasRg: boolean = false
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
            if (this.documents[i]['type'] == 'RG') {
              this.hasRg = true
              this.documentId = this.documents[i]['id']
              this.rg.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                dataExpedicao: this.dataFormat(this.documents[i]['dataExpedicao']),
                dataNascimento: this.dataFormat(this.documents[i]['dataNascimento']),
                naturalidade: this.documents[i]['naturalidade'],
                nomeMae: this.documents[i]['nomeMae'],
                nomePai: this.documents[i]['nomePai'],
                orgaoExpedidor: this.documents[i]['orgaoExpedidor']
              })
            }
          }
        },
        error: () => {
          this.toast.error('Erro ao buscar dados', 'Erro')
        }
      })


  }

  initializeForm() {
    this.rg = this.formBuilder.group({
      type: ['RG'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      dataExpedicao: [null],
      dataNascimento: [null],
      naturalidade: ['', [Validators.minLength(3), Validators.required]],
      nomeMae: ['', [Validators.minLength(3), Validators.required]],
      nomePai: ['', [Validators.minLength(3), Validators.required]],
      orgaoExpedidor: ['', [Validators.minLength(3), Validators.required]],
      user: [Number(localStorage.getItem('user'))]
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

    this.http.post(`${API.baseUrl}/documentos/rg`, this.rg.value, { headers: headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.documentId = Number(response.headers.get('idDocument'))
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          } else {
            this.http.post(`${API.baseUrl}/documentos/rg/img/${this.documentId}`, formData, { headers })
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

    this.serviceDoc.update(this.rg.value, this.documentId, "rg")
      .subscribe({
        next: () => {
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          }else{
            this.http.post(`${API.baseUrl}/documentos/rg/img/${this.documentId}`, formData, { headers })
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
    if (confirm("Deseja Excluir RG cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('RG excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir RG')
          }
        })

    }
  }
}
