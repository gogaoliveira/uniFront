import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { Rg } from 'src/app/models/rg';
import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-post-rg',
  templateUrl: './post-rg.component.html',
  styleUrls: ['./post-rg.component.css']
})
export class PostRgComponent implements OnInit {

  rg: Rg={
    type: 'RG',
    numberDocument: '',
    photoDocument: 'testeFoto.jpg',
    dataExpedicao: null,
    dataNascimento: null,
    naturalidade: '',
    nomeMae: '',
    nomePai: '',
    orgaoExpedidor: '',
    user: Number(localStorage.getItem('user'))
  }

  numero          = new FormControl(Validators.minLength(3));
  orgaoExpedidor  = new FormControl(Validators.minLength(3));
  dataNascimento  = new FormControl(Validators.required);
  dataExpedicao   = new FormControl(Validators.required);
  naturalidade    = new FormControl(Validators.minLength(3));
  nomeMae         = new FormControl(Validators.minLength(3));
  nomePai         = new FormControl(Validators.minLength(3));

  constructor(
    private serv: DocService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  validaCampos(){
    return (this.numero.valid && 
            this.orgaoExpedidor.valid && 
            this.dataNascimento.valid && 
            this.dataExpedicao.valid &&
            this.naturalidade.valid && 
            this.nomeMae.valid && 
            this.nomePai.valid
            );
  }

  newRg(){
    console.log(this.rg.type)
    console.log(this.rg.numberDocument)
    console.log(this.rg.photoDocument)
    console.log(this.rg.dataExpedicao)
    console.log(this.rg.dataNascimento)
    console.log(this.rg.naturalidade)
    console.log(this.rg.nomeMae)
    console.log(this.rg.nomePai)
    console.log(this.rg.orgaoExpedidor)
    console.log(this.rg.user)

    this.serv.postRg(this.rg)
    .subscribe({
      next: () => {
        console.log(this.rg)
      },
      error: (error) => {
        this.toast.error('Erro')
      }
    })
  }

}
