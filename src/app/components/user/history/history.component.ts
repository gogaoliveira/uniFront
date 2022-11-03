import { Component, OnInit } from '@angular/core';
import { ReqService } from 'src/app/services/req.service';
import { Request } from 'src/app/models/request';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  requestFilter: String[] = []
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
          this.filter(response)
        },
        error: () => { }
      })
  }

  put(date: string, state: string, userCompany: number, id: number) {
    var index = this.requestFilter.findIndex(obj => obj['id'] == id)
    this.request.date = date;
    this.request.state = state;
    this.request.user = Number(localStorage.getItem('user'));
    this.request.userCompany = userCompany;
    this.reqService.put(this.request, id)
      .subscribe({
        next: () => {
          this.toast.info('Pedido reprovado com sucesso')
          this.requestFilter[index]['state'] = 'REFUSED'
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

  filter(res: String[]) {
    for (let i = 0; i < res.length; i++) {
      if (res[i]['state'] == "REFUSED" || res[i]['state'] == "APPROVED") {
        this.requestFilter.push(res[i]);
      }
    }
    this.hasRequest = (this.requestFilter.length == 0)
  }

}
