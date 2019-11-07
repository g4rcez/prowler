import { homedir } from "os";
import {existsSync,mkdirSync} from "fs";
import { extname, join } from "path";

const dirToSaveScan = (hostSite: string) => {
	const prowlerAnalytics = join(homedir(), "prowler-analytics")
	if(!existsSync(prowlerAnalytics)){
		mkdirSync(prowlerAnalytics)
	}
	return join(prowlerAnalytics, hostSite)
};
const getExtName = (file: string) => extname(file);
const pathToSaveFile = (hostSite: string, routeOrPage: string) => join(dirToSaveScan(hostSite), routeOrPage);

export default {
	getExtName,
	dirToSaveScan,
	pathToSaveFile,
	createWorkDir: (site:string) => {
		const dir = dirToSaveScan(site)
		try {
			if(!existsSync(dir)){
				mkdirSync(dir)
			}
		} catch (error) {
			mkdirSync(dir)
		}
		return dir
	}
};
