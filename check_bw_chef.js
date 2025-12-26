const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ekxyxvpdwurgrvimagcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreHl4dnBkd3VyZ3J2aW1hZ2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTg1ODksImV4cCI6MjA3NjczNDU4OX0.Vv7SKECOigVMiHBiFNwDna-wYq7pxdTP4FgJVupuFP8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'koreanow' }
});

async function checkData() {
  console.log('🔍 Checking black_white_chef table...\n');
  
  const { data, error } = await supabase
    .from('black_white_chef')
    .select('*')
    .limit(10);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('✅ Found', data.length, 'rows\n');
  console.log('📊 Sample data:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.length > 0) {
    console.log('\n🔑 Column names:');
    console.log(Object.keys(data[0]));
  }
}

checkData();
