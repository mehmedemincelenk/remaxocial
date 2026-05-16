import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export type ReviewCardProps = {
  customerName: string;
  message: string;
  email?: string;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
  customerName = "Ahmet Yılmaz",
  message = "Mehmed Emin Bey ile çalışmak gerçekten bir ayrıcalıktı. Gayrimenkul sürecimizi o kadar profesyonel yönetti ki tek bir pürüz dahi çıkmadı. Kesinlikle tavsiye ediyorum",
  email = "ahmet.yilmaz@outlook.com"
}) => {
  const photoIds = [
    "1600585157083-0605a6598c4d", "1600047509807-ba51f9f6b6c4", "1613490493576-7fde63acd811",
    "1512917774080-9991f1c4c750", "1580587767511-20942555541e", "1600210492486-724fe5c67fb0",
    "1600607687920-4e2a12cf6a57", "1600566753190-197d21c8785e", "1600566753086-00f18fb6c321",
    "1600607687644-c7171b42498b", "1600566752355-3579af9ac45d", "1600047509358-9dc75a572710",
    "1600566752311-667746f33221", "1600566752300-1f3e07ee5397", "1600566752150-163457597f74",
    "1564013799919-ab600027ffc6", "1568605114967-8130f3a36994", "1592595825556-98006cfce396",
    "1513584684032-29f1593e27df", "1576941089067-2de3c901e126", "1572120360610-d971b9d7767c",
    "1570129477492-45c003edd2be", "1523217582562-09d0def993a6", "1512915920307-44ff521da1ee",
    "1502672260266-1c1ef2d93688", "1484154218962-a197022b5858", "1449844908441-8829872d2607",
    "1516156008625-3a9d6067fab5", "1493809842364-78817add7ffb", "1501183638710-841dd1904471"
  ];
  
  const bgIndex = message.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % photoIds.length;
  const selectedId = photoIds[bgIndex];
  const bgImg = `https://images.unsplash.com/photo-${selectedId}?q=80&w=1080&auto=format&fit=crop`;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      {/* 1. Global Background Image (Very Dark & Blurred) */}
      <AbsoluteFill>
        <Img 
          src={bgImg} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(15px)' }} 
        />
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.88)' }} />
      </AbsoluteFill>

      {/* 2. Main Content Wrapper */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        
        {/* 3. Enhanced WhatsApp Style Glass Bubble */}
        <div style={{
          width: '820px', 
          position: 'relative',
          borderRadius: '44px',
          overflow: 'hidden', 
          boxShadow: '0 60px 150px rgba(0,0,0,0.9)',
          border: '1px solid rgba(255, 255, 255, 0.28)',
        }}>
          {/* THE EMBEDDED IMAGE (The "Core" of the glass) */}
          <AbsoluteFill>
            <Img 
              src={bgImg} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: 'scale(1.4)', 
                filter: 'blur(40px) brightness(0.65)' 
              }} 
            />
            <AbsoluteFill style={{ background: 'rgba(255,255,255,0.15)' }} />
          </AbsoluteFill>

          {/* Bubble Contents */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '55px',
            display: 'flex',
            flexDirection: 'column',
            gap: '35px'
          }}>
            {/* Header Row: Name/Email + Stars */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '42px', fontWeight: '850', letterSpacing: '-1px' }}>{customerName}</h4>
                <p style={{ margin: 0, fontSize: '24px', color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>{email}</p>
              </div>

              {/* 5 Google Stars Row */}
              <div style={{ 
                display: 'flex',
                gap: '6px',
                marginTop: '10px' // Aligning vertically with the name a bit better
              }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="#FBBC04" width="30" height="30">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Message Text */}
            <p style={{ 
              margin: 0, 
              fontSize: '36px', 
              lineHeight: '1.45', 
              fontWeight: '400',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.2px'
            }}>
              {message}
            </p>
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
