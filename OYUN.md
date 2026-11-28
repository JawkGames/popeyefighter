# Popeye Fighter – oyun notları (sayılar ve kurallar)

Kullanıcı oyunla ilgili bir şey sorunca önce buraya bak (koda girme). Oyunda bir değer/kural değişince bu dosyayı da güncelle.
Not: Değişiklikler görsel kontrol / ekran görüntüsü testi yapılmadan yapılıyor; görsel hataları kullanıcı bildiriyor. Üretilen ve kullanılan tüm karakter/parça görselleri ortalanmış, sağa bakan, dik duran çizimlerdir.
Ölçü: kullanıcı mesafeleri Popeye'nin kafa boyuyla anlatır. Oyun birimi: oyuncu boyu ~850.

## Oyuncu
- Yüz yara seviyeleri (11 yüz) arasında saydam geçiş yok; eşik geçilince doğrudan değişir.
- Can: 250 (Maks. Can +100 yeteneğiyle 350). Can çubuğu yok; can kafa görselinden (11 hasar seviyesi) ve eğik çubuktan okunur.
- Can dolumu: son hasardan 6–8 sn (rastgele) sonra başlar; saniyede max canın %1'i = 250 canda **2.5 can/sn** (350 canda 3.5). Can Dolumu %2 → 5/sn, %3 → 7.5/sn. Kalkanlı Savunma: blokta beklemeden dolar. Dolarken kalp atar ve kalp sesi çalar. (`dongu.js`)
- Enerji: max 250, saniyede 2.5 dolar (ıspanaktan sonra 10 sn 2 kat). Her özel güç 50 enerji. Bıçak modu saniyede 7.5 enerji yer.
- Ispanak canı (maks. canın %10'u) anında değil: ilk yaprak ağza girince başlar, son yaprakla biter; enerji kutu boşalınca gelir.
- Ispanak yerken kutudan dökülen yapraklar (kutunun arkasında, yüzün önünde) saçılmaz; yapraklar bitene kadar ağız açık kalır: hepsi kavisle açık ağzın içine (`OGV.agiz`) akar, yaklaşınca kararıp küçülerek kaybolur.
- Ispanak: max canın %10'u + 50 enerji. Ispanak Cebi açıksa ikisi de 2 kat (yerden de cepten de). Düşman ölünce %25, varil kırılınca %50 (Varil Tutma ile) ıspanak düşer.
- Seviye atlayınca can ve enerji tamamen dolar.
- Blok: iki parmak ekranda hareketsiz. Hasarın yarısı engellenir; ilk 0.5 sn içinde vurulursa PARRY (düşman sersemler).

- Kayma (E): koşarken (en az max hızın yarısı). Kayma bitince durup yavaşlarsa ya da koşarak 650 birim (`KAY_YOL`) yol alırsa tekrar kayılır (koş-kay-koş-kay).
- Yürüme/koşu hızı (en yüksek): 1100 birim/sn. Yerde saldırırken hız %35'e, çömelikken %45'e düşer.
- Yerçekimi: 5600.
- Zıplama: bir basış hep tam zıplar (basılı tutmak yükseltmez). Hız 2700, çift zıplama 1700 (yükseklik eskinin yarısı). Çift zıplama 1 kez (havada 1 ek zıplama, D yeteneğiyle). Çok Zıplama (K): zıplama gücü x1.25.
- Sensörle zıplama gücü telefonu silkme hızına göre 0.8–1.45 kat (koşarken x1.18).

## Can çalma (şu anki kod, `yetenek.js` canCal)
- Can Çalma %10 (H) ya da %20 (M): tüm vuruşlarda (yumruk, tekme, bıçak) vurulan hasarın yüzdesi kadar can.
- Tekmeyle Can Çalma (Q): sadece tekmelere kendi +%10'unu ekler (H yoksa tekme %10, H varsa %20, M varsa %30). Yumruğu artırmaz.
- Bıçakla Can Çalma (T): sadece bıçak modu vuruşlarına kendi +%20'sini ekler (H yoksa %20, H varsa %30, M varsa %40). Yumruğu artırmaz.
- Can Çalmalı Yırtma (R): düşmanın kalan canı kadar can (en az 50).

## Sesler
- Havadan tahtaya düşme (oyuncu inişi, fırlatılan/ölen düşman, yarılar): `ses/wooddusme.mp3`. Yer yarmalar birbirini silmez, her biri kendi süresinde kaybolur; kesiştikleri aralıkta yeni yarık maskelenir (çift yarık görünmez). Yer yarma düşmana vurunca `ses/tahtavurma.mp3`; yarıktan sonraki sürekli çatırdama sesi kaldırıldı. Arka plan `ses/deniz.mp3`.

## Düşmanlar
- k yumruklu korsan: 150 can, oyuncuya 10 hasar. b bıçaklı: 100 can, 15 hasar. h kancacı: 200 can, yumruk 10 hasar, yürümez.
- a baltalı kar korsanı (3. bölümden itibaren, `ZOR_N>=2`): 220 can, 22 hasar, menzil 500, yürüme hızı x0.9, saldırı süresi x1.15, 25 XP. (`sk:'a', kc:'b'`, balta arka kolda, kafa x0.9)
- n kar avcısı / buzlu tüfekçi (3. bölümden itibaren, `ZOR_N>=2`): 140 can, 20 yakın / 24 mermi hasar, ateş arası 1.8–3.2 sn, 22 XP. (`sk:'n', kc:'p'`)
- g kaslı yakalayıcı kar devi (3. bölümden itibaren, `ZOR_N>=2`): 260 can, 15 fırlatma hasarı, 30 XP (`sk:'g', kc:'g'`). Bacaklar kalçanın arkasında (`kalcaUst:true`), başta iki eli de açık (yakın elin dışı oval bilekli `g_elN`, uzak elin avucu `g_elF`). Yaklaşınca oyuncuyu direkt yakalayıp 0.72 sn içinde kendi arkasına uzağa fırlatır (`vx:-2550, vy:-1650`); fırlattıktan sonra (`e.atti`) elleri yumruk (`g_yumN/g_yumF`) olur ve 1–3 vuruşluk normal yumruk kombosuyla vurmaya devam eder.
- y iri kıyım buz lordu (3. bölüm+ karlı dağ boss'u, `ZOR_N>=2`): 950 can, 28 hasar, %18 büyük (`bs:1.18`), dev buz çekici (`sk:'y', kc:'b'`), arkadaki çekicsiz eli %20 büyütülmüş ve avucu görünen açık el (`y_elF`). Nadir olarak (%30 şans, 10–15 sn arayla) arkadaki tek kolunu uzatıp oyuncuyu gırtlak seviyesinde yakalar, olduğu yerden dimdik havaya fırlatır (oyuncu kilitli kalır), aşağı düşerken dev çekiciyle gelişine vurup ileri fırlatır (28 hasar). 3. bölümde liman korsanları çıkmaz, sadece `a`, `n`, `g` ve sonda `y` boss çıkar.
- Kaptan (boss): 500 can, 15 hasar; vuruşların yarısını alır, kafaya vuruş 3 kat (KRİTİK). Bölüm sonunda, son dalgadan sonra çıkar (v0.475: `AR.bossX`).
- Kaptan yer vuruşlarından (iniş sarsıntısı, yer yarma, taş patlaması) kafa kritiği (3x) almaz ve vuruş başına en çok maks. canının %5'ini yer (`S.yerV`, `vur`).
- Zorluk: sadece boss öldürülüp bölüm bitince (ölünce değil, v0.387) tüm düşmanların canı ve saldırı gücü (yakın dövüş, kanca 15/çekerken 1, kaptan mermisi 30, kafa atma 10/5/3) ×1.1 birikerek artar (en çok 4 kat; `ZOR_N`, `ZK()` dusman_kur.js, localStorage `pf_zor`). Tam sıfırlamada sıfırlanır. XP canın 1/10'u olduğu için o da artar. Yukarıdaki can/hasar değerleri başlangıç (×1) değerleridir.
- Yürüme hızı: yumruklu/bıçaklı 520, kaptan 340 birim/sn. Kaçarken yarı hız.
- Vurma menzili: yumruklu 470, bıçaklı 425, kaptan ~537 birim.
- Saldırı: yumruklu 1–3 vuruşluk kombo, bıçaklı/kaptan 1–2. Kombo sonrası 0.6–1.4 sn bekler. Vuruş süreleri: uzak kol 0.5 sn, yakın kol 0.62 sn, bıçak/dipçik 0.66 sn.
- Kaptan: ~1075–1900 birim uzaktayken nişan alıp ateş eder (nişandan 0.6 sn sonra), ateşler arası 1–2 sn.
- Kancacı: 2100 birim içindeyse kanca atar. Kanca takılırsa 15 hasar, çekerken her 0.5 sn 1 hasar. Oyuncuyu 420 birim yakınlığa (yumruk mesafesi) çekip bırakır; 610 birime kadar 2–3 vuruşluk yumruk atar.
- Düşman içine girilince biraz geri gider; geri giderken de vurabildiği an normal vurur.
- Canı ilk kez %25 altına düşen korsan bir kez kaçar (10 sn ya da 4 vuruş), canı %50'ye doğru dolar. Kaçarken saldırı pozu yok: kollar aşağı sarkık, bel hafif bükük, aksayarak gider. Kaptan kaçmaz.
- Yere düşme 0.45 sn, kalkış 1.0 sn sürer.

- Ölen (ve parçalanan) düşman siyah beyaz çizilir; yere düşüp yaşayan renkli kalır.
- Cesetler kalıcı: ölen düşman yere yatınca (1.2 sn) ya da yırtılan yarı yere yatıp durunca bir kez siyah beyaz resme çevrilir (`CESET`, korsan.js `cesetYap`/`parcaYap`) ve düşman listesinden silinir. Sonra sadece ekrandayken tek resim çizilir: güncelleme/poz/filtre yok. En çok 150 ceset (eskisi silinir). Önizlemede ceset kalmaz.

- Sersem (parry, Yere Düşürme ölümü %15, Dağıtıcı ölümü; `e.ser`): yıldızlı sersem yüzü (`parca/X_ser.webp`) ve olduğu yerde yalpalama (baş/gövde sallanır, kollar sarkık, dizler çöker).
- Sersemletme / itme / yere düşürme eşikleri (10 üstü) yeteneksiz ölümlerden gelen düz hasar bonusu (`AG.cip`) hariç hasara bakar: bonus yüzünden düz 5'lik yumruk/tekme sersemletmez.
- Kaptan da sersemler: diğerlerinin yarı şansıyla, yarı süresiyle (parry %50 / 0.75 sn, Yere Düşürme ölümü %2.5 / 0.65 sn, Dağıtıcı ölümü %50 / 0.65 sn).
- Baygın (yerde) ya da sersemken vurulsa da baygın/sersem yüz kalır; vurulma yüzüne geçmez.
## Zıpkın — v0.438'de tamamen kaldırıldı (aşağısı eski kayıt)
- Kamera uzaklığı: `ZOOM` 1.0. Ekranın altında zeminin en fazla 285 birim altı görünür (ön tahtanın dibi görünmez); zoom değişince alt sabit kalır, üste açılır.
- Ekranda sadece can barı, yön/zıplama tuşları, ıspanak ve zıpkın düğmesi ve sağ üstte menü (ayarlar) düğmesi var. Menü açıkken oyun durur; içinde ses efektleri, müzik, eğim sensörü (+dengele), tam ekran, dil, kombolar, yetenekler, devam ve sürüm. Ses/müzik ayarı kayıtlı (`pf_ayar`). Düşman sayacı ekranda yok.
- Sol alttaki zıpkın butonu (ıspanak butonunun karşısı, sola gitme tuşunun üstü; PC'de X) zıpkın modunu açar/kapar. Şimdilik enerji harcamaz, yetenek ağacında değil.
- Zıpkın iki kolda (tabanca ölçeği 0.855), ikisi de aynı çalışır. Ekrana basınca parmağı olmayan kol (yer/yön fark etmez; önce zıpkını dışarıda olmayan, sonra ön kol) basılan yere atar; bu parmak o zıpkını çeker/salar. İki kol da tutuluyorsa basılan parmak sallar (yana kaydır). Zıpkın tutulurken tekme bölgesi tekme atmaz. Parmak kalkınca takılı zıpkın 0.5 sn daha asılı kalır, sonra kopar (asılıyken zıplama hemen bırakır).
- Zıpkın modunda kamera uzaklaşır (ZOOM_ZPK 0.625), ekranın altı sabit kalır, fazlası üste açılır; mod kapanınca normal zoom (0.75).
- Takılabilen her şey: düşman (yerde yatan dahil), varil, kazıklar (ön/arka), sokak lambaları, iskele tahtası, evler (görselin dolu pikseline), gökyüzü (zeminden 250 birim yukarısı havada takılır). Su: zıpkın uçar, geri sarılır.
- Uçuş hızı 7500, geri sarma 6500, halat en uzun 4500, en kısa 260 birim.
- Parmak basılı = halat tutuluyor; parmak kalkınca 0.5 sn sonra halat bırakılır, zıpkın geri sarılır. Halattan havada bırakınca savrulma hızı 1.5 sn korunur.
- Nesneye takılınca: çekme ekseni atışta sabitlenir (hedef yanda ise yatay, üstte/altta ise dikey). İlk parmağı hedefin tersine kaydırdıkça (yeri önemsiz; sağdaysa sola, üstteyse aşağı) halat o kadar kısalır, hedefe doğru kaydırdıkça uzar (ZP_IP 1.3). Sadece takıldıktan sonraki parmak hareketi sayılır. Hızlı geri çekme fiskesi (0.1 sn'de en az 110 px ve 2800 px/sn) = çapaya fırla (3000). Halat gergin ve sarkaç gibi. Asılıyken zıplama = halatı bırakıp sıçrar. Eğim/sol-sağ tuşları da sallar.
- Düşmana saplanınca zıpkın 10 sn düşmana saplanamaz (etrafa takılır); buton ıspanak gibi dolar, kalan saniyeyi yazar, aç/kapa çalışır.
- Düşmana saplanma 20 hasar (kaptana 10, kafasına 3 kat). Düşman iki eliyle mızrağı tutar, çırpınır, saldıramaz. Parmağı kendine çek = düşmanı çek (400 birime kadar; oyuncu uzaklaşınca da sürüklenir), hızlı geri fiske = kendine savurur (yanına yüzüstü kapaklanır), düşmana doğru hızlı fiske = mızrağı kopar. Kaptan tutmaz, mızrak 0.45 sn sonra çıkar. Aynı düşmana ikinci zıpkın: hasar verir, hemen çıkar.
- Yerde yatan düşmana saplanma 20 hasar; hızlı çekince çekilen yöne havaya fırlar, düşünce yine yatar.
- Varil: geri çek = sürükle, hızlı geri fiske = kendine fırlatır (yoldaki düşmana çarpar). v0.397: fırlatılan varil düşmanın KAFASINA (düşman boyunun üst %30'u) çarparsa KRİTİK: hasar 2 kat, `ses/varil_kafa.mp3` çalar, "KRİTİK!" yazısı çıkar (varil.js).
- Sesler: `ses/zipkin_obje.mp3` (nesneye), `ses/zipkin_insan.mp3` (insana). Görseller: `parca/z_dolu` (mızraklı tabanca), `z_bos`, `z_mizrak`, `z_ip` (halat, uç uca), `ui/btn_zipkin`.

## XP ve seviye
- Düşman XP'si SABİT (cana bağlı değil): yumruklu 15, bıçaklı 10, kancalı 20, tabancalı kadın 15, kar avcısı 22, baltalı kar korsanı 25, kaslı yakalayıcı 30, boss 200. Her bölüm geçince hepsi ×1.5 (`XPK()` dusman_kur.js; boss 200→300→450); can/atak artışından bağımsız. Yırtarak öldürme +%50.
- Seviye L'den L+1'e geçmek için gereken XP her seviye 100 artar: 1→2: 100, 2→3: 200, 3→4: 300... (`xpGerek(lv)=100*lv` yetenek.js; v0.426, önceki +50). Her seviye geçişinde XP barı sıfırlanır ve 0'dan o seviyenin kendi gereksinimine (örn. 200) dolar — kümülatif/taşımalı değil. Her seviye 1 puan; can ve enerji dolar; seviye sesi (`ses/levelup.mp3`).
- Kayıtta oyuncunun TOPLAM XP'si tutulur (`pf_agac2.top`); seviye ve seviye-içi XP (`AG.lv`, `AG.xp`) her açılışta bu toplamdan yeniden hesaplanır (kazanılan XP boşa gitmez). `xpGerek` düşürülürse oyuncular daha çok seviye atlamış olur, yükseltilirse seviye düşer. Puan eksiye düşerse son açılan yetenekler kapanır, puanı geri döner.
- Tüm yetenekleri açmak (toplam 42 puan) için 43. seviye lazım; bu formülle toplam 47.250 XP gerekir.

## Hasarlar (oyuncunun)
- Yumruk kombo: ara vuruşlar 5, son vuruş 5×n+5. Serbest kol vuruşu 15. Bıçak modunda vuruşlar 2 kat (bıçak vuruşu 20, sersemletmez).
- Tekmeler (kombo): 6–18. Kombo kayar tekmesi (yyt) havada bacaklar açık yapılır, iki ayak da vurur (arkadaki ayak arkadaki düşmana). Kayar tekme 15 (%50 yere serer). Döner tekme (v0.401): havada 2 dönüş, her dönüşte düşmana en çok 1 vuruş × 20 = en çok 40 (saldırı gücü artışı yine etkiler). Yere tekme (uçan tekme) her düşmana bir kullanımda bir kez 15 (iniş sarsıntısı aynı düşmana tekrar vurmaz). Kombo 30 (yyyyyt) bitişi: havada 6 tekme (2 orta, 2 daha yukarı-ileri, 2 en yukarı-ileri), 30 hasar 6×5 olarak bölünür; 1.33 sn sürer, karakter tekme başına 70 birim ilerler ve her isabet düşmanı aynı miktar iter (mesafe sabit kalır).
- Ateşli aparkat 32. Süpermen uçuşu 50. Aduket 50. Yer yarma (yarık) 40. Süper kahraman inişi 50 (yer sarsıntısı).
- Dağıtıcı (alkış, eski adı Alkış Şok Dalgası) 30: geri savurur, %50 yere düşürür (kaptan ve kancacı hariç).
- Tutup fırlatma 4–40 (hıza göre); düşman varil gibi el hızıyla uçar, varilin yarı mesafesi (en yüksek hız ~2300). Varil fırlatma 25–60 (v0.400 taban 25; kafaya 2x kritik kalır); varil en yüksek hız 3250. Fırlayan düşman başkasına çarparsa 10–35.
- Yırtma: anında öldürür (enerji = düşmanın kalan canı).
- Yere Düşürme yeteneği: 10 üstü vuruşlar %25 ihtimalle düşmanı yere düşürür.

## Yetenek ağacı (`js/yetenek.js` YET) — parantez içi puan
Her zaman açık: yumruk kombo, tekme, blok. Diğerleri ağaçtan puanla (1–3) açılır; komşusu açık olmalı.
- C Yumruk (kök, 0) · I Yere Düşürme (1, pasif) · O Can Dolumu %2 (1, pasif) · X Can Dolumu %3 (1, pasif) · W Kalkanlı Savunma (2, pasif) · V Maks. Can +100 (1, pasif) · TOP Ispanak Cebi (2; 30 sn'de bir ıspanak butonu, ıspanak gücü x2)
- A İnsan Tutma (1) · B Varil Tutma (1) · G Sıkı Tutuş (1, pasif; tutulan kafa atamaz) · F Yırtma (2) · R Can Çalmalı Yırtma (3; Yırtma açılmadan açılmaz) · H Can Çalma %10 (1, pasif) · M Can Çalma %20 (1, pasif)
- N Yer Yumruğu / yarık (2) · S Süpermen Uçuşu (2) · Y Aduket (2)
- Aduket öldürülünce (anti Y): yumruk hasarı +%30, yumruk menzili +80 (sulu yumruk v0.399'da kaldırıldı). YENİ (v0.399) basılı tutmalı ROKET YUMRUK (`rkGuncelle/rkAt`, anti.js): yumruk tarafına parmağı oynatmadan 0.26 sn basılı tut → şarj başlar (`S.cg`): üst kol geri çekik titrer (v0.399 pozu), dirsekten sonrası (ön kol+yumruk) parmağın yönüne 360° yumuşak döner (v0.401) ve 1 sn'de %25 büyür, su 1 sn boyunca yumruğa çekilir, `ses/su_sarj.mp3` basılı tutulurken döngüde çalar; 1 sn = tam güç. Parmak kalkınca (`S.rk`) roket gibi öne atılır: hasar 15→45 (1x–3x, ayrıca +%30), menzil 450→1350 birim, süre 0.32–0.5 sn, enerji/bekleme yok; giderken yumruktan geriye roket ateşi gibi su fışkırır, atılırken ön kol+yumruk şarj boyundan %10 daha büyür (v0.403) ve sonda normale döner; anti_Y yazısı güncel (menzil +80, 15-45 hasar, 450-1350 menzil), yoldaki herkese bir kez vurur. Şarjda yürünmez; iki parmak/blok, zıplama vb. şarjı iptal eder. Parmak sürüklenmişse (>22 px) şarj başlamaz.
- v0.400 roket yumruk: şarjda kol geri gitmez, yumruk parmağın o an sürüklendiği yöne dönük bekler (dirsekten öne şişer); bırakınca o yöne atılır, yukarı-ileri ise (saat 2 gibi) karakter havaya uçarak gider; atılırken `ses/waterwhoosh.mp3`.
- D Çift Zıplama (1) · K Çok Zıplama (1, pasif) · E Kayar Tekme (1) · L Döner Tekme (2) · U Süper Kahraman İnişi (2) · Q Tekmeyle Can Çalma (1, pasif)
- J Ateşli Aparkat (1) · AL Dağıtıcı (2) · YT Yere Tekme (1)
- P Bıçak Modu (2) · T Bıçakla Can Çalma (1, pasif) · Z Bıçak Atlama (3)
- Aktif yetenek açılınca kendi sesi çalar. Sesi olmayan aktifler: Süpermen Uçuşu, Dağıtıcı.
- Aduket: dönen su girdabı (`fx/aduket_su`), dönerken iki yana su damlası (`fx/damla`) saçar. Oluşurken `ses/wateraduket.mp3` döngüde çalar, atınca kesilir; çarpınca `ses/aduket_carpma.mp3`.

- Ağaçta yetenek açma: dokun = bilgi/önizleme, 1 sn basılı tut = açılır (simge dönerek renklenir, bırakınca dolum boşalır).

## Ekran barı (`hud.js`)
- Çerçeve `ui/bar_cerceve.webp`; soldaki yuvarlak XP ile alttan (dalgalı) dolar, dolunca seviye atlar, parlayıp boşalır. Üstte tek kalp `ui/kalp_tek.webp`: lub-dub atar, can azaldıkça hızlanır; can dolarken kalp sesiyle güçlü atar; ölünce durur. Barlarda ve XP yuvarlağında bombeli cam efekti.
- Kalp sesi (`kalpsesi.mp3`): can dolmaya her BAŞLADIĞINDA bir kere, en çok 1 sn çalınır (uzun döngüyle tekrar tekrar değil); can dolma durursa kesilir.

## Düşman yaraları (`js/dyara.js`)
- Vuruldukça canıyla orantılı yara (en çok 36), sadece ten yerlerinde (gövde, üst/ön kol; ızgara `dyara_veri.js`); can dolunca azalır. Kaptanda ten yok, yara çıkmaz. Yara görselleri sadece y4–y11 havuzundan. Yumruklu korsanın göğüs altındaki gölgeli çizgiye yara gelmez.

## Skill öldürme (kodda anti; `js/anti.js`, `AG.anti`, `YA(k)`)
- Arayüzde "Öldür" denir. Öldürünce `ses/skill_oldur.mp3` çalar, değişiklik 2 sn görünür, sonra oyun başlar. Öldürme ekranında simgeler renkli, çeper griden kırmızıya yavaş geçer; yazıda önce öldürülmüş hali, sonra eski ad üstü çizili. Normal ağaçta skill yazısının sonunda ölüm hali üstü çizili.
- Kalpli kol ağaçta hep görünür: dokununca güncel maks. can ve toplam ceza/bonus yazar; sadece ölüm seçiminde 2 sn basılı tutunca seçilir (maks. can 100 ise seçilemez; 110'dayken "son" uyarısı yazar, verince "VERECEK BAŞKA CANIN KALMADI!" çıkar; maks. can 100'e inince kalpli kolun arkasında kan lekesi görünür).
- Öldürülecek skill yok ve maks. can 100 iken ölüm: OYUN BİTTİ, her şey sıfırlanır (XP, seviye, skill'ler, öldürülenler, cezalar).
- Hiç verilmiş yetenek yokken ölünce: maks. can -10 (en az 100), her vuruşa +1 düz hasar; her ölümde birikir (`AG.cip`, kayıtlı).
- Ölünce verilmiş (Yumruk hariç, henüz çevrilmemiş) yetenek varsa 1.3 sn sonra ağaç zorunlu seçimle açılır, kapatılamaz; yeteneğe dokun = anti metni (önce anti, yanında orijinal; yazı yana kaydırılır), 1 sn basılı tut = çevrilir, oyun yeniden başlar. Sağ üstteki kalpli kol (`ui/kalpkol.webp`): skill öldürmek yerine maks. can -10, +1 hasar (dokun = açıklama, 1 sn basılı = seçer). Çevrilen yetenek kapalı sayılır (YV false), ağaçta simgenin altında kan lekesi (`ui/kanleke.webp`). Kayıt `pf_agac2.anti`.
- O: can dolumu bonusu yok (pasif %1 dolum kalır), öldürünce düşmanın maks. canının %10'u kadar can (boss dahil) · X: can dolumu bonusu yok (pasif dolum kalır), can %25 altında hasar +%50 · W: blokta dolum yok, blok %75 engeller · V: +100 can yerine +100 maks. enerji (ENMAX) · TOP: ıspanak 2 kat sık düşer · I: vuruş %5 sersemletir (1.3 sn)
- H: +%20 saldırı · M: her vuruş +2 enerji · Q: tekme itmesi +%30 · T: bıçak hasarı +%20 · R: yırtma enerjisi yarı
- A: koşarken (max hızın %70'i) düşmana yaklaşınca %25 şansla omuz atma: önce omuz hamlesi (öne çapraz eğilme, arka bacak kalkar), 0.14 sn sonra 25 hasar, uzağa fırlatıp yere serer · B: tekme varili top gibi uçurur; tekmelenen varil kırılmaz (seker, yuvarlanır, hacıyatmaz gibi hep dik durur, tekrar tekmelenebilir), sadece düşmana çarpınca kırılır · G: vuruşlar %20 daha hızlı (vuruşlar arası bekleme kısalır), yumruk hasarı -%10 · F: canı %20 altındaki tek yumrukla ölür
- D: havada ileri hız 2x · K: +1 havada zıplama (D açıksa 3 zıplama) · E: koşu +%20 · U: yüksekten inişte (380 üstü) taş patlaması: hasar (yükseklik-300)/40, 3–25; alan 450–1100
- N: çömelik yumruk 2x · S (v0.400): gizlilik — fark etmemiş (`e.akt` yok) düşmanın arkasındaysak eğilerek yürürsek hiç dönmez (ayaktaysak 900 birimden yakında duyar); arkadan yumruk 10x hasar (KRİTİK), anında öldürmez; biri ölünce ya da oyuncu zıplayınca ekrandaki (kenarda azıcık görünen dahil) fark etmemiş herkes döner ve gelir (`sesYay`); düşmanlar başta rastgele yöne bakar · Y: yumruk menzili +80 birim, yumruk hasarı +%30 · L: her 3. tekme kritik (2x) · J: her vuruş %5 şansla yakar (yumrukla olduysa yumruk alev alır, alev hareketin gerisine savrulur): 4 sn, 0.5 sn'de bir düz vuruşun (5 + ölüm bonusu) yarısı; ateş efekti hafif/saydam · AL: blok/parry yapınca 900 içindeki düşmanlar sersemler · YT: yerde yatana 2x · P: yumruk %25 kanatır (4 sn, 0.5 sn'de 3) · Z: bıçak modunda yana kaydırma = bumerang bıçak (25 enerji, 30 hasar, gidiş-dönüş)

## Bölüm
- Düz zemin, karlı. Yürüme, zıplama, iniş, kayma, çift ayak/tek ayak yere inişte kar-taş sıçraması yok (sadece yere yumruk/yarık sıçratır). 7 varil (x: 2600, 6300, 12400, 18000, 24200, 28600, 34000). Boss x=42000.

- Giriş sahnesi (v0.433): dağ, zemin, evler, iskele (üstünde obje yok), 4 kazık, iskelenin üstünde duran lambalar, iskelenin altına giren deniz; sahne %10 doygun (logo hariç). Giriş yazıları 17 dilde, oyun İngilizce açılır.
- Skill ağacındaki kalp (maks. can -10 / +1 hasar): normal ekranda "sadece ölünce verilir" yazar.

## Reklamlar (v0.430, js/reklam.js — sadece Android uygulamasında)
- Banner: sadece giriş ekranında, oyun başlayınca kalkar. Açılış reklamı (v0.476): uygulama ilk açılırken HİÇ gösterilmez; yalnız 2. bölümden itibaren, en az 10 sn arkada kalıp geri dönülünce.
- Ölünce kurtulma (ödüllü video): skill öldürme ekranında sol üstte (kalbin karşısı) el fırlayan play butonu "Video izle · Kurtul". Verilecek skill yoksa ölünce BİR HAK DAHA ekranı: video izle kurtul ya da YENİDEN BAŞLA (eski ceza: maks. can -10 / +1 hasar ya da maks. can 100'deyse tam sıfırlama burada uygulanır). Kurtulunca ceza yok, olduğu yerde can/enerji dolu kalkar, 3 sn dokunulmaz.
- +1 skill puanı (ödüllü geçiş): skill ağacında sol üstte klaketli el "Video izle · +1 skill puanı"; ek puanlar `AG.ek` olarak kaydedilir, tam sıfırlamada silinir.
- Geçiş reklamı: kurtulmadan YENİDEN BAŞLA'ya basınca, en çok 3 dakikada bir. v0.476: 1. bölümde gösterilmez, 2. bölümden itibaren.

## Arayüz ve dil
- Oyun giriş ekranıyla açılır (v0.429, `js/giris.js`): oyunun çevre görselleriyle kurulan hareketli liman (deniz akar, gökyüzü kayar, lambalar titrer), ortada logo görseli (`ui/logo.webp`), BAŞLA ve AYARLAR (menüyü açar) butonları; giriş açıkken oyun durur.
- Arayüz varsayılan İngilizce. Tüm yazılar `js/dil.js` `DILLER` içinde (en, tr); kod `dil('anahtar')` ile alır, HTML `data-l` / `data-lh` / `data-la`. Yeni dil = `DILLER`'e yeni blok. Sağ üstte 🌐 dil butonu dilleri sırayla değiştirir, seçim kaydedilir (`pf_dil`), anında değişir.
- Oyun arkaya düşünce (sekme, uygulama, ekran kilidi) tüm sesler susar, dönünce devam eder.
- Kombo listesi butonu hep renkli (aktif) görünür. Ispanak cebi butonu basar basmaz çalışır (yürürken de).

## Kontrol modları ve tuşlar (v0.434, `js/kontrol.js`)
- Menüde eski "Eğim sensörü" satırı artık kontrol modu: Dokunmatik (varsayılan) → Eğim sensörü → Klavye → Joystick (dokundukça değişir, kaydedilir `pf_kmod`). Eğimde simgenin yanında Dengele; klavye/joystick modunda ekrandaki yön tuşları gizlenir ve satır sonundaki liste simgesi tuş listesini açar (dile göre).
- Klavye (joystick aynı aksiyonları kullanır): yürü ← → / A D (J: X, D-pad/sol çubuk) · zıpla ↑ W Boşluk Z (▲) · eğil ↓ S (▼) · yumruk J (X) · tekme K (A) · Süpermen H (Y) · Bıçak Modu G (B) · Döner Tekme B (RB) · Yer Yumruğu N yerde / Süper Kahraman İnişi N havada (RT) · Kayar Tekme M koşarken (LB koşarken) · Yere Tekme havada M + yön ya da ↓+K (↓+A havada; ileri = ileri kayarak, aşağı = olduğu yere, ileri+aşağı = çapraz) · Aduket ↓ → J (↓ → X) · Ateşli Aparkat → ↓ → J (→ ↓ → X) · Alkış H+G birlikte (Y+B) · Tut Y basılı (LB basılı): en yakın düşman ya da varil, bırakınca bırakır · Yırt U tutarken (LB+X); varil tutarken yırt tuşu varili ileri fırlatır · Bıçak Atlama bıçak modunda ileri + G (ileri + B) · Ispanak Cebi T (LT) · Zıpkın X (Select) · Menü Esc (Start). Klavyede tutarken J boştaki elle vurur.
- Tutma tek tuş: İnsan Tutma / Sıkı Tutuş / Varil Tutma hepsi aynı tutma tuşunu, Yırtma / Can Çalmalı Yırtma aynı yırtma tuşunu kullanır. O/P test tuşları kaldırıldı.
- Joystick yoklaması sadece `gamepadconnected` olunca başlar (takılı değilken çalışmaz).
- Dokunmatik modda skill ağacında önizlemeye basınca beklenen parmak hareketi `ui/parmak.webp` ile gösterilir (`PARMAK` tablosu): basınca büyükten küçülür, kaydırmalarda kayar, iki parmaklılarda iki parmak.

## Kontroller (dokunmatik)
- Sağ yarı ön kol, sol yarı arka kol: kaydırınca kol o yöne gider. Telefon eğimi = yürüme, geri silkme = zıplama.
- Eğimle yürüme: 3.5° altı durur, ~8°'ye kadar yavaş yürür, 20°'de tam koşu. Ekranı kendine yatırınca eğilir, bir daha yatırınca kalkar.
- Butonlar: sol/sağ (solda), çömel/zıpla (sağda), ıspanak cebi, zıpkın (sol altta, sola gitme tuşunun üstü), yetenek ağacı, kombo listesi.
- İki parmak birlikte aşağı (yerde) = yer yumruğu.
- İki parmak birlikte hızlı YUKARI = bıçak modu aç/kapat (Wolverine bıçakları; `penceCift` ozel.js, v0.428). Tekrar iki parmak yukarı çekince bıçaklar girer. Eski "blokta iki parmak aşağı" yöntemi kaldırıldı. Yetenek (P) kilitliyse tek parmak yukarı (shoryuken) normal çalışır; iki parmak yukarıyken tek parmak hareketleri (shoryuken, bıçak saplaması) tetiklenmez.
- İki parmak aynı yöne yatay = süpermen. Zıt yöne (açılarak) = döner tekme. Ortaya doğru = alkış (Dağıtıcı).
- Havada tek parmak hızlı aşağı = yere tekme (çekilen yöne); iki parmak aşağı = süper kahraman inişi.
- Çok hızlı yukarı = ateşli aparkat. Kol 0.5 sn aşağıda = eğilip ıspanak alma.

## Yaralar (`js/yara.js`)
- Can azaldıkça gövde, kollar ve pantolona rastgele yara görselleri (`yara/y1-16`) basılır; her yeni oyunda yerleşim yeniden rastgele. Üst üste gelmez, eklem halkalarına, dövmeye ve göğsün alt çizgisine değmez. Yerleşen yara sayısı N (~50) ise her HPMAX/N can kaybında (~5 can) bir yara görünür; can dolunca ters sırayla kaybolur.
- y1-2 sadece pantolonda (bacak başına en çok 2-4), y5/y9 yara bandı (sabit boy, %30), diğerleri deride büyüklü küçüklü. Gövde artık hep temiz `govde0` + yaralar; yüz eskisi gibi can kademesiyle değişir.

## Bölüm 2+ düşmanları (v0.388)
- 1. bölüm boss: eski kaptan (can 500, XP 200). 2. bölümden itibaren boss: kılıç ustası (erkek, `sk:'m'`, `agil`): can 750, yakın dövüş 22 (kaptanın 1.5 katı), yürüyüş ×1.35, saldırı süreleri ×0.75. Vurulunca %38 şansla geri takla/geri sıçrama, sonra öne atılıp vurur; saldırıdan sonra havaya sıçrar; eğilir, bazı saldırılardan kaçar ("KAÇTI!"). `usta.js`.
- Tabancalı kadın (`sk:'f'`, 2. bölümden): can 100, atak 20, orta hız; boy ölçeği 1.2075 (v0.395: %5 büyütüldü). Mermi kaptanınkinin 0.55'i. Nişanda tabancalı kol omuzun gerçek konumundan oyuncunun kafasına dümdüz (gövde eğimi düşülür), bilek namluyu (`mb`=7°, namlu dibi `gb`) kol hizasına getirir; mermi namlu ekseninde gider. Namlu ateşi kendi görseli `parca/f_ates.webp` (anker sol kenar [4,59], 0.45 ölçek), tam namlu ucundan çıkar ve namluya yapışık kalır (geri tepmede namluyla döner); ateş sesi `ses/f_ates.mp3`. Tabancasız (arka) kol hep aşağı, hafif öne açılı.
- Tutma kuralı (v0.396): `TUTMA()` (yetenek.js) — İnsan Tutma (A), Sıkı Tutuş (G), Yırtma (F) dirisi ya da Can Çalmalı Yırtma (R) dirisi VEYA ölüsü varsa düşman tutulur. Yırtma kuralı `YIRT()`: Yırtma (F) dirisi ya da Can Çalmalı Yırtma (R) dirisi veya ölüsü varsa yırtılır. Varil Tutma (B) sadece varil içindir.
- TEST: O tuşu 1 yetenek puanı verir (sonra silinecek).
- Yere iniş seslerinin (wooddusme, inis_*) başındaki sessizlik `bosKes()` ile kesilir.

## v0.389 düzeltmeler
- Yarık (Yer Yumruğu, N): her kullanım artık aynı düşmana kesin bir kez vurur (`ozel.js` çatlak başına `Set`).
- Tabancalı kadın (f): el ataması düzeltildi (tabanca öndeki kolda, `gunNear`), eller kolun ön katmanında çizilir (`eo`).
- Kılıç ustası boss (m): bacaklar %20 büyük, gövde 20 birim yukarı alındı (`bs:1.2`, `bel:468.3`); kollar düz duruşa alındı (bıçaklı gard açısı artık uygulanmıyor).
- Zemin görseli değişti (kumlu toprak), dağ %25 daha küçültüldü (`DAG_BOY` 4600→3450).

## v0.390
- Kadın (f) ve kılıç ustası (m) için yeni kafa görselleri: normal, darbe yiyince (vur), sersemleme (ser, yıldızlı), ölü/bayılmış (ahh), acı çekip kaçış (aci). Kendi ölüm sesleri eklendi (`olum_f`, `olum_m`).
- Kadının etek+bacakları (govdeden altı) 20 birim yukarı alındı.
- Tabanca nişan hattı düzeltildi: kadının eli öndeki kolda olduğu için mermi artık doğru elden namluya doğru düz çizgide gider (önceki hata: mermi hep arkadaki elden hesaplanıyordu).
- Kancacının (h) kanca atışı artık oyuncunun kafa hizasına (kafaY(), eski sabit göğüs yüksekliği yerine) düz çizgide atılır: aynı zeminde yere paralel gider, oyuncu zıplarsa/eğilirse ona göre yukarı/aşağı nişan alır.
- Zemin görseli (kumlu toprak) yeniden işlendi: üstteki beyaz gökyüzü kırpıldı, artık tamamen toprak dokusu; zeminin dağın eteğine taşma payı artırıldı (340 birim), arkada boşluk/beyaz ekran görünmez.

- Çizim sırası (v0.395): yerdeki variller düşmanların arkasında (`varilCiz(false)` → `dusmanCiz`).

## v0.397
- Oyuncu ölüm animasyonu (`olumBasla/olumGuncelle`, anti.js; poz `olumPoz`, oyuncu.js): ölünce kontrol kilitlenir, `ses/popeye_die.mp3` çalar; iki dizine çöker (0.4 sn'de dizler yere çarpar: hafif sekme + yere iniş sesi), elleri karnında, karnından kan fışkırır (orta güç), 2.0 sn'de kollar öne uzanıp yüz üstü yığılır (2.68 sn'de yere çarpınca düşmanların yere düşme sesi `dusme.mp3`). 3.0 sn'de YENİLDİN yazısı + game over sesi, 3.5 sn'de yetenek (skill) seçimi açılır / dokununca yeniden başlar.
- Kadın (f): şarjör sesi (`ses/kiz_sarjor.mp3`, 0.55 sn) nişan başlarken çalar (kaptanda eski `mermi_haz`); arkadaki (tabancasız) kolun eli 45° aşağı bükülü (`wF:45`); geri tepme 14°→4° (namlu kalkıp mermi "altından çıkıyor" görünüyordu), mermi ilk 0.05 sn canlı namlu ucuna yapışık.

## v0.398
- Kadın (f): kalça/etek parçası (`f_kalca`) çizilmiyor; bacaklar doğrudan gövdenin (eteğin) altına bağlı, üst bacak yuvarlağı eteğin altında kalır. Bot görseli yenilendi: tek bot (`parca/f_bot.webp`, 150x175, bilek yuvarlağı [49.8,25.5]) iki ayakta da kullanılır (arkadaki koyulaştırılır).

- Eğilip yürürken ayak sesi %50 (v0.400).
- Ses düğmeleri (v0.412): Ambiyans düğmesi = deniz sesi (`ses/deniz.mp3`). Müzik düğmesi = 3 loop müzik: normal oyun `bgm_ambient`, kaptan boss savaşı `bgm_silah`, kılıç ustası boss savaşı `bgm_kilic`. Boss gelince (yaşayan `boss`) onun müziği çalar, ölünce normal müziğe döner. Tam ekran düğmesi sağ üstte menü düğmesinin solunda (sadece ikon).
- Tam ekran düğmesi görseli: `ui/m_tam.webp` (v0.413).
- Sersem vuruş sesi (`sersem_vurus.mp3`, v0.420): sadece "sersemletildi" yazısı çıkınca ve vuruş düşmanı yere düşürünce (diri yere düşme veya ölüp uçarak düşme) çalar; diğer vuruşlarda çalmaz. 0.15 sn içinde tekrar etmez.
- 3'lü zıplama (v0.416; Çok Zıplama yeteneği D + anti K birlikte): 2. zıplama dönmez, dizler yukarı kırık (az çekik, bir ayak biraz aşağıda), kollar ilk zıplamadaki gibi ama pazu daha sıkılı ve biraz daha yukarıda, ön kollar 20° daha dik (v0.423) (0.45 sn, `S.tuck`); takla (dönme) 3. zıplamada. Sadece 2 zıplama varsa 2.si eskisi gibi döner.
- Ses düğmeleri birbirinden bağımsız (v0.417): ambiyans = sadece deniz sesi, ses = sadece efektler, müzik = normal oyun + boss müzikleri. Oyuncu ölürken kan karakterin önünde çizilir.
- Ölünce müzik susar, sadece ölüm sesleri duyulur; yeni oyunda müzik geri gelir (v0.419). Deniz sesi devam eder.
- Süpermen uçuşu başlayınca `ses/superman_ucus.mp3` çalar (v0.421).

## Ölüm pozu (v0.426)
- Popeye ölünce dizlerine çöker; kollar omuzdan geriye bükülür (dirsekler arkada), eller karnı tutar. Kan ön elin altından fışkırır; arka el en arkada kalır.
- Kol açısı kuralı (oyuncu.js `kol()`): `aNu` üst kol — 0 aşağı sarkık, negatif öne/yukarı (-90 yatay öne), pozitif geriye. `aNr` ön kolun üst kola göre dönüşü; ön kolun mutlak açısı `aNu+aNr` (0 = yatay ileri, +90 = aşağı, -90 = yukarı). Ölüm pozu: aNu 32 / aNr -26 (eller karında). v0.426'da aNr 112 verilince ön kol geriye dönüyordu.

## Menü görünümü (v0.435)
- Panel kurdelesi ayrı görsel (`ui/m_kurdele.webp`), panelin üstüne taşar; alt ucu çerçevenin kahverengi tahtasında biter, açık renkli kâğıda değmez. Menü, tuş listesi ve BİR HAK DAHA paneli aynı.
- Menüdeki sağ butonların hepsi mavi (Kombolar, Yetenekler, Devam); simgeleri aynı hizada.
- Yeni yuvarlak simgeler (256x256): m_joy, m_klv, m_dokun, m_liste, m_amb, m_sfx, m_muz, m_sens, m_dil, m_devam, m_ayar. Kupa simgesi verildi ama henüz bir yere konmadı.

## v0.436
- Giriş ekranı: kumlu zemin büyütüldü (üst kenarı dağın eteğini kapatır); aradaki ek kahverengi dolgu kaldırıldı.
- Kılıç ustası boss: kalça ve bacaklar 40 birim yukarı, 25 birim ileri (boy kısaldı); karakter %10 büyük (`KSK.m.sc` 1.1).
- Bıçak atlama (Wolverine): neredeyse düz ileri uçar; eskisinin yarısı kadar yükselir, menzil aynı (`DAG_VY` 2600, `DAG_G` 1.5). Kollar dümdüz ileri, bıçaklar delecek gibi önde; yakın bacak katlı, uzak bacak hafif sarkık. Önizlemede sadece tek parmak ileri kaydırma gösterilir.
- Süpermen uçuşu: uçuş sesi sürer, düşmana çarpınca normal yumruk sesi de çalar.

## v0.437 (önce v1.0 olarak çıktı, sürüm numarası geri alındı)
- Arka plan evleri ve objeleri (oyunda ve giriş ekranında) %20 küçük (`EV_K`, `CV_OBJ_K` 0.8), doygunluk %15 az (`soluk()`, ayar.js; yüklenirken bir kez). Soldan sağa rastgele, aynı görsel art arda gelmez (giriş ekranında her açılışta yeni sıra).
- Deniz: oyunda da giriş ekranındaki gibi tek parça akan deniz görseli, üstünde saydam ışık çizgileri ve parıltılar (`denizCizgi`). Lambaların titreyen ışığı oyunda da var.
- Giriş logosu %10 küçük. Girişte Ayarlar menüsünden Kombolar/Yetenekler açılır (giriş geçici kapanır, önizleme arkada oynar, kapanınca giriş geri gelir).
- Menü: Kombolar/Yetenekler/Devam butonlarında simge+yazı ortada, butonlar %5 küçük. Klavye/joystick modunda satırda "Tuş ataması" yazısı (dokununca tuş listesi).
- Tuş ataması: tuş listesinde altı çizili satıra dokun → yeni harfe/rakama (joystick: düğmeye) bas; aynı tuş başka işteyse ikisi yer değiştirir. Yön harfleri (A D W S Z), oklar, Esc/Start sabit. "Varsayılan" sıfırlar. Kayıt telefonda.
- Süpermen anti (gizlilik): arkasındayken eğilerek yürümek, durmak ya da sadece ayağa kalkmak düşmanı döndürmez. Ayakta yürümek, zıplamak, bir düşmana vurmak ya da birinin ölmesi ekrandaki fark etmemiş herkesi döndürür. Arkadan gizli yumruk 10x, yazısı "GİZLİ x10" (kritik değil).
- Bıçak atlama: belden aşağısı daha arkaya katlı (vücut arkaya eğimli).
- Menüdeki geçici ceset sayacı kaldırıldı. Açılışta logo görseli (üst sabit, ekranı kaplar), yeni uygulama simgesi ve web simgesi.
- Temizlik: kullanılmayan görseller (eski evler ev0-7, eski gökyüzü/kum/sahil/lamba/kazık, fx/agac*, fx/dag, fx/yol, m_kare, m_seridi), kullanılmayan kod ve phaser paketi silindi.

## v0.438
- Zıpkın (kanca atma) tamamen kaldırıldı: buton, tuş (X / Select), kod (zipkin.js), görseller (btn_zipkin, z_*), sesler (zipkin_obje/insan), zıpkın zoom'u.
- Sağ üstteki tam ekran butonu kaldırıldı (uygulamada zaten tam ekran).
- Sürüm v1.0 yerine v0.438'den devam ediyor.

## v0.439
- Açılış görseli artık yükleme ekranı: altında yükleme çubuğu; giriş görselleri + tüm oyun görselleri + tüm sesler hazır olunca (en az 1.8 sn, en çok 25 sn) kalkar. O zamana kadar BAŞLA çalışmaz.
- Sesler açılışta önceden indirilip çözülür (eskiden BAŞLA'ya basınca ~100 ses birden çözülüyordu: oyun başındaki takılmanın sebebi). Görseller de yüklenirken çözülür (decode).
- Ölü / yırtılmış düşman artık her karede filtreyle değil, bir kez hazırlanan siyah beyaz parça kopyalarıyla çizilir (düşman ölürken/yırtılırken takılma yok).
- Ispanak düğmesi sadece yüzde değişince güncellenir.

## v0.440
- Grafik seviyesi (menüde GRAFİK düğmesi, eski YETENEKLER'in yerinde; tıkladıkça simge değişir, menü kapanınca uygulanır; kayıt `pf_ayar.gr`):
  - Yüksek (varsayılan): her şey açık, çözünürlük en çok 2x.
  - Orta: bıçak modu / enerji barı parlaması yok, kan damlası ve kıymık/taş yarı yarıya, çözünürlük en çok 1.5x.
  - Düşük: kan, kıymık/taş, yaralar (oyuncu + düşman), su ışıltısı ve sıçraması, fener ışığı, bar camı kapalı; ceset sınırı 50 (normalde 150); çözünürlük 1x.
- Yetenek ağacı düğmesi (çapa) artık oyun ekranında ayarların hemen solunda; açılacak yetenek varsa oklu çapa olur. Ayarlar ve kombo simgeleri yenilendi (kombo: pazı).
- Yükleme çubuğu kullanıcının bar görselleriyle (boş çerçeve + soldan açılan dolu bar).
- Ayak-zemin uyumu (ters kinematik) olduğu gibi bırakıldı: yükü yok denecek kadar az, çömelme ve yumrukta ayağın yerde kalması da aynı koddan geliyor.

## v0.441 — Öğretici (`js/ogretici.js`)
- Her oyuncuya bir kez: ilk BAŞLA'da açılır, bitince ya da "Geç"e basınca `pf_ogr=1` kaydedilir, bir daha gelmez. Test için linke `?ogretici` eklenirse her açılışta gelir.
- Başta oyuncu düşmansız alana alınır (x = -1400; ilk düşman 3800'de). Evler daha soldan başlar (cevreKur lx -4200).
- Adımlar (üstte kutuda yazı + ilerleme noktaları, parmak görseli `ui/parmak.webp`, ilgili düğme parlar, yapınca yeşil "Harika!" + seviye sesi):
  hoş geldin → sağa yürü (450 birim) → sola yürü → zıpla → eğil (0.35 sn) → yumruk ×3 (sağ/sol iki daire gösterilir) → tekme ×2 (tekme alanı çatı biçiminde boyanır) → basılı tutup kol sürükle (oklu yol) → sağ üstteki ⚓'ya dokun (kutu nabız gibi parlar, uzun kalır) → ağaçta yeteneğe dokun / ağacı kapat → "Hazırsın!".
- Klavye/joystick ya da dokunmatik olmayan ekranda yazılar tuş adlarıyla gelir (yumruk/tekme tuşu tuş atamasından), kol adımı atlanır. Eğim modunda yürü/zıpla/eğil adımları atlanır.
- Menü, kombo listesi, ölüm, tuş listesi açıkken öğretici gizlenir ve bekler. Yazılar 17 dilde (`ogr_*`).

## v0.442
- ACİL düzeltme: v0.441'de cevre.js'te satır sonu açıklaması `const SON=...` kodunu yutmuştu → oyun açılışta çöküyor, karakter/oyun görünmüyordu. Düzeltildi.

## v0.443 — Mobil uygulama ayarları
- Android geri tuşu artık uygulamayı direkt kapatmıyor: açık paneli (tuşlar, kombo listesi, yetenek ağacı, menü) kapatır; oyun sırasında menüyü açar (duraklatır); giriş ekranında 2 sn içinde ikinci basış uygulamayı kapatır. Ölüm ekranı / zorunlu anti seçimi açıkken geri tuşu bir şey yapmaz.
- Uygulama arka plana gidince (ev tuşu, gelen arama) oyun menüyle duraklar.
- Oynarken ekran kararmaz.
- Titreşim izni eklendi (önceden uygulamada titreşim çalışmıyordu).
- Otomatik grafik: oyuncu menüden grafiği elle seçmediyse oyunun ilk 1 dakikasında ortalama FPS 38'in altındaysa grafik kendiliğinden bir seviye iner (yüksek → orta → düşük). Elle seçince otomatik ayar kapanır.

## v0.444 — AAB hazırlığı
- Telefon uygulamasında kontrol modları: dokunmatik, eğim, joystick (klavye modu sadece tarayıcı/PC testinde var).
- Çentikli telefonlarda oyun çentiğin altına da uzanır, yanlarda siyah boşluk kalmaz.

## v0.445
- Google Play uyarısı düzeltildi: "zorunlu donanım özelliği (android.hardware.screen.landscape)". Manifest'te yatay/dikey ekran özelliği isteğe bağlı (required=false) yapıldı; uygulama artık her cihaza (tablet, PC, XR dahil) kurulabilir.

## v0.446
- Android uygulama küçültme/optimizasyon açıldı (R8 kod + kaynak küçültme). AAB ile birlikte mapping.txt (hata raporlarını okunur yapan eşleme dosyası) Releases'e yüklenir.

## v0.447 — Karlı dağ (3. bölüm), test tuşları, pusula, yükleme
- Bölümler: 1. liman (boss kaptan), 2. liman (boss kılıç ustası), **3. karlı dağ** (boss şimdilik kılıç ustası; ileride yeni boss). 3. bölümden sonrası şimdilik karlı dağda devam eder (başa sarma ileride kaldırılıp bölümler uzatılacak).
- Karlı dağ limana geçmeden önceki son karlı sürümden (v0.306) geri getirildi: uzak dağlar (`fx/dag`), karlı yol (`fx/yol`), 8 ağaç (`fx/agac0-7`, düşmana yakın yerde kuru ağaç), kar adım sesleri (`stepsnow_2-6`), yarık açık kaldıkça çalan ses (`yarildi_sonra`), inişte kar savrulması. Limanın gökyüzü/deniz görseli, evler, iskele, kazıklar ve deniz sesi bu bölümde yok. Kod: `js/kar.js` (`KARLI()` = ZOR_N>=2).
- PC testi (sadece tarayıcı): klavyede `1–9` → o bölüm baştan başlar; aynı rakama tekrar basma, `0` tuşu ya da `Shift + 1–9` → direkt o bölümün boss ekranına ışınlar (v0.481/v0.482).
- Yetenek açılabilecekken sağ üstteki çapanın çevresinde yanıp sönen sarı ışık çerçevesi.
- Giriş ekranında sağ üstte pusula (`ui/m_ogr.webp`): oyunu başlatıp öğreticiyi baştan açar.
- Yükleme: alttaki bar kaldırıldı; açılış görseli siyah-beyazdan renkliye soldan sağa akarak dolar.

## v0.461 — Arka eller (elF), Boss çekiç zamanlaması ve geri fırlama pozu
- 5 düşman arka eli (`a_elF.png`, `n_elF.png`, `g_elF.png`, `g_yumF.png`, `y_elF.png`) tek sprite sayfasından oyunun kalın siyah konturlu stiline uygun, avuç içi kameraya dönük ve kenar beyazlığı sıfırlanmış şekilde yeniden üretildi (`ayar.js` bu 5 dosya için `.png` yükler).
- Karlı bölüm boss'unun (`y_`) oyuncuyu havaya attıktan sonraki çekiç vuruşu tetiklemesi `0.50 sn`'ye çekildi (`korsan.js`, eskiye göre ~`0.30 sn` daha erken ve her seferinde).
- Oyuncu geri fırlarken (`S.firlatT` aktifken havada) karnından darbe yemiş gibi gövde geriye (`torso: -36`), kafa, kollar ve bacaklar öne gelecek duruş eklendi (`oyuncu.js`).

## v0.462 — 3./4. bölüm ayrımı ve 5. Bölüm: Mısır Çölü & Mumya
- **3. bölüm (`ZOR_N===2`)**: Karlı dağda baltalı kar korsanı (`a_`) artık çıkmaz; sadece kar avcısı (`n_`) ve kaslı dev (`g_`) + Buz Lordu boss (`y_`) çıkar (`dusman_kur.js`).
- **4. bölüm (`ZOR_N===3`)**: Buz Lordu yenilince karlı dağ tekrar başlar ve bu kez baltalı kar korsanı (`a_`) da devreye girer; boss yine `y_` Buz Lordu.
- **5. bölüm (`ZOR_N>=4`, Mısır Çölü)**: Canva ile üretilen çöl arka planı (`misir_dag.png`, `misir_yol.png`, `misir_agac0..5.png` — `fx/misir/`), ve 4 yeni Mısır temalı düşman (`parca/misir/`):
  - `d_` Mısır Mumya Savaşçı (khopesh hançerli, 220 can, 22 hasar)
  - `w_` Kadın Mısır Savaşçısı (güneş asalı, 160 can, 20/25 hasar)
  - `u_` Anubis Tapınak Muhafızı (altın baltalı, 280 can, 26 hasar)
  - `z_` Dev Firavun Mumya Boss (1150 can, 32 hasar)
- PC test tuşlarına `4` ve `5` eklendi (`kar.js`: `1..5` ile tüm bölümlere doğrudan geçiş).

## v0.463 — 5./6. Mısır bölümü ayrımı ve 7. Bölüm: Karanlık Bataklık / Sisli Orman
- **5. bölüm (`ZOR_N===4`, Mısır Çölü)**: Anubis köpek (`u_`) yok; Mumya Savaşçı (`d_`), Kadın Mısır Savaşçısı (`w_`) + Firavun Boss (`z_`).
- **6. bölüm (`ZOR_N===5`, Mısır Çölü 2. tur)**: Aynı Mısır Çölü tekrar başlar, bu kez **Anubis (`u_`)** da dahil olur.
- **7. bölüm (`ZOR_N>=6`, Karanlık Bataklık / Sisli Orman)**: Canva ile üretilen bataklık ormanı arka planı (`bataklik_dag.png`, `bataklik_yol.png`, `bataklik_agac0..5.png` — `fx/bataklik/`), ilk ekranda 3 düşman (`o_` Baltalı Bataklık Oduncusu, `v_` Bataklık Avcısı, `c_` Bataklık Canavarı) ve sonda Dev Yosun Lordu Boss (`t_`) (`parca/bataklik/`, `js/bataklik.js`).
- PC test tuşları `1..7` olarak güncellendi (`kar.js`).

## v0.464 — 7./8. Bataklık ayrımı ve 9. Bölüm: Vahşi Batı Kanyonu / Kasaba
- **7. bölüm (`ZOR_N===6`, Karanlık Bataklık)**: Ağaç/balta tutan Oduncu (`o_`) yok; ilk ekranda 3 düşman (`v_`, `c_`) + Dev Yosun Lordu Boss (`t_`).
- **8. bölüm (`ZOR_N===7`, Karanlık Bataklık 2. tur)**: Aynı Bataklık bölümü tekrar başlar, bu kez **Baltalı Bataklık Oduncusu (`o_`)** da gelir.
- **9. bölüm (`ZOR_N>=8`, Vahşi Batı Kanyonu / Kasaba)**: Kızgın gün batımı, kızıl kanyon kayalıkları (`bati_dag.png`), tren raylı tozlu yol (`bati_yol.png`), ahşap salon/su kulesi/kaktüs/fıçılar (`bati_agac0..5.png` — `fx/bati/`, `js/bati.js`) ve 4 yeni düşman (`parca/bati/`):
  - `q_` Kovboy Haydut (altıpatlar tabanca, 210 can)
  - `s_` Kadın Şerif (Winchester tüfek, 190 can)
  - `r_` Altın Madencisi Haydut (kazma, 290 can)
  - `x_` Dev Demir-Ray Kovboy Boss (1500 can, 38 hasar)
- PC test tuşları `1..9` olarak güncellendi (`kar.js`).

## v0.465 — Bölüm varlık klasörleme
- İlk bölüm (1-2. liman) düşman görselleri `www/parca/liman/` altına, karlı bölüm (3-4.) düşman görselleri `www/parca/kar/` altına ve karlı çevre/efekt görselleri `www/fx/kar/` altına taşındı (`ayar.js`, `kar.js`). Ortak oyuncu/varil/efekt dosyaları kök klasörlerde kaldı.

## v0.466 — Silahlı düşman yerleşim ve açı düzeltmeleri
- Yeni düşmanların tamamına (`d_`, `w_`, `u_`, `z_`, `o_`, `v_`, `c_`, `t_`, `q_`, `s_`, `r_`, `x_`) `kalcaUst: true` eklendi (`korsan.js`): bacaklar artık bel/kalça parçasının arkasından çıkar. (`w_` ve `s_` içindeki `kon: 1` kaldırılarak etek/kalça parçası görünür yapıldı.)
- Yeni silahlı düşmanların (`w_`, `v_`, `q_`, `s_`) yatay çizilmiş silahları için `mb: 90` ve sol kenar bilek pivotu (`A.elN`, `mz`, `gb`) ayarlandı; nişan alırken havaya değil doğrudan oyuncunun kafasına doğrulur, gardda `wN: 65` ile doğal açıda durur (`korsan.js`).

## v0.467 — Liman 1. ve 2. bölüm ev/obje ayrımı ve giriş ekranı oranı
- Oyun içi obje boyutları (`cevre.js` `CV_OBJ_BOY`), giriş ekranındaki (`giris.js`) ev-obje oranlarıyla birebir eşleştirildi.
- İlk 2 bölümün evleri ve objeleri benzer olanlar ayrıştırılarak 2 tamamen farklı sete bölündü (`cevre.js`):
  - **1. Bölüm (`ZOR_N===0`):** Evler `yev0, 1, 3, 5`; objeler `tezgah, kasacuval, variller, samanaraba, ilan, balta, bank, cit, cali, fici_cicek, kup`.
  - **2. Bölüm (`ZOR_N===1`):** Evler `yev2, 4, 6, 7`; objeler `kuyu, camasir, yonlevha, saman, saksi, kaya, fici_bitki, teker, cuval, kutuk`.

## v0.468 — Tüm bölümler çok katmanlı (1–2 tarzı) + 2. turlara gece atmosferi
- 3–9. bölümlerin tamamı 1–2. bölümdeki çok katmanlı yapıya geçirildi ([tema.js](file:///D:/Users/CraftC/Desktop/popeyefighter-v0.447/popeyefighter-v0.447/www/js/tema.js)): gökyüzü/ay → uzak dağlar → orta zemin şeridi (`*_zemin.png`) + evler (`ev0..3.png`) + objeler (`obj0..5.png`) ve ağaçlar → yürünen yol.
- Her temanın 1. ve 2. turunda (`2, 4, 6, 8`) evler ve objeler tamamen ikiye ayrılır (hiçbiri ortak değil) ve 2. turlara ay/yıldızlı gece gökyüzü + karanlık atmosfer efekti uygulanır. Tüm yeni görseller `.png` olarak üretildi.

## v0.470 — Paralaks, zıplama kamera tepkisi ve uzayan orta zemin eşitlemesi
- 3–9. bölümlerin arka plan katmanları (`tema.js`) `cevre.js` ile birebir aynı paralaks (`DAG_H`, `EV_H`), zıplama dikey kamera tepkisi (`dagTaban` ve `evTaban` birlikte `S.camY*SC*EV_H` ile iner) ve yürünen yola kadar kesintisiz uzayan orta zemin dolgusuyla eşitlendi. Toplam **9 bölüm** mevcut.

## v0.472 — Eğilerek otomatik ıspanak alma
- Yerdeki ıspanak kutusuna yakınken (`|dx| < 230`) eğilince (`asagiMi()`) oyuncu otomatik olarak kutuya dönüp elini uzatarak (`0.22 sn`) ıspanağı alır ve yer (`ispanak.js`).

## v0.473 — 3–9. Bölüm Görsel & Rig Temizliği, Geniş Orta Zeminler, Demo Koruması ve LOW/HIGH Optimizasyonu
- **Cırt pembe (`#FF00FF`) arka planla yeni el ve geniş orta zemin görselleri (`.png`)**:
  - `g_` (tutan adam) 4 eli (`g_elN/F`, `g_yumN/F`) gövde/kol teniyle birebir aynı tonda yeniden üretildi; `w_elF`, `s_elF`, `q_elF` (ince/orantılı eller) ve `c_elF` (bataklık yakalayıcı pençesi) tek sayfada cırt pembe arka planla üretilip temizlendi (`_kaynak_eller.jpg` referans olarak `www/parca/kar/` içine bırakıldı).
  - 4 tema için 1. bölüm (`zemin.webp`) derinlik ve perspektifinde geniş orta zeminler (`kar_zemin.png`, `misir_zemin.png`, `bataklik_zemin.png`, `bati_zemin.png`) üretildi (`_kaynak_zemin_yeni.jpg` referansları ilgili `www/fx/<tema>/` klasörlerinde) ve `tema.js` doğrudan `ZEM_BOY`/`ZEM_ALT` yerleşimine bağlandı.
  - Vahşi Batı evlerindeki (`bati/ev0..3.png`) veranda içi beyaz cepler, Bataklık kulübelerindeki (`bataklik/ev0..3.png`) sarmaşık/direk arası beyaz cepler, `s_elN.png` tetik içi, `w_elN.png` güneş arası beyazlar ve `bati_dag.png` dikey çizgi hatası temizlendi.
- **3–9. bölüm düşman boyut, el ve poz ayarları (`korsan.js`)**:
  - Küçük kalan düşman boyları (`a_, d_, w_, o_, q_, r_`), iri kalan uzak eller (`u_, d_, z_, v_, o_, t_, r_, x_`), `c_elN` dikey yönü, `t_` boss boyun boşluğu, `u_` bacak/kalça bağlantısı ve `x_` boss bot zemini düzeltildi.
  - Yatay silahlı yakın dövüş düşmanları (`d_, u_, z_, o_, t_, r_, x_`) gardda silahı kendi yüzüne sokmak yerine öne hazır tutar.
- **Menü / Yetenek Önizlemesi (`DEMO`) kesin geri dönüş koruması (`demo.js`, `dongu.js`, `menu.js`, `yetenek.js`, `kombo.js`, `giris.js`, `ayar.js`)**:
  - `demoKaydet/demoGeri` artık tüm durum ve dizileri (`CESET, ADKD, ISP_Y, BCK, SUC, ENPOS, ZM, SC`) korur; `agacAcik` kapalıyken `DEMO` her karede otomatik kapatılır.
  - `oyunKurtar()` ve `boyut()` sıfır-ekran koruması ile mobilde boyut/demo/menü geçişlerinde `S.camY`/`SC`/`ZM` bozulması veya oyuncu/düşmanların kaybolması engellendi; `blade` çiziminin arka plan altında silinme hatası düzeltildi.
- **Grafik seviyesi (LOW vs HIGH) ciddi performans iyileştirmesi (`ayar.js`, `tema.js`, `cevre.js`, `dongu.js`, `efekt.js`, `hud.js`, `korsan.js`)**:
  - `GR_DPR = [0.75, 1.25, 2]` (LOW mod HIGH'a göre ~7 kat daha az piksel işler).
  - LOW modda (`GR===0`): dekoratif orta-plan objeleri (`objeler` / `CV_OBJ`), kan, kıymık/taş, kar zemini sütun ezme hesabı, gökyüzü/gece gradyanları, fener/su efektleri, bar camı ve XP dalga animasyonu kapatılır; kalıcı ceset sınırı `12`'ye düşürülür.
  - Tüm modlarda `tema.js`, `dongu.js` ve `cevre.js` içindeki her kare `createLinearGradient` çağrıları önbelleğe alındı.


## v0.474 — 3 Boss'un Alt Bacak Çift Ayakkabı Temizliği
- `x_bacak.png` (Vahşi Batı Boss), `z_bacak.png` (Mısır Firavun Boss) ve `t_bacak.png` (Bataklık Yosun Lordu Boss) görsellerinin altındaki fazladan ayakkabı/ayak kısmı kırpıldı ve [korsan.js](file:///D:/Users/CraftC/Desktop/popeyefighter-v0.447/popeyefighter-v0.447/www/js/korsan.js#L234-L260) içinde `ak`/`A.bacak`/`A.bot`/`bel` bağlantıları gerçek bot görseline tam oturacak şekilde ayarlandı.

## v0.475 — Dalga (arena) sistemi, kamera, ceset, baştan sona optimizasyon
- **Dalga sistemi (tüm bölümler, `dusman_kur.js` `AR`, `dalgaKur`, `arGuncelle`):** bölümün düşmanları soldan sağa en çok 4'lük dalgalara bölünür (1. bölümde ilk iki dalga 2 ve 3 kişi). Dalgalar 4000 birim arayla (`AR_MESAFE`), ilki x=3800'de; dalga içi aralık 400 (`AR_ARA`). Kancacı dalganın en önünde durur.
  - Oyuncu dalga alanına girince kamera kilitlenir (`AR.kilit`): geri gidilir, ileri gidilmez (sağda görünmez duvar: ekranın sağ kenarından 230 birim içeride, `AR_DUVAR`). Dalganın düşmanları da alandan çıkamaz. Dalgadaki herkes ölünce kilit açılır.
  - Kilit açılınca sağda (biraz altta) sarı ok yana yana kayarak çıkar (`#ileri`, `ui/ileri.webp`, `arOk`): oyuncu 1000 birim ilerleyince (en az 2.5 sn) kaybolur.
  - Kamera artık ayrı değişken: `KX` (ayar.js). Kilitteyken durur, oyuncu ekranda serbest dolaşır. Kilit açıldıktan sonra oyuncu ekranın sağ yarısının %45'ini geçince kamera yumuşakça (0.85 sn'lik yay) oyuncuyu ortalar ve sonraki dalgaya kadar izler. **Çizimde `S.x` değil `KX` kullanılır** (`(x-KX)*SC`).
  - Boss: son dalga bitince `AR.bossX` (son dalga + 4600) noktasında çıkar (eski sabit `BOSS_X=42000` yalnız çevre uzunluğu için kaldı); boss alanı da kilitli.
  - Yetenek önizlemesi (DEMO) ve öğretici dalga sistemini etkilemez (`demoKaydet` `KX` ve `AR`'ı saklar).
- **Cesetler:** siyah beyaz yerde 5 sn kalır (`CESET_SURE`), sonra 1.4 sn'de (`CESET_SON`) yavaşça kaybolur ve belleği bırakılır (`cesetBirak`). Yerde kalan (`e.kal`) ölüler de aynı.
- **Optimizasyon (ayrıntı CLAUDE.md "DOKU"):**
  - Görseller artık ekran çözünürlüğüne küçültülmüş kopyalarından çizilir (`dk`); koyu/soluk/siyah beyaz hâller bu küçük kopyadan türetilir (eskiden ~200 tam boy tuval vardı). Doku belleği telefonda ~280 MB → 10-35 MB.
  - Tema bölümlerinin (kar, mısır, bataklık, batı) düşman ve arka plan görselleri yalnız o bölüme gelince yüklenir (`PAKET`, `paketYukle`); bölüm değişince kısa YÜKLENİYOR… yazısı çıkar, eski temanın kopyaları bırakılır.
  - Yükleme ekranı bitmeden kopyalar hazırlanır, grafik belleğine yüklenir ve sahne 3 kez boşa çizilir (`bolumHazirla`, `isit`): oyun ilk karede takılmaz. BAŞLA'da ve uygulamaya geri dönünce oyun tuvali baştan kurulur (`tuvalYenile`).
  - Boşa boyama azaltıldı: gökyüzü yalnız dağın tabanına kadar, toprak dolgusu denize/zemine kadar, denizin altına mavi boyanmaz, temalarda gök iki kez boyanmaz; tuval `alpha:false`.
  - Grafik seviyeleri: yüksek 2x, orta 1.35x, düşük 1x çözünürlük (`GR_DPR=[1,1.35,2]`; eski 0.75 / 1.25 / 2). Düşükte bulanıklık yok; içerik farkları v0.440/v0.474'teki gibi. Ceset sınırı 24 / 16 / 10.
  - Ölçüm (başsız Chromium, Pixel 7 yatay, 4x işlemci kısıtı, yüksek grafik): kare başına ana iş parçacığı süresi ~115 ms → 1.5-7 ms. Gerçek telefonda ölçülmedi.
- Düzeltme: yetenek önizlemesi `BCK` sabitine atama yaptığı için sessizce bozuluyor, ağaç kapanınca düşmanlar baştan kuruluyordu (v0.474 hatası).

## v0.482 — `v0.476` Eski İskeletli Düşman Sistemine Dönüş + Boss Ekranı Kısayolları
- `v0.477–v0.480` arasında denenen kare-kare (frame-by-frame) düşman ve boss sistemi kaldırıldı; tüm bölümlerde `v0.476` durumundaki orijinal iskeletli/eklem parçalı düşman ve boss sistemi görselleriyle birlikte birebir geri getirildi.
- `v0.481`'deki tarayıcı PC test kısayolları korundu (`kar.js`): `1–9` ilgili bölümü baştan başlatır; aynı rakama ikinci basış, `0` tuşu ya da `Shift + 1–9` direkt o bölümün Boss karşılaşmasına ışınlar (`bossGit`).

## v0.483 — Tüm Bölümlerde Ayak-Bacak Sırası, Çift El/Omuz Temizliği ve Ters El Düzeltmeleri
- **Ayak–bacak sırası (`korsan.js` `kBacak`):** `bf:true` kaldırıldı; artık tüm 22 düşman ve boss'ta **her ayak (`bot`) kendi alt bacağının (`bacak`) arkasında** çizilir.
- **Ön kolda çift el / bilek manşeti temizliği:** `w_on.png`, `u_on.png`, `c_on.png` ve `x_on.png` altındaki gömülü ikinci yumruklar, `s_elF.png` üstündeki beyaz gömlek manşeti ve `w_elF.png` / `q_elF.png` fazla bilek payları temizlendi; 5–9. bölüm karakterlerinde bilek kökü ön kol zırhının (`on`) içine alındı, göğüs önüne taşan uzak omuz (`omF`) derinlikleri içeri çekildi ve `c_` bataklık canavarının açık boyun boşluğu kapatıldı.
- **Yeşil Bataklık Canavarı (`c_`):** Uyumsuz açık yeşil karşı el (`c_elF.png`) silindi; avuç içi kameraya bakan yosunlu pençe `c_elF.png`'ye taşındı, yakın kol (`c_elN.png`) için gövde dokusuyla birebir uyumlu dış-sırt pençe üretildi.
- **Ters yakın eller (`elN` / `a_elF` — el sırtı/boğumlar kameraya bakacak şekilde toplu yenileme):** `m_elN.webp`, `a_elF.png`, `y_elN.webp`, `d_elN.png`, `u_elN.png`, `z_elN.png`, `c_elN.png`, `o_elN.png`, `t_elN.png`, `s_elN.png`, `r_elN.png` ve `x_elN.png` sıfır kenar beyazlığıyla yenilendi ve bilek/silah ucu noktaları kalibre edildi.

## v0.484 — Görsel temizlik, boss'lara özel mekanikler, güç ve XP dengesi
- **Çift el / oturmayan el düzeltmeleri (5–9. bölüm):**
  - Silahlı yakın dövüşçülerde (`d_, u_, z_, o_, t_, r_, x_`) boş el gardda silahlı elin hemen altında duruyordu (iki el üst üste görünüyordu): boş el artık göğüs hizasında yumruk gardında (`korsanPoz`, `uF:-52, rF:-100`).
  - `z_on.png` (Firavun) ve `t_on.png` (Yosun Lordu) ön kollarının ucundaki gömülü ikinci yumruk kırpıldı; iki boss'ta el ön kolun üstüne çizilir (`eo:true`).
  - Bataklık canavarının yakın pençesi (`c_elN.png`) uzak pençeyle aynı yosun tonuna getirildi.
  - Yatay silahlı nişancılar (`w_, v_, q_, s_`; `yatSil`) dipçiği artık silahı tuttukları yakın kolla vurur (eskiden boş kol savruluyor, silah yüzün önünde kalıyordu). Kadın Şerif nişan alırken boş eliyle tüfeği alttan destekler.
- **Her boss'un kendi özelliği (`js/boss.js`: `bossKontrol`, `bossGuncelle`, `bossPoz`, `bossFxCiz`, efektler `BFX`):**
  - 1 Kaptan: tabanca · 2 Kılıç Ustası: çevik kaçış · 3–4 Buz Lordu: yakalayıp çekiçle vurma (değişmedi).
  - 5–6 **Firavun (`z`)**: 560–1900 uzaklıkta çekici yere vurup **şok dalgası** yollar (1500 hız, 1900 yol, hasar `dm×0.6`; üstünden zıplanır; 4.5–6.5 sn'de bir). Canı %66 ve %33'e inince **2 mumya çağırır** (110 can, 16 hasar, en çok 4; Firavun ölünce dağılırlar).
  - 7–8 **Yosun Lordu (`t`)**: 4 sn vurulmazsa saniyede maks. canının %1.2'si **iyileşir**. Oyuncunun ayağının altından **kök** çıkarır (0.9 sn önce yer kararır, hasar `dm×0.5`, havaya atar; canı yarının altında 3 kök birden; 5–6.5 / 3.2–4.7 sn'de bir).
  - 9 **Demir Şerif (`x`)**: 650–2800 uzaklıkta 0.7 sn hazırlanıp **hücum** eder (2500 hız, hasar `dm×0.9`, fırlatır; üstünden zıplanır). Iskalayıp duvara çarparsa 1.7 sn **sersemler**. Canı %35 altında **öfkelenir** (vuruş süresi 0.72, yürüme 1.35 kat, hücum 4–6 sn'de bir; normalde 6–8).
  - Özel saldırılar blokla yarıya iner ve fırlatmaz. Boss barı ve geliş yazısı her boss'un kendi adı/ipucu (`bb_*`, `bg_*`; eskiden hepsinde KAPTAN / KILIÇ USTASI yazıyordu).
- **Güç dengesi:**
  - Zorluk çarpanı ikiye ayrıldı: can `ZK()=1.1^bölüm` (en çok 4, aynı), **hasar `ZKD()=1.06^bölüm`** (en çok 2.5). 9. bölümde hasar ×2.14 yerine ×1.59.
  - 3–9. bölüm düşmanlarının temel hasarı ~%18 indi: `a`19 · `n`17/mermi 20 · `g`21 · `d`18 · `w`16/20 · `u`22 · `o`22 · `v`18/21 · `c`23 · `q`19/22 · `s`18/21 · `r`23. Yeni nişancıların atış arası 2.4–4 sn (eski 1.8–3.2).
  - Sıra: boss olmayan düşmanlar vuruşa en az 0.35 sn, nişana en az 0.8 sn arayla başlar (aynı anda 3-4 vuruş yok). Vuruş beklerken her düşman kendi mesafesine (menzilin %70–100'ü) kadar sokulur: üst üste durmazlar.
- **XP:** yeni düşmanlar güçlerine göre XP verir (`XP_T`): `d`24 · `w`20 · `u`30 · `v`22 · `c`32 · `o`28 · `q`24 · `s`22 · `r`32 (eskiden hepsi 10–15'ti; 5. bölüm 4. bölümden az XP veriyordu). Bölüm çarpanı `1.5^bölüm` aynı.

## v0.485 — Bölüm müzikleri, boss müziği, büyücü kadının ateş büyüsü
- **Her bölümün kendi döngü müziği** (hepsi CC0 / kamu malı, OpenGameArt.org; atıf zorunlu değil). Mono 72 kbps, uzunlar 80 sn'ye kırpıldı (baş/son yumuşak geçiş):
  - 1 liman `m_b1`: "Pirate Game Tune" · 2 liman `m_b2`: "Pirate's Orchestra"
  - 3 kar `m_b3`: "Icy Heights" (theme-loop) · 4 kar gece `m_b4`: "Snow Theme" (yavaş döngü)
  - 5 Mısır `m_b5`: "Desert theme" (caravan) · 6 Mısır gece `m_b6`: "Desert_mystic" (Polygondan)
  - 7 bataklık `m_b7`: "Tarlite Swamplands 7" · 8 bataklık gece `m_b8`: "Swamp Theme Loop"
  - 9 Vahşi Batı `m_b9`: "Spaghetti Western"
  - Boss `m_boss`: "Epic Boss Battle [Seamlessly Looping]" (Juhani Junkala) — Buz Lordu, Firavun, Yosun Lordu, Demir Şerif. Kaptan `bgm_silah`, Kılıç Ustası `bgm_kilic` (eski müzikleri).
- Müzik o bölüme gelince indirilir, başka bölümünki bellekten çıkar; hazır olana kadar eski ortam müziği (`bgm_ambient`) çalar.
- **Büyücü kadın (`w_`, 5–6. bölüm):** asasından ateş büyüsü atar (`parca/misir/w_buyu.webp`, ses `ses/buyu.mp3`, mermi hızının %80'i; hasar aynı). Silah patlama efekti, tabanca hazırlık ve patlama sesi bu karakterde yok.

## v0.486
- AAB sürümü (v0.484 + v0.485 içeriği); kod değişikliği yok.

## v0.487 — Kırık bilek düzeltmesi (5–9. bölüm)
- Silahlı el görsellerinde bilek belli bir açıyla çizilmiş; pozlar eli başka açıya (ör. gardda 68°, yumrukta -6°) döndürdüğü için el ön kola kırık bağlanıyordu.
- Artık her karakterin kendi bilek açısı var (`KSK.x.wb`): `d`20 · `u`20 · `z`40 · `o`10 · `t`25 · `r`27 · `x`22 · `c`0; nişancılar (`w, v, q, s`) 90. El hep ön kolun devamı olur; poz bileği yakın elde en çok ±10°, uzak elde ±15°, nişancıda 70–100° arasında oynatır (`kKol`).
- Sonuç: yakın dövüşçüler gardda silahı dik tutar, nişancıların silahı kolun doğrultusunda durur.

## v0.488 — Kol devamlılığı (dirsek + bilek) ve ayak sırası (5–9. bölüm)
- **Kol ekseni:** üst kol ve ön kol görsellerinde kolun orta çizgisi dik değildi (ör. Firavun üst kol 14 px, bataklık avcısı ön kol 28 px kayık); dirsekte ve bilekte parçalar yana kayıyordu. Her parçanın orta çizgisi görselden ölçüldü (`KOL_X`), parça eklemden ekleme dümdüz gelecek şekilde çevriliyor: üst kol → ön kol → el aynı doğrultuda devam eder.
- **Nişancı bilekleri:** bilek açıları görsele göre düzeltildi (`w`51 · `v`73 · `q`90 · `s`47) ve el noktaları bilek köküne taşındı (`w, v, q, s` + `x`, Firavun'un uzak eli). Nişan alırken kol, silahın bilekle yaptığı açı kadar aşağıdan uzanır; silah yine oyuncunun kafasına bakar (büyücü asayı, şerif tüfeği bel hizasından doğrultur).
- **Ayak sırası:** 5–9. bölüm karakterlerinde ayak artık bacağın önünde çizilir (v0.483'te arkaya alınmıştı). İlk 4 bölümün karakterleri değişmedi.

## v0.489 — Kullanıcının işaretlediği düzeltmeler (5–9. bölüm)
- **Ayakkabı kesimi:** ayak artık bacağın önünde olduğu için konç kısmı bacağın üstüne biniyordu; `w, v, q, s, r, x` ayak görselleri bilek hizasından (sarı çizgi) kesildi.
- **Kalça kesimi:** madenci (`r_kalca`) ve bataklık canavarı (`c_kalca`) kalça parçasının alt kısmı ortası sarkık eğriyle kesildi.
- **Bacaklar geri:** Demir Şerif, kadın şerif, bataklık avcısı ve kovboyda bacak kökleri 14 birim geri alındı (`kN/kF`).
- **Omuz:** Firavun'un yakın omzu aşağı-öne (`omN -80,-177`; çıkık duruyordu), kovboyun omzu aşağı (`omN -80,-170`).
- **Eller:** mumyanın silahlı eli bilekten ileri alındı; kovboyun boş eli 30° yukarı çevrildi (`wbF`); kadın şerifte bilek 62° (tüfek ve kol daha yukarıda/ileride).
- **Vuruş:** silahlı yakın dövüşçüler vuruş anında bileği de savurur (silah en çok +30° aşağı iner).

## v0.490 — İkinci tur işaretli düzeltmeler (5–9. bölüm)
- **Firavun:** silahlı el %15 büyük (`elS`), bilek 32° (çekiç biraz yukarı), el ön kolun altında çizilir.
- **Vuruşta bilek:** silahlı yakın dövüşçülerde vuruş anındaki bilek savurması azaltıldı (en çok +5°; v0.489'da +30° idi).
- **Oduncu:** yakın kol eliyle birlikte 12 birim öne (`omN`). **Yosun Lordu:** bacak arası açıldı (`kN 36`, `kF -32`).
- **Kovboy:** eller ön kolun önünde çizilir (`eo`), boş elin çevirmesi kaldırıldı, iki el bilek hizasına oturtuldu.
- **Madenci:** kalça kesimi azaltıldı (arka-orta kısım geri geldi).
- **Bacak/ayak:** Demir Şerif, bataklık avcısı ve kovboyda bacaklar 10 birim daha geri; Demir Şerif ve kadın şerifte ayaklar bacağın ucuna hizalandı (10–12 birim geri).
- **Nişan (bilek kırılmaz):** silahın bilekle açı yaptığı nişancılarda (büyücü, bataklık avcısı, kadın şerif) bilek doğal açıda kalır, dirsek bükülüp geride durur (`eb = bo×1.4`); silah bel hizasından yine oyuncunun kafasına doğrultulur. Kadın şerifte bilek 47°'ye geri alındı.

## v0.491
- Kafa oturması: Mısırlı kadın (`w`) gövdesinde boyun yok (gövdede yaka boşluğu var, boyun ve gerdanlık kafa görselinde): kafa 20 birim aşağı (`boyun 14,-210`). Demir Şerif (`x`) kafası 14 birim öne, 23 birim aşağı (`boyun 32,-292`).

## v0.492
- Mısırlı kadın kafası gerdanlığı gövdedeki yakaya oturacak şekilde aşağı ve geri (`boyun -8,-180`); Demir Şerif kafası biraz daha aşağı (`boyun 32,-274`).

## v0.493
- Mısırlı kadın omuzları aşağı (kafa inince kollar yüksek kalmıştı): yakın omuz `omN -74,-155`, arka omuz aşağı ve öne `omF 50,-154`.

## v0.494
- Mısırlı kadın: ayaklar %15 küçük (`botS 0.85`, yeni ayar: ayak görseli ölçeği, `bh` buna göre 100), bacak parçaları arası açılarak uzadı (uyluk 158→172, alt bacak 160→176; görsellerde diz payı yetiyor), toplam boy ~30 birim arttı.

## v0.495
- Mısırlı kadın: ayak bilek alt bacak kalınlığında olacak şekilde küçüldü (`botS 0.62`), uyluk kalınlaştı (`uyW 1.36`, yeni ayar: uyluk görselinin en ölçeği) ve dizde alt bacağın üst köşesini örttüğü için yürürken diz kırık görünmüyor. Uyluk 166.

## v0.496
- Madenci (`r`) kalçası 14 birim öne. Kovboy (`q`) ve Demir Şerif (`x`) arka bacak kökü 16 birim öne (kalçanın içinden çıkar). Demir Şerif ve kapüşonlu bataklık avcısının (`v`) alt bacak görseli 8° saat yönü tersine çevrildi (`bR`, yeni ayar: alt bacak görselini dikleştirme açısı), alt bacak dik durur.

## v0.497
- AAB sürümü (v0.487–v0.496 içeriği); kod değişikliği yok.
