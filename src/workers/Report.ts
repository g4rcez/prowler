export default class Report {
	public domain: string;
	public emails: string[];

	constructor() {
		this.domain = "";
		this.emails = [];
	}

	public addEmail(email: string) {
		const set = new Set(this.emails.concat(email));
		this.emails = [...set];
	}
}
