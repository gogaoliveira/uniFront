import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Para trabalhar com formulários no Angular 12
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Para realizar requisições HTTP
import { HttpClientModule } from '@angular/common/http';

// Imports para componentes do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatGridListModule} from '@angular/material/grid-list';
import { ToastrModule } from 'ngx-toastr'

//componentes
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { RegisterDocumentsComponent } from './components/user/register-documents/register-documents.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'
import { NgxMaskModule } from 'ngx-mask';
import { PostRgComponent } from './components/user/register-documents/documents/post-rg/post-rg.component';
import { PostCpfComponent } from './components/user/register-documents/documents/post-cpf/post-cpf.component';
import { PostEleitorComponent } from './components/user/register-documents/documents/post-eleitor/post-eleitor.component';
import { PostCasamentoComponent } from './components/user/register-documents/documents/post-casamento/post-casamento.component';
import { PostNascimentoComponent } from './components/user/register-documents/documents/post-nascimento/post-nascimento.component';
import { PostMotoristaComponent } from './components/user/register-documents/documents/post-motorista/post-motorista.component';
import { PostTrabalhoComponent } from './components/user/register-documents/documents/post-trabalho/post-trabalho.component';
import { PostEnderecoComponent } from './components/user/register-documents/documents/post-endereco/post-endereco.component';
import { PostOutrosComponent } from './components/user/register-documents/documents/post-outros/post-outros.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { RequestComponent } from './components/user/request/request.component';
import { SearchDocumentsComponent } from './components/company/search-documents/search-documents.component';
import { HistoryComponent } from './components/user/history/history.component';
import { RequestCompanyComponent } from './components/company/request-company/request-company.component';
import { ViewDocumentsComponent } from './components/company/view-documents/view-documents.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HeaderComponent,
    RegisterDocumentsComponent,
    LoginComponent,
    RegisterComponent,
    PostRgComponent,
    PostCpfComponent,
    PostEleitorComponent,
    PostCasamentoComponent,
    PostNascimentoComponent,
    PostMotoristaComponent,
    PostTrabalhoComponent,
    PostEnderecoComponent,
    PostOutrosComponent,
    RequestComponent,
    SearchDocumentsComponent,
    HistoryComponent,
    RequestCompanyComponent,
    ViewDocumentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // Forms
    FormsModule,
    ReactiveFormsModule,
    // Requisições http
    HttpClientModule,
    // Angular Material
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatGridListModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }