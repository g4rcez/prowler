export default interface IReport<T> {
	name: string;
	workDirectory: string;
	parseReport(report: T): void;
}
