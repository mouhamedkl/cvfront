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
  personalInfo = { name: '', email: '', phone: '',linkedin:'',github:'' };
  education = [{ degree: '', institution: '', startDate: '', endDate: '' }];
  workExperience = [{ position: '', company: '', startDate: '', endDate: '', description: '' }];
  skills = '';
  certifications= [{ title: '', institution: '' }];
  languagesSpoken = [''];
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
    this.languagesSpoken.push('');
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
        console.log(error.toString());
        this.isLoading = false;
      });
  }
  validEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  fillSampleData() {
    // Fill Personal Information
    this.personalInfo = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    };

    // Fill Education
    this.education = [
      { degree: 'BSc Computer Science', institution: 'XYZ University', startDate: '2015-09-01', endDate: '2019-06-01' },
      { degree: 'MSc Software Engineering', institution: 'ABC University', startDate: '2019-09-01', endDate: '2021-06-01' }
    ];

    // Fill Work Experience
    this.workExperience = [
      {
        position: 'Software Engineer',
        company: 'Tech Company',
        startDate: '2021-07-01',
        endDate: 'Present',
        description: 'Developing web applications using Angular and Node.js. Collaborated with cross-functional teams to define, design, and ship new features. Improved application performance by optimizing code and implementing best practices. Actively participated in code reviews and contributed to team knowledge sharing sessions.'
      },
      {
        position: 'Intern',
        company: 'Startup',
        startDate: '2020-06-01',
        endDate: '2021-06-01',
        description: 'Assisted in software development by contributing to various projects using JavaScript and Python. Engaged in daily stand-ups and sprint planning sessions. Gained hands-on experience in Agile methodologies. Developed a small web application that improved internal communication, resulting in a 20% increase in team efficiency.'
      }
    ];

    // Fill Skills
    this.skills = 'JavaScript, Angular, Python, Node.js, HTML, CSS, Git, Agile methodologies';

    // Fill Languages Spoken
    this.languagesSpoken = ['English', 'Spanish','Arabe'];

    // Fill Projects
    this.projects = [
      { projectName: 'Project A', startDate: '2022-01-01', endDate: '2022-12-01', description: 'Led the development of an e-commerce platform. Implemented responsive design and integrated payment gateways, resulting in a 30% increase in user engagement.', toolsUsed: 'Angular, Node.js, MongoDB' },
      { projectName: 'Project B', startDate: '2023-01-01', endDate: '2023-06-01', description: 'Developed a social media application with real-time chat features. Collaborated with designers to create an intuitive user interface and ensured cross-platform functionality.', toolsUsed: 'React, Express, Socket.io' }
    ];

    // Fill Certifications
    this.certifications = [
      { title: 'Certified Scrum Master', institution: 'Scrum Alliance' },
      { title: 'AWS Certified Solutions Architect', institution: 'Amazon' }
    ];

    // Fill Organizations
    this.organizations = [
      { name: 'Tech Innovators', role: 'Member'},
      { name: 'Developer Community', role: 'Co-founder' }
    ];
}



}
