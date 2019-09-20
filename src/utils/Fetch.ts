import fetch from "node-fetch";

type FetchReturn = {
	data: any;
	ok: boolean;
	statusCode: number;
	statusText: string;
	headers: any;
};

const Fetch = (
	url: string,
	body: any = undefined,
	method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
	config: any = {
		headers: {}
	}
): Promise<FetchReturn> => {
	return new Promise(async (resolve, reject) => {
		const response = await fetch(url, {
			body,
			method,
			headers: { ...config.headers },
			redirect: "follow"
		});
		if (!response.ok) {
			return resolve({
				ok: false,
				data: (response.text() as unknown) as any,
				statusCode: response.status,
				statusText: response.statusText,
				headers: response.headers
			});
		}
		const contentType = response.headers.get("Content-Type") || "";
		if (contentType.startsWith("application/json")) {
			const data = await response.json();
			return resolve({
				data,
				ok: response.ok,
				statusCode: response.status,
				statusText: response.statusText,
				headers: response.headers
			});
		}
		return resolve({
			data: response.text() as any,
			ok: response.ok,
			statusCode: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	});
};

Fetch.get = (url: string, config?: any) => {
	return Fetch(url, undefined, "GET", config);
};

export default Fetch;
