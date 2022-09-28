import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-nascimento',
  templateUrl: './post-nascimento.component.html',
  styleUrls: ['./post-nascimento.component.css']
})
export class PostNascimentoComponent implements OnInit {

  nascimento: FormGroup
  documents: String[] = []
  hasNascimento: boolean = false
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
            if (this.documents[i]['type'] == 'CERTIDAO_NASCIMENTO') {
              this.hasNascimento = true
              this.documentId = this.documents[i]['id']
              this.nascimento.patchValue({
                numberDocument: this.documents[i]['numberDocument'],
                photoDocument: this.documents[i]['photoDocument'],
                cpf: this.documents[i]['cpf'],
                dataNascimento: this.dataFormat(this.documents[i]['dataNascimento']),
                localNascimento: this.documents[i]['localNascimento'],
                sexo: this.documents[i]['sexo'],
                filiacao: this.documents[i]['filiacao'],
                avosPaternos: this.documents[i]['avosPaternos'],
                avosMaternos: this.documents[i]['avosMaternos'],
                numeroDnv: this.documents[i]['numeroDnv'],
                observacao: this.documents[i]['observacao'],
                municipioDeRegistro: this.documents[i]['municipioDeRegistro'],
                naturalidade: this.documents[i]['naturalidade']
              })
            }
          }
        }
      })
  }

  initializeForm() {
    this.nascimento = this.formBuilder.group({
      type: ['CERTIDAO_NASCIMENTO'],
      numberDocument: ['', [Validators.minLength(3), Validators.required]],
      photoDocument: 'testeFoto.jpg',
      user: [Number(localStorage.getItem('user'))],
      tipo: ['Titular'],
      cpf: ['', [Validators.minLength(11), Validators.required]],
      dataNascimento: [null, Validators.required],
      localNascimento: ['', [Validators.minLength(3), Validators.required]],
      sexo: ['', [Validators.minLength(1), Validators.required]],
      filiacao: ['', [Validators.minLength(3), Validators.required]],
      avosPaternos: ['', [Validators.minLength(3), Validators.required]],
      avosMaternos: ['', [Validators.minLength(3), Validators.required]],
      numeroDnv: ['', [Validators.minLength(1), Validators.required]],
      observacao: ['', [Validators.minLength(3), Validators.required]],
      municipioDeRegistro: ['', [Validators.minLength(3), Validators.required]],
      naturalidade: ['', [Validators.minLength(3), Validators.required]],
    })
  }

  dataFormat(date: Date) {
    return date.toString().slice(0, 10)
  }

  post() {

    this.serviceDoc.post(this.nascimento.value, "nascimento")
      .subscribe({
        next: () => {
          this.toast.info('Certidão de Nascimento cadastrado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao cadastrar Certidão de Nascimento')
        }
      })
  }

  put() {
    console.log(this.nascimento.value)
    console.log(this.documentId)
    this.serviceDoc.update(this.nascimento.value, this.documentId, "nascimento")
      .subscribe({
        next: () => {
          this.toast.info('Certidão de Nascimento atualizado com sucesso')
          this.router.navigate(['cadastrar']);
        },
        error: (error) => {
          this.toast.error('Erro ao atualizar Certidão de Nascimento')
        }
      })
  }

  delete() {
    if (confirm("Deseja Excluir Certidão de Nascimento cadastrado?")) {
      this.serviceDoc.delete(this.documentId)
        .subscribe({
          next: () => {
            this.toast.info('Certidão de Nascimento excluido com sucesso')
            this.router.navigate(['cadastrar']);
          },
          error: () => {
            this.toast.error('Erro ao excluir Certidão de Nascimento')
          }
        })

    }
  }

}
