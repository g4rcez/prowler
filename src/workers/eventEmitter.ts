import events, { EventEmitter } from "events";
import { slugify, capitalize } from "sidekicker/lib/strings";

const createEventName = (prefix: string) => (action: string) => {
	return slugify(`${capitalize(action)}${capitalize(prefix)}`);
};
export default class Event<Worker> {
	public static START = "Start";
	public static COMPLETE = "Complete";
	public prefixEvent: string;
	private event: events.EventEmitter;
	private startEventName: string;
	private completeEventName: string;
	private createName: (str: string) => string;

	constructor(props: Partial<Event<Worker>>) {
		this.prefixEvent = props.prefixEvent!;
		this.createName = createEventName(this.prefixEvent);
		this.event = new EventEmitter();
		this.startEventName = this.createName(Event.START);
		this.completeEventName = this.createName(Event.COMPLETE);
	}

	public addStartListener(callback: Function) {
		this.event.addListener(this.startEventName, () => {
			callback(this);
		});
	}

	public emitStart() {
		this.event.emit(this.startEventName);
	}

	public emitComplete() {
		this.event.emit(this.completeEventName);
	}

	public addCompleteListener(callback: Function) {
		this.event.addListener(this.completeEventName, () => {
			callback(this);
		});
	}

	public onStart(callback: Function) {
		this.event.on(this.startEventName, () => {
			callback(this);
		});
	}

	public onComplete(callback: Function) {
		this.event.on(this.completeEventName, () => {
			callback(this);
		});
	}

	public addEventListener(actionToListener: string, callback: Function) {
		const name = this.createName(actionToListener);
		//@ts-ignore
		return this.event.addListener(name, callback);
	}

	public emit(eventName: string, ...args: any) {
		this.event.emit(this.createName(eventName), ...args);
	}

	public clean() {
		this.event.removeAllListeners();
	}

	public on(listenEvent: string, callback: Function) {
		//@ts-ignore
		this.event.on(this.createName(listenEvent), callback);
	}
}
