import { supabase } from './supabaseClient';

/**
 * Kullanıcının beyaz listede olup olmadığını kontrol eder.
 * @param {string} email 
 * @returns {Promise<{allowed: boolean, member: any, error: any}>}
 */
export const checkWhitelist = async (email) => {
  if (!email) return { allowed: false, error: 'E-posta gerekli' };
  
  const targetEmail = email.toLowerCase().trim();
  
  const { data: member, error } = await supabase
    .from('test_allowed_members')
    .select('*')
    .eq('email', targetEmail)
    .single();

  if (error || !member) {
    return { allowed: false, member: null, error: error || 'Kayıt bulunamadı' };
  }

  return { allowed: true, member, error: null };
};

/**
 * Kullanıcı nesnesinden memberId (insta_username veya email prefix) türetir.
 * @param {any} user 
 * @param {any} memberData (Opsiyonel)
 * @returns {string}
 */
export const deriveMemberId = (user, memberData = null) => {
  if (memberData?.insta_username) return memberData.insta_username;
  if (user?.email) return user.email.split('@')[0];
  return 'unknown';
};
