import { useState, useEffect } from 'react';

/**
 * Belirtilen URL'den JSON feed çeker ve #etiketlere göre ayırır.
 * @param {string} url 
 * @returns {{ data: any, loading: boolean, error: any }}
 */
export default function useFeed(url) {
  const [data, setData] = useState({ posts: [], hook: null, reviews: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        const posts = json.posts || [];
        
        // Remaxocial özel etiketleme mantığı
        const hook = posts.find(x => x.caption?.toLowerCase().includes('#wahook'));
        const reviews = posts.filter(x => x.caption?.toLowerCase().includes('#wayorum'));

        setData({ 
          posts, 
          hook, 
          // Çift marquee etkisi için yorumları çoğaltıyoruz (opsiyonel)
          reviews: [...reviews, ...reviews] 
        });
      })
      .catch(err => {
        console.error('Feed error:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
