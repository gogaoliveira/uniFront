import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
          console.log(this.documents)
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

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {
    this.serviceDoc.post(this.motorista.value, "motorista")
      .subscribe({
        next: () => {
          this.toast.info('Carteira de Motorista cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao cadastrar Carteira de Motorista')
        }
      })
  }

  put() {
    console.log(this.motorista.value)
    console.log(this.documentId)
    this.serviceDoc.update(this.motorista.value, this.documentId, "motorista")
      .subscribe({
        next: () => {
          this.toast.info('Carteira de Motorista atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar Carteira de Motorista')
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
