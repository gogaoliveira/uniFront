import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-casamento',
  templateUrl: './post-casamento.component.html',
  styleUrls: ['./post-casamento.component.css']
})
export class PostCasamentoComponent implements OnInit {

  casamento: FormGroup
  documents: String[] = []
  hasCasamento: boolean = false
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
            if (this.documents[i]['type'] == 'CERTIDAO_CASAMENTO') {
              this.hasCasamento = true
              this.documentId = this.documents[i]['id']
              this.casamento.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                nomeConjuge: this.documents[i]['nomeConjuge'],
                cpfConjuge: this.documents[i]['cpfConjuge'],
                nascimentoConjuge: this.dataFormat(this.documents[i]['nascimentoConjuge']),
                cidadeNascimentoConjuge: this.documents[i]['cidadeNascimentoConjuge'],
                paiConjunge: this.documents[i]['paiConjunge'],
                maeConjuge: this.documents[i]['maeConjuge'],
                dataCasamento: this.dataFormat(this.documents[i]['dataCasamento']),
                regimeBens: this.documents[i]['regimeBens'],
                observacoes: this.documents[i]['observacoes']
              })
              
            }
          }
        }
      })
  }

  initializeForm() {
    this.casamento = this.formBuilder.group({
      type: ['CERTIDAO_CASAMENTO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      nomeConjuge: ['', [Validators.minLength(3), Validators.required]],
      cpfConjuge: ['', [Validators.minLength(11), Validators.required]],
      nascimentoConjuge: [null, Validators.required],
      cidadeNascimentoConjuge: ['', [Validators.minLength(3), Validators.required]],
      paiConjunge: ['', [Validators.minLength(3), Validators.required]],
      maeConjuge: ['', [Validators.minLength(3), Validators.required]],
      dataCasamento: [null, Validators.required],
      regimeBens: ['', [Validators.required]],
      observacoes: ['', [Validators.minLength(3), Validators.required]],
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0,10)
  }

  post() {
    this.serviceDoc.post(this.casamento.value, "casamento")
      .subscribe({
        next: (res) => {
          this.toast.info('sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro')
        }
      })
  }

  put() {
    this.serviceDoc.update(this.casamento.value, this.documentId, "casamento")
      .subscribe({
        next: () => {
          this.toast.info('sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro')
        }
      })
  }

}
