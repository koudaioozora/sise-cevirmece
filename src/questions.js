'use strict';

const ANONYMOUS_AVATARS = [
  { id: 'fox', emoji: '🦊', label: 'Tilki' },
  { id: 'wolf', emoji: '🐺', label: 'Kurt' },
  { id: 'owl', emoji: '🦉', label: 'Baykuş' },
  { id: 'eagle', emoji: '🦅', label: 'Kartal' },
  { id: 'cat', emoji: '🐱', label: 'Kedi' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'tiger', emoji: '🐯', label: 'Kaplan' },
  { id: 'bat', emoji: '🦇', label: 'Gece' },
  { id: 'mask', emoji: '🎭', label: 'Maske' },
  { id: 'moon', emoji: '🌙', label: 'Ay' },
  { id: 'crystal', emoji: '🔮', label: 'Kahin' },
  { id: 'leaf', emoji: '🌿', label: 'Lokal' }
];

const NICK_ADJECTIVES = ['Mistik', 'Gölge', 'Gece', 'Kozmik', 'Sessiz', 'Dingin', 'Kuzey', 'Gizemli', 'Sakin', 'Yıldız'];
const NICK_NOUNS = ['Tilki', 'Kurt', 'Baykuş', 'Kuzgun', 'Vaşak', 'Panter', 'Kartal', 'Kedi', 'Yolcu', 'Kahin'];

const DECKS = {
  classic: {
    id: 'classic',
    name: 'Klasik Samimi Deste',
    shortName: 'Klasik Samimi',
    emoji: '🌿',
    priceTry: 0,
    free: true,
    description: 'Standart buz kırıcı, eğlenceli ve sıcak başlangıç soruları.',
    truth: [
      { id: 'c_t1', category: 'Eğlenceli', text: 'Bugüne kadar kimseye anlatmadığın en tuhaf veya komik sakarlığın nedir?' },
      { id: 'c_t2', category: 'Eğlenceli', text: 'En son kime, ne konuda masum bir beyaz yalan söyledin?' },
      { id: 'c_t3', category: 'Sosyal', text: 'Bu masadaki oyunculardan ilk izlenimine göre en çok hangisine güvenirsin?' },
      { id: 'c_t4', category: 'Derin', text: 'Hayatında zamanı geri alıp değiştirmek istediğin tek bir an olsa neyi seçerdin?' },
      { id: 'c_t5', category: 'Eğlenceli', text: 'Kimse bakmıyorken yaptığın en garip alışkanlığın nedir?' },
      { id: 'c_t6', category: 'Sosyal', text: 'Gece yarısı uykun kaçtığında aklına en çok ne geliyor?' }
    ],
    dare: [
      { id: 'c_d1', category: 'Eğlenceli', text: 'Sohbet kutusuna klavyenin otomatik tamamlama önerilerine 8 kez basarak çıkan cümleyi gönder!' },
      { id: 'c_d2', category: 'Sosyal', text: 'Masadaki bir oyuncuyu @etiketleyip ona içten bir iltifatta bulun!' },
      { id: 'c_d3', category: 'Eğlenceli', text: 'Bundan sonraki 2 tur boyunca yazdığın her mesajın sonuna gizemli bir emoji ekle!' },
      { id: 'c_d4', category: 'Cesur', text: 'En sevdiğin şarkının nakaratını 10 saniye boyunca sesli veya ritimli yazı ile canlandır!' },
      { id: 'c_d5', category: 'Eğlenceli', text: 'Sadece emojiler kullanarak son yaşadığın komik olayı anlat; masa tahmin etsin!' },
      { id: 'c_d6', category: 'Sosyal', text: 'Masadaki her oyuncuya anonim karakterine göre tek kelimelik bir unvan ver!' }
    ]
  },

  midnight: {
    id: 'midnight',
    name: 'Gece Yarısı (+18 İtiraf) Destesi',
    shortName: 'Gece Yarısı (+18)',
    emoji: '🔥',
    priceTry: 39,
    free: false,
    description: 'Cesur, filtresiz gece yarısı itirafları ve heyecan dozu yüksek görevler.',
    truth: [
      { id: 'm_t1', category: 'Cesur', text: 'Gizlice profilini uzun uzun incelediğin ve sonradan pişman olduğun son kişi kimdi?' },
      { id: 'm_t2', category: 'Cesur', text: 'Asla yapmam deyip de gizlice yaptığın en büyük çılgınlık neydi?' },
      { id: 'm_t3', category: 'Cesur', text: 'Telefonunda şu an yakalanmaktan en çok çekineceğin mesajlaşma veya not hangisi?' },
      { id: 'm_t4', category: 'Cesur', text: 'Bugüne kadar aldığın en cesur ama kimseye söyleyemediğin gece kararı neydi?' },
      { id: 'm_t5', category: 'Cesur', text: 'Birine karşı hislerin varken sırf gururdan görmezden geldiğin oldu mu? Nasıl bitti?' }
    ],
    dare: [
      { id: 'm_d1', category: 'Cesur', text: 'Telefonunda en son açtığın sekmenin veya son dinlediğin şarkının adını eksiksiz itiraf et!' },
      { id: 'm_d2', category: 'Cesur', text: 'Şu ana kadar kimseye söylemediğin tek cümlelik bir itirafı masanın ortasına bırak!' },
      { id: 'm_d3', category: 'Cesur', text: 'Masadan seçeceğin bir kişiye 10 saniye içinde en iddialı gizli lakabı tak!' },
      { id: 'm_d4', category: 'Cesur', text: 'Sesini veya yazım tarzını tamamen gizemli bir gece radyo sunucusuna çevirip masaya bir sır fısılda!' },
      { id: 'm_d5', category: 'Cesur', text: 'Son silmiş olduğun mesajın veya fotoğrafın konusunu dürüstçe açıkla!' }
    ]
  },

  flirt: {
    id: 'flirt',
    name: 'Kıvılcım & Flört Destesi',
    shortName: 'Kıvılcım & Flört',
    emoji: '💘',
    priceTry: 29,
    free: false,
    description: '2 kişilik baş başa odalar ve yeni tanışanlar için çekim dolu sorular.',
    truth: [
      { id: 'f_t1', category: 'Flört', text: 'Bir insanda ilk anda kalbini hızlandıran en güçlü detay nedir?' },
      { id: 'f_t2', category: 'Flört', text: 'Bugüne kadar aldığın ve hala gülümseyerek hatırladığın en etkileyici iltifat neydi?' },
      { id: 'f_t3', category: 'Flört', text: 'Şu an bu masadaki birine özel mektup yazacak olsan ilk cümlen ne olurdu?' },
      { id: 'f_t4', category: 'Flört', text: 'Sence iyi bir gece sohbetini unutulmaz yapan şey ses tonu mu, bakış açısı mı, gizem mi?' },
      { id: 'f_t5', category: 'Flört', text: 'Birinden hoşlandığını belli etmek için kullandığın en ince ipucu nedir?' }
    ],
    dare: [
      { id: 'f_d1', category: 'Flört', text: 'Soruyu soran kişiye tamamen doğaçlama, etkileyici bir 2 satırlık iltifat yaz veya söyle!' },
      { id: 'f_d2', category: 'Flört', text: 'Masadan birini @etiketle ve ona özel mektup kutusu açsan hangi takma adı vereceğini söyle!' },
      { id: 'f_d3', category: 'Flört', text: 'Karşındaki kişiyi tek cümlelik gizemli bir buluşma senaryosuna davet et!' },
      { id: 'f_d4', category: 'Flört', text: 'Sadece 3 kelime ve 1 emoji ile bu masadaki enerjini tarif et!' },
      { id: 'f_d5', category: 'Flört', text: 'Sesli veya yazılı olarak "bu geceyi özetleyen" en romantik veya çekici şarkı sözünü paylaş!' }
    ]
  },

  psychology: {
    id: 'psychology',
    name: 'Derin Psikoloji & Karanlık Ayna',
    shortName: 'Derin Psikoloji',
    emoji: '🧠',
    priceTry: 29,
    free: false,
    description: 'Karakter analizi, içsel yüzleşme ve maskeleri indiren sorular.',
    truth: [
      { id: 'p_t1', category: 'Psikoloji', text: 'İnsanların senin hakkında en sık yanlış anladığı ama düzeltmeye üşendiğin yönün nedir?' },
      { id: 'p_t2', category: 'Psikoloji', text: 'Kendi karanlık aynana baktığında en çok hangi duygunu bastırdığını fark ediyorsun?' },
      { id: 'p_t3', category: 'Psikoloji', text: 'Hayatında en çok hangi konuda kendinle çelişiyorsun?' },
      { id: 'p_t4', category: 'Psikoloji', text: 'Bir ilişkiyi veya dostluğu bitiren ama genelde kimsenin açıkça itiraf edemediği sebep sence nedir?' },
      { id: 'p_t5', category: 'Psikoloji', text: 'Şu an maskeni tamamen indirsen, kendinle ilgili tek bir gerçeği nasıl özetlerdin?' }
    ],
    dare: [
      { id: 'p_d1', category: 'Psikoloji', text: 'Soruyu soran kişinin sadece rumuzuna ve enerjisine bakarak 2 cümlelik karakter analizini yap!' },
      { id: 'p_d2', category: 'Psikoloji', text: 'Masadaki her oyuncunun gizli süper gücünü veya zaafını tek cümlede tahmin et!' },
      { id: 'p_d3', category: 'Psikoloji', text: 'Kendine 1 yıl sonraki halinden kısa, dürüst bir sesli veya yazılı not bırak!' },
      { id: 'p_d4', category: 'Psikoloji', text: 'En son ne zaman kırıldığını veya güçlü göründüğünü maskesizce tek cümlede anlat!' },
      { id: 'p_d5', category: 'Psikoloji', text: 'Sana göre bu masadaki en gizemli oyuncuyu @etiketle ve nedenini açıkla!' }
    ]
  }
};

const SHOP_PACKS = {
  dm_3: { id: 'dm_3', name: '3 Özel DM Hakkı', priceTry: 49, tickets: 3, vip: false },
  dm_10: { id: 'dm_10', name: '10 Özel DM Hakkı', priceTry: 129, tickets: 10, vip: false, popular: true },
  vip_plus: { id: 'vip_plus', name: 'Lokal Plus+ VIP Paketi', priceTry: 199, tickets: 25, vip: true }
};

function getDeckList() {
  return Object.values(DECKS).map((d) => ({
    id: d.id,
    name: d.name,
    shortName: d.shortName,
    emoji: d.emoji,
    priceTry: d.priceTry,
    free: d.free,
    description: d.description,
    cardCount: d.truth.length + d.dare.length
  }));
}

function getShopCatalog() {
  return {
    dmPacks: Object.values(SHOP_PACKS),
    decks: getDeckList()
  };
}

function generateAnonymousIdentity() {
  const adj = NICK_ADJECTIVES[Math.floor(Math.random() * NICK_ADJECTIVES.length)];
  const noun = NICK_NOUNS[Math.floor(Math.random() * NICK_NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  const avatar = ANONYMOUS_AVATARS[Math.floor(Math.random() * ANONYMOUS_AVATARS.length)];
  return {
    alias: `${adj} ${noun} #${num}`,
    avatarId: avatar.id,
    emoji: avatar.emoji
  };
}

function getRandomCard(mode, category = null, deckId = 'classic') {
  const deck = DECKS[deckId] || DECKS.classic;
  const pool = mode === 'dare' ? deck.dare : deck.truth;
  const filtered = category && category !== 'Tümü'
    ? pool.filter((c) => c.category === category)
    : pool;
  const source = filtered.length > 0 ? filtered : pool;
  const picked = source[Math.floor(Math.random() * source.length)];
  return {
    ...picked,
    deckId: deck.id,
    deckName: deck.shortName,
    deckEmoji: deck.emoji
  };
}

module.exports = {
  ANONYMOUS_AVATARS,
  DECKS,
  SHOP_PACKS,
  TRUTH_CARDS: DECKS.classic.truth,
  DARE_CARDS: DECKS.classic.dare,
  getDeckList,
  getShopCatalog,
  generateAnonymousIdentity,
  getRandomCard
};
