import { GameOverPayload, InitGamePayload, MovePayload } from "./types/types";
import pool from "./db";
import cuid from "cuid";
import { QueryResult } from "pg";

type QueryResultDB = {
  result: string;
  queryResult?: QueryResult | undefined;
  errorMessage?: string;
  details?: string;
};

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

const queryDB = async (query: string, value: any[]): Promise<QueryResultDB> => {
  try {
    const res = await pool.query(query, value);
    return { result: "success", queryResult: res };
  } catch (e: any) {
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
};

// Insert move into the database
const insertMove = async (id: string, data: MovePayload) => {
  const moveId = cuid();
  const column = ["id", "game_id", "move", "move_num", "fen_after"];
  const values = [moveId, id, data.d.san, data.d.ply, data.d.f];
  const query = `INSERT INTO move (${column.join(", ")}) VALUES (${values
    .map((_, index) => `$${index + 1}`)
    .join(", ")})`;
  const res = await queryDB(query, values);
  if (res.result === "error") {
    console.error("Error inserting move:", res.errorMessage);
    if (res.details) {
      console.error("Details:", res.details);
    }
  } else {
    console.log("Move inserted successfully");
  }
};

// Insert game result into the database
const insertResult = async (id: string, payload: GameOverPayload) => {
  const winner = payload.d.winner;
  const event = payload.d.type;
  const column = ["status", "result", "event", "end_at"];
  const values = ["FINISHED", winner, event, new Date(), id];
  const query = `UPDATE game SET ${column.map(
    (col, index) => `${col}=$${index + 1}`
  )} WHERE id=$${values.length}`;
  const res = await queryDB(query, values);
  if (res.result === "error") {
    console.error("Error updating game result:", res.errorMessage);
    if (res.details) {
      console.error("Details:", res.details);
    }
  } else {
    console.log("Game result updated successfully");
  }
};

const insertInitGame = async (id: string, payload: InitGamePayload) => {
  const column = [
    "id",
    "white_player_id",
    "black_player_id",
    "status",
    "start_time",
    "time_control",
    "current_fen",
  ];
  const values = [
    id,
    payload.d.whitePlayerId,
    payload.d.blackPlayerId,
    "ACTIVE",
    payload.d.startTime,
    payload.d.timeControl,
    payload.d.currentFen,
  ];
  const query = `INSERT INTO game (${column.join(", ")}) VALUES (${values
    .map((_, index) => `$${index + 1}`)
    .join(", ")})`;
  const res = await queryDB(query, values);
  if (res.result === "error") {
    console.error("Error inserting init game:", res.errorMessage);
    if (res.details) {
      console.error("Details:", res.details);
    }
  } else {
    console.log("Init game inserted successfully");
  }
};

export const Processor = async (message: string) => {
  let data;
  try {
    data = JSON.parse(message);
  } catch (e) {
    console.error("Invalid JSON message:", message, e);
    return;
  }

  if (!data.payload || !data.payload.d) {
    console.error(
      "Invalid message format: Missing 'payload' or 'd' field",
      data
    );
    return;
  }

  const payload = data.payload as
    | MovePayload
    | GameOverPayload
    | InitGamePayload;
  const id = data.gameId;

  try {
    switch (payload.t) {
      case "init_game":
        await insertInitGame(id, payload as InitGamePayload);
        break;
      case "move":
        await insertMove(id, payload as MovePayload);
        break;
      case "game_over":
        await insertResult(id, payload as GameOverPayload);
        break;
      default:
        console.error("Unknown message type:", payload.t);
    }
  } catch (e) {
    console.error("Error processing message:", message, e);
  }
};
