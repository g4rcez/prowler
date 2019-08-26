import cheerio from "cheerio";
import puppeter, { Page } from "puppeteer";
import signale from "signale";
import File from "../utils/File";
import UaGenerator from "../utils/UaGenerator";
import Event from "./eventEmitter";
import IReport from "./IReport";
import IWorker from "./IWorker";
import log from "../utils/Log";

export class BrowserWorkerReport implements IReport<BrowserWorkerReport> {
	public name: string;
	public workDirectory: string;
	public url: URL;
	public hostname: string;
	public html: string;
	public printDirectory?: string;
	parseReport(report: BrowserWorkerReport): void {
		throw new Error("Method not implemented.");
	}

	constructor(props: Partial<BrowserWorkerReport>) {
		this.name = "BrowserWorkerReport";
		this.hostname = props.hostname! || "";
		this.workDirectory = File.dirToSaveScan(this.hostname) || "";
		this.html = props.html! || "";
		this.url = props.url! || "";
	}
}

type ParsePageReport = {
	url: URL;
	html: string;
	href: string;
};

export class WebWorker implements IWorker<BrowserWorkerReport> {
	private URL: URL;
	private emitter: Event<WebWorker>;
	constructor(url: URL) {
		this.URL = url;
		this.emitter = new Event({ prefixEvent: "WebWorker" });
		this.emitter.addStartListener(() => {
			log.start("Start with", url.href);
		});
		this.emitter.addEventListener("NewPage", this.parseNewPage);
	}

	private async parseNewPage(report: ParsePageReport) {
		log.info("I Listen a new page", report.href);
		const $ = cheerio(report.html);
	}

	async configurePage(): Promise<Page> {
		const browser = await puppeter.launch();
		const page = await browser.newPage();
		await page.setJavaScriptEnabled(true);
		await page.setUserAgent(UaGenerator());
		return page;
	}

	async parsePage(url: URL): Promise<ParsePageReport> {
		const page = await this.configurePage();
		await page.goto(url.href);
		const html = await page.content();
		await page.close();
		return { html, url, href: url.href };
	}
	async start(): Promise<void> {
		this.emitter.emitStart();
		const html = await this.parsePage(this.URL);
		this.emitter.emit("NewPage", html);
	}
	report(): BrowserWorkerReport {
		throw new Error("Method not implemented.");
	}
	complete(): void {
		this.emitter.clean();
	}
}
