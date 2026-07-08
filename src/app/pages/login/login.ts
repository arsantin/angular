import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { environment } from '../../../environments/environment.development';

interface ILogin {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginModel = signal<ILogin>({
    email: '',
    password: '',
  });
  http = inject(HttpClient);
  loginForm = form(this.loginModel);

  postLogin() {
    const { email, password } = this.loginModel();
    const loginData: ILogin = { email, password };
    console.log('loginData', loginData);
    this.http.post(`${environment.baseUrl}/signin`, loginData).subscribe({
      next: (response: any) => {
        console.log('response', response);
        const token = response?.data?.token;
        localStorage.setItem('token_angular', token);
        alert('Formulário enviado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao enviar o formulário', error);
      },
    });
  }
}
