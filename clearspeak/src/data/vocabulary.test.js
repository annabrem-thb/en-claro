import { describe, it, expect } from 'vitest';
import { wordDatabaseEN } from './vocabulary_en.js';
import { wordDatabasePL } from './vocabulary_pl.js';
import { wordDatabaseDE } from './vocabulary_de.js';

const databases = [
  { lang: 'EN', db: wordDatabaseEN },
  { lang: 'PL', db: wordDatabasePL },
  { lang: 'DE', db: wordDatabaseDE }
];

describe('Vocabulary Schema Validation', () => {
  databases.forEach(({ lang, db }) => {
    describe(`Dictionary: ${lang}`, () => {
      it('should have unique IDs across all categories', () => {
        const allIds = Object.values(db).flat().map(item => item.id);
        const idCounts = allIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});
        const duplicates = Object.entries(idCounts)
          .filter(([, count]) => count > 1)
          .map(([id]) => id);

        expect(duplicates.length, `Dictionary ${lang} has duplicate IDs: [${duplicates.join(', ')}]`).toBe(0);
      });

      Object.entries(db).forEach(([category, items]) => {
        it(`should not use deprecated 'questions' or 'hints' keys in the ${category} category`, () => {
          items.forEach((item) => {
            // 1. Check for legacy/plural misnomers
            expect(item, `Item ID ${item.id} in ${lang} uses deprecated 'questions'`).not.toHaveProperty('questions');
            expect(item, `Item ID ${item.id} in ${lang} uses deprecated 'hints'`).not.toHaveProperty('hints');

            // 2. Validate new singular schema
            // If they exist, they must be i18n objects (e.g., { en: '...', pl: '...' })
            if (item.question) {
              expect(
                typeof item.question, 
                `Item ID ${item.id} 'question' should be an object mapping languages`
              ).toBe('object');
            }
            
            if (item.hint) {
              expect(
                typeof item.hint, 
                `Item ID ${item.id} 'hint' should be an object mapping languages`
              ).toBe('object');
            }
          });
        });

        it(`should not have duplicate option texts in the ${category} category`, () => {
          items.forEach((item) => {
            if (item.options && Array.isArray(item.options)) {
              const optionTexts = item.options.map((opt) => opt.text);
              const uniqueOptionTexts = new Set(optionTexts);
              expect(
                optionTexts.length,
                `Item ID ${item.id} in ${lang} has duplicate options: [${optionTexts.join(', ')}]`
              ).toBe(uniqueOptionTexts.size);
            }
          });
        });

        it(`should ensure all tags are lowercase and contain no spaces in the ${category} category`, () => {
          items.forEach((item) => {
            if (item.tags && Array.isArray(item.tags)) {
              item.tags.forEach((tag) => {
                expect(
                  tag === tag.toLowerCase() && !tag.includes(' '),
                  `Item ID ${item.id} in ${lang} has an invalid tag: '${tag}'. Tags must be lowercase and contain no spaces.`
                ).toBe(true);
              });
            }
          });
        });

        it(`should not have distractors that overlap with the correct answer in the ${category} category`, () => {
          items.forEach((item) => {
            if (item.distractors && Array.isArray(item.distractors)) {
              if (typeof item.word === 'string') {
                const wordLetters = item.word.toUpperCase().split('');
                item.distractors.forEach((distractor) => {
                  expect(
                    wordLetters.includes(distractor.toUpperCase()),
                    `Item ID ${item.id} in ${lang} has distractor '${distractor}' which is part of the word '${item.word}'`
                  ).toBe(false);
                });
              } else if (Array.isArray(item.correct)) {
                item.distractors.forEach((distractor) => {
                  expect(
                    item.correct.includes(distractor),
                    `Item ID ${item.id} in ${lang} has distractor '${distractor}' which is part of the correct sequence`
                  ).toBe(false);
                });
              }
            }
          });
        });

        it(`should have valid single emoji icons or images in the ${category} category`, () => {
          const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D\uFE0F]+$/u;

          items.forEach((item) => {
            if (item.icon) {
              expect(emojiRegex.test(item.icon), `Item ID ${item.id} in ${lang} has an invalid icon: '${item.icon}'`).toBe(true);
            }
            if (item.image) {
              expect(emojiRegex.test(item.image), `Item ID ${item.id} in ${lang} has an invalid image: '${item.image}'`).toBe(true);
            }

            if (item.options && Array.isArray(item.options)) {
              item.options.forEach((opt) => {
                if (opt.icon) {
                  expect(emojiRegex.test(opt.icon), `Item ID ${item.id} in ${lang} has an invalid option icon: '${opt.icon}'`).toBe(true);
                }
              });
            }

            if (item.buckets && Array.isArray(item.buckets)) {
              item.buckets.forEach((bucket) => {
                if (bucket.icon) {
                  expect(emojiRegex.test(bucket.icon), `Item ID ${item.id} in ${lang} has an invalid bucket icon: '${bucket.icon}'`).toBe(true);
                }
              });
            }
          });
        });

        if (category === 'syllables') {
          it(`should ensure every word in the ${category} category arrays joins perfectly back to its original word`, () => {
            items.forEach((item) => {
              if (item.word && item.segments && Array.isArray(item.segments)) {
                expect(
                  item.segments.join(''),
                  `Item ID ${item.id} in ${lang} has segments [${item.segments.join(', ')}] that do not match the word '${item.word}'`
                ).toBe(item.word);
              }
            });
          });
        }

        if (category === 'phonemes') {
          it(`should ensure all 'phonetic' strings are wrapped in slashes (/) in the ${category} category`, () => {
            items.forEach((item) => {
              if (item.phonetic && typeof item.phonetic === 'string') {
                expect(
                  item.phonetic.startsWith('/') && item.phonetic.endsWith('/'),
                  `Item ID ${item.id} in ${lang} has malformed phonetic string: '${item.phonetic}'`
                ).toBe(true);
              }
            });
          });
        }

        if (category === 'context') {
          it(`should ensure every item contains both sentence_part1 and sentence_part2 in the ${category} category`, () => {
            items.forEach((item) => {
              expect(item, `Item ID ${item.id} in ${lang} is missing 'sentence_part1'`).toHaveProperty(
                'sentence_part1'
              );
              expect(typeof item.sentence_part1, `Item ID ${item.id} in ${lang} 'sentence_part1' should be a string`).toBe('string');

              expect(item, `Item ID ${item.id} in ${lang} is missing 'sentence_part2'`).toHaveProperty(
                'sentence_part2'
              );
              expect(typeof item.sentence_part2, `Item ID ${item.id} in ${lang} 'sentence_part2' should be a string`).toBe('string');
            });
          });

          it(`should ensure exactly one correct option exists in the ${category} category`, () => {
            items.forEach((item) => {
              if (item.options && Array.isArray(item.options)) {
                const correctOptions = item.options.filter((opt) => opt.isCorrect);
                expect(
                  correctOptions.length,
                  `Item ID ${item.id} in ${lang} does not have exactly 1 correct option. Found ${correctOptions.length}.`
                ).toBe(1);
              }
            });
          });
        }
      });
    });
  });
});