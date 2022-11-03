import { Component, OnInit } from '@angular/core';
import { ReqService } from 'src/app/services/req.service';
import { Request } from 'src/app/models/request';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  requestAwait: String[] = []
  msg: string
  request: Request = {
    date: '',
    state: '',
    user: 0,
    userCompany: 0
  }
  hasRequest: boolean

  constructor(
    private reqService: ReqService,
    private toast: ToastrService
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

  put(date: string, state: string, userCompany: number, id: number) {
    var index = this.requestAwait.findIndex(obj => obj['id'] == id)
    this.requestAwait[index]['state'] = state
    this.request.date = date;
    this.request.state = state;
    this.request.user = Number(localStorage.getItem('user'));
    this.request.userCompany = userCompany;
    this.msg = state == 'APPROVED' ? 'Pedido aprovado com sucesso' : 'Pedido reprovado com sucesso'
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
    console.log(this.requestAwait)
    this.hasRequest = (this.requestAwait.length == 0)
  }

  
}
