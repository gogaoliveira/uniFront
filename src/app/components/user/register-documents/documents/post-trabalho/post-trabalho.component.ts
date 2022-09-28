import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-trabalho',
  templateUrl: './post-trabalho.component.html',
  styleUrls: ['./post-trabalho.component.css']
})
export class PostTrabalhoComponent implements OnInit {

  trabalho: FormGroup
  documents: String[] = []
  hasTrabalho: boolean = false
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
            if (this.documents[i]['type'] == 'CARTEIRA_TRABALHO') {
              this.hasTrabalho = true
              this.documentId = this.documents[i]['id']
              this.trabalho.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                pis: this.documents[i]['pis'],
                serie: this.documents[i]['serie'],
                uf: this.documents[i]['uf'],
              })

            }
          }
        }
      })
  }

  initializeForm() {
    this.trabalho = this.formBuilder.group({
      type: ['CARTEIRA_TRABALHO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      pis: ['', [Validators.minLength(3), Validators.required]],
      serie: ['', [Validators.minLength(1), Validators.required]],
      uf: ['', [Validators.minLength(2), Validators.required]],
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.trabalho.value, "trabalho")
      .subscribe({
        next: () => {
          this.toast.info('Carteira de Trabalho cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao cadastrar Carteira de Trabalho')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.trabalho.value, this.documentId, "trabalho")
      .subscribe({
        next: () => {
          this.toast.info('Carteira de Trabalho atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar Carteira de Trabalho')
        }
      })
  }

  delete() {
    if (confirm("Deseja Excluir Carteira de Trabalho cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Carteira de Trabalho excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Carteira de Trabalho')
          }
        })

    }
  }

}
