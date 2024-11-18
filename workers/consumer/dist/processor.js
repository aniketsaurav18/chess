"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
const db_1 = __importDefault(require("./db"));
const cuid_1 = __importDefault(require("cuid"));
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
const queryDB = (query, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield db_1.default.query(query, value);
        console.log("database response");
        console.log(res);
        return { result: "success", queryResult: res };
    }
    catch (e) {
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
});
const insertMove = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const moveId = (0, cuid_1.default)();
    const column = ["id", "game_id", "move", "move_num", "fen_after"]; //TODO: convert fenAfter to fen_after for consistency.
    const values = [moveId, id, data.d.san, 1, data.d.f];
    const query = `INSERT INTO move (${column.join(", ")}) VALUES (${values
        .map((_, index) => `$${index + 1}`)
        .join(", ")})`;
    const res = yield queryDB(query, values);
    if (res.result === "error") {
        console.error(res.errorMessage, query);
    }
    else if (res.result === "success") {
        console.log("query executed successfully");
    }
});
// const insertResult = async (id, data) => {
//   console.log(data);
// };
// const insertInitGamePayload = async (id, data) => {
//   console.log(data);
// };
const Processor = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(message);
    const payload = data.payload;
    const id = data.gameId;
    switch (payload.t) {
        case "move": {
            yield insertMove(id, payload);
        }
        // case "game_over": {
        //   await insertResult(id, data.d);
        // }
        // case "init_game": {
        //   await insertInitGamePayload(id, data.d);
        // }
    }
});
exports.Processor = Processor;
