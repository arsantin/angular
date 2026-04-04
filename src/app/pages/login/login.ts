import { Component, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

interface ILogin {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  loginModel = signal<ILogin>({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel);

  postLogin() {
    const loginData = this.loginForm();
    console.log(loginData)
  }

}
