import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  documents: String[] = []
  name: String

  constructor(
    private service: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.service.getDateUser()
      .subscribe({
        next: (response) => {
          this.documents = response['documents']
          this.name = response['name']
        },
        error: () => {
          this.toast.error('Erro ao tentar cadastrar', 'Erro')
        }
      })
  }

  dataFormat(date:  Date){
    var data = new Date(date),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth()+1).toString().padStart(2, '0'),
        ano = data.getFullYear();
    return dia+"-"+mes+"-"+ano;
    

  }


}
