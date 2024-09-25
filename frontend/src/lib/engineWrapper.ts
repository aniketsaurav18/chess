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

interface CurrentEval {
  depth: number;
  nodes: number;
  multiPv: number;
  millis: number;
  isMate: boolean;
  cp: number | null;
  mate: number | null;
  moves: string[];
}

class EngineWrapper {
  private engine: any;
  private queue: Queue<string>;
  private log: (message?: any, ...optionalParams: any[]) => void;
  public SearchTime: number | null = 8;
  public Depth: number | null = 20;
  public expectedPV: number = 1;
  public CurrentEval: CurrentEval[] | null = null;
  public side: string = "black";

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
    this.send("stop"); //stop the engine if it is running
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

  /* --------- This is a sample message from the engine ----------------
   "info depth 20 seldepth 30 multipv 1 score cp -23 nodes 4176440 nps 1099352 hashfull 894 time 3799 pv e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 g8f6 d4c6 b7c6 e4e5 d8e7 d1e2 f6d5 g2g3 a7a5 f1g2 d5b6 b2b3 a5a4 c1b2 e7e6 e1g1 d7d5 c2c4 f8e7 f2f4 a4b3" 
   
   Note: for every multiPV, there will be a separate info message.
  */

  parseMessage(events: string): void {
    const parts = events.trim().split(/\s+/g);
    if (parts[0] === "info") {
      let depth = 0,
        nodes,
        multiPv = 1,
        millis,
        evalType,
        isMate = false,
        povEv,
        moves: string[] = [];
      for (let i = 1; i < parts.length; i++) {
        switch (parts[i]) {
          case "depth":
            depth = parseInt(parts[++i]);
            break;
          case "nodes":
            nodes = parseInt(parts[++i]);
            break;
          case "multipv":
            multiPv = parseInt(parts[++i]);
            break;
          case "time":
            millis = parseInt(parts[++i]);
            break;
          case "score":
            isMate = parts[++i] === "mate";
            povEv = parseInt(parts[++i]);
            if (parts[i + 1] === "lowerbound" || parts[i + 1] === "upperbound")
              evalType = parts[++i];
            break;
          case "pv":
            moves = parts.slice(++i);
            i = parts.length;
            break;
        }
      }
      if (isMate && !povEv) return;
      if (this.expectedPV < multiPv) this.expectedPV = multiPv;

      if (!nodes || !millis || !isMate || !povEv) return;
      const ev = (this.side === "black" ? -1 : 1) * povEv;

      // For now, ignore most upperbound/lowerbound messages.
      // However non-primary pvs may only have an upperbound.
      if (evalType && multiPv === 1) return;
      const cp = isMate ? null : ev;
      const mate = isMate ? ev : null;

      const currentEval: CurrentEval = {
        depth,
        nodes,
        multiPv,
        millis,
        isMate,
        cp,
        mate,
        moves,
      };
      if (!this.CurrentEval) this.CurrentEval = [];
      this.CurrentEval[multiPv - 1] = currentEval;
    }
  }
}

export default EngineWrapper;
