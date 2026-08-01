const { createClient } = require('@supabase/supabase-js');

// Dictionaries mapping app values to plain English (for data analysis)
const themeMap = {
  'Natur': 'Nature',
  'Musik': 'Music',
  'Kunst': 'Art',
  'Space': 'Space',
  'Ocean': 'Ocean'
};

const a11yMap = {
  'LRS': 'Friendly font',
  'Kontrast': 'High contrast',
  'Motorik': 'Comfortable buttons',
  'Niedowidzenie': 'Larger text',
  'Daltonizm': 'Safe colors',
  'Redukcja': 'Calm screen',
  'Linijka': 'Focus ruler',
  'Spacing': 'Larger spacing',
  'Desaturacja': 'Soft colors'
};

const langMap = {
  'pl': 'Polish',
  'de': 'German',
  'en': 'English'
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables in Netlify configuration.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = JSON.parse(event.body);

    // Standardization and translation of parameters to English
    const rawVersion = payload.appVersion || (payload.isGamified ? 'gamified' : 'basic');
    const appVersionEn = (rawVersion === 'vollversion' || rawVersion === 'gamified') ? 'gamified' : 'basic';
    
    const translatedTheme = themeMap[payload.theme] || payload.theme;
    const translatedLang = langMap[payload.userLanguage] || payload.userLanguage;
    
    let translatedAddons = payload.a11yAddons;
    if (Array.isArray(payload.a11yAddons)) {
      translatedAddons = payload.a11yAddons.map(addon => a11yMap[addon] || addon);
    }

    const dbData = {
      app_version: appVersionEn,
      
      local_timestamp: payload.localTimestamp || null,
      participant_id: payload.participantId || null,
      user_language: translatedLang || null,
      theme: translatedTheme || null,
      
      a11y_addons: translatedAddons ? JSON.stringify(translatedAddons) : null,
      inclusive_options: payload.inclusiveOptions ? JSON.stringify(payload.inclusiveOptions) : null,
      
      user_difficulty: payload.userDifficulty,
      daily_goal: payload.dailyGoal,
      
      mental_demand: payload.mental,
      physical_demand: payload.physical,
      temporal_demand: payload.temporal,
      performance: payload.performance,
      effort: payload.effort,
      frustration: payload.frustration,
      
      // SUS Survey (mapping for different frontend naming conventions)
      sus_q01: payload.sus_q01,
      sus_q02: payload.sus_q02,
      sus_q03: payload.sus_q03,
      sus_q04: payload.sus_q04,
      sus_q05: payload.sus_q05,
      sus_q06: payload.sus_q06,
      sus_q07: payload.sus_q07,
      sus_q08: payload.sus_q08,
      sus_q09: payload.sus_q09,
      sus_q10: payload.sus_q10
    };

    const { data, error } = await supabase
      .from('ab_study_submissions')
      .insert([dbData]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Survey results saved successfully!' }),
    };

  } catch (error) {
    console.error('Database insertion error:', error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};