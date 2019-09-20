import cheerio from "cheerio";
import puppeter from "puppeteer";
import url from "url";
import log from "../utils/Log";
import UaGenerator from "../utils/UaGenerator";
import { EventEmitter } from "./EventEmitter";

type Links = {
	timestamp: Date;
	isFile: boolean;
	href: string;
};
type ParsePageReport = {
	url: URL;
	html: string;
	href: string;
};

async function configurePage() {
	const browser = await puppeter.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
	const page = await browser.newPage();
	await page.setJavaScriptEnabled(true);
	await page.setUserAgent(UaGenerator());
	return page;
}

export const WebWorker = async (origin: url.URL) => {
	const emitter = EventEmitter("WebWorker");
	const page = await configurePage();
	const links = [
		{
			href: origin.href,
			isFile: false,
			timestamp: new Date()
		}
	] as Links[];

	emitter.addListener("NewPage", parseNewPage);

	function checkIfExist(href: string) {
		console.log(links, href);
		return links.some((x) => href === x.href);
	}

	async function parseNewPage(report: ParsePageReport) {
		const $ = cheerio.load(report.html);
		$("a").each(async (_, e) => {
			const link = $(e).attr("href");
			if (/https?:\/\//.test(link)) {
				if (!checkIfExist(link)) {
					log.info("New page", link);
					links.push({
						isFile: false,
						href: link,
						timestamp: new Date()
					});
					const html = await parsePage(new url.URL(link));
					emitter.emit("NewPage", html);
				}
			} else {
				log.error("Look this error", link);
			}
		});
	}

	async function parsePage(url: URL) {
		try {
			await page.goto(url.href);
			// await page.setDefaultNavigationTimeout(5000);
			// await page.waitForNavigation();
			const html = await page.content();
			await page.removeAllListeners();
			return { html, url, href: url.href };
		} catch (e) {
			log.fatal(e);
			return { html: "", url: null, href: "" };
		}
	}

	async function start() {
		try {
			const html = await parsePage(origin);
			emitter.emit("NewPage", html);
		} catch (e) {
			log.fatal(e);
		}
	}

	return { start };
};
