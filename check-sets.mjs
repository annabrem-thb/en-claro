import { wordDatabaseDE } from './src/data/vocabulary_de.js';
import { wordDatabaseEN } from './src/data/vocabulary_en.js';
import { wordDatabasePL } from './src/data/vocabulary_pl.js';
import { STUDY_SETS } from './src/data/studySets.js';

const DATABASES = { de: wordDatabaseDE, en: wordDatabaseEN, pl: wordDatabasePL };

// Item ids don't line up 1:1 across all three locales for every pillar
// today (e.g. `phonemes`/`graphemes`/`dictation` already have different
// item counts per language) — that's a pre-existing content gap unrelated
// to set assignment, so cross-locale consistency below is only checked for
// a (lang, pillar) pair whose id set actually matches its DE counterpart;
// everything else is reported as skipped rather than flagged as an error.
function idSet(pillarTasks) {
  return new Set((pillarTasks || []).map((task) => task.id));
}

function sameIds(a, b) {
  return a.size === b.size && [...a].every((id) => b.has(id));
}

function checkSets() {
  let hasErrors = false;
  const skippedPairs = [];
  const coverage = [];

  const pillars = Object.keys(DATABASES.de);

  for (const pillar of pillars) {
    for (const [lang, db] of Object.entries(DATABASES)) {
      const tasks = db[pillar] || [];
      const assigned = tasks.filter((task) => task.set !== undefined);
      coverage.push({ pillar, lang, assigned: assigned.length, total: tasks.length });

      for (const task of assigned) {
        if (!STUDY_SETS.includes(task.set)) {
          console.error(
            `❌ ${lang}/${pillar} id ${task.id}: invalid set "${task.set}" (must be ${STUDY_SETS.join(' or ')})`,
          );
          hasErrors = true;
        }
      }
    }

    const deIds = idSet(DATABASES.de[pillar]);
    for (const lang of ['en', 'pl']) {
      const langIds = idSet(DATABASES[lang][pillar]);
      if (!sameIds(deIds, langIds)) {
        skippedPairs.push(`${lang}/${pillar}`);
        continue;
      }
      const deById = new Map(DATABASES.de[pillar].map((task) => [task.id, task.set]));
      const langById = new Map(DATABASES[lang][pillar].map((task) => [task.id, task.set]));
      for (const [id, deSet] of deById) {
        const langSet = langById.get(id);
        if ((deSet ?? null) !== (langSet ?? null)) {
          console.error(
            `❌ ${pillar} id ${id}: set mismatch between de ("${deSet ?? 'unassigned'}") and ${lang} ("${langSet ?? 'unassigned'}")`,
          );
          hasErrors = true;
        }
      }
    }
  }

  const totalAssigned = coverage.reduce((sum, c) => sum + c.assigned, 0);
  const totalItems = coverage.reduce((sum, c) => sum + c.total, 0);
  console.log(`ℹ️  Set coverage: ${totalAssigned}/${totalItems} items assigned to a set.`);
  if (skippedPairs.length > 0) {
    console.log(
      `ℹ️  Skipped cross-locale consistency check for ${skippedPairs.length} locale/pillar pairs with pre-existing id mismatches: ${skippedPairs.join(', ')}`,
    );
  }

  if (!hasErrors) console.log('✅ Set assignments are consistent.');
  process.exitCode = hasErrors ? 1 : 0;
}

checkSets();
