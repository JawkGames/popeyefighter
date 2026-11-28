'use strict';
// Düşman yerleşimi ve yeni oyun
// zorluk: her yeniden başlamada düşman canı ve saldırı gücü +%10 (birikerek, en çok 4 kat); tam sıfırlamada sıfırlanır
let ZOR_N=0;try{ZOR_N=Math.max(0,+localStorage.getItem('pf_zor')||0)}catch(_){}
const ZK=()=>Math.min(4,Math.pow(1.1,ZOR_N));      // düşman CANI çarpanı
const ZKD=()=>Math.min(2.5,Math.pow(1.06,ZOR_N));      // düşman HASARI çarpanı (v0.484: can kadar hızlı artmaz; yeni bölümlerin düşmanları zaten daha sert vurur)
function zorKaydet(){try{localStorage.setItem('pf_zor',String(ZOR_N))}catch(_){}}
const XPK=()=>Math.pow(1.5,ZOR_N);      // her bölümde düşman XP'si %50 artar (sabit XP, can/atak artışından bağımsız)
const XP_T={f:15,n:22,g:30,a:25,d:24,w:20,u:30,v:22,c:32,o:28,q:24,s:22,r:32};      // düşman başına temel XP (güce göre); tabloda olmayan: kancacı 20, bıçaklı 10, yumruklu 15
function korsanYap(x,kc){const e={t:'korsan',kc,x,y:zemin(x),vx:0,vy:0,hp:100,max:100,cy:450,r:211,yon:Math.random()<0.5?1:-1,anim:Math.random()*9,fl:0,st:0,olu:false,ol:0,rot:0,hitT:{N:0,F:0},wf:0,acd:0,ka:null};if(kc==='h'){e.cy=558;e.r=259}return e}
function dusmanKur(){      // yol boyunca yerleşik korsanlar: 1-2. bölüm liman korsanları, 3. bölüm+ (karlı dağ) sadece 3 kar düşmanı
  DUS=[];ENPOS=[BOSS_X];varilKur();if(typeof BFX!=='undefined')BFX.length=0;
  const ekle=(x,kc)=>(ENPOS.push(x),DUS.push(korsanYap(x,kc)));
  if(ZOR_N>=8){      // 9. bölüm: Vahşi Batı Kanyonu / Kasaba
    [3800,6600,9800,13200,16600,20000,23400,26800,30400,34200,37600].forEach(x=>{ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'q',bs:1.06,cy:450,r:215,hp:210,max:210,dm:19,bdm:22,fa:[2.4,1.6]})});      // Kovboy Haydut
    [5000,8400,12000,15400,19000,22400,25800,29200,33000,36200].forEach(x=>{ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'s',bs:1.05,cy:450,r:215,hp:190,max:190,dm:18,bdm:21,fa:[2.5,1.6]})});      // Kadın Şerif
    [6000,10800,14200,18000,21400,25000,28400,32000,35200,38200].forEach(x=>{ekle(x,'b');Object.assign(DUS[DUS.length-1],{sk:'r',hp:290,max:290,dm:23,vk:0.92,hz:1.1})});      // Madenci Haydut
  }else if(ZOR_N>=6){      // 7-8. bölüm: Karanlık Bataklık (7'de ağaç/balta tutan o_ yok, 8'de gelir)
    if(ZOR_N>=7)[3800,6600,9800,13200,16600,20000,23400,26800,30400,34200,37600].forEach(x=>{ekle(x,'b');Object.assign(DUS[DUS.length-1],{sk:'o',hp:260,max:260,dm:22,vk:0.92,hz:1.1})});      // 8. bölümden itibaren: Baltalı Oduncu
    [3800,5400,9000,13000,17000,21000,25000,29000,33000,36200].forEach(x=>{if(ZOR_N>=7&&x===3800)return;ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'v',bs:1.08,cy:450,r:215,hp:180,max:180,dm:18,bdm:21,fa:[2.4,1.6]})});      // Bataklık Avcısı
    [4800,7200,10600,14200,18000,21800,25800,29800,33600,38200].forEach(x=>{ekle(x,'g');Object.assign(DUS[DUS.length-1],{sk:'c',bs:1.1,cy:480,r:230,hp:300,max:300,dm:23,vk:0.9})});      // Bataklık Canavarı
  }else if(ZOR_N>=4){      // 5-6. bölüm (Mısır çölü & mumya; 5. bölümde Anubis köpek yok, 6. bölümde gelir)
    [3800,6200,9400,12600,15800,19000,22200,25400,28600,31800,34600,37200].forEach(x=>{ekle(x,'b');Object.assign(DUS[DUS.length-1],{sk:'d',hp:220,max:220,dm:18,vk:0.95,hz:1.05})});      // Mısır mumya savaşçı (khopesh)
    [5000,8400,13800,17400,23600,27200,33200,36000].forEach(x=>{ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'w',bs:1.08,cy:450,r:215,hp:160,max:160,dm:16,bdm:20,fa:[2.4,1.6]})});      // Kadın Mısır savaşçısı (güneş asası)
    if(ZOR_N>=5)[7200,11000,15000,20600,24800,29800,32600,38000].forEach(x=>{ekle(x,'b');Object.assign(DUS[DUS.length-1],{sk:'u',bs:1.12,cy:480,r:230,hp:280,max:280,dm:22,vk:0.9,hz:1.15})});      // Anubis tapınak muhafızı (6. bölümden itibaren)
  }else if(ZOR_N>=2){
    if(ZOR_N>=3)[3800,6200,9400,12600,15800,19000,22200,25400,28600,31800,34600,37200].forEach(x=>{ekle(x,'b');Object.assign(DUS[DUS.length-1],{sk:'a',hp:220,max:220,dm:19,vk:0.9,hz:1.15})});      // baltalı kar korsanı (4. bölümden itibaren)
    [5000,8400,13800,17400,23600,27200,33200,36000].forEach(x=>{ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'n',bs:1.1,cy:450,r:215,hp:140,max:140,dm:17,bdm:20,fa:[2.2,1.5]})});      // buzlu tüfekli kar avcısı
    [7200,11000,15000,20600,24800,29800,32600,38000].forEach(x=>{ekle(x,'g');Object.assign(DUS[DUS.length-1],{sk:'g',bs:1.08,cy:480,r:230,hp:260,max:260,dm:21,vk:0.92})});      // kaslı yakalayıcı kar devi
  }else{
    [3800,5200,9600,11200,14800,16000,19200,21000,23000,25800,27000,31600,33400,35200].forEach(x=>{ekle(x,'k');DUS[DUS.length-1].hp=DUS[DUS.length-1].max=150});
    [4500,7400,10400,13600,16800,20200,22000,24600,29000,32200,34400].forEach(x=>ekle(x,'b'));
    [8600,15800,23600,30400,37200].forEach(x=>{ekle(x,'h');const e=DUS[DUS.length-1];e.hp=e.max=200;e.cy=558;e.r=259});      // kancacılar
    if(ZOR_N>=1)[6300,12400,18200,26300,29800,35800].forEach(x=>{ekle(x,'p');Object.assign(DUS[DUS.length-1],{sk:'f',bs:1.2075,cy:462,r:215,hp:100,max:100,dm:20,bdm:20,fa:[2,1.5]})});      // 2. bölümden: tabancalı kadın
  }
  dalgaKur();
  for(const e of DUS){e.xp=Math.round((XP_T[e.sk]||(e.kc==='h'?20:e.kc==='b'?10:15))*XPK());e.hp=e.max=Math.round(e.max*ZK())}
}
// ---- Dalga (arena) sistemi (v0.475) ----
// Bölümün düşmanları soldan sağa en çok 4'lü dalgalara bölünür (1. bölümün ilk iki dalgası 2 ve 3 kişilik: yumuşak başlangıç).
// Oyuncu bir dalganın önüne gelince kamera durur, ekranın sağ kenarı duvar olur: geri gidilir ama ileri gitmek için o dalganın hepsi ölmelidir.
// Dalga bitince sağda ileri oku (#ileri) çıkar; oyuncu ekranın sağına yürüyünce kamera onu yumuşakça ortalar ve sonraki dalgaya kadar birlikte ilerler. Boss alanı da aynı şekilde kilitlenir.
const AR={i:0,n:0,x:[],bossX:BOSS_X,kilit:false,gecT:-99,gecX:0,bek:null,yak:false,of:0,v:0,ok:false};
const AR_ARA=400,AR_MESAFE=4000,AR_DUVAR=230,AR_DDUVAR=110;      // dalga içi düşman aralığı, dalgalar arası yol, oyuncunun / düşmanın sağ duvara (ekran kenarına) en fazla yaklaşması
const arBosluk=()=>Math.min(1100,(W/2/SC)*0.5);      // kilit anında dalganın ilk düşmanı ekran ortasından bu kadar ileride
function dalgaKur(){      // DUS (bölüm tablosu) → dalgalar: sıra korunur, konumlar dalga düzenine çekilir
  const L=DUS.filter(e=>!e.boss).sort((a,b)=>a.x-b.x),N=L.length,boy=[];
  let k=0;if(ZOR_N===0){for(const b of [2,3])if(N-k>b+1){boy.push(b);k+=b}}      // 1. bölüm: ilk dalgalar küçük
  {const kal=N-k,m=Math.ceil(kal/4);for(let j=0;j<m;j++)boy.push(Math.floor(kal/m)+(j>=m-kal%m?1:0))}      // kalanlar eşit dağılır (en çok 4), büyükler sonda
  AR.x=[];ENPOS=[];let i=0;
  boy.forEach((b,d)=>{const xb=3800+d*AR_MESAFE,g=L.slice(i,i+b);i+=b;AR.x.push(xb);
    g.sort((a,c)=>(c.kc==='h')-(a.kc==='h'));      // kancacı yürümez: dalganın en önünde durur
    g.forEach((e,j)=>{e.x=xb+j*AR_ARA+(j?Math.round((Math.random()-0.5)*120):0);e.y=zemin(e.x);e.dg=d;ENPOS.push(e.x)})});
  AR.n=boy.length;AR.i=0;AR.kilit=false;AR.gecT=-99;AR.bek=null;AR.yak=false;AR.of=0;AR.v=0;
  AR.bossX=AR.n?AR.x[AR.n-1]+AR_MESAFE+600:BOSS_X;ENPOS.push(AR.bossX);
}
function arSinir(){      // kameranın gidebileceği en sağ merkez (dünya x)
  if(AR.i<AR.n)return AR.x[AR.i]-arBosluk();
  return AR.bossX-arBosluk();      // son dalga bitti: boss alanı
}
function arGuncelle(dt){      // her karede (dongu.js): dalga kilidi, sağ duvar, kamera (KX)
  if(DEMO||!AR.n){KX=S.x;AR.yak=false;AR.bek=null;AR.of=0;AR.v=0;arOk(false);return}
  const hw=W/2/SC;
  if(S.durum==='oyun'&&AR.i<AR.n){
    const L=AR.x[AR.i]-arBosluk();
    if(!AR.kilit&&S.x>=L-2){AR.kilit=true;AR.bek=null;for(const e of DUS)if(e.dg===AR.i&&!e.olu&&!e.akt&&!gizliKal(e,S.x-e.x))e.akt=true}      // dalga başladı: hepsi fark eder (arkadan sessiz yaklaşma hariç)
    let var_=false;for(const e of DUS)if(e.dg===AR.i&&!e.olu){var_=true;break}
    if(!var_){AR.bek=AR.kilit?L:null;AR.i++;AR.kilit=false;AR.gecT=S.t;AR.gecX=KX;AR.gecP=S.x}      // dalga temizlendi: kamera oyuncu ekranın sağına yürüyene kadar yerinde bekler
  }
  const lim=arSinir(),duvar=lim+hw-AR_DUVAR;
  if(S.x>duvar){S.x=duvar;if(S.vx>0)S.vx=0}      // sağ duvar (ekranın sağ kenarı)
  {const dd=lim+hw-AR_DDUVAR,ak=AR.i<AR.n?AR.kilit:S.bossGeldi;      // düşmanlar da duvarı geçemez (kaçan, fırlatılan); ekran dışından gelen içeri girene kadar serbest
    if(ak)for(const e of DUS){if(e.tut||(e.dg!==AR.i&&!e.boss))continue;if(e.x<=dd-30)e.ic=true;else if(e.ic&&e.x>dd){e.x=dd;if(e.vx>0)e.vx*=-0.3}}}
  if(AR.bek!==null&&S.x-KX>hw*0.45){AR.yak=true;AR.of=Math.max(0,Math.min(S.x,lim)-KX);AR.v=0;AR.bek=null}      // oyuncu sağa yürüdü: kamera yumuşakça yakalar
  const hedef=Math.min(S.x,AR.bek!==null?AR.bek:lim);
  if(AR.yak){      // yumuşak yakalama: sapma (hedef - kamera) yay gibi sıfıra iner (yavaş başlar, yavaş biter)
    const om=2/0.85,x=om*dt,ex=1/(1+x+0.48*x*x+0.235*x*x*x),tmp=(AR.v+om*AR.of)*dt;
    AR.v=(AR.v-om*tmp)*ex;AR.of=(AR.of+tmp)*ex;
    if(AR.of<2||!Number.isFinite(AR.of)){AR.of=0;AR.v=0;AR.yak=false}
    KX=hedef-AR.of;
  }else KX=hedef;
  arOk(S.durum==='oyun'&&!AR.kilit&&S.t-AR.gecT<60&&(S.x<(AR.gecP||0)+1000||S.t-AR.gecT<2.5)&&!(AR.i>=AR.n&&S.bossGeldi));
}
function arOk(ac){      // ileri oku: sadece durum değişince DOM'a yazılır
  if(ac===AR.ok)return;AR.ok=ac;const el=arOk.el||(arOk.el=document.getElementById('ileri'));if(el)el.classList.toggle('ac',ac);
}
function yeniOyun(){if(typeof demoBitir==='function'&&DEMO)demoBitir();ZOR_N=S.tamSif?0:S.durum==='tamam'?ZOR_N+1:ZOR_N;zorKaydet();try{sesSeviye()}catch(_){}cevreKur(Math.random()*4294967296>>>0,Math.random()*4294967296>>>0);YARA.ok=false;ISP=[];ISP_Y=[];ADKD=[];S.yeme=null;S.ust=null;S.yak=null;S.dag=null;S.ispEnT=0;S.uzan=null;S.pence=null;MERMI=[];EMER=[];EFL=[];S.hitR=null;S.sarjP=null;S.en=ENMAX;S.antiBek=0;S.hakBek=0;S.omuz=null;S.ispCan=null;S.tamSif=false;S.tepe=0;BCK.length=0;S.noEn=-9;S.yy=null;S.alk=null;if(S.catlak)for(const c of S.catlak)yarikSesDur(c,0.1);S.catlak=null;S.sman=null;S.dkick=null;S.sup=null;S.pend=null;S.sarj=0;S.shoryu=0;S.slam=false;S.tats=0;S.blok=false;S.bossGeldi=false;S.hp=HPMAX;S.inv=0;S.x=0;KX=0;S.y=0;S.camY=0;S.vx=0;S.vy=0;S.durum='oyun';S.ol=null;S.cg=null;S.rk=null;SUC.length=0;sulSes(false);S.spin=0;S.pops.length=0;S.parcalar=[];S.kan=[];S.karP=[];S.leke=[];KAR.fill(KD);for(const c of CESET)cesetBirak(c);CESET.length=0;dusmanKur();if(typeof bolumGecis==='function')bolumGecis()}
// ---- sesler: kayıtlı ses dosyaları (WebAudio) ----
