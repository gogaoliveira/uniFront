import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/config/api.config';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-nascimento',
  templateUrl: './post-nascimento.component.html',
  styleUrls: ['./post-nascimento.component.css']
})
export class PostNascimentoComponent implements OnInit {

  nascimento: FormGroup
  documents: String[] = []
  hasNascimento: boolean = false
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
            if (this.documents[i]['type'] == 'CERTIDAO_NASCIMENTO') {
              this.hasNascimento = true
              this.documentId = this.documents[i]['id']
              this.nascimento.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                cpf: this.documents[i]['cpf'],
                dataNascimento: this.dataFormat(this.documents[i]['dataNascimento']),
                localNascimento: this.documents[i]['localNascimento'],
                sexo: this.documents[i]['sexo'],
                filiacao: this.documents[i]['filiacao'],
                avosPaternos: this.documents[i]['avosPaternos'],
                avosMaternos: this.documents[i]['avosMaternos'],
                numeroDnv: this.documents[i]['numeroDnv'],
                observacao: this.documents[i]['observacao'],
                municipioDeRegistro: this.documents[i]['municipioDeRegistro'],
                naturalidade: this.documents[i]['naturalidade']
              })
            }
          }
        }
      })
  }

  initializeForm() {
    this.nascimento = this.formBuilder.group({
      type: ['CERTIDAO_NASCIMENTO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      tipo: ['Titular'],
      cpf: ['', [Validators.minLength(11), Validators.required]],
      dataNascimento: [null, Validators.required],
      localNascimento: ['', [Validators.minLength(3), Validators.required]],
      sexo: ['', [Validators.minLength(1), Validators.required]],
      filiacao: ['', [Validators.minLength(3), Validators.required]],
      avosPaternos: ['', [Validators.minLength(3), Validators.required]],
      avosMaternos: ['', [Validators.minLength(3), Validators.required]],
      numeroDnv: ['', [Validators.minLength(1), Validators.required]],
      observacao: ['', [Validators.minLength(3), Validators.required]],
      municipioDeRegistro: ['', [Validators.minLength(3), Validators.required]],
      naturalidade: ['', [Validators.minLength(3), Validators.required]],
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

    this.http.post(`${API.baseUrl}/documentos/nascimento`, this.nascimento.value, { headers: headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.documentId = Number(response.headers.get('idDocument'))
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          } else {
            this.http.post(`${API.baseUrl}/documentos/nascimento/img/${this.documentId}`, formData, { headers })
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

    this.serviceDoc.update(this.nascimento.value, this.documentId, "nascimento")
      .subscribe({
        next: () => {
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          }else{
            this.http.post(`${API.baseUrl}/documentos/nascimento/img/${this.documentId}`, formData, { headers })
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
    if (confirm("Deseja Excluir Certidão de Nascimento cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Certidão de Nascimento excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Certidão de Nascimento')
          }
        })

    }
  }

}
