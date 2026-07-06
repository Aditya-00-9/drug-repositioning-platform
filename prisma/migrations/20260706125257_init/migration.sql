-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "brandNames" TEXT NOT NULL,
    "mechanism" TEXT NOT NULL,
    "primaryIndication" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL,
    "atcCode" TEXT,
    "whyThisDrug" TEXT NOT NULL,
    "knownRisks" TEXT NOT NULL,
    "targetSlugs" TEXT NOT NULL,
    "relatedDiseaseSlugs" TEXT NOT NULL,
    "similarDrugSlugs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icd10" TEXT,
    "meshId" TEXT,
    "description" TEXT NOT NULL,
    "pathwayClusters" TEXT NOT NULL,
    "unmetNeed" TEXT NOT NULL,
    "relatedDrugSlugs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "geneSymbol" TEXT NOT NULL,
    "uniprotId" TEXT,
    "description" TEXT NOT NULL,
    "pathway" TEXT NOT NULL,
    "druggability" TEXT NOT NULL,
    "relatedDrugSlugs" TEXT NOT NULL,
    "relatedDiseaseSlugs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EvidenceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "drugSlug" TEXT NOT NULL,
    "diseaseSlug" TEXT NOT NULL,
    "targetSlug" TEXT NOT NULL,
    "mechanism" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "evidenceTypes" TEXT NOT NULL,
    "clinicalTrialIds" TEXT NOT NULL,
    "pubmedIds" TEXT NOT NULL,
    "phase" TEXT,
    "outcomes" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "evidenceLevel" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "aiGeneratedAt" DATETIME NOT NULL,
    "lastVerified" DATETIME NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "reviewStage" TEXT NOT NULL,
    "citations" TEXT NOT NULL,
    "sourcePapers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "details" TEXT
);

-- CreateTable
CREATE TABLE "ReviewQueueItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evidenceSlug" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "assignedTo" TEXT,
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Drug_slug_key" ON "Drug"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_slug_key" ON "Disease"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Target_slug_key" ON "Target"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceRecord_slug_key" ON "EvidenceRecord"("slug");
