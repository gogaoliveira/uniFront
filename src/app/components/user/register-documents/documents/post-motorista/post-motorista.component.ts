import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/config/api.config';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-motorista',
  templateUrl: './post-motorista.component.html',
  styleUrls: ['./post-motorista.component.css']
})
export class PostMotoristaComponent implements OnInit {

  motorista: FormGroup
  documents: String[] = []
  hasMotorista: boolean = false
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
            if (this.documents[i]['type'] == 'CARTEIRA_MOTORISTA') {
              this.hasMotorista = true
              this.documentId = this.documents[i]['id']
              this.motorista.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                validade: this.dataFormat(this.documents[i]['validade']),
                primeiraHabilitacao: this.dataFormat(this.documents[i]['primeiraHabilitacao']),
                categoria: this.documents[i]['categoria'],
                observacoes: this.documents[i]['observacoes'],
                permissao: this.documents[i]['permissao'],
                acc: this.documents[i]['acc']
              })
            }
          }
        }
      })
  }

  initializeForm() {
    this.motorista = this.formBuilder.group({
      type: ['CARTEIRA_MOTORISTA'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      validade: [null, Validators.required],
      primeiraHabilitacao: [null, Validators.required],
      categoria: ['', [Validators.minLength(1), Validators.required]],
      observacoes: ['', [Validators.minLength(3), Validators.required]],
      permissao: ['', [Validators.minLength(3), Validators.required]],
      acc: ['', [Validators.minLength(3), Validators.required]],
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

    this.http.post(`${API.baseUrl}/documentos/motorista`, this.motorista.value, { headers: headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.documentId = Number(response.headers.get('idDocument'))
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          } else {
            this.http.post(`${API.baseUrl}/documentos/motorista/img/${this.documentId}`, formData, { headers })
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

    this.serviceDoc.update(this.motorista.value, this.documentId, "motorista")
      .subscribe({
        next: () => {
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          }else{
            this.http.post(`${API.baseUrl}/documentos/motorista/img/${this.documentId}`, formData, { headers })
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
    if (confirm("Deseja Excluir Carteira de Motorista cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Carteira de Motorista excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Carteira de Motorista')
          }
        })

    }
  }

}
