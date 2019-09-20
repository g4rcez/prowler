import { slugify, capitalize } from "sidekicker/lib/strings";
import events from "events";

const createEventName = (prefix: string) => (action: string) => {
	return slugify(`${capitalize(action)}${capitalize(prefix)}`);
};

export const EventEmitter = (prefix: string) => {
	const emitter = new events.EventEmitter();
	emitter.setMaxListeners(11);
	return emitter;
};
