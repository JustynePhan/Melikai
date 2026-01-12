import { Routes } from '@angular/router';
import { EnvelopeIntroComponent } from './envelope-intro/intro.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: EnvelopeIntroComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
