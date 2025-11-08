# Müzik Distribütörü Platformu

Tamamen Türkçe arayüze sahip bu Next.js 13 (App Router) projesi; sanatçı, label ve admin rollerine sahip kullanıcıların dijital müzik dağıtım sürecini yönetmesi için tasarlanmıştır. Tailwind CSS ile responsive dashboard bileşenleri, Prisma + PostgreSQL altyapısı, JWT tabanlı kimlik doğrulama ve rol bazlı middleware desteği içerir.

## Özellikler

- ✅ **Kimlik doğrulama**: E-posta + şifre ile kayıt/giriş, JWT cookie, şifre sıfırlama.
- ✅ **Rol bazlı paneller**: Sanatçı & label kullanıcıları için şarkı yönetimi, admin için inceleme, duyuru ve ayar ekranları.
- ✅ **Şarkı iş akışı**: Yükleme → inceleme → onay/ret, ret sebebi kaydı ve e-posta bildirimi.
- ✅ **Duyuru sistemi**: Hedef kitle seçimi, panel bildirimi, toplu e-posta ve EmailLog kaydı.
- ✅ **Dosya yükleme**: Kapak görseli & ses dosyası için doğrulama, benzersiz GUID ile `uploads/` klasörüne kaydetme.
- ✅ **SMTP entegrasyonu**: Nodemailer ile ret ve duyuru e-postaları (`emails/` klasöründeki HTML şablonları kullanır).
- ✅ **API güvenliği**: Zod şemaları, rol kontrolü ve JWT doğrulaması; tüm endpoint'ler korumalıdır.

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 13+

### Adımlar

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env` dosyası oluşturup aşağıdaki değişkenleri girin:
   ```env
   DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/muzik"
   SMTP_HOST="sandbox.smtp.mailtrap.io"
   SMTP_PORT="2525"
   SMTP_USER="mailtrap_kullanici"
   SMTP_PASS="mailtrap_sifresi"
   JWT_SECRET="cok-gizli-bir-anahtar"
   APP_URL="http://localhost:3000"
   ```

3. Prisma şemasını PostgreSQL veritabanına uygulayın ve client oluşturun:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
   > `migrate dev` komutu şemadaki tabloları oluşturur; `generate` ise Prisma Client kodunu üretir.

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

5. Tarayıcıdan `http://localhost:3000` adresine giderek uygulamayı test edin.

## Geliştirme Notları

- Dosya yüklemeleri yerel `uploads/` klasörüne kaydedilir. Üretim ortamında bu klasörü kalıcı bir depolama alanına taşıyın.
- E-posta gönderimleri Mailtrap gibi bir SMTP sandığı ile test edilebilir.
- `middleware.ts` dosyası; `/panel` ve `/admin` rotalarına erişim için JWT doğrulaması ve rol kontrolü sağlar.
- React Query ile sayfa içi veri güncellemeleri otomatik olarak yenilenir.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Production derlemesi oluşturur |
| `npm run start` | Production sunucusunu başlatır |
| `npm run lint` | ESLint kontrollerini çalıştırır |
| `npm run prisma:generate` | Prisma Client dosyalarını yeniden üretir |

Keyifli geliştirmeler! 🎧
