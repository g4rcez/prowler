import { homedir } from "os";
import { extname, join } from "path";

const dirToSaveScan = (hostSite: string) => join(homedir(), hostSite);

export default {
	dirToSaveScan,
	getExtName: (file: string) => extname(file),
	pathToSaveFile: (hostSite: string, routeOrPage: string) => join(dirToSaveScan(hostSite), routeOrPage)
};
