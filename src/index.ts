import commander from "commander";
import URL from "url";
import server from "./server";

const app = new commander.Command();

app.version("0.0.1");

app.option("-u, --url <url>", "URL of site to parse");
app.parse(process.argv);

const createUrl = (str: string) =>
  /^https?:\/\//.test(str) ? str : `https://${str}`;

(async () => {
  const url = new URL.URL(createUrl(app.url!));
  server.listen(3000, () => {
    console.log("Entrypoint domain:", url.href);
    console.log("Web server is up");
  });
})();
