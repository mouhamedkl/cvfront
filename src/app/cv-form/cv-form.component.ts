import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormcvService } from '../services/formcv.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './cv-form.component.html',
  styleUrls: ['./cv-form.component.css']  
})
export class CvFormComponent implements OnInit {
  cvForm!: FormGroup;
  cvForm1!: FormGroup;
  cvForm2!: FormGroup;
  personalInfo = { name: '', email: '', phone: '', linkedin: '', github: '', position: '' };
  selectedImage: File | null = null; 
  selectedLanguage: any;
  isLoading: boolean = false;
  currentStep: number = 1;
  constructor(private serviceform: FormcvService, private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cvForm = this.fb.group({
      language: [this.selectedLanguage, Validators.required],
      name: [this.personalInfo.name, [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: [this.personalInfo.email, [Validators.required, Validators.email]],
      phone: [this.personalInfo.phone, [Validators.required, Validators.pattern('[0-9]*')]],
      position: [this.personalInfo.position, [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      linkedin: [this.personalInfo.linkedin, [
        Validators.required, 
        Validators.pattern('^(https?://)(www\\.)?linkedin\\.com/.*')
      ]],
      github: [this.personalInfo.github,Validators.pattern('^(https?://)(www\\.)?github\\.com/.*')],
      education: this.fb.array([]),
      image: [null, Validators.required] 
    });
    this.cvForm1= this.fb.group({
      workExperience: this.fb.array([]),
      skills: ['', Validators.required],
      languagesSpoken: this.fb.array([]),
    })
    this.cvForm2=this.fb.group({
      projects: this.fb.array([]),
      certifications: this.fb.array([]),
      organizations: this.fb.array([])
    })

  

    this.addEducation();
    this.addWorkExperience();
    this.addLanguage();
    this.addProject();
    this.addCertification();
    this.addOrganization();
  }

  get education(): FormArray {
    return this.cvForm.get('education') as FormArray;
  }

  get workExperience(): FormArray {
    return this.cvForm1.get('workExperience') as FormArray;
  }

  get languagesSpoken(): FormArray {
    return this.cvForm1.get('languagesSpoken') as FormArray;
  }

  get projects(): FormArray {
    return this.cvForm2.get('projects') as FormArray;
  }

  get certifications(): FormArray {
    return this.cvForm2.get('certifications') as FormArray;
  }

  get organizations(): FormArray {
    return this.cvForm2.get('organizations') as FormArray;
  }

  addProject() {
    const projectGroup = this.fb.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      toolsUsed: ['', Validators.required]
    });
    this.projects.push(projectGroup);
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  addCertification() {
    const certificationGroup = this.fb.group({
      title: [''],
      institution: ['']
    });
    this.certifications.push(certificationGroup);
  }

  removeCertification(index: number) {
    this.certifications.removeAt(index);
  }

  addOrganization() {
    const organizationGroup = this.fb.group({
      name: [''],
      role: ['']
    });
    this.organizations.push(organizationGroup);
  }

  removeOrganization(index: number) {
    this.organizations.removeAt(index);
  }

  addWorkExperience(): void {
    const work = this.fb.group({
      position: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.workExperience.push(work);
  }

  removeWorkExperience(index: number): void {
    this.workExperience.removeAt(index);
  }

  addLanguage(): void {
    const lang = this.fb.group({
      lang: ['', Validators.required],
    });
    this.languagesSpoken.push(lang);
  }

  removeLanguage(index: number): void {
    this.languagesSpoken.removeAt(index);
  }

  addEducation(): void {
    const eduGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.education.push(eduGroup);
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.cvForm.patchValue({ image: this.selectedImage });
    } else {
      this.cvForm.patchValue({ image: null });
    }
  }

  generateCV() {
    this.personalInfo = { name: this.cvForm.value.name, email: this.cvForm.value.email, phone:this.cvForm.value.phone, linkedin: this.cvForm.value.linkedin, github: this.cvForm.value.github, position: this.cvForm.value.position };

    const cvData = {
      personalInfo: this.personalInfo,
      education: this.education.value, 
      workExperience: this.workExperience.value,
      skills: this.cvForm1.value.skills.split(',').map((skill: any) => skill.trim()),
      languagesSpoken: this.languagesSpoken.value,
      projects: this.projects.value
        .filter((project: any) => project.projectName)
        .map((project: any) => ({
          ...project,
          toolsUsed: project.toolsUsed.split(',').map((tool: any) => tool.trim())
        })),
      language: this.cvForm.value.language, // Dynamically set the selected language
      certifications: this.certifications.value,
      organizations: this.organizations.value
    };
    const formData = new FormData();
    formData.append('cvData', JSON.stringify(cvData));
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    this.isLoading = true;
    this.serviceform.addcv(formData)
      .subscribe((response: any) => {
        this.isLoading = false;
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = response.pdf;
        link.download = 'cv.pdf';
        link.click();
      }, (error: HttpErrorResponse) => {
        alert("An error occurred while generating the CV.");
        this.isLoading = false;
      });
  }


  

nextStep() {

  if (this.currentStep === 1) {
    if (this.selectedImage != null && this.cvForm.valid) {
      this.currentStep++;
    } else {
      this.cvForm.markAllAsTouched()
    }
  } 
  else if (this.currentStep === 2) {
    if (this.cvForm1.valid) {
      this.currentStep++;
    } else {
      this.cvForm1.markAllAsTouched()
    }
  }
  
}

previousStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}

}
