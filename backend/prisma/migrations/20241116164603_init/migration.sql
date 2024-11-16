-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE', 'BLACK', 'DRAW', 'WHITE_TIMEOUT', 'BLACK_TIMEOUT', 'WHITE_ABANDONED', 'BLACK_ABANDONED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "white_player_id" TEXT,
    "black_player_id" TEXT,
    "status" "GameStatus" NOT NULL,
    "result" "GameResult",
    "time_control" INTEGER NOT NULL DEFAULT 10,
    "pgn" TEXT,
    "current_fen" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3),
    "opening" TEXT,
    "event" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "move" TEXT NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "fenAfter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_rating_idx" ON "user"("rating");

-- CreateIndex
CREATE INDEX "game_id_result_idx" ON "game"("id", "result");

-- CreateIndex
CREATE INDEX "move_game_id_moveNum_idx" ON "move"("game_id", "moveNum");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_white_player_id_fkey" FOREIGN KEY ("white_player_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_black_player_id_fkey" FOREIGN KEY ("black_player_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
