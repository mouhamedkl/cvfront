import { Routes } from '@angular/router';
import { CvFormComponent } from './cv-form/cv-form.component';

export const routes: Routes = [
    {path:"",redirectTo:"cv",pathMatch:"full"},
    {path:"cv",component:CvFormComponent},

    {path:"**",redirectTo:"cv"},
   
];
