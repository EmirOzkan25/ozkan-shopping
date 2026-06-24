function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Gizlilik Politikası
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5 text-slate-600 leading-relaxed">
        <section>
          <h2 className="font-semibold text-slate-800 mb-2">
            1. Toplanan Bilgiler
          </h2>
          <p>
            Platformumuza üye olurken e-posta adresiniz ve şifreniz gibi temel
            bilgiler toplanır. Şifreniz güvenlik amacıyla şifrelenerek saklanır
            ve hiçbir şekilde düz metin olarak tutulmaz.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">
            2. Bilgilerin Kullanımı
          </h2>
          <p>
            Toplanan bilgiler yalnızca hesabınızın yönetimi, siparişlerinizin
            işlenmesi ve size daha iyi bir hizmet sunulması amacıyla kullanılır.
            Bilgileriniz üçüncü taraflarla paylaşılmaz.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">3. Çerezler</h2>
          <p>
            Oturumunuzun açık kalması için tarayıcınızda güvenli bir oturum
            anahtarı (token) saklanır. Bu bilgi yalnızca kimlik doğrulama amacıyla
            kullanılır.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">4. Güvenlik</h2>
          <p>
            Verilerinizin güvenliği bizim için önceliklidir. Modern şifreleme ve
            güvenli kimlik doğrulama yöntemleri kullanılarak bilgileriniz
            korunmaktadır.
          </p>
        </section>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-slate-500">
            
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;