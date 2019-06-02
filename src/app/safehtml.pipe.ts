import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safehtml' })
export class SafeHTMLPipe {
	constructor(protected _sanitizer: DomSanitizer) {}
	public transform(value: string): SafeHtml {
		return this._sanitizer.bypassSecurityTrustHtml(value);
	}
}
