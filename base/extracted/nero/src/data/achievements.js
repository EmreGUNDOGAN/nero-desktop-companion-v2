// Rozetler (başarımlar). Her rozetin ya istatistiklere bakan bir koşulu (check)
// ya da belirli bir anda doğrudan verilen bir olayı (event) vardır.
// icon: rozet kartında gösterilen küçük sembol.

module.exports = [
  // İşler
  { id: 'ilk_is', icon: '✓', title: 'Bir yerden başlamak lazım', desc: 'İlk işini bitir.', check: (s) => s.totals.todos >= 1 },
  { id: 'is_10', icon: '10', title: 'Isınma turları', desc: 'Toplam 10 iş bitir.', check: (s) => s.totals.todos >= 10 },
  { id: 'is_50', icon: '50', title: 'Liste avcısı', desc: 'Toplam 50 iş bitir.', check: (s) => s.totals.todos >= 50 },
  { id: 'is_100', icon: '100', title: 'Yüzlük', desc: 'Toplam 100 iş bitir.', check: (s) => s.totals.todos >= 100 },
  { id: 'is_500', icon: '500', title: 'Nero bile etkilendi', desc: 'Toplam 500 iş bitir.', check: (s) => s.totals.todos >= 500 },
  { id: 'gunde_5', icon: '5', title: 'Verimli gün', desc: 'Bir günde 5 iş bitir.', check: (s) => s.today.todos >= 5 },
  { id: 'gunde_10', icon: '⚡', title: 'Bugün başka biri gibisin', desc: 'Bir günde 10 iş bitir.', check: (s) => s.today.todos >= 10 },
  { id: 'hepsi_bitti', icon: '☐', title: 'Boş liste', desc: 'Listedeki bütün işleri bitir.', event: true },
  { id: 'gece_kusu', icon: '☾', title: 'Gece kuşu', desc: 'Gece yarısından sonra bir iş bitir.', event: true },
  { id: 'erken_kus', icon: '☀', title: 'Erken kalkan', desc: 'Sabah 7\'den önce bir iş bitir.', event: true },

  // Odak
  { id: 'ilk_sayac', icon: '⏱', title: 'İlk odak', desc: 'Bir sayacı sonuna kadar tamamla.', check: (s) => s.totals.timersDone >= 1 },
  { id: 'sayac_25', icon: '25', title: 'Sayaç dostu', desc: '25 sayacı tamamla.', check: (s) => s.totals.timersDone >= 25 },
  { id: 'odak_10s', icon: '10s', title: 'On saat', desc: 'Toplam 10 saat odaklan.', check: (s) => s.totals.focusMin >= 600 },
  { id: 'odak_50s', icon: '50s', title: 'Elli saat', desc: 'Toplam 50 saat odaklan.', check: (s) => s.totals.focusMin >= 3000 },
  { id: 'gunluk_2s', icon: '2s', title: 'Derin iş', desc: 'Bir günde 2 saat odaklan.', check: (s) => s.today.focus >= 120 },
  { id: 'maraton', icon: '60', title: 'Maraton', desc: 'Tek seferde 60 dakikalık bir sayacı bitir.', event: true },
  { id: 'pes_etmeyen', icon: '5x', title: 'Pes etmek yok', desc: 'Üst üste 5 sayacı yarıda bırakmadan bitir.', event: true },

  // Seri ve birliktelik
  { id: 'seri_3', icon: '3', title: 'Alışkanlık başlıyor', desc: '3 gün üst üste gel.', check: (s) => s.streak >= 3 },
  { id: 'seri_7', icon: '7', title: 'Bir haftalık seri', desc: '7 gün üst üste gel.', check: (s) => s.streak >= 7 },
  { id: 'seri_30', icon: '30', title: 'Bir aylık seri', desc: '30 gün üst üste gel.', check: (s) => s.streak >= 30 },
  { id: 'birlikte_30', icon: '♥', title: 'Bir ay oldu', desc: '30 gündür birliktesiniz.', check: (s) => s.daysTogether >= 30 },
  { id: 'birlikte_100', icon: '♥♥', title: 'Yüz gün', desc: '100 gündür birliktesiniz.', check: (s) => s.daysTogether >= 100 },

  // Notlar
  { id: 'ilk_not', icon: '✎', title: 'Aklımda tutarım demedin', desc: 'İlk notunu al.', check: (s) => s.totals.notes >= 1 },
  { id: 'not_25', icon: '✎✎', title: 'Arşivci', desc: '25 not al.', check: (s) => s.totals.notes >= 25 },

  // Nero ile
  { id: 'sev_1', icon: '♡', title: 'İlk sevgi', desc: 'Nero\'yu sev.', check: (s) => s.totals.pets >= 1 },
  { id: 'sev_50', icon: '♡♡', title: 'Sevgi dolu', desc: 'Nero\'yu 50 kere sev.', check: (s) => s.totals.pets >= 50 },
  { id: 'sev_200', icon: '♡♡♡', title: 'Nero\'nun favorisi', desc: 'Nero\'yu 200 kere sev.', check: (s) => s.totals.pets >= 200 },
  { id: 'uyandirdin', icon: 'z', title: 'Uyku kaçıran', desc: 'Nero\'yu uykusundan uyandır.', event: true },
  { id: 'salladin', icon: '~', title: 'Deprem', desc: 'Nero\'yu salla. Evet, bunu da saydık.', event: true },
  { id: 'yakaladin', icon: '!', title: 'Casus avcısı', desc: 'Sürpriz ziyarette Nero\'yu yakala.', event: true },
  { id: 'dogum_gunu', icon: '★', title: 'İyi ki doğdun', desc: 'Doğum gününü Nero ile geçir.', event: true }
];
