import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-cpf',
  templateUrl: './post-cpf.component.html',
  styleUrls: ['./post-cpf.component.css']
})
export class PostCpfComponent implements OnInit {

  cpf: FormGroup
  documents: String[] = []
  hasCpf: boolean = false
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
            if (this.documents[i]['type'] == 'CPF') {
              this.hasCpf = true
              this.documentId = this.documents[i]['id']
              this.cpf.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                dataNascimento: this.dataFormat(this.documents[i]['dataNascimento'])
              })
            }
          }
        }
      })
  }

  initializeForm() {
    this.cpf = this.formBuilder.group({
      type: ['CPF'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      dataNascimento: [null]
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0,10)
  }

  post() {
    this.serviceDoc.post(this.cpf.value, "rg")
      .subscribe({
        next: () => {
          this.toast.info('sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.cpf.value, this.documentId, "rg")
      .subscribe({
        next: () => {
          this.toast.info('sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro')
        }
      })
  }

}
