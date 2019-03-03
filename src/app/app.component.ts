import { Component, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe {
	constructor(protected _sanitizer: DomSanitizer) {}
	public transform(value: string): SafeHtml {
		return this._sanitizer.bypassSecurityTrustHtml(value);
	}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
	constructor(private http: HttpClient) {}

  title = 'emojifier';
  uri = 'http://localhost:3000';
	imageUrl = '';
	htmlToAdd = ''

	sendFile(imageUrl) {
    this.imageUrl = '';

    const obj = {
      imageUrl: imageUrl,
    };

		// write type FaceModel here

		this.htmlToAdd = ''
		this.http.post(`${this.uri}`, obj).subscribe((res:any) => {
      if (res.error) {
        this.htmlToAdd += `<span style="color: red;">${res.error.message}</span>`;
        return;
      }
			res.forEach((face:FaceModel) => {
				const { faceRectangle, faceAttributes } = face;
				const { height, width, left, top } = faceRectangle;

        // write code to add Image here

				const { emotion } = faceAttributes;
				let mainEmotion = undefined;

				Object.keys(emotion).forEach(key => {
					if(!mainEmotion || emotion[key] > emotion[mainEmotion]) {
						mainEmotion = key
					}
				});

				// write code to add emoji here
			})
		});
	}
}
