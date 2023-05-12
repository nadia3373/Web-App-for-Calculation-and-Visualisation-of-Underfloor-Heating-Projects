import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  // We will store the API URL in angular environment file
  private API_URL: string = environment.API_URL;

  // Dependency Injection to use HttpClient
  constructor(private http: HttpClient) {}

  // Methods to use to access proper endpoints
  public getRootMessage(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/`);
  }

  public getHelloMessage(name: string): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/greet/${name}`);
  }
}
