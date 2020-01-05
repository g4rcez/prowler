import database from "../../database";
import Host from "../target/host";

export class ShodanDTO {
  public domain: string;
  public hosts: Host[];

  public constructor(props: Partial<ShodanDTO> = {}) {
    this.domain = props.domain || "";
    this.hosts = props.hosts || [];
  }
}

const shodan = async (data: ShodanDTO) => {
  const { DB, Query } = await database;
  return data;
};

export default shodan;
