import { GameOverPayload, InitGamePayload, MovePayload } from "./types/types";
import pool from "./db";
import cuid from "cuid";
import { QueryResult } from "pg";

type QueryResultDB = {
  result: string;
  queryResult?: QueryResult | undefined;
  errorMessage?: string;
};

/* Sample message
{
    topic: 'game-update',
    partition: 0,
    key: 'moves-update',
    value: '{"gameId":"fd142b0d-eb2e-4678-8313-428aceb56a7a","payload":{"t":"game_over","d":{"type":"black_timeout","msg":"White wins by timeout.","winner":"white","clock":{"w":486871,"b":553516}}}}'
}
*/

/*
model move {
  id        String   @id @default(cuid())
  game_id   String
  game      game     @relation("GameMoves", fields: [game_id], references: [id])
  move      String
  moveNum   Int
  fenAfter  String?
  createdAt DateTime @default(now())

  @@index([game_id, moveNum])
}
*/

const PGErrorTable = {
  errors: [
    {
      code: "ECONNREFUSED",
      message: "Connection refused",
    },
    {
      code: "ETIMEDOUT",
      message: "Connection timed out",
    },
    {
      code: "42601",
      message: "Syntax error",
    },
    {
      code: "42P01",
      message: "Undefined table",
    },
    {
      code: "42703",
      message: "Undefined column",
    },
    {
      code: "23505",
      message: "Unique constraint violation",
    },
    {
      code: "23503",
      message: "Foreign key violation",
    },
    {
      code: "23502",
      message: "NOT NULL constraint violation",
    },
    {
      code: "22P02",
      message: "Invalid text representation",
    },
    {
      code: "22007",
      message: "Invalid datetime format",
    },
    {
      code: "40001",
      message: "Serialization failure",
    },
    {
      code: "40P01",
      message: "Deadlock detected",
    },
    {
      code: "42501",
      message: "Insufficient privileges",
    },
    {
      code: "53200",
      message: "Out of memory",
    },
  ],
};

const queryDB = async (query: string): Promise<QueryResultDB> => {
  try {
    const res = await pool.query(query);
    return { result: "success", queryResult: res };
  } catch (e: any) {
    if (e.code === "23505") {
      return {
        result: "error",
        errorMessage: "duplicate move",
      };
    }
    for (const msg of PGErrorTable.errors) {
      if (e.code === msg.code) {
        return { result: "error", errorMessage: msg.message };
      }
    }
    return {
      result: "error",
      errorMessage: `Unknown error: ${e.message}`,
    };
  }
};

const insertMove = async (id: string, data: MovePayload) => {
  const moveId = cuid();
  const column = ["id", "game_id", "move", "movenum", '"fenAfter"']; //TODO: convert fenAfter to fen_after for consistency.
  const values = [moveId, id, data.d.san, 1, data.d.f];
  const query = `INSERT INTO move (${column.join(", ")}) VALUES (${values
    .map((_, index) => {
      `$${index + 1}`;
    })
    .join(", ")})`;
  const res = await queryDB(query);
  if (res.result === "error") {
    console.error(res.errorMessage, query);
  }
};

// const insertResult = async (id, data) => {
//   console.log(data);
// };

// const insertInitGamePayload = async (id, data) => {
//   console.log(data);
// };

export const Processor = async (message: string) => {
  const data = JSON.parse(message);
  const payload = data.payload as
    | MovePayload
    | GameOverPayload
    | InitGamePayload;
  const id = data.gameId;
  switch (data.t) {
    case "move": {
      await insertMove(id, data.d);
    }

    // case "game_over": {
    //   await insertResult(id, data.d);
    // }

    // case "init_game": {
    //   await insertInitGamePayload(id, data.d);
    // }
  }
};
