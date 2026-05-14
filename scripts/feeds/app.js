document.addEventListener('DOMContentLoaded', () => {
    const videoGrid = document.getElementById('video-grid');
    const randomBtn = document.getElementById('random-btn');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close');

    // CORS hatasını aşmak için data.js'den gelen global videoData değişkenini kullanıyoruz
    const allVideos = typeof videoData !== 'undefined' ? videoData : [];

    if (allVideos.length === 0) {
        videoGrid.innerHTML = '<p style="text-align:center; padding:50px;">Veri yüklenemedi. Lütfen katalog_full.json dosyasının doğru olduğundan emin olun.</p>';
        return;
    }

    // Videoları Ekrana Bas
    function renderVideos(videos) {
        videoGrid.innerHTML = '';
        videos.forEach((video) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const videoId = getYouTubeId(video.link);
            const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            
            // İlk cümleden başlık oluştur
            const title = generateTitle(video.tam_transkript);

            card.innerHTML = `
                <div class="img-box">
                    <img src="${thumbUrl}" alt="Thumbnail" loading="lazy">
                </div>
                <div class="card-info">
                    <div class="card-views">👁️ ${video.izlenme_sayisi}</div>
                    <div class="card-title">${title}</div>
                </div>
            `;

            card.onclick = () => openModal(video);
            videoGrid.appendChild(card);
        });
    }

    // Modal Aç
    function openModal(video) {
        const videoId = getYouTubeId(video.link);
        const sentences = splitSentences(video.tam_transkript);
        
        // İlk ve son cümle (Kanca & CTA)
        const hook = sentences[0] || 'Tespit edilemedi';
        const cta = sentences[sentences.length - 1] || 'Tespit edilemedi';

        modalBody.innerHTML = `
            <div class="modal-body-content">
                <div style="position:relative; padding-top: 56.25%; background: #000;">
                    <iframe style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay" allowfullscreen>
                    </iframe>
                </div>
                <div class="modal-details">
                    <div class="card-views" style="margin-bottom: 1.5rem; font-size: 1.2rem;">👁️ ${video.izlenme_sayisi} İzlenme</div>
                    
                    <div class="quote-section">
                        <span class="section-label">🎯 KANCA (Videonun İlk Cümlesi)</span>
                        <div class="quote-box">
                            <p class="quote-text">"${hook}"</p>
                        </div>
                    </div>

                    <div class="quote-section">
                        <span class="section-label">📢 ÇAĞRI (Videonun Son Cümlesi)</span>
                        <div class="quote-box" style="border-left-color: #2ed573; background: rgba(46, 213, 115, 0.05);">
                            <p class="quote-text">"${cta}"</p>
                        </div>
                    </div>

                    <div class="transcript-section">
                        <span class="section-label">📄 TAM TRANSKRİPT</span>
                        <div class="transcript-box">
                            ${video.tam_transkript}
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = "block";
        document.body.style.overflow = 'hidden'; // Kaydırmayı engelle
    }

    // Yardımcı Fonksiyonlar
    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length == 11) ? match[2] : null;
    }

    function splitSentences(text) {
        if (!text || text === "Transkript bulunamadı") return [];
        // Cümle ayırma (Daha temiz sonuç için)
        return text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);
    }

    function generateTitle(text) {
        if (!text || text === "Transkript bulunamadı") return "Gayrimenkul Portföyü";
        const words = text.split(' ');
        return words.slice(0, 10).join(' ') + '...';
    }

    // Rastgele Butonu
    randomBtn.onclick = () => {
        const randomIndex = Math.floor(Math.random() * allVideos.length);
        openModal(allVideos[randomIndex]);
    };

    // Modal Kapatma
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
        modalBody.innerHTML = ''; // Durdurmak için içeriği temizle
    }

    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };

    // İlk yükleme
    renderVideos(allVideos);
});
