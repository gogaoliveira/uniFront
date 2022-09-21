import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-documents',
  templateUrl: './register-documents.component.html',
  styleUrls: ['./register-documents.component.css']
})
export class RegisterDocumentsComponent implements OnInit {

  documents: String[] = []
  name: String

  rg: boolean
  cpf: boolean
  eleitor: boolean


  constructor(
    private service: AuthService,
    private toast: ToastrService,
    private router: Router
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

  setCad(){
    for (let index = 0; index < this.documents.length; index++) {
      if (this.documents[index]['type'] = "RG"){
        this.rg = true;
      }
      
    }
  }

  post(page: string){
    this.router.navigate([`post${page}`])
  }


}
