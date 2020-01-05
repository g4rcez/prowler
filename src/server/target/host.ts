export default class Host {
  public hostname: string;
  public domain: string;
  public lastSeen: Date | null;
  public ipAddress: string;

  public constructor(props: Partial<Host> = {}) {
    this.hostname = props.hostname || "";
    this.domain = props.domain || "";
    this.lastSeen = props.lastSeen || null;
    this.ipAddress = props.ipAddress || "";
  }
}
