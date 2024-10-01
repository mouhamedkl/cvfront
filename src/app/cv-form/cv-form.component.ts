import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormcvService } from '../services/formcv.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.css'
})
export class CvFormComponent {
organizations: any[]=[{ name: '', role: '' }];
addOrganization() {
  this.organizations.push({ name: '', role: '' })
}
removeOrganization(index: number) {
  this.organizations.splice(index, 1);
}
addCertification() {
this.certifications.push({ title: '', institution: '' })
}
removeCertification(index: number) {
  this.certifications.splice(index, 1);
}
  personalInfo = { name: '', email: '', phone: '',linkedin:'',github:'',position:'' };
  education = [{ degree: '', institution: '', startDate: '', endDate: '' }];
  workExperience = [{ position: '', company: '', startDate: '', endDate: '', description: '' }];
  skills = '';
  certifications= [{ title: '', institution: '' }];
  languagesSpoken = [{lang:""}];
  projects = [{ projectName: '', startDate: '', endDate: '', description: '', toolsUsed: '' }];
  selectedImage: File | null = null; // Store selected image file
selectedLanguage: any;

  constructor(private serviceform:FormcvService) {}

  // Handle image selection
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addProject() {
    this.projects.push({ projectName: '', startDate: '', endDate: '', description: '', toolsUsed: '' });
  }

  addEducation() {
    this.education.push({ degree: '', institution: '', startDate: '', endDate: '' });
  }  removeEducation(index: number) {
    this.education.splice(index, 1);
  }
  removeWorkExperience(index: number) {
    this.workExperience.splice(index, 1);
  }
  addWorkExperience() {
    this.workExperience.push({ position: '', company: '', startDate: '', endDate: '', description: '' });
  }
  removeLanguage(index: number) {
    this.languagesSpoken.splice(index, 1);
  }
  removeProject(index: number) {
    this.projects.splice(index, 1);
  }
  addLanguage() {
    this.languagesSpoken.push({lang:''});
  }

  isLoading: boolean = false;
  generateCV(v:any) {
    const cvData = {
      personalInfo: this.personalInfo,
      education: this.education,
      workExperience: this.workExperience,
      skills: this.skills.split(',').map(skill => skill.trim()),
      languagesSpoken: this.languagesSpoken.filter(lang => lang),
      projects: this.projects
        .filter(project => project.projectName)
        .map(project => ({
          ...project,
          toolsUsed: project.toolsUsed.split(',').map(tool => tool.trim())
        })),
      language: this.selectedLanguage,  // Dynamically set the selected language
      certifications:this.certifications,
      organizations:this.organizations
    };
  
    const formData = new FormData();
    formData.append('cvData', JSON.stringify(cvData));
  
    // If an image is selected, append it to the form data
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
    this.isLoading = true;
    // Send the form data to the backend
    this.serviceform.addcv(formData)
      .subscribe(response => {
        this.isLoading = false;
        const link = document.createElement('a');
        link.href = response.pdf;
        link.download = 'cv.pdf';
        link.click();
      },(error:HttpErrorResponse)=>{
        alert("error")
        console.log(error.error);
        this.isLoading = false;
      });
  }


  



}
