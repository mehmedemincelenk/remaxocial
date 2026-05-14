from pytrends.request import TrendReq
import pandas as pd
import time

def get_istanbul_trends():
    print("--- İstanbul Gayrimenkul Trendleri Analiz Ediliyor ---")
    
    # Google Trends bağlantısı
    pytrends = TrendReq(hl='tr-TR', tz=180) # Türkiye saati

    # İstanbul için kritik anahtar kelimeler
    # TR-34 = İstanbul Geo Kodu
    keywords = ["Kentsel Dönüşüm", "Konut Kredisi", "Satılık Daire", "Kanal İstanbul", "Tiny House"]
    
    try:
        # Veriyi çek (Son 12 ay, İstanbul özeli)
        pytrends.build_payload(keywords, timeframe='today 12-m', geo='TR-34')
        
        data = pytrends.interest_over_time()
        
        if not data.empty:
            # Sadece ilgi oranlarını al
            data = data.drop(labels=['isPartial'], axis='columns')
            
            print("\n--- Son 1 Aylık Ortalama İlgi Skorları (0-100) ---")
            averages = data.tail(4).mean().sort_values(ascending=False)
            for kw, score in averages.items():
                print(f"{kw}: {score:.1f}")
                
            # En çok yükselen trendi bul
            growth = ((data.tail(1).values - data.tail(8).head(1).values) / (data.tail(8).head(1).values + 1)) * 100
            print("\n--- Son 2 Ayda En Çok Yükselenler ---")
            for i, kw in enumerate(keywords):
                print(f"{kw}: %{growth[0][i]:.1f}")
                
        else:
            print("Veri bulunamadı.")
            
    except Exception as e:
        print(f"Hata: {e}")

if __name__ == "__main__":
    get_istanbul_trends()
