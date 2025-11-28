import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
// 환경 변수에서 URL과 키를 가져옴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 클라이언트 컴포넌트용 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
