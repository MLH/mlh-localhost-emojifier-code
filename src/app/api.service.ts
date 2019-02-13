
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendFile(file) {
    const obj = {
      file: file,
    };
    console.log(obj);
    this.http.post(`${this.uri}`, obj)
        .subscribe(res => console.log('Done'));
  }
}

