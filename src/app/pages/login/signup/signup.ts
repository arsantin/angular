import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { environment } from '../../../../environments/environment.development';

interface ISignup {
  username: string;
  email: string;
  password: string;
}

const signupModel = signal<ISignup>({
  username: '',
  email: '',
  password: '',
});

@Component({
  selector: 'app-signup',
  imports: [FormField],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signup.css',
})
export class Signup {
  http = inject(HttpClient);
  signupForm = form(signupModel);

  postSignup() {
    const { username, email, password } = signupModel();
    const signupData: ISignup = { username, email, password };
    console.log('signupData', signupData);
    this.http.post(`${environment.baseUrl}/user`, signupData).subscribe({
      next: (response: any) => {
        const token = response.token;
        localStorage.setItem('token_angular', token);
        alert('Formulário enviado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao enviar o formulário', error);
      },
    });
  }
}
