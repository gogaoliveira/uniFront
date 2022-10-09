import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-request-company',
  templateUrl: './request-company.component.html',
  styleUrls: ['./request-company.component.css']
})
export class RequestCompanyComponent implements OnInit {

  requestApproved: String[] = []
  requestRefused: String[] = []
  requestAwait: String[] = []
  request: String[] = []

  constructor(
    private reqService: ReqService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reqService.getRequestForCompany()
      .subscribe({
        next: (res) => {
          console.log(res)
          for (let i = 0; i < res.length; i++) {
            if (res[i]['state'] == "APPROVED") {
              this.requestApproved.push(res[i]);
            }
            if (res[i]['state'] == "REFUSED") {
              this.requestRefused.push(res[i]);
            }
            if (res[i]['state'] == "AWAIT") {
              this.requestAwait.push(res[i]);
            }
          }
        },
        error: () => { }
      })
    this.request = this.requestAwait;
  }

  dataFormat(date: Date) {
    var data = new Date(date),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'),
      ano = data.getFullYear();
    return dia + "-" + mes + "-" + ano;
  }

  filter(tipe: string) {
    this.request = []
    if (tipe == "AWAIT") {
      this.request = this.requestAwait;
    } else if (tipe == "APPROVED") {
      this.request = this.requestApproved;
    } else if (tipe == "REFUSED") {
      this.request = this.requestRefused;
    }
  }

  access(user: string) {
    localStorage.removeItem('userdoc')
    localStorage.setItem('userdoc', user);
    this.router.navigate(['documentos'])
  }

}
