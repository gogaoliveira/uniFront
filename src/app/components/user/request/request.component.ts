import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Request } from 'src/app/models/request';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  requestAwait: String[] = []
  request: Request = {
    date: '',
    state: '',
    user: 0,
    userCompany: 0
  }

  msg: string
  dater: Date

  constructor(
    private reqService: ReqService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reqService.getRequestForUser()
      .subscribe({
        next: (response) => {
          this.filterAwait(response)
        },
        error: () => { }
      })
  }

  dataFormat(date: Date) {
    var data = new Date(date),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'),
      ano = data.getFullYear();
    return dia + "-" + mes + "-" + ano;
  }


  filterAwait(res: String[]) {
    for (let i = 0; i < res.length; i++) {
      if (res[i]['state'] == "AWAIT") {
        this.requestAwait.push(res[i]);
      }
    }
  }

  put(date: string, state: string, userCompany: number, id: number) {
    this.request.date = date;
    this.request.state = state;
    this.request.user = Number(localStorage.getItem('user'));
    this.request.userCompany = userCompany;
    if (state == 'APPROVED') {
      this.msg = 'Pedido aprovado com sucesso'
    } else {
      this.msg = 'Pedido reprovado com sucesso'
    }
    this.reqService.put(this.request, id)
      .subscribe({
        next: () => {
          this.toast.info(this.msg)
          window.location.reload();
        },
        error: () => {
          this.toast.error('Erro')
        }
      })
  }
}
