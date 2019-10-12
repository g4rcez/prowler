import { onlyNumbers, formatCellPhone } from "sidekicker/lib/strings";

export class Address {
	public logradouro: string;
	public complemento: string;
	public bairro: string;
	public cep: string;
	public municipio: string;
	public estado: string;
	constructor(props: Partial<Address> = {}) {
		this.logradouro = props.logradouro || "";
		this.complemento = props.complemento || "";
		this.bairro = props.bairro || "";
		this.cep = props.cep || "";
		this.municipio = props.municipio || "";
		this.estado = props.estado || "";
	}
}

export default class Report {
	public domain: string;
	public emails: string[];
	public docs: string[];
	public razaoSocial: string;
	public addressList: Address[];
	public cellphones: string[];

	constructor() {
		this.razaoSocial = "";
		this.domain = "";
		this.emails = [];
		this.docs = [];
		this.addressList = [];
		this.cellphones = [];
	}

	public addEmails(email: string[]) {
		const set = new Set([...this.emails, ...email]);
		this.emails = [...set];
	}

	public addDocument(document: string) {
		const docs = [...this.docs, document];
		this.docs = [...new Set(docs)];
	}

	public addAddress(addr: Address) {
		this.addressList.push(addr);
	}

	public addCellphones(maybeList: string | string[]) {
		if (Array.isArray(maybeList)) {
			const previousPhones = [...this.cellphones, ...maybeList].map((x) => onlyNumbers(x));
			this.cellphones = [...new Set(previousPhones)];
			return;
		}
		this.cellphones.push(onlyNumbers(maybeList));
	}
}
