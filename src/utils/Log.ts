import signale from "signale";
import moment from "moment";
import chalk from "chalk";

export const Styles = {
	title: chalk.bgBlack.blueBright.bold,
	debug: chalk.bold.yellowBright,
	timestamps: chalk.underline,
	url: chalk.underline.bold.greenBright
};
type LEVELS = "complete" | "info" | "error" | "fatal" | "debug" | "start";

const log = (level: LEVELS, ...messages: any[]) => {
	const logger = signale[level];
	const now = moment().format("YYYY-MM-DD HH:mm:ss");
	logger(Styles.timestamps(now), ...messages);
};

log.complete = (...messages: any[]) => log("complete", ...messages);
log.info = (...messages: any[]) => log("info", ...messages);
log.error = (...messages: any[]) => log("error", ...messages);
log.fatal = (...messages: any[]) => log("fatal", ...messages);
log.debug = (...messages: any[]) => log("debug", ...messages);
log.start = (...messages: any[]) => log("start", ...messages);

export default log;
