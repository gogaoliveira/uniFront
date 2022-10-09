import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-search-documents',
  templateUrl: './search-documents.component.html',
  styleUrls: ['./search-documents.component.css']
})
export class SearchDocumentsComponent implements OnInit {

  pedido: FormGroup

  constructor(
    private reqService: ReqService,
    private formBuilder:  FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(){
    this.pedido = this.formBuilder.group({
      email: [''],
      company: [Number(localStorage.getItem('user'))]
    })
  }

  post(){
    this.reqService.post(this.pedido.value)
      .subscribe({
        next: () => {
          this.toast.info('sucesso')
          this.router.navigate(['home']);
        },
        error: (res) => {
          this.toast.error(res['error']['msg'])
        }
      })
  }
}
