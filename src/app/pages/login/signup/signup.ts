import { HttpClient } from '@angular/common/http';
import { Component, signal, inject } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

interface ISignup {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup',
  imports: [Field],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupModel = signal<ISignup>({
    name: '',
    email: '',
    password: '',
  });

  http = inject(HttpClient);
  signupForm = form(this.signupModel);

  postSignup() {
    const { name, email, password } = this.signupModel();
    const signupData: ISignup = { name, email, password };
    console.log('signupData', signupData);
    this.http.post('http://127.0.0.1:3000/signup', signupData).subscribe(
      (response: any) => {
        const token = response.token;
        localStorage.setItem('token_angular', token);
        alert('Formulário enviado com sucesso!');
      },
      (error) => {
        console.error('Erro ao enviar o formulário', error);
      },
    );
  }
}
