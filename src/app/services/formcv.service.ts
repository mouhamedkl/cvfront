import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormcvService {

  constructor(private http:HttpClient) { }
  url=environment.apiUrl+"/generate-cv"
  addcv(formData:FormData):Observable<{ pdf: string }>{
return  this.http.post<{ pdf: string }>(this.url, formData)
  }

}
