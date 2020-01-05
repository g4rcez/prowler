import childProcess from "child_process";
require("dotenv").config();

const PYTHON = "/usr/bin/python3";
const PATH = process.env.PYTHON_SCRIPTS;
type MapCommands = {
  command: string;
  unixEpoch: Date;
  formatDate: string;
};
const mapChildProcess = new Map<string, MapCommands>();

const controlProcess = (key: string, command: string) => {
  if (mapChildProcess.has(key)) {
    return false;
  }
  const date = new Date();
  mapChildProcess.set(key, {
    command,
    formatDate: date.toLocaleString(),
    unixEpoch: date
  });
  return true;
};

const $ = (scriptName: string, params: string) => {
  const command = `${PYTHON} ${PATH} ${scriptName} ${params}`;
  controlProcess(`#ToDo: Gerar UUID`, command);
};

export default $;
