import { Component, OnInit } from '@angular/core';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  requestFilter: String[] = []

  constructor(
    private reqService: ReqService
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
  }

}
