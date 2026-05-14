import { useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/ortak/PageLayout';
import GlassCard from '../../components/ortak/GlassCard';
import { Mic, RefreshCcw } from 'lucide-react';

export default function VoiceTest() {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const script = "Gayrimenkul dünyasında fark yaratmaya hazır mısınız? Bugün sizlere özel portföylerimizden ve piyasa analizlerimizden bahsedeceğim.";
  const words = script.split(' ');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'tr-TR';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            // Final kelimeleri işle
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const spokenWords = interimTranscript.toLowerCase().split(' ');
        const lastSpokenWord = spokenWords[spokenWords.length - 1].trim();

        // Basit eşleştirme mantığı
        if (lastSpokenWord) {
          words.forEach((word, index) => {
            const cleanWord = word.replace(/[.,!?]/g, "").toLowerCase();
            if (cleanWord === lastSpokenWord && index > currentWordIndex) {
              setCurrentWordIndex(index);
            }
          });
        }
      };

      recognitionRef.current.onerror = (err) => {
        console.error("Konuşma tanıma hatası:", err);
        setIsListening(false);
      };
    }
  }, [currentWordIndex, words]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setCurrentWordIndex(-1);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '30px', textAlign: 'center' }}>Ses Takip Testi</h1>
        
        <GlassCard style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', lineHeight: '2', color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>
            {words.map((word, index) => (
              <span 
                key={index} 
                style={{ 
                  color: index <= currentWordIndex ? '#22c55e' : 'inherit',
                  transition: 'color 0.3s ease',
                  fontWeight: index <= currentWordIndex ? '700' : '400',
                  marginRight: '8px',
                  display: 'inline-block'
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <button 
            onClick={toggleListening}
            style={{
              padding: '15px 30px',
              borderRadius: '50px',
              border: 'none',
              background: isListening ? '#ef4444' : '#0054a5',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            {isListening ? <RefreshCcw size={20} className="animate-spin" /> : <Mic size={20} />}
            {isListening ? "Dinleniyor... (Konuşun)" : "Testi Başlat"}
          </button>

          <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            {isListening ? "Okuduğunuz kelimeler yeşile dönecek." : "Mikrofon izni verdikten sonra senaryoyu okuyun."}
          </p>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
