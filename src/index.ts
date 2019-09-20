import commander from "commander";
import URL from "url";
import { WebWorker } from "./workers/WebWorker";
import { Whois } from "./workers/Whois";
import DocumentExplorer from "./workers/DocumentExplorer";

const app = new commander.Command();

app.version("0.0.1");

app.option("-u, --url <url>", "URL of site to parse");
app.parse(process.argv);

async function main() {
	const report = {
		emails: [],
		
	};
	const url = new URL.URL(app.url!);
	// const whois = await Whois(url.hostname);
	// const documents = await DocumentExplorer(whois.ownerid);
	// console.log(whois, documents);
	const e = await WebWorker(url);
	e.start()
}
main();
