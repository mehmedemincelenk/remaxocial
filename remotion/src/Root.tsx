import { Composition, Folder, staticFile } from "remotion";
import { NewsVideo } from "./templates/NewsVideo";
import { VictoryCard } from "./templates/VictoryCard";
import { ReviewCard } from "./templates/ReviewCard";
import { reviewsData } from "./templates/ReviewCard/reviewsData";
import { SSS_Static } from "./templates/SSS_Static";
import sssData from "./data/SSS_demo.json";
import { Interactive_Static } from "./templates/Interactive_Static";
import formData from "./data/form_insta_demo.json";
import { z } from "zod";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import newsData from "../large_news.json";
import victoriesData from "../victories.json";

import { QuickInsight } from "./templates/QuickInsight";
import { SSS_B2B } from "./templates/SSS_B2B";

// Optimize font loading
loadInter("normal", { weights: ["400", "900"], subsets: ["latin"] });

export const newsVideoSchema = z.object({
  title: z.string(),
  summary: z.string(),
  category: z.string(),
  script: z.string().optional(),
  audioSrc: z.string().optional(),
});

export const quickInsightSchema = z.object({
  topic: z.string(),
  title: z.string(),
  value: z.string().optional(),
  status: z.enum(['up', 'down', 'neutral']),
  description: z.string(),
});

export const sssB2BSchema = z.object({
  question: z.string(),
  answer: z.string(),
  variant: z.enum([
    'minimal', 'executive', 'blueprint', 'split', 
    'glass-card', 'titanium', 'sidebar-bold', 
    'staggered-glass', 'monochrome-depth', 'silver-edge',
    'apple-classic', 'apple-dark', 'apple-glass', 'apple-sidebar', 'apple-centered',
    'apple-minimal', 'apple-pro', 'apple-night', 'apple-sunrise', 'apple-eco',
    'estate-modern', 'estate-luxury', 'estate-loft', 'estate-garden', 'estate-view',
    'estate-minimal', 'estate-urban', 'estate-classic', 'estate-tech', 'estate-premium'
  ]).optional(),
});

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Veri">
        <Composition
          id="Veri-Emlak-Bodrum"
          component={QuickInsight}
          durationInFrames={300}
          fps={60}
          width={1080}
          height={1920}
          schema={quickInsightSchema}
          defaultProps={{
            topic: "BODRUM / YALIKAVAK",
            title: "Yıllık Değer Artış Oranı",
            value: "%124",
            status: "up" as const,
            description: "Bölgedeki lüks konut segmentinde son 12 ayın en yüksek artışı kaydedildi."
          }}
        />
        <Composition
          id="Veri-Emlak-Haber"
          component={QuickInsight}
          durationInFrames={300}
          fps={60}
          width={1080}
          height={1920}
          schema={quickInsightSchema}
          defaultProps={{
            topic: "EMLAK / HABER",
            title: "Konut Satışlarında Hareketlilik Başladı",
            status: "up" as const,
            description: "Faiz oranlarındaki güncelleme ve bahar sezonu etkisiyle talep son 6 ayın zirvesine çıktı."
          }}
        />
        <Composition
          id="Veri-Amortisman-Besiktas"
          component={QuickInsight}
          durationInFrames={300}
          fps={60}
          width={1080}
          height={1920}
          schema={quickInsightSchema}
          defaultProps={{
            topic: "İSTANBUL / BEŞİKTAŞ",
            title: "Amortisman Süresi Düştü",
            value: "16 Yıl",
            status: "down" as const,
            description: "Kira artış hızının konut fiyatlarını geçmesiyle geri dönüş süreleri rekor seviyede kısaldı."
          }}
        />
      </Folder>

      <Folder name="SSS-B2B">
        <Composition
          id="B2B-Minimal"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "minimal" as const,
            question: "Lüks konut piyasasında neden artış bekleniyor?",
            answer: "Arz daralması ve artan global talep, özellikle sahil bölgelerindeki lüks segment fiyatlarını yukarı yönlü tetikliyor."
          }}
        />
        <Composition
          id="B2B-Executive"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "executive" as const,
            question: "Portföy yönetim süreciniz nasıl işler?",
            answer: "Mülkünüz için 360 derece dijital pazarlama, hukuki danışmanlık ve hedef kitle odaklı stratejik satış planı uyguluyoruz."
          }}
        />
        <Composition
          id="B2B-Glass-Card"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "glass-card" as const,
            question: "Yatırımcılar için fırsat bölgeleri nereler?",
            answer: "Altyapı projelerinin yoğunlaştığı kuzey aksı ve kentsel dönüşüm hızı yüksek olan merkezi semtler yüksek getiri vadediyor."
          }}
        />
        
        {/* Apple Style Variants */}
        <Composition
          id="B2B-Apple-Classic"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "apple-classic" as const,
            question: "Yeni nesil gayrimenkul danışmanlığı nedir?",
            answer: "Veri analitiği ve dijital pazarlama araçlarını kullanarak, mülkünüzü en doğru alıcıyla en kısa sürede buluşturma sürecidir."
          }}
        />
        <Composition
          id="B2B-Apple-Dark"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "apple-dark" as const,
            question: "Piyasa durgunluğunda nasıl satış yapıyorsunuz?",
            answer: "Hedefli reklam stratejileri ve geniş yatırımcı ağımız sayesinde, genel piyasa trendlerinden bağımsız sonuçlar üretiyoruz."
          }}
        />
        <Composition
          id="B2B-Apple-Glass"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "apple-glass" as const,
            question: "Neden özel portföy yönetimi?",
            answer: "Mülkünüzün değerini korumak ve gizlilik prensipleri içinde en yüksek getiriyi sağlamak için size özel strateji geliştiriyoruz."
          }}
        />
        <Composition
          id="B2B-Apple-Pro"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "apple-pro" as const,
            question: "Küresel sermaye emlak piyasasını nasıl etkiliyor?",
            answer: "Yabancı yatırımcı ilgisi, özellikle A+ segment mülklerde değer koruma kalkanı oluşturarak likiditeyi artırıyor."
          }}
        />
        <Composition
          id="B2B-Apple-Night"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "apple-night" as const,
            question: "Risk analizi mülk satışında neden kritiktir?",
            answer: "Hukuki ve finansal pürüzlerin önceden tespiti, satış sürecinde yaşanabilecek zaman ve değer kayıplarını tamamen ortadan kaldırır."
          }}
        />

        {/* Estate Style Variants */}
        <Composition
          id="B2B-Estate-Luxury"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "estate-luxury" as const,
            question: "Lüks konut yatırımında nelere dikkat edilmeli?",
            answer: "Lokasyonun ötesinde; mimari özgünlük, sürdürülebilirlik sertifikaları ve sunduğu 'yaşam stili' imkanları değer artışını belirler."
          }}
        />
        <Composition
          id="B2B-Estate-Urban"
          component={SSS_B2B}
          durationInFrames={1}
          fps={60}
          width={1080}
          height={1920}
          schema={sssB2BSchema}
          defaultProps={{
            variant: "estate-urban" as const,
            question: "Şehir merkezi yatırımları hala karlı mı?",
            answer: "Kısıtlı arz ve bitmeyen talep sayesinde, merkezi lokasyonlar değerini her zaman korur ve en yüksek kira çarpanına sahiptir."
          }}
        />
      </Folder>

      <Folder name="SSS-B2C">
        {sssData.map((sss: any, index: number) => {
          return (
            <Composition
              key={sss.id}
              id={`B2C-SSS-${index + 1}`}
              component={SSS_Static}
              durationInFrames={1}
              fps={60}
              width={1080}
              height={1920}
              defaultProps={{
                question: sss.question,
                answer: sss.answer,
                followUpQuestion: sss.followUpQuestion,
                followUpAnswer: sss.followUpAnswer,
                closingEmoji: sss.closingEmoji
              }}
            />
          );
        })}
      </Folder>

      <Folder name="Haberler">
        {newsData.map((news: any, index: number) => (
          <Composition
            key={news.id || index}
            id={`Haber-${index + 1}`}
            component={NewsVideo}
            durationInFrames={300}
            fps={60}
            width={1080}
            height={1920}
            schema={newsVideoSchema}
            calculateMetadata={async () => {
              try {
                const duration = await getAudioDurationInSeconds(staticFile(`audio/${index + 1}.mp3`));
                return { durationInFrames: Math.ceil(duration * 60) };
              } catch (e) {
                return { durationInFrames: 150 };
              }
            }}
            defaultProps={{
              title: news.title as string,
              summary: news.summary as string,
              category: news.category as string,
              script: news.script as string,
              audioSrc: `audio/${index + 1}.mp3`
            }}
          />
        ))}
      </Folder>

      <Folder name="Zaferler">
        {victoriesData.map((victory: any) => (
          <Composition
            key={victory.id}
            id={victory.id}
            component={VictoryCard}
            width={1080}
            height={1920}
            fps={60}
            durationInFrames={(victory.images.length - 1) * 42 + 120}
            defaultProps={{
              location: victory.location,
              details: victory.details,
              images: victory.images.map((img: string) => staticFile(img)),
              type: victory.type,
              variant: "stamp-bg",
              accentColor: "#2ecc71",
              note: victory.note
            }}
          />
        ))}
      </Folder>

      <Folder name="Yorumlar">
        {reviewsData.map((review, index) => (
          <Composition
            key={index}
            id={`Yorum-${index + 1}`}
            component={ReviewCard}
            durationInFrames={300}
            fps={60}
            width={1080}
            height={1920}
            defaultProps={{
              customerName: review.customerName,
              email: review.email,
              message: review.message,
              bgImage: review.bgImage
            }}
          />
        ))}
      </Folder>

      <Folder name="Etkilesim-Statik">
        {formData.map((item: any, index: number) => (
          <Composition
            key={item.id}
            id={`Etkilesim-${index + 1}`}
            component={Interactive_Static}
            durationInFrames={1}
            fps={60}
            width={1080}
            height={1920}
            defaultProps={{
              question: item.question,
              type: item.type as any
            }}
          />
        ))}
      </Folder>
    </>
  );
};
