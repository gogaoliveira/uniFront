import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RequestCompanyComponent } from './components/company/request-company/request-company.component';
import { SearchDocumentsComponent } from './components/company/search-documents/search-documents.component';
import { ViewDocumentsComponent } from './components/company/view-documents/view-documents.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { HistoryComponent } from './components/user/history/history.component';
import { PostCasamentoComponent } from './components/user/register-documents/documents/post-casamento/post-casamento.component';
import { PostCpfComponent } from './components/user/register-documents/documents/post-cpf/post-cpf.component';
import { PostEleitorComponent } from './components/user/register-documents/documents/post-eleitor/post-eleitor.component';
import { PostEnderecoComponent } from './components/user/register-documents/documents/post-endereco/post-endereco.component';
import { PostMotoristaComponent } from './components/user/register-documents/documents/post-motorista/post-motorista.component';
import { PostNascimentoComponent } from './components/user/register-documents/documents/post-nascimento/post-nascimento.component';
import { PostOutrosComponent } from './components/user/register-documents/documents/post-outros/post-outros.component';
import { PostRgComponent } from './components/user/register-documents/documents/post-rg/post-rg.component';
import { PostTrabalhoComponent } from './components/user/register-documents/documents/post-trabalho/post-trabalho.component';
import { RegisterDocumentsComponent } from './components/user/register-documents/register-documents.component';
import { RequestComponent } from './components/user/request/request.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: NavComponent, canActivate: [AuthGuard], children: [
      { path: 'home', component: HomeComponent },
      { path: 'cadastrar', component: RegisterDocumentsComponent },
      { path: 'buscar', component: SearchDocumentsComponent},
      { path: 'pedidos', component: RequestComponent },
      { path: 'historico', component: HistoryComponent},
      { path: 'pedidosempresa', component: RequestCompanyComponent},
      { path: 'documentos', component: ViewDocumentsComponent},
      { path: 'postrg', component: PostRgComponent },
      { path: 'postcpf', component: PostCpfComponent },
      { path: 'posteleitor', component: PostEleitorComponent },
      { path: 'postcasamento', component: PostCasamentoComponent },
      { path: 'postnascimento', component: PostNascimentoComponent },
      { path: 'postmotorista', component: PostMotoristaComponent },
      { path: 'posttrabalho', component: PostTrabalhoComponent },
      { path: 'postendereco', component: PostEnderecoComponent },
      { path: 'postoutros', component: PostOutrosComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }