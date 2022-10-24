import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/config/api.config';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-endereco',
  templateUrl: './post-endereco.component.html',
  styleUrls: ['./post-endereco.component.css']
})
export class PostEnderecoComponent implements OnInit {

  endereco: FormGroup
  documents: String[] = []
  hasEndereco: boolean = false
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
          for (let i = 1; i < this.documents.length; i++) {
            if (this.documents[i]['type'] == 'ENDERECO') {
              this.hasEndereco = true
              this.documentId = this.documents[i]['id']
              this.endereco.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                complemento: this.documents[i]['complemento'],
                cep: this.documents[i]['cep'],
                numero: this.documents[i]['numero'],
                cidade: this.documents[i]['cidade'],
                uf: this.documents[i]['uf'],
                endereco: this.documents[i]['endereco'],
              })

            }
          }
        }
      })
  }

  initializeForm() {
    this.endereco = this.formBuilder.group({
      type: ['ENDERECO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      complemento: ['', [Validators.minLength(3), Validators.required]],
      cep: ['', [Validators.minLength(8), Validators.required]],
      numero: ['', [Validators.minLength(1), Validators.required]],
      cidade: ['', [Validators.minLength(3), Validators.required]],
      uf: ['', [Validators.minLength(2), Validators.required]],
      endereco: ['', [Validators.minLength(3), Validators.required]],
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

    this.http.post(`${API.baseUrl}/documentos/endereco`, this.endereco.value, { headers: headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.documentId = Number(response.headers.get('idDocument'))
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          } else {
            this.http.post(`${API.baseUrl}/documentos/endereco/img/${this.documentId}`, formData, { headers })
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

    this.serviceDoc.update(this.endereco.value, this.documentId, "endereco")
      .subscribe({
        next: () => {
          if (this.photo1 == null && this.photo2 == null) {
            this.toast.info('sucesso')
            this.router.navigate(['cadastrar']);
          }else{
            this.http.post(`${API.baseUrl}/documentos/endereco/img/${this.documentId}`, formData, { headers })
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
    if (confirm("Deseja Excluir Endereço cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Endereço excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Endereço')
          }
        })

    }
  }

}
