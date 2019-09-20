import { trueTrim } from "sidekicker/lib/strings";
const whois = require("whois");

const findLineByPrefix = (lines: string[]) => (prefix: string): string | string[] => {
	const result = lines.filter((x: string) => x.startsWith(`${prefix}`));
	if (result.length === 1) {
		return trueTrim(result[0].split(":")[1]);
	}
	return result.map((x: string) => {
		return trueTrim(x.split(":")[1]);
	});
};

type WhoisReport = {
	domain: string;
	person: string | string[];
	"e-mail": string | string[];
	responsible: string | string[];
	owner: string | string[];
	ownerid: string;
};

export const Whois = async (url: string): Promise<WhoisReport> => {
	return new Promise((resolve, reject) => {
		whois.lookup(url, (err: any, data: string) => {
			const lines = data.toString().split("\n");
			const findLines = findLineByPrefix(lines);
			return resolve({
				domain: findLines("domain") as string,
				person: findLines("person"),
				"e-mail": findLines("e-mail"),
				responsible: findLines("responsible"),
				owner: findLines("owner"),
				ownerid: findLines("ownerid") as string
			});
		});
	});
};
