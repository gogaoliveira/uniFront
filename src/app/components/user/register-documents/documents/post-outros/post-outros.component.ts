import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-outros',
  templateUrl: './post-outros.component.html',
  styleUrls: ['./post-outros.component.css']
})
export class PostOutrosComponent implements OnInit {

  outros: FormGroup
  documents: String[] = []
  hasOutros: boolean = false
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
            if (this.documents[i]['type'] == 'OUTROS') {
              this.hasOutros = true
              this.documentId = this.documents[i]['id']
              this.outros.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                nomeDocumento: this.documents[i]['nomeDocumento'],
                dados: this.documents[i]['dados'],
              })

            }
          }
        }
      })
  }

  initializeForm() {
    this.outros = this.formBuilder.group({
      type: ['OUTROS'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      nomeDocumento: ['', [Validators.minLength(3), Validators.required]],
      dados: ['', [Validators.minLength(3), Validators.required]],
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.outros.value, "outros")
      .subscribe({
        next: (res) => {
          this.toast.info('Documento cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao cadastrar este Documento')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.outros.value, this.documentId, "outros")
      .subscribe({
        next: () => {
          this.toast.info('Documento atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao atualizar este Documento')
        }
      })
  }

  delete() {
    if (confirm("Deseja Excluir Documento cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Documento excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir este Documento')
          }
        })

    }
  }

}
