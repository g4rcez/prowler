export default interface IWorker<IReport> {
	start(): void;
	report(): IReport;

	complete(): void;
}
