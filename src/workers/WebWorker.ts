import cheerio from "cheerio";
import puppeter from "puppeteer";
import url from "url";
import log from "../utils/Log";
import UaGenerator from "../utils/UaGenerator";
import { EventEmitter } from "./EventEmitter";
import psl from "psl";
import { join } from 'path';

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

const removeBarOnString = (x: string) => x.replace(/\/$/, "");

export const WebWorker = async (origin: url.URL,basedir: string) => {
	const emitter = EventEmitter("WebWorker");
	const links = [
		{
			href: origin.href,
			isFile: false,
			timestamp: new Date()
		}
	] as Links[];

	emitter.addListener("NewPage", parseNewPage);

	const checkIfExist = (href: string) =>
		links.some((x) => {
			const newHref = new URL(removeBarOnString(href));
			const newLink = new URL(removeBarOnString(x.href));
			const linkDomain = psl.get(newLink.hostname);
			const hrefDomain = psl.get(newHref.hostname);
			if(linkDomain === hrefDomain){
				return newLink.href === newHref.href;
			}
			return false
		});

	async function parseNewPage(report: ParsePageReport) {
		const $ = cheerio.load(report.html);
		$("a").each(async (_, e) => {
			let link = $(e).attr("href").replace(/\/#\/$/,"").trim();
			if (/https?:\/\//.test(link)) {
				link = link.trim();
			} else if(link.startsWith("#/")) {
				link = `${origin.href}${link}`.replace(/\/#\/$/,"").trim()
			} else {
				log.error("Look this error", link);
				return;
			}
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
		});
	}

	async function parsePage(url: URL) {
		try {
			const page = await configurePage();
			await page.goto(url.href);
			// await page.waitForNavigation();
			
			const html = await page.content();
			await page.emulateMedia("print");
			// await page.pdf({path: "page.pdf"});
			const pathPrint = `${url.href}.png`.replace(/\//g, "-").replace(/^http:\/\//g, "").replace(/^https:\/\//g, "")
			await page.screenshot({
				path: join(basedir, pathPrint),
				type:"png",
				encoding:"binary",
				fullPage:true
			});

			return { html, url, href: url.href };
		} catch (e) {
			log.fatal(`Page ${url.href} maybe is offline`,e);
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
