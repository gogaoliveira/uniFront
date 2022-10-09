import { Component, OnInit } from '@angular/core';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {

  documents: String[] = []
  name: string

  constructor(
    private reqService: ReqService
  ) { }

  ngOnInit(): void {
    this.reqService.getDateUser(localStorage.getItem('userdoc'))
      .subscribe({
        next: (response) => {
          this.documents = response['documents']
          this.name = response['name']
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

}
