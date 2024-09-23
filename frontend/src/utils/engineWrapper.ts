import Queue from "./messageQueue";

// reference: https://disservin.github.io/stockfish-docs/stockfish-wiki/UCI-&-Commands.html
const VALID_UCI_OPTIONS = [
  "Threads",
  "Hash",
  "MultiPV",
  "UCI_LimitStrength",
  "UCI_Elo",
  "Skill Level",
];

class EngineWrapper {
  private engine: any;
  private queue: Queue<string>;
  private log: (message?: any, ...optionalParams: any[]) => void;
  public SearchTime: number | null = 5;
  public Depth: number | null = 20;

  constructor(
    engine: any,
    log: (message?: any, ...optionalParams: any[]) => void = console.log
  ) {
    this.engine = engine;
    this.queue = new Queue<string>();
    this.engine.addEventListener("message", (event: any) => {
      console.log("Event data", event.data);
      this.queue.put(event.data);
    });
    this.log = log;
  }

  send(command: string): void {
    this.log(">>(engine)", command);
    this.engine.postMessage(command);
  }

  async receive(): Promise<string> {
    const line = await this.queue.get();
    this.log("<<(engine)", line);
    return line;
  }

  async receiveUntil(predicate: (line: string) => boolean): Promise<string[]> {
    const lines: string[] = [];
    while (true) {
      const line = await this.receive();
      lines.push(line);
      if (predicate(line)) {
        break;
      }
    }
    return lines;
  }

  async initialize(options: Record<string, any> = {}): Promise<boolean> {
    this.send("uci");
    await this.receiveUntil((line) => line === "uciok");
    for (const name in options) {
      if (VALID_UCI_OPTIONS.includes(name)) {
        // console.error(`Invalid UCI option: ${name}`);
        this.send(`setoption name ${name} value ${options[name].toString()}`);
        continue;
      } else if (name === "Time") {
        this.SearchTime = options[name];
      } else if (name === "Depth") {
        this.Depth = options[name];
      } else {
        console.error(`Invalid UCI option: ${name}`);
      }
    }
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");
    return true;
  }

  async initializeGame(): Promise<void> {
    this.send("uci");
    this.send("ucinewgame");
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");
  }

  async getEval(fen?: string): Promise<string> {
    if (fen) {
      this.send(`position fen ${fen}`);
      this.send("isready");
      this.receiveUntil((line) => line === "readyok");
    }
    this.send("eval");
    return "eval completed";
  }

  async search(
    initialFen: string
    // moves?: string,
    // depth: number | null = this.Depth,
    // searchTime?: number | null
  ): Promise<string> {
    this.send(`position fen ${initialFen}`);
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");
    const searchCommand = `go ${this.Depth ? `depth ${this.Depth}` : ""} ${
      this.SearchTime ? `movetime ${this.SearchTime}` : ""
    }`;
    console.log("Search Command", searchCommand);
    this.send(searchCommand);
    const lines = await this.receiveUntil((line) =>
      line.startsWith("bestmove")
    );
    const lastLine = lines[lines.length - 1];
    const bestmove = lastLine.split(" ")[1];
    // this.getEval();
    return bestmove;
  }
}

export default EngineWrapper;
