import commander from "commander";
import URL from "url";
import { WebWorker } from "./workers/WebWorker";
import { Whois } from "./workers/Whois";
import DocumentExplorer, { TypeDocExplorer } from "./workers/DocumentExplorer";
import Report from "./workers/Report";
import fs from "fs";
import os from "os";
import File from './utils/File';

const app = new commander.Command();

app.version("0.0.1");

app.option("-u, --url <url>", "URL of site to parse");
app.parse(process.argv);

const report = new Report();

const addFromDocumentExplorer = (documents: TypeDocExplorer | null) => {
	if (documents !== null && documents.type === "company") {
		const data = documents.data;
		report.addDocument(data.CNPJ);
		report.addCellphones(data.Telefones);
		report.razaoSocial = data["Razão Social"];
		report.addAddress({
			logradouro: data.Logradouro,
			complemento: data.Complemento,
			bairro: data.Bairro,
			cep: data.CEP,
			municipio: data["Município"],
			estado: data.Estado
		});
	}
};

async function main() {
	const url = new URL.URL(app.url!);
	const whois = await Whois(url.hostname);
	
	const dirname = File.createWorkDir(url.hostname);

	report.addEmails(whois["e-mail"]);
	report.domain = whois.domain;
	report.addDocument(whois.ownerid);

	const documents = await DocumentExplorer(whois.ownerid);
	addFromDocumentExplorer(documents);
	
	const e = await WebWorker(url,dirname);
	e.start()
}

main();
