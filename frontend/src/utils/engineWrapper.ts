import Queue from "./messageQueue";
class EngineWrapper {
  private engine: any;
  private queue: Queue<string>;
  private log: (message?: any, ...optionalParams: any[]) => void;

  constructor(
    engine: any,
    log: (message?: any, ...optionalParams: any[]) => void = console.log
  ) {
    this.engine = engine;
    this.queue = new Queue<string>();
    this.engine.addEventListener("message", (event: any) => {
      //   console.log(event.data);
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

  async initialize(options: Record<string, string> = {}): Promise<void> {
    this.send("uci");
    await this.receiveUntil((line) => line === "uciok");
    for (const name in options) {
      this.send(`setoption name ${name} value ${options[name]}`);
    }
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");
  }

  async initializeGame(): Promise<void> {
    this.send("uci");
    this.send("ucinewgame");
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");
  }

  async search(
    initialFen: string,
    // moves?: string,
    depth: number = 20
  ): Promise<string> {
    this.send(`position fen ${initialFen}`);
    this.send("isready");
    await this.receiveUntil((line) => line === "readyok");

    this.send(`go depth ${depth}`);
    const lines = await this.receiveUntil((line) =>
      line.startsWith("bestmove")
    );
    const lastLine = lines[lines.length - 1];
    const bestmove = lastLine.split(" ")[1];
    return bestmove;
  }
}

export default EngineWrapper;
