import Fetch from "../utils/Fetch";
import { onlyNumbers, trueTrim, formatCnpj } from "sidekicker/lib/strings";
import cheerio from "cheerio";

const parsers = {
	CNPJ: (text: string) => {
		const data = trueTrim(text.split(": ")[1].split(" - ")[1]);
		return [formatCnpj(data), "CNPJ"];
	},
	"Razão Social": (text: string) => [text.split(": ")[1], "Razão Social"],
	"Data da Abertura": (text: string) => [text.split(": ")[1], "Data de Abertura"],
	"Capital Social": (text: string) => [text.split(": ")[1], "Capital Social"],
	Tipo: (text: string) => [text.split(": ")[1], "Tipo"],
	Situação: (text: string) => [text.split(": ")[1], "Situação"],
	"Natureza Jurídica": (text: string) => [text.split(": ")[1], "Natureza Jurídica"],
	"E-mail": (text: string) => [text.split(": ")[1].split(" ")[0], "Email"],
	"Telefone(s):": (text: string) => {
		const data = text.split(": ");
		const cellphones = data[1]
			.replace(/[^\(\d\d\) \d{4,5}-\d{4,5}]/g, "")
			.replace(/\(\)/g, "")
			.replace(/\) /g, ")")
			.split(" ");
		return [cellphones, "Telefones"];
	},
	Logradouro: (text: string) => [text, "Logradouro"],
	Complemento: (text: string) => [text.split(": ")[1], "Complemento"],
	Bairro: (text: string) => [text.split(": ")[1], "Bairro"],
	CEP: (text: string) => [text.split(": ")[1], "CEP"],
	Município: (text: string) => [text.split(": ")[1], "Município"],
	Estado: (text: string) => [text.split(": ")[1], "Estado"],
	"Para correspondência": (text: string) => [text.split(": ")[1], "Endereço Correspondência"],
	Principal: (text: string) => [text.split(": ")[1], "Principal"],
	Secundárias: (text: string) => [text.split(": ")[1], "Secundárias"]
};

const parseEach = (text: string) => {
	for (const parser in parsers) {
		if (text.startsWith(parser)) {
			// @ts-ignore
			const [data, typeInfo] = parsers[parser](text);
			if (Array.isArray(data)) {
				return data.filter(Boolean);
			}
			return [trueTrim(data), typeInfo];
		}
	}
	return [trueTrim(text), ""];
};

const DocumentExplorer = (document: string) => {
	const documentNumber = onlyNumbers(document);

	if (documentNumber.length === 11) {
		// !ToDo: Consulta CPF
	}
	if (documentNumber.length === 14) {
		return new Promise(async (resolve, reject) => {
			const response = await Fetch.get("https://cnpj.biz/" + documentNumber);
			if (response.ok) {
				const html: any = await response.data;
				const $ = cheerio.load(html);
				const elements = $(".hero p");
				const elementsCount = elements.length - 1;
				const companyData = {} as any;
				elements.each((i, element) => {
					if (i !== elementsCount) {
						const [value, key] = parseEach($(element).text());
						companyData[key] = value;
					}
				});
				return resolve({ data: companyData, type: "company" });
			}
			return reject(null);
		});
	}
};

export default DocumentExplorer;
