import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getImageData(imageUrl, callback) {
    const obj = {
      imageUrl: imageUrl,
    };
    this.http.post(`${this.uri}`, obj)
      .subscribe(res => callback(res));
  }
}
