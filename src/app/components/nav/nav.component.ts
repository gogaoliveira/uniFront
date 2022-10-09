import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ReqService } from 'src/app/services/req.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  profile: string;
  cont: number = 0;

  //let token = localStorage.getItem('token')

  constructor(
    private router:Router,
    private authService: AuthService,
    private reqService: ReqService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.router.navigate(['home']);
    this.profile = localStorage.getItem('profile')

    this.contadorNot()
    
  }

  logout(){
    this.router.navigate(['login']);
    this.authService.logout();
    this.toast.info('Logout realizado com sucesso!', 'Logout', {timeOut: 4000})
  }

  contadorNot(){
    this.reqService.getRequestForUser()
    .subscribe({
      next: (res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i]['state'] == "AWAIT") {
            this.cont += 1;
          }
        }
      },
      error: () => { }
    })
  }

}
