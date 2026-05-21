import { Routes } from '@angular/router';
import { EnvelopeIntroComponent } from './components/envelope-intro/intro.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: EnvelopeIntroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:section', component: HomeComponent },
  { path: 'admin', component: AdminComponent }
];
