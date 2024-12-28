import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from 'aws-amplify';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public loginForm: FormGroup<LoginForm>;
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.loginForm = this.formBuilder.group<LoginForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  async onSubmit() {
    const { email, password } = this.loginForm.value;

    try {
      await Auth.signIn(email!, password);
      alert('Logged in');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }
}
