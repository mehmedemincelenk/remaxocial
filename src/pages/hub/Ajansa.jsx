import { useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/ortak/PageLayout';
import FikirKutusu from '../../components/hub/ajansa/FikirKutusu';
import AiStudio from '../../components/hub/ajansa/AiStudio';
import IcerikGunuFlow from '../../components/hub/ajansa/IcerikGunuFlow';
import Akademi from '../../components/hub/ajansa/Akademi';

import AuthGuard from '../../components/ortak/AuthGuard';

export default function Ajansa() {
  const [searchParams] = useSearchParams();
  const mainTab = searchParams.get('tab') || 'fikir_kutusu';

  return (
    <PageLayout padding="1rem">
      <div className="tab-content">
        {mainTab === 'fikir_kutusu' && <FikirKutusu />}
        {mainTab === 'ads' && (
          <AuthGuard>
            <AiStudio />
          </AuthGuard>
        )}
        {mainTab === 'icerik_gunu' && (
          <AuthGuard>
            <IcerikGunuFlow />
          </AuthGuard>
        )}
        {mainTab === 'akademi' && (
          <AuthGuard>
            <Akademi />
          </AuthGuard>
        )}
      </div>
      
      <div style={{ height: '4rem' }} />
    </PageLayout>
  );
}
