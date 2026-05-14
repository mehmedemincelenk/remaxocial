import json
import os
import yt_dlp
from concurrent.futures import ThreadPoolExecutor

# --- CONFIG ---
HASHTAG = "emlak"

def get_video_data(entry):
    """Tek bir video için detaylı veri çeker (Like/Comment için gereklidir)"""
    if not entry: return None
    return {
        "platform": "youtube",
        "id": entry.get('id'),
        "embed_url": f"https://www.youtube.com/embed/{entry.get('id')}",
        "title": entry.get('title', 'YouTube Short'),
        "likes": entry.get('like_count', 0),
        "comments": entry.get('comment_count', 0)
    }

def get_youtube_shorts(tag, amount=1000):
    print(f"--- YT: #{tag} Shorts Çekiliyor ({amount} adet) ---")
    print("Hızlı Mod Aktif: Beğeni ve Yorum odaklı tarama başlatıldı...")
    
    # Flat extract ile önce ID'leri hızlıca alıyoruz
    ydl_opts_flat = {
        'quiet': True,
        'extract_flat': True,
    }
    
    search_query = f"ytsearch{amount}:#{tag} #shorts"
    shorts = []
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts_flat) as ydl:
            print("Video listesi alınıyor...")
            info = ydl.extract_info(search_query, download=False)
            entries = info.get('entries', [])
            total = len(entries)
            print(f"Toplam {total} video bulundu. Detaylar (Beğeni/Yorum) çekiliyor...")

            # Detayları çekmek için 'extract_flat: False' ile tekrar ama daha kontrollü
            # Not: yt-dlp search'te detayları tek tek çekmek en sağlıklısıdır.
            ydl_opts_deep = {
                'quiet': True,
                'extract_flat': False,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts_deep) as ydl_deep:
                for i, entry in enumerate(entries):
                    # Her 20 videoda bir ilerleme göster ve KAYDET
                    if (i + 1) % 20 == 0 or i + 1 == total:
                        print(f"İlerleme: {i + 1}/{total} video tamamlandı... Kaydediliyor...")
                        with open("data.json", "w", encoding="utf-8") as f:
                            json.dump(shorts, f, ensure_ascii=False, indent=4)

                    try:
                        # Video detayına git (Like/Comment için)
                        video_info = ydl_deep.extract_info(entry['url'], download=False)
                        shorts.append({
                            "platform": "youtube",
                            "id": video_info.get('id'),
                            "embed_url": f"https://www.youtube.com/embed/{video_info.get('id')}",
                            "title": video_info.get('title', 'YouTube Short'),
                            "likes": video_info.get('like_count', 0),
                            "comments": video_info.get('comment_count', 0)
                        })
                    except:
                        continue # Hatalı videoyu atla
    except Exception as e:
        print(f"YouTube Hatası: {e}")
        
    return shorts

if __name__ == "__main__":
    # 1000 adet YouTube verisini çek
    yt_data = get_youtube_shorts(HASHTAG, 1000)
    
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(yt_data, f, ensure_ascii=False, indent=4)
    
    print(f"\nBitti! 1000 video 'data.json' dosyasına yazıldı.")
