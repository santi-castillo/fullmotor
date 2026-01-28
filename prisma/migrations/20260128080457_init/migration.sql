-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "version" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "priceUYU" REAL,
    "priceUSD" REAL,
    "engineCc" INTEGER,
    "engineHp" INTEGER,
    "engineTorque" INTEGER,
    "fuelType" TEXT,
    "transmission" TEXT,
    "gears" INTEGER,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "wheelbase" INTEGER,
    "trunkCapacity" INTEGER,
    "fuelTank" INTEGER,
    "weight" INTEGER,
    "safetyFeatures" TEXT,
    "equipment" TEXT,
    "images" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");
