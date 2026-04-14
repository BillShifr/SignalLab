-- CreateTable
CREATE TABLE "scenario_runs" (
    "id" SERIAL NOT NULL,
    "scenario" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scenario_runs_pkey" PRIMARY KEY ("id")
);
