import Fetch from "../utils/Fetch";

const getURL = (domain: string) => "https://certspotter.com/api/v0/certs?domain=" + domain;

const DomainSearch = async (domain: string) => {
	try {
		const response = await Fetch.get(getURL(domain));
		const dnsNames = response.data.map((x: any) => x.dns_names);
	} catch (error) {}
};

export default DomainSearch;
