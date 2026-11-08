/**
 * @file validatePacks.ts
 * @description CLI validator script that checks all registered DomainPacks against the 12 Oracle Contract rules.
 */

import { DOMAIN_PACKS } from '../src/packs';
import { validateDomainPack } from '../src/core/validator';

let hasAnyErrors = false;

console.log('======================================================================');
console.log(' ORACLE CONTRACT VALIDATOR — Universal Timeline Framework (12 Rules) ');
console.log('======================================================================\n');

for (const pack of DOMAIN_PACKS) {
  const report = validateDomainPack(pack);

  console.log(`▶ Pack: [${report.packId}] ${report.packTitle}`);
  console.log(
    `  Stats: Axes=${report.stats.axesCount}, Entities=${report.stats.entitiesCount}, Segments=${report.stats.segmentsCount}, Transitions=${report.stats.transitionsCount}, Events=${report.stats.eventsCount}, Evidences=${report.stats.evidencesCount}`
  );
  console.log(
    `  Contract Rules Passed: ${report.passedRulesCount}/${report.totalRulesChecked} | Errors: ${report.errorCount} | Warnings: ${report.warningCount}`
  );

  if (report.issues.length > 0) {
    for (const issue of report.issues) {
      console.log(`    [${issue.severity}] (${issue.ruleCode}) ${issue.targetId}: ${issue.message}`);
    }
  } else {
    console.log('    [PASS] 100% Compliant with all 12 Oracle Schema & Causal Contracts.');
  }
  console.log('');

  if (!report.isValid) {
    hasAnyErrors = true;
  }
}

if (hasAnyErrors) {
  throw new Error('Validation FAILED. Fix the contract violations above.');
} else {
  console.log('✅ All registered DomainPacks passed 12/12 Oracle Contract checks with ZERO errors!');
}
