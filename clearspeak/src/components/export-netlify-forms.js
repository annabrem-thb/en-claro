/**
 * Automated Supabase Survey Export Script
 * Downloads `ab_study_submissions` records and formats them into an SPSS-ready CSV.
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
    const url = new URL(`${SUPABASE_URL}/rest/v1/ab_study_submissions?select=*`);
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
    'id', 'created_at', 'app_version', 'participant_id', 'user_language',
    'mentalDemand', 'physicalDemand', 'temporalDemand', 'performance', 'effort', 'frustration',
    'sus_q01', 'sus_q02', 'sus_q03', 'sus_q04', 'sus_q05', 
    'sus_q06', 'sus_q07', 'sus_q08', 'sus_q09', 'sus_q10'
  ];

  const csvRows = submissions.map(sub => {
    return [
      sub.id,
      new Date(sub.created_at).toISOString(),
      sub.app_version || '',
      sub.participant_id || '',
      sub.user_language || '',
      sub.mental_demand, sub.physical_demand, sub.temporal_demand, sub.performance, sub.effort, sub.frustration,
      sub.sus_q01, sub.sus_q02, sub.sus_q03, sub.sus_q04, sub.sus_q05,
      sub.sus_q06, sub.sus_q07, sub.sus_q08, sub.sus_q09, sub.sus_q10
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