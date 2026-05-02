import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-envelope-intro',
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class EnvelopeIntroComponent {
  isExiting = false;

  constructor(private router: Router) {}

  enterHome(): void {
    this.isExiting = true;
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 600);
  }
}
