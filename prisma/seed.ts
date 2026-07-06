import { PrismaClient } from "@prisma/client";
import {
  drugs,
  diseases,
  targets,
  evidenceRecords,
  reviewQueue,
  auditLogs,
} from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.reviewQueueItem.deleteMany();
  await prisma.evidenceRecord.deleteMany();
  await prisma.drug.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.target.deleteMany();

  for (const drug of drugs) {
    await prisma.drug.create({
      data: {
        slug: drug.slug,
        name: drug.name,
        genericName: drug.genericName,
        brandNames: JSON.stringify(drug.brandNames),
        mechanism: drug.mechanism,
        primaryIndication: drug.primaryIndication,
        approvalStatus: drug.approvalStatus,
        atcCode: drug.atcCode,
        whyThisDrug: drug.whyThisDrug,
        knownRisks: JSON.stringify(drug.knownRisks),
        targetSlugs: JSON.stringify(drug.targetSlugs),
        relatedDiseaseSlugs: JSON.stringify(drug.relatedDiseaseSlugs),
        similarDrugSlugs: JSON.stringify(drug.similarDrugSlugs),
      },
    });
  }

  for (const disease of diseases) {
    await prisma.disease.create({
      data: {
        slug: disease.slug,
        name: disease.name,
        icd10: disease.icd10,
        meshId: disease.meshId,
        description: disease.description,
        pathwayClusters: JSON.stringify(disease.pathwayClusters),
        unmetNeed: disease.unmetNeed,
        relatedDrugSlugs: JSON.stringify(disease.relatedDrugSlugs),
      },
    });
  }

  for (const target of targets) {
    await prisma.target.create({
      data: {
        slug: target.slug,
        name: target.name,
        geneSymbol: target.geneSymbol,
        uniprotId: target.uniprotId,
        description: target.description,
        pathway: target.pathway,
        druggability: target.druggability,
        relatedDrugSlugs: JSON.stringify(target.relatedDrugSlugs),
        relatedDiseaseSlugs: JSON.stringify(target.relatedDiseaseSlugs),
      },
    });
  }

  for (const evidence of evidenceRecords) {
    await prisma.evidenceRecord.create({
      data: {
        slug: evidence.slug,
        drugSlug: evidence.drugSlug,
        diseaseSlug: evidence.diseaseSlug,
        targetSlug: evidence.targetSlug,
        mechanism: evidence.mechanism,
        grade: evidence.grade,
        evidenceTypes: JSON.stringify(evidence.evidenceTypes),
        clinicalTrialIds: JSON.stringify(evidence.clinicalTrialIds),
        pubmedIds: JSON.stringify(evidence.pubmedIds),
        phase: evidence.phase,
        outcomes: evidence.outcomes,
        confidenceScore: evidence.confidenceScore,
        evidenceLevel: evidence.evidenceLevel,
        aiSummary: evidence.aiSummary,
        aiGeneratedAt: new Date(evidence.aiGeneratedAt),
        lastVerified: new Date(evidence.lastVerified),
        lastUpdated: new Date(evidence.lastUpdated),
        reviewStage: evidence.reviewStage,
        citations: JSON.stringify(evidence.citations),
        sourcePapers: JSON.stringify(evidence.sourcePapers),
      },
    });
  }

  for (const item of reviewQueue) {
    await prisma.reviewQueueItem.create({
      data: {
        evidenceSlug: item.evidenceSlug,
        stage: item.stage,
        assignedTo: item.assignedTo,
        notes: item.notes,
        updatedAt: new Date(item.updatedAt),
      },
    });
  }

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: {
        id: log.id,
        timestamp: new Date(log.timestamp),
        action: log.action,
        actor: log.actor,
        resource: log.resource,
        details: log.details,
      },
    });
  }

  console.log("Seed complete:", {
    drugs: drugs.length,
    diseases: diseases.length,
    targets: targets.length,
    evidence: evidenceRecords.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
