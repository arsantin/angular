import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Field, form, FormField } from '@angular/forms/signals';
import { environment } from '../../../environments/environment.development';

interface iContato {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contato',
  imports: [FormField],
  templateUrl: './contato.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contato.css',
})
export class Contato {
  http = inject(HttpClient);

  contatoModel = signal<iContato>({
    name: '',
    email: '',
    message: '',
  });

  contatoForm = form(this.contatoModel);

  sendForm() {
    const { name, email, message } = this.contatoModel();
    const formData: iContato = { name, email, message };
    console.log(formData);
    this.http.post(`${environment.baseUrl}/signup`, formData).subscribe({
      next: (response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);
        console.log('Formulário enviado com sucesso!', response);
      },
      error: (error) => {
        console.error('Erro ao enviar o formulário', error);
      },
    });
  }
}
