import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

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

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.rg.value, "rg")
      .subscribe({
        next: () => {
          this.toast.info('RG cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao cadastrar RG')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.rg.value, this.documentId, "rg")
      .subscribe({
        next: () => {
          this.toast.info('RG atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar RG')
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
