import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-eleitor',
  templateUrl: './post-eleitor.component.html',
  styleUrls: ['./post-eleitor.component.css']
})
export class PostEleitorComponent implements OnInit {

  eleitor: FormGroup
  documents: String[] = []
  hasEleitor: boolean = false
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
          for (let i = 0; i < this.documents.length; i++) {
            if (this.documents[i]['type'] == 'TITULO_ELEITOR') {
              this.hasEleitor = true
              this.documentId = this.documents[i]['id']
              this.eleitor.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                dataNascimento: this.dataFormat(this.documents[i]['dataNascimento']),
                dataEmissao: this.dataFormat(this.documents[i]['dataEmissao']),
                zona: this.documents[i]['zona'],
                secao: this.documents[i]['secao'],
                municipio: this.documents[i]['municipio']
              })
            }
          }
        }
      })
  }

  initializeForm() {
    this.eleitor = this.formBuilder.group({
      type: ['TITULO_ELEITOR'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      dataNascimento: [null],
      dataEmissao: [null],
      zona: ['', [Validators.required]],
      secao: ['', [Validators.required]],
      municipio: ['', [Validators.required]]
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.eleitor.value, "eleitor")
      .subscribe({
        next: () => {
          this.toast.info('Titulo de Eleitor cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao cadastrar Titulo de Eleitor')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.eleitor.value, this.documentId, "eleitor")
      .subscribe({
        next: () => {
          this.toast.info('Titulo de Eleitor atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar Titulo de Eleitor')
        }
      })
  }

  delete() {
    if (confirm("Deseja Excluir Titulo de Eleitor cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Titulo de Eleitor excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Titulo de Eleitor')
          }
        })

    }
  }

}
