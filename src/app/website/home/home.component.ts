import { Component, OnInit } from '@angular/core';
import { ThemeToggleComponent } from "../../admin/components/theme-toggle/theme-toggle.component";
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  FormControl, 
  Validators 
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../admin/services/auth.service';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    ThemeToggleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  loginForm!: FormGroup<{
    email: FormControl<string | null>;
    passwd: FormControl<string | null>;
  }>;
  
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirigir si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    
    // Default return URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      passwd: new FormControl('', [Validators.required])
    });
  }

  // Acceso rápido a los controles del formulario
  get f() { 
    return {
      email: this.loginForm.get('email') as FormControl,
      passwd: this.loginForm.get('passwd') as FormControl
    };
  }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(
      this.f.email.value ?? '', 
      this.f.passwd.value ?? ''
    )
      .pipe(first())
      .subscribe(
        data => {
          // Redirigir a la URL de retorno
          this.router.navigate([this.returnUrl]);
        },
        error => {
          // Manejar errores de inicio de sesión
          this.error = 'Correo o contraseña incorrectos';
          this.loading = false;
        });
  }
}
