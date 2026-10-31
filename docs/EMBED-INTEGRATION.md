# Huner Biofoundry — Visualization Embed & Integration Guide

Bu doküman, `visualization` projesinin (`https://hunelii.github.io/visualization/`) Huner Biofoundry ana sitesine (`https://hunelii.github.io/huner-biofoundry/`) veya diğer sayfalara gömülmesi (iframe embedding) için gerekli sözleşmeyi ve kod örneklerini içerir.

---

## 1. Gömülü Görünüm (`?embed=1`)

Uygulama `?embed=1` sorgu parametresi ile açıldığında otomatik olarak gömülü moda geçer:
- **Harici Başlık ve Kenar Boşlukları Sadeleştirilir:** İframe içinde gereksiz çift scrollbar oluşmasını engellemek için wrapper padding'i optimize edilir.
- **Marka Çubuğu:** İsteğe bağlı bağımsız açma bağlantısı (`Open standalone ↗`) sunulur.
- **Klavye Erişilebilirliği Korunur:** Ok tuşları (`←` / `→`) ve sekmeler tam ARIA desteğiyle çalışmaya devam eder.
- **Zemin:** `#F4F1E8` (Culture white) ana siteyle %100 uyumludur.

---

## 2. postMessage Yükseklik Protokolü

İçerik değiştiğinde veya responsive kırılımlarda (desktop/tablet/mobil) iframe yüksekliğinin ana sayfayı bozmaması ve iç içe scrollbar (nested scroll) oluşmaması için otomatik boyutlandırma protokolü mevcuttur.

### 2.1. İletilen Paket

```json
{
  "type": "huner:visualization:resize",
  "height": 560,
  "timestamp": 1730372400000
}
```

- **Loop Koruması:** Child frame, yalnızca `Math.abs(newHeight - lastSentHeight) >= 3` olduğunda ve `requestAnimationFrame` ile throttle edilmiş olarak mesaj gönderir.

---

## 3. Ana Site İçin Entegrasyon Kodu (React / Next.js)

Ana sitede bir bileşen olarak kullanmak için örnek JSX/TSX kodu:

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function TruffleAromaVisualization() {
  const [iframeHeight, setIframeHeight] = useState<number>(580);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Güvenlik Origin Kontrolü
      const allowedOrigins = [
        'https://hunelii.github.io',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
      ];

      // Origin doğrulama
      if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
        return;
      }

      if (event.data?.type === 'huner:visualization:resize') {
        const height = event.data.height;
        if (typeof height === 'number' && height > 100 && height < 3000) {
          setIframeHeight(height);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section className="visualization-embed-section" style={{ width: '100%', margin: '48px 0' }}>
      <iframe
        ref={iframeRef}
        src="https://hunelii.github.io/visualization/?embed=1"
        title="Huner Biofoundry — From Molasses to Truffle Aroma Process Visualization"
        style={{
          width: '100%',
          height: `${iframeHeight}px`,
          border: 'none',
          display: 'block',
          backgroundColor: '#F4F1E8',
          transition: 'height 0.25s ease-out'
        }}
        scrolling="no"
        loading="lazy"
      />
    </section>
  );
}
```

---

## 4. Düz HTML / Web Standartları Entegrasyonu

```html
<iframe
  id="huner-process-vis"
  src="https://hunelii.github.io/visualization/?embed=1"
  title="Huner Biofoundry — From Molasses to Truffle Aroma"
  style="width: 100%; min-height: 520px; border: none; display: block; background-color: #F4F1E8;"
  scrolling="no"
></iframe>

<script>
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'huner:visualization:resize') {
      var iframe = document.getElementById('huner-process-vis');
      if (iframe && typeof event.data.height === 'number') {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>
```
