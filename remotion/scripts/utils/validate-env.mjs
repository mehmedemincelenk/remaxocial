import dotenv from 'dotenv';
import fs from 'fs';

export function validateEnv() {
  dotenv.config();
  
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'INSTA_USER_ID',
    'INSTA_ACCESS_TOKEN'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables in .env:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.log('\nHint: Check .env.example for required keys.');
    return false;
  }

  console.log('✅ Environment variables validated.');
  return true;
}
