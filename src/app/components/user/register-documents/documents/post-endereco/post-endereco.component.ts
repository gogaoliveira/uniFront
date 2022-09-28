import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private serviceDoc: DocService,
    private toast: ToastrService,
    private router: Router
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

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.endereco.value, "endereco")
      .subscribe({
        next: (res) => {
          this.toast.info('Endereço cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao cadastrar Endereço')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.endereco.value, this.documentId, "endereco")
      .subscribe({
        next: () => {
          this.toast.info('Endereço atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao atualizar Endereço')
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
