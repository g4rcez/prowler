import commander from "commander";
import signale from "signale";
import URL from "url";
import { WebWorker } from "./workers/WebWorker";

const app = new commander.Command();

app.version("0.0.1");

app.option("-u, --url <url>", "URL of site to parse");
app.parse(process.argv);

const url = new URL.URL(app.url!);

const webWorker = new WebWorker(url);
webWorker.start();

process.on("exit", () => {
	signale.fatal("Exit process");
});
