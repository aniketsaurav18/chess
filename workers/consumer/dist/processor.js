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
// Error table for known PostgreSQL error codes
const PGErrorTable = {
    errors: [
        { code: "ECONNREFUSED", message: "Connection refused" },
        { code: "ETIMEDOUT", message: "Connection timed out" },
        { code: "42601", message: "Syntax error" },
        { code: "42P01", message: "Undefined table" },
        { code: "42703", message: "Undefined column" },
        { code: "23505", message: "Unique constraint violation" },
        { code: "23503", message: "Foreign key violation" },
        { code: "23502", message: "NOT NULL constraint violation" },
        { code: "22P02", message: "Invalid text representation" },
        { code: "22007", message: "Invalid datetime format" },
        { code: "40001", message: "Serialization failure" },
        { code: "40P01", message: "Deadlock detected" },
        { code: "42501", message: "Insufficient privileges" },
        { code: "53200", message: "Out of memory" },
    ],
};
const queryDB = (query, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield db_1.default.query(query, value);
        return { result: "success", queryResult: res };
    }
    catch (e) {
        console.error("Database error:", e.message);
        if (e.code === "23505") {
            return {
                result: "error",
                errorMessage: "Duplicate move",
                details: e.detail,
            };
        }
        for (const msg of PGErrorTable.errors) {
            if (e.code === msg.code) {
                return {
                    result: "error",
                    errorMessage: msg.message,
                    details: e.detail,
                };
            }
        }
        return {
            result: "error",
            errorMessage: `Unknown database error: ${e.message}`,
            details: e.detail,
        };
    }
});
// Insert move into the database
const insertMove = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const moveId = (0, cuid_1.default)();
    const column = ["id", "game_id", "move", "move_num", "fen_after"];
    const values = [moveId, id, data.d.san, 1, data.d.f];
    const query = `INSERT INTO move (${column.join(", ")}) VALUES (${values
        .map((_, index) => `$${index + 1}`)
        .join(", ")})`;
    const res = yield queryDB(query, values);
    if (res.result === "error") {
        console.error("Error inserting move:", res.errorMessage);
        if (res.details) {
            console.error("Details:", res.details);
        }
    }
    else {
        console.log("Move inserted successfully");
    }
});
// Insert game result into the database
const insertResult = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const winner = payload.d.winner;
    const event = payload.d.type;
    const column = ["status", "result", "event", "end_at"];
    const values = ["FINISHED", winner, event, new Date(), id];
    const query = `UPDATE game SET ${column.map((col, index) => `${col}=$${index + 1}`)} WHERE id=$${values.length}`;
    const res = yield queryDB(query, values);
    if (res.result === "error") {
        console.error("Error updating game result:", res.errorMessage);
        if (res.details) {
            console.error("Details:", res.details);
        }
    }
    else {
        console.log("Game result updated successfully");
    }
});
const Processor = (message) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    try {
        data = JSON.parse(message);
    }
    catch (e) {
        console.error("Invalid JSON message:", message, e);
        return;
    }
    if (!data.payload || !data.payload.d) {
        console.error("Invalid message format: Missing 'payload' or 'd' field", data);
        return;
    }
    const payload = data.payload;
    const id = data.gameId;
    try {
        switch (payload.t) {
            case "move":
                yield insertMove(id, payload);
                break;
            case "game_over":
                yield insertResult(id, payload);
                break;
            default:
                console.error("Unknown message type:", payload.t);
        }
    }
    catch (e) {
        console.error("Error processing message:", message, e);
    }
});
exports.Processor = Processor;
