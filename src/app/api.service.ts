import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = environment.api_url;

  constructor(private http: HttpClient) { }

  getImageData(imageUrl, callback) {
    const obj = {
      imageUrl: imageUrl,
    };
    this.http.post(`${this.uri}`, obj)
      .subscribe(res => callback(res));
  }
}
