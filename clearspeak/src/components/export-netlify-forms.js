/**
 * Automated Supabase Survey Export Script
 * Downloads `ux_survey` records and formats them into an SPSS-ready CSV.
 * 
 * Usage:
 * SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_KEY=your_service_key node src/components/export-netlify-forms.js
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OUTPUT_FILE = './ux_survey_results.csv';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

const fetchSubmissions = () => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/survey_submissions?select=*`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

const generateCSV = (submissions) => {
  // Standard psychological schema headers
  const headers = [
    'id', 'created_at', 'local_timestamp', 'participant_id', 'user_language',
    'theme', 'a11y_addons', 'inclusive_options', 'user_difficulty', 'daily_goal',
    'mentalDemand', 'physicalDemand', 'temporalDemand', 'performance', 'effort', 'frustration',
    'ueq1_obstructive_supportive', 'ueq2_complicated_easy', 'ueq3_inefficient_efficient', 
    'ueq4_confusing_clear', 'ueq5_boring_exciting', 'ueq6_notInteresting_interesting', 
    'ueq7_conventional_inventive', 'ueq8_usual_leadingEdge'
  ];

  const csvRows = submissions.map(sub => {
    return [
      sub.id,
      new Date(sub.created_at).toISOString(),
      sub.local_timestamp ? new Date(sub.local_timestamp).toISOString() : '',
      sub.participant_id || '',
      sub.user_language || '',
      sub.theme || '',
      `"${sub.a11y_addons || ''}"`,
      `"${sub.inclusive_options || ''}"`,
      sub.user_difficulty || '',
      sub.daily_goal || '',
      sub.mental_demand, sub.physical_demand, sub.temporal_demand, sub.performance, sub.effort, sub.frustration,
      sub.ueq_item_1, sub.ueq_item_2, sub.ueq_item_3, sub.ueq_item_4, sub.ueq_item_5, sub.ueq_item_6, sub.ueq_item_7, sub.ueq_item_8
    ].join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
};

(async () => {
  console.log('🔄 Fetching submissions from Supabase...');
  const submissions = await fetchSubmissions();
  const csvData = generateCSV(submissions);
  fs.writeFileSync(OUTPUT_FILE, csvData, 'utf-8');
  console.log(`✅ Success! Exported ${submissions.length} responses to ${OUTPUT_FILE}`);
})();