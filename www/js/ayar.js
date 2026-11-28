'use strict';
// Ayarlar, sürüm, görsel yükleyici, ekran boyutu, oyuncu durumu (S)
// ---------- Görseller: hepsi tek yükleyiciyle; tamamı inince oyun başlar ----------
const OYUN_SURUM='v0.496';      // ekrandaki sürüm (her değişiklikte artar)
document.getElementById('surum').textContent=OYUN_SURUM;
const SURUM='?v=157';                 // görsel değişince artır: tarayıcı eski önbelleği kullanmasın
const KP=['kafa','govde','kalca','ust','on','elN','elF','uy','bacak','bot'];      // korsan parça seti (k: yumruklu, b: bıçaklı, p: tabancalı kaptan)
const ADLAR=['el_isp_n','el_isp_f','kalca','ustkol','onkol','onkol2','uyluk','altpan','bacak_bot','el_yum','el_yum_f','el_ac_n','el_ac_f','el_pN','el_pF']
  .concat([...Array(11).keys()].map(i=>'govde'+i));
const RES=2;                       // oyuncu parçaları oyun biriminin 2 katı çözünürlükte
const R={},YUZY=[],YUZ=[],YUZA=[],KARI=[],KANI=[],TASI=[],KIYI=[];      // YUZ: can kademesi yüzleri (0 tam can … 10 ölü), YUZA: darbe tepkisi yüzleri, KARI: kar taneleri, KANI: kan efektleri
// ---------- DOKU (v0.475): her görselin ekran çözünürlüğüne küçültülmüş kopyası ----------
// Eskiden görseller tam boy çizilirdi (telefonda ekrandaki boyun 3-10 katı piksel) + her koyu/soluk kopya ayrı tam boy tuvaldi: bellek doluyor, ilk çizimde takılıyordu.
// Artık oyunda HİÇBİR görsel doğrudan çizilmez: dk(görsel, oran) o görselin ekrana göre küçültülmüş hafif kopyasını (ImageBitmap) verir. Kopya arka planda (iş parçacığında) hazırlanır,
// yükleme ekranı bitmeden hepsi hazır olur. oran = 1 kaynak pikseli ekranda kaç cihaz pikseli. Koyu / soluk / siyah beyaz hâller küçük kopyadan türetilir (koyult, soluk, dkGri).
// KURAL: yeni çizim eklerken ctx.drawImage(görsel…) yazma; dk / dkh / dkw ile al ve hedef boyu mutlaka ver (kopyanın pikseli asıl görselden küçüktür).
let DK_KO=0,DK_OY=0.5,DK_IS=0,DK_AKT=0,DK_CIB=typeof createImageBitmap==='function';      // DK_KO: dünya birimi → cihaz pikseli (en yakın zoom); DK_OY: oyuncu parçalarının oranı; DK_IS: hazırlanmakta olan kopya sayısı
const DK_PAY=1.12,DK_TAM=0.9,DK_L=new Set(),DK_SIRA=[],DK_TUR=[],DK_CB=[];      // DK_PAY: netlik payı; DK_TAM: bu orandan büyükse tam boy kopya; DK_L: kopyası olan görseller; DK_TUR: türev (koyu/soluk) tanımları
function dkKapat(b){      // kopyayı ve ondan türeyenleri bellekten bırakır
  if(!b)return;const v=b._v;b._v=null;if(v)for(const k in v)dkKapat(v[k]);
  if(b._g){const g=b._g;b._g=null;dkKapat(g)}
  try{if(b.close)b.close();else if(b.getContext)b.width=b.height=0}catch(_){}
}
function dkTuval(im,tw,th){const c=document.createElement('canvas');c.width=tw;c.height=th;const x=c.getContext('2d');if('imageSmoothingQuality' in x)x.imageSmoothingQuality='high';x.drawImage(im,0,0,tw,th);return c}
function dkKucult(im,tw,th,tam){      // küçültülmüş kopya (söz): önce dosyadan arka planda (ana iş parçacığı takılmaz), olmazsa görselden, o da olmazsa tuvalle
  const sec=tam?undefined:{resizeWidth:tw,resizeHeight:th,resizeQuality:'high'};
  const elden=()=>DK_CIB?createImageBitmap(im,sec).catch(()=>dkTuval(im,tw,th)):Promise.resolve(tam?im:dkTuval(im,tw,th));
  if(!DK_CIB||!im.src||typeof fetch!=='function')return elden();
  return fetch(im.src).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(bl=>createImageBitmap(bl,sec)).catch(elden);
}
function dkPompa(){while(DK_AKT<4&&DK_SIRA.length){DK_AKT++;DK_SIRA.shift()().then(()=>{DK_AKT--;dkPompa()})}}      // aynı anda en çok 4 kopya hazırlanır (bellek tepe yapmaz)
function dkYap(im,r){
  let d=im._d;if(!d){d=im._d={b:null,ir:0,ist:0,is:false,sr:0};DK_L.add(im)}
  if(d.is){if(r>d.sr)d.sr=r;return d}
  const w=im.width,h=im.height;if(!w||!h){d.b=im;d.ir=9;return d}
  const hr=r*DK_PAY,tam=hr>=DK_TAM;d.ist=r;
  if(tam&&d.ir>=9&&d.b)return d;
  d.ir=tam?9:r;d.is=true;d.sr=0;DK_IS++;
  const tw=Math.max(1,Math.round(w*hr)),th=Math.max(1,Math.round(h*hr));
  DK_SIRA.push(()=>dkKucult(im,tw,th,tam).then(b=>{if(im._d!==d){if(b!==im)dkKapat(b);return}const e=d.b;d.b=b;if(e&&e!==im&&e!==b)dkKapat(e)},()=>{if(!d.b)d.b=im})
    .then(()=>{d.is=false;DK_IS--;if(im._d===d&&d.sr>d.ir*1.1)dkYap(im,d.sr);if(!DK_IS&&DK_CB.length){const L=DK_CB.splice(0);for(const f of L)try{f()}catch(_){}}}));
  dkPompa();return d;
}
function dk(im,r){      // çizilecek kaynak: hazırsa küçük kopya, değilse (yalnız hazırlanana kadar) asıl görsel. Daha büyük oran istenirse arka planda yenisi hazırlanır, o zamana kadar eldeki çizilir
  if(!im)return im;
  if(im.ana)return dkTur(im,r);
  const d=im._d;
  if(!d)return dkYap(im,r).b||im;
  if(r>d.ir*1.1)dkYap(im,r);
  return d.b||im;
}
const dkh=(im,h)=>dk(im,h*DPR/im.height);      // ekranda h piksel (CSS) boyunda çizilecek görsel
const dkw=(im,w)=>dk(im,w*DPR/im.width);       // ekranda w piksel (CSS) eninde çizilecek görsel
const dkVar=im=>{const a=im&&(im.ana||im),d=a&&a._d;return !!(d&&d.b)};      // kopyası hazır mı
function dkOn(im,r){if(!im)return;const a=im.ana||im,d=a._d;if(!d||r>d.ir*1.1)dkYap(a,r)}      // önceden hazırlat (yükleme ekranında)
function dkBekle(f){if(!DK_IS)f();else DK_CB.push(f)}      // bütün kopyalar hazır olunca çağırır
function dkBm(v,k,c){if(DK_CIB)createImageBitmap(c).then(bm=>{if(v[k]===c){v[k]=bm;c.width=c.height=0}else bm.close()},()=>{})}      // türev tuvali hafif resme çevir (çok sayıda küçük tuval telefonu yavaşlatır)
function dkTur(p,r){      // türev (koyu / soluk) kopya: küçük kopyadan bir kez üretilir
  const a=p.ana,b=dk(a,r);if(!b||(b===a&&a._d&&!a._d.b))return b;      // asıl kopya daha hazırlanıyor: o ana kadar düz hali
  const v=b._v||(b._v={});let c=v[p.vk];if(c)return c;
  try{c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');
    if(p.sol&&'filter' in x)x.filter='saturate('+p.sol+')';
    x.drawImage(b,0,0);
    if(p.al){if('filter' in x)x.filter='none';x.globalCompositeOperation='source-atop';x.fillStyle='rgba(40,35,60,'+p.al+')';x.fillRect(0,0,c.width,c.height)}
  }catch(_){return b}
  v[p.vk]=c;dkBm(v,p.vk,c);return c;
}
function dkGri(b){      // siyah beyaz kopya (ölü düşman): küçük kopyadan bir kez üretilir
  if(!b||(b._d&&b._d.b!==b))return b;
  let g=b._g;if(g)return g;
  try{const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');if(!('filter' in x))return b;
    x.filter='grayscale(1)';x.drawImage(b,0,0);b._g=c;dkBm(b,'_g',c);return c}catch(_){return b}
}
function dkTurHazir(){for(const p of DK_TUR)if(dkVar(p))dkTur(p,0)}      // hazır kopyaların koyu/soluk türevlerini önceden üret
function dkOlcekle(f){      // ekran / grafik seviyesi değişti: kopyalar yeni çözünürlüğe göre arka planda yenilenir (o ana kadar eldekiler çizilir)
  for(const im of DK_L){const d=im._d;if(d&&d.ist>0&&!d.is)dkYap(im,d.ist*f)}
}
function paketBirak(ad){      // başka bölüm paketlerinin kopyaları bellekten bırakılır (görsel dosyası kalır, o bölüme dönülünce kopya yeniden hazırlanır)
  for(const im of DK_L)if(im._pk&&im._pk!==ad){const d=im._d;im._d=null;DK_L.delete(im);if(d&&d.b&&d.b!==im)dkKapat(d.b)}
}
function koyult(img,al=.28){            // arka taraftaki uzuvlar için hafif koyu kopya (tanım: asıl çizim küçük kopyadan türetilir)
  if(!img)return img;const p={ana:img,al,vk:'k'+al,width:img.width,height:img.height};DK_TUR.push(p);return p;
}
let kalan=0,YUK_TOP=0,YUK_BIT=0,YUK_PK='';const YUK_CB=[];      // YUK_TOP/YUK_BIT: açılıştaki yükleme için toplam / biten görsel; YUK_PK: o an yüklenen bölüm paketi
function soluk(im,d=0.85){      // arka plan öğeleri: doygunluk %15 az (tanım: küçük kopyaya bir kez uygulanır, her karede filtre yok)
  if(!im)return im;const p={ana:im,sol:d,vk:'s'+d,width:im.width,height:im.height};DK_TUR.push(p);return p;
}
function yukBitti(){if(!gorselHazir.ok)gorselHazir();const L=YUK_CB.splice(0);for(const f of L)try{f()}catch(_){}}
function yukle(src,al){
  kalan++;YUK_TOP++;const pk=YUK_PK;let dene=0;
  const bas=()=>{const im=new Image();if(pk)im._pk=pk;
    // v0.475: görsel burada çözülmez (decode yok): pikseller küçük kopya hazırlanırken arka planda çözülür, tam boy hali belleğe hiç girmez
    im.onload=()=>{YUK_BIT++;try{al(im)}catch(_){}if(--kalan===0)yukBitti()};
    im.onerror=()=>{if(dene++<2){setTimeout(bas,400*dene);return}document.getElementById('yuk').textContent=dil('yuk_hata',src);YUK_BIT++;if(--kalan===0)yukBitti()};      // 2 kez yeniden denenir; yine olmazsa oyun o görselsiz açılır (yükleme takılı kalmaz)
    im.src=src+SURUM};
  bas();
}
// ---------- Bölüm paketleri (v0.475): her temanın düşman ve arka plan görselleri o bölüme gelince yüklenir (açılış hızlı, bellek az) ----------
const PAKET={};      // ad → {f:[yükleyiciler], d: 0 yok / 1 yükleniyor / 2 hazır, q:[düşman önekleri]}
function paketEk(ad,f,q){const p=PAKET[ad]||(PAKET[ad]={f:[],d:0,q:[]});p.f.push(f);if(q)p.q=p.q.concat(q)}
const paketAd=n=>n<2?'':n<4?'kar':n<6?'misir':n<8?'batak':'bati';      // bölüm (0 tabanlı) → paket; 1-2. bölüm (liman) ortak pakette
function paketYukle(ad,cb){
  const p=PAKET[ad];if(!ad||!p||p.d===2){if(cb)cb();return}
  if(cb)(p.cb||(p.cb=[])).push(cb);
  if(p.d===1)return;p.d=1;
  YUK_PK=ad;for(const f of p.f)try{f()}catch(_){}YUK_PK='';
  const bit=()=>{if(kalan>0){YUK_CB.push(bit);return}p.d=2;p.q.forEach(setKur);const L=p.cb||[];p.cb=null;for(const c of L)try{c()}catch(_){}};
  bit();
}
const PNG_EL=new Set(['a_elF','n_elF','g_elN','g_elF','g_yumN','g_yumF','y_elF']);
ADLAR.forEach(a=>yukle('parca/'+a+'.webp',im=>R[a]=im));
const LIMAN_Q=['k_','b_','p_','h_','m_','f_'];
LIMAN_Q.forEach(q=>KP.concat(['vur','ahh','ser']).forEach(n=>yukle('parca/liman/'+q+n+'.webp',im=>R[q+n]=im)));
['k_','b_','m_','f_'].forEach(q=>yukle('parca/liman/'+q+'aci.webp',im=>R[q+'aci']=im));
['p_mermi','p_ates','h_elB','h_kanca','h_zincir','h_alt','f_ates'].forEach(a=>yukle('parca/liman/'+a+'.webp',im=>R[a]=im));
const KAR_Q=['a_','n_','g_','y_'];
paketEk('kar',()=>{KAR_Q.forEach(q=>KP.concat(['vur','ahh','ser','aci']).forEach(n=>{const a=q+n;yukle('parca/kar/'+a+(PNG_EL.has(a)?'.png':'.webp'),im=>R[a]=im)}));
  ['g_yumN','g_yumF'].forEach(a=>yukle('parca/kar/'+a+(PNG_EL.has(a)?'.png':'.webp'),im=>R[a]=im))},KAR_Q);
const MISIR_Q=['d_','w_','u_','z_'];
paketEk('misir',()=>yukle('parca/misir/w_buyu.webp',im=>R.w_buyu=im));      // büyücü kadının ateş büyüsü (v0.485)
paketEk('misir',()=>MISIR_Q.forEach(q=>KP.concat(['vur','ser']).forEach(n=>yukle('parca/misir/'+q+n+'.png',im=>R[q+n]=im))),MISIR_Q);
const BATAK_Q=['o_','v_','c_','t_'];
paketEk('batak',()=>BATAK_Q.forEach(q=>KP.concat(['vur','ser']).forEach(n=>yukle('parca/bataklik/'+q+n+'.png',im=>R[q+n]=im))),BATAK_Q);
const BATI_Q=['q_','s_','r_','x_'];
paketEk('bati',()=>BATI_Q.forEach(q=>KP.concat(['vur','ser']).forEach(n=>yukle('parca/bati/'+q+n+'.png',im=>R[q+n]=im))),BATI_Q);
['v_varil',...[...Array(14).keys()].map(i=>'v_c'+i),'v_h0','v_h1','v_h2'].forEach(a=>yukle('parca/'+a+'.webp',im=>R[a]=im));      // varil ve kırılınca saçılan parçaları (tahtalar, demir halkalar)
yukle('parca/spinach.png',im=>R.isp=im);yukle('parca/spinach-empty.png',im=>R.ispB=im);      // ıspanak kutusu (dolu / boş)
yukle('parca/blade.png',im=>R.blade=im);      // blade: bıçak atlama / yerdekine atlama için bıçak görseli
for(let i=0;i<11;i++)yukle('yuz/yuz'+i+'.webp',im=>YUZ[i]=im);
for(let i=0;i<10;i++)yukle('yuz/yuzA'+i+'.webp',im=>YUZA[i]=im);
for(let i=0;i<11;i++)yukle('yuz/yuzY'+i+'.webp',im=>YUZY[i]=im);      // ıspanak yerken ağzı açık yüzler (can kademesine göre)
for(let i=3;i<=6;i++)yukle('fx/kan'+i+'.webp',im=>KANI[i]=im);
for(let i=0;i<3;i++)yukle('fx/kar/kar'+i+'.webp',im=>KARI[i]=im);      // küçük kar topakları (adım, iniş, saçılma)
for(let i=0;i<4;i++)yukle('fx/tas'+i+'.webp',im=>TASI[i]=im);      // küçük taşlar (düşme, patlama)
for(let i=0;i<4;i++)yukle('fx/kiymik'+i+'.webp',im=>KIYI[i]=im);      // tahta kıymıkları: yerden fışkıran her şey
['patla','sprey','yarik','aduket_su','damla','yaprak'].forEach(n=>yukle('fx/'+n+'.webp',im=>R[n]=im));      // yaprak: kutudan dökülen ıspanak; iniş kanatları, yere çakılma patlaması, kayma sıçraması
yukle('fx/kar/yarik2.png',im=>R.yarik2=im);      // yarik2: karlı bölüm yer yarma
['bos','can','en','kalp','cerceve'].forEach(n=>yukle('ui/bar_'+n+'.webp',im=>R['bar_'+n]=im));      // can/enerji barı: boş (büyük kalp), can dolgusu, enerji dolgusu, küçük kalp (yuvarlak); cerceve: boş çerçeve (yuvarlak XP ile dolar)
yukle('ui/kalp_tek.webp',im=>R.kalp_tek=im);      // kalp_tek: atan kalp
function setKur(q){      // bir düşman setinin arkadaki kol/bacak koyu türevleri (set yüklenince bir kez)
  if(!R[q+'ust'])return;
  for(const n of ['ust','on','elF'])R[q+n+'_k']=koyult(R[q+n],.13);
  for(const n of ['uy','bacak','bot'])R[q+n+'_k']=koyult(R[q+n],.3);
  if(MISIR_Q.includes(q)||BATAK_Q.includes(q)||BATI_Q.includes(q)){R[q+'ahh']=R[q+'vur'];R[q+'aci']=R[q+'vur'];R[q+'elN_k']=koyult(R[q+'elN'],.13)}
  if(q==='p_'||q==='f_'||q==='n_'||q==='a_'||q==='h_')R[q+'elN_k']=koyult(R[q+'elN'],.13);
  if(q==='h_')R.h_elB_k=koyult(R.h_elB,.13);      // kancacının arkadaki kolunda kancalı / boş el
  if(q==='g_')R.g_yumF_k=koyult(R.g_yumF,.13);
}
function gorselHazir(){
  if(gorselHazir.ok)return;gorselHazir.ok=true;      // tek sefer: sonradan yüklenen görseller (bölüm paketleri) ikinci döngü başlatmasın (oyun 2 kat hızlı akıyordu)
  ['uyluk','altpan','bacak_bot'].forEach(n=>R[n+'_k']=koyult(R[n]));                 // oyuncunun arka bacağı
  ['ustkol','onkol2','el_yum_f','el_ac_n','el_pF'].forEach(n=>R[n+'_a']=koyult(R[n],.13));    // oyuncunun arka kolu ve eli
  LIMAN_Q.forEach(setKur);      // korsanın arkadaki kolu/bacağı
  R.el_isp_f_a=koyult(R.el_isp_f,.13);
  document.getElementById('yuk').hidden=true;
  (function bas(){if(typeof dongu==='function')requestAnimationFrame(dongu);else setTimeout(bas,20)})();      // önbellekten görseller dongu.js yüklenmeden hazır olabilir: döngü tanımlanınca başlar
}
let DEMO=null;      // yetenek önizlemesi çalışıyor mu (demo.js)
let HPMAX=250,ENMAX=250;      // oyuncunun en yüksek canı
function hasarKat(hp){const g=Math.max(0,Math.min(10,(HPMAX-hp)/(HPMAX/10))),i=Math.min(9,Math.floor(g));return [i,g-i]}   // 11 hasar modeli arasında sürekli geçiş: i = alttaki model, f = üstteki sonraki modelin saydamsızlığı (can 100→90: model 0→1, ... 10→0: model 9→10)
function hasarCiz(ciz,i,f){ciz(f>=0.999?i+1:i)}      // yara seviyeleri arası saydam geçiş yok: eşik geçince doğrudan diğer yüz

// ---------- Ayarlar (parça birimi) ----------
const CR_H=320;                 // çömelmede kalça yüksekliği
const BACAK_BOY=477;            // eklemden zemine (kalça-diz 206 + diz-bilek 172 + bilek-taban 99)
const KARAKTER_BOY=1020;
const HIZ=1100, G=5600, ZIP1=2700, ZIP2=1700, KAY_YOL=650;      // KAY_YOL: kaymadan sonra yeni kayma için koşulması gereken yol      // zıplama hızları: yükseklik eskisinin yarısı (yükseklik hızın karesiyle orantılı)
const D=Math.PI/180;
// [başlangıç x, yükseklik]; sol baştaki ve sağ sondaki yüksek duvar bölümün sınırı
const ZEMIN=[[-1e9,0]];      // şimdilik düz zemin
const BOSS_X=42000;
const kafaY=()=>S.y+((S.yer&&asagiMi())?620:790);      // oyuncunun kafa yüksekliği (eğilince alçalır): kaptan buraya nişan alır

// ---------- Durum ----------
const cv=document.getElementById('c');let ctx=cv.getContext('2d',{alpha:false})||cv.getContext('2d');      // ctx: ceset resmi çizilirken geçici olarak başka tuvale döner (korsan.js cesetResim). alpha:false: tuval saydam değil, tarayıcı sayfayla harmanlamaz (hızlı)
// v0.475 Grafik seviyesi (menüdeki GRAFİK düğmesi, pf_ayar.gr):
// 2 yüksek = her şey açık, 2x DPR; 1 orta = yarı parçacık/obje, 1.35x DPR; 0 düşük = 1x DPR, kan/kıymık/taş/yara/su/fener/obje/cam/kar-izi kapalı.
// Görseller her seviyede o çözünürlüğe göre önceden küçültülür (DOKU): düşük seviyede de net kalır, çizim yükü çözünürlükle birlikte düşer.
let GR=2;try{const a=JSON.parse(localStorage.getItem('pf_ayar')||'{}');if(a.gr===0||a.gr===1)GR=a.gr}catch(_){}
const GR_DPR=[1,1.35,2];
let W=0,H=0,DPR=1,SC=1,SC0=1,ZM=0.85,ZGAP=300,GOK=null,GOK_G=null;const ZOOM=0.85,KAZIK_DIP=450;
function boyut(){
  const nw=window.innerWidth,nh=window.innerHeight;
  if(!nw||!nh||nw<10||nh<10)return;      // mobilde geçici 0x0 boyut olayında SC/ZGAP'ın NaN/Infinity olmasını engeller
  DPR=Math.min(window.devicePixelRatio||1,GR_DPR[GR]);GOK=null;GOK_G=null;
  W=nw;H=nh;
  cv.width=Math.max(1,Math.round(W*DPR));cv.height=Math.max(1,Math.round(H*DPR));
  if('imageSmoothingQuality' in ctx)ctx.imageSmoothingQuality='low';      // görseller zaten ekran boyuna küçültülmüş: pahalı (mipmap) süzme gerekmez
  SC0=Math.max(0.05,Math.min(H*0.58/KARAKTER_BOY, W*0.45/KARAKTER_BOY));
  if(!Number.isFinite(ZM)||ZM<=0.2||ZM>3)ZM=ZOOM;
  SC=SC0*ZM;      // ZOOM<1: uzaktan bakış
  ZGAP=Math.min(H*0.3/(SC0*ZOOM),KAZIK_DIP);      // ekranın altı hep aynı dünya yüksekliğinde: zoom yalnız üste açılır
  {const ko=SC0*ZOOM*DPR;      // kopyaların ölçeği; belirgin değiştiyse (ekran döndü / grafik seviyesi) kopyalar arka planda yenilenir, küçük oynamalarda (adres çubuğu vb.) eski ölçek kalır
    if(!DK_KO)DK_KO=ko;else if(ko>DK_KO*1.04||ko<DK_KO*0.85){const f=ko/DK_KO;DK_KO=ko;dkOlcekle(f)}
    DK_OY=DK_KO/RES*1.15}
}
function tuvalYenile(){      // v0.475: tuvalin grafik belleği baştan kurulur (oyun başlarken ve uygulamaya geri dönünce): bozulmuş / yazılıma düşmüş tuvalle oynanmaz
  try{cv.width=Math.max(1,cv.width-1)}catch(_){}
  boyut();
  if(typeof ciz==='function'&&typeof girisAcik!=='undefined'&&!girisAcik&&gorselHazir.ok)try{ciz()}catch(_){}      // duraklamışken (menü açık) tuval boş kalmasın
}
window.addEventListener('resize',boyut);boyut();

let KX=0;      // v0.475 kamera merkezi (dünya x). Eskiden kamera = S.x idi; artık dalga kilidinde kamera durur, oyuncu ekranda serbest dolaşır (dusman_kur.js AR)
const key={sol:false,sag:false,zipla:false,asagi:false};
const S={camY:0,atk:null,kuyruk:[],sonAtk:-9,x:0,y:0,vx:0,vy:0,yer:true,yon:1,ziplaTut:false,ekstra:1,spin:0,donuyor:false,faz:0,t:0};
const ROLL_SURE=0.55;
const P={}; // yumuşatılmış açılar
