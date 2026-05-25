const { createClient } = require('@supabase/supabase-js');

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

    const dbData = {
      local_timestamp: payload.localTimestamp || null,
      participant_id: payload.participantId || null,
      user_language: payload.userLanguage || null,
      theme: payload.theme || null,
      a11y_addons: payload.a11yAddons || null,
      inclusive_options: payload.inclusiveOptions || null,
      user_difficulty: payload.userDifficulty || null,
      daily_goal: payload.dailyGoal || null,
      mental_demand: payload.mentalDemand,
      physical_demand: payload.physicalDemand,
      temporal_demand: payload.temporalDemand,
      performance: payload.performance,
      effort: payload.effort,
      frustration: payload.frustration,
      ueq_item_1: payload.ueq1,
      ueq_item_2: payload.ueq2,
      ueq_item_3: payload.ueq3,
      ueq_item_4: payload.ueq4,
      ueq_item_5: payload.ueq5,
      ueq_item_6: payload.ueq6,
      ueq_item_7: payload.ueq7,
      ueq_item_8: payload.ueq8
    };

    const { data, error } = await supabase
      .from('survey_submissions') // Upewnij się, że tak samo nazywa się tabela w SQL Editor
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