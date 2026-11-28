'use strict';
// Kontrol modları (menüde: Dokunmatik / Eğim sensörü / Klavye / Joystick), klavye ve joystick aksiyonları, tuş listesi paneli, dokunmatik modda skill önizlemesinde parmak gösterimi.
// Klavye ve joystick aynı aksiyon fonksiyonlarını kullanır (aYumruk, aTekme, aTut, aYirt, ikiliBas…). Joystick yoklaması sadece gamepadconnected olunca başlar (takılı değilken sıfır maliyet).
// Tuşlar OYUN.md "Kontroller"de; tuş listesi panelindeki satırlar TL tablosunda.
// v0.444: telefon uygulamasında (Capacitor) klavye modu yok (PC/tarayıcı testine özel); joystick kalır (Android'e bluetooth oyun kumandası bağlanabilir)
const UYGULAMA=(()=>{try{return !!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}catch(_){return false}})();
const KMODLAR=UYGULAMA?['dokun','egim','joy']:['dokun','egim','klavye','joy'],KM_IKON={dokun:'m_dokun',egim:'m_sens',klavye:'m_klv',joy:'m_joy'};
let KMOD='dokun';try{const m=localStorage.getItem('pf_kmod');if(KMODLAR.includes(m))KMOD=m}catch(_){}
async function kmodSec(m){
  KMOD=m;try{localStorage.setItem('pf_kmod',m)}catch(_){}
  for(const x of KMODLAR)document.body.classList.toggle('km_'+x,x===m);
  if(m==='egim'&&!GYRO.ak)await sensorToggle();
  else if(m!=='egim'&&GYRO.ak)await sensorToggle();
  if(window.menuYenile)menuYenile();
}
for(const x of KMODLAR)document.body.classList.toggle('km_'+x,x===KMOD);
if(KMOD==='egim')sensorToggle();

// ---------- tuş ataması (tuş listesinden değiştirilebilir, telefona kaydedilir) ----------
// Yön tuşları sabit (oklar + A D W S Z Boşluk); aksiyon tuşları TUS (klavye harfi) ve PADT (joystick düğme no) tablolarında.
const TUS_VAR={yumruk:'j',tekme:'k',super:'h',bicak:'g',doner:'b',yer:'n',kay:'m',tut:'y',yirt:'u',isp:'t'};
const PAD_VAR={yumruk:2,tekme:0,super:3,bicak:1,doner:5,yer:7,tut:4,isp:6};
const PAD_AD=['A','B','X','Y','LB','RB','LT','RT','Select','Start','L3','R3','D▲','D▼','D◀','D▶','Home'];
let TUS={...TUS_VAR},PADT={...PAD_VAR};
try{const a=JSON.parse(localStorage.getItem('pf_tus')||'null'),b=JSON.parse(localStorage.getItem('pf_pad')||'null');if(a)Object.assign(TUS,a);if(b)Object.assign(PADT,b)}catch(_){}
function tusKaydet(){try{localStorage.setItem('pf_tus',JSON.stringify(TUS));localStorage.setItem('pf_pad',JSON.stringify(PADT))}catch(_){}}
const tusAksiyon=c=>{for(const k in TUS)if(TUS[k]===c)return k;return null};      // klavye harfi → aksiyon
function tusAta(tab,ad,v){const es=Object.keys(tab).find(k=>k!==ad&&tab[k]===v);if(es)tab[es]=tab[ad];tab[ad]=v;tusKaydet()}      // aynı tuş başka işteyse ikisi yer değiştirir

// ---------- ortak aksiyonlar (klavye + joystick) ----------
const GIR={yonG:[],sarjT:0,sarjD:1,tut:null,bek:null};
const TUT_MENZIL=560;      // tutma: kolun uzanabildiği yakınlık (dünya birimi)
function yonKaydet(c){GIR.yonG.push({c,t:performance.now()});if(GIR.yonG.length>8)GIR.yonG.shift()}      // c: 'a' aşağı, 'R' sağ, 'L' sol
function hareketSirasi(){      // son 0.6 sn'deki yön girişleri: → ↓ → = aparkat, ↓ → = aduket
  const n=performance.now(),g=GIR.yonG.filter(q=>n-q.t<600).map(q=>q.c).join('');
  let m=g.match(/([RL])a\1$/);if(m)return {ad:'apar',d:m[1]==='R'?1:-1};
  m=g.match(/a([RL])$/);if(m)return {ad:'adu',d:m[1]==='R'?1:-1};
  return null;
}
function aYumruk(joy){
  if(S.durum!=='oyun')return;
  if(S.yak){yakVur('kafa');return}
  if(GIR.tut&&GIR.tut.ok){if(joy)aYirt();else tutKombo('F');return}      // joystick: LB basılıyken X = yırt; klavye: tutarken J = boştaki elle vur
  const m=hareketSirasi();
  if(m&&m.ad==='apar'&&YV('J')){GIR.yonG.length=0;if(m.d!==S.yon)donDon(m.d);shoryu({t:'N',yon:m.d});return}
  if(m&&m.ad==='adu'&&YV('Y')){GIR.yonG.length=0;
    if(S.en>=50&&S.sarj<=0&&!S.sman&&!S.yy&&!S.alk&&!(S.tats>0)){if(m.d!==S.yon)donDon(m.d);S.sarj=1;S.sarjP=null;GIR.sarjT=S.t+0.45;GIR.sarjD=m.d}else S.noEn=S.t;return}
  S.jEl=S.jEl==='N'?'F':'N';komboTap('y',S.jEl);
}
function aHavaTekme(){      // havada: yön tuşlarına göre yere tekme (ileri = ileri kayarak, aşağı = olduğu yere, ileri+aşağı = çapraz)
  if(S.yer||S.pend||S.dkick||S.slam)return;
  const dir=key.sag?1:key.sol?-1:S.yon,ileri=key.sag||key.sol,asg=key.asagi;
  const [dx,dy]=asg&&!ileri?[40,450]:asg?[350,450]:[450,130];
  S.pend={t:S.t,iz:{t:'N',yon:1},dx:dx*dir,dy};
}
function aTekme(){
  if(S.durum!=='oyun')return;
  if(S.yak){yakVur('tekme');return}
  if(!S.yer&&key.asagi&&YV('YT')&&!GIR.tut){aHavaTekme();return}
  S.kEl=S.kEl==='N'?'F':'N';tekmeAt(S.kEl);
}
function aKayma(){if(S.durum!=='oyun'||S.yak)return;if(!S.yer){aHavaTekme();return}ciftAtil(S.yon)}      // baktığı yöne kayar (koşarken)
function aAlkis(){
  if(S.durum!=='oyun'||S.yak||tutmaVar()||S.ust||S.sarj>0||S.tats>0||S.sman||S.yy||S.alk)return;
  if(!YV('AL')||!enerji(50))return;
  S.alk={t0:S.t,T:0.75,hit:false};S.vx*=0.2;S.kay=null;S.lungeT=-1;
}
function tekli(c){
  if(c==='h'){ozelTus('h');return}
  const dir=key.sag?1:key.sol?-1:0;
  if(S.pence&&dir&&YV('Z'))dagAtla(dir);else ozelTus('g');      // bıçak modundayken ileri + bıçak tuşu = bıçak atlama
}
function ikiliBas(c){      // H+G (joystick Y+B) birlikte = alkış; tek basış 0.16 sn bekleyip kendi hareketini yapar
  const n=performance.now(),b=GIR.bek;
  if(b&&b.c!==c&&n-b.t<160){clearTimeout(b.to);GIR.bek=null;aAlkis();return}
  if(b){clearTimeout(b.to);GIR.bek=null;tekli(b.c)}
  const o={c,t:n};o.to=setTimeout(()=>{if(GIR.bek===o){GIR.bek=null;tekli(c)}},160);GIR.bek=o;
}
function tutHedef(){      // en yakın tutulabilir düşman ya da varil
  let en=null,ed=1e9,tip=null;
  if(TUTMA())for(const e of DUS){if(e.olu||e.tut||e.boss||e.noTut>S.t||Math.abs(e.y-S.y)>500)continue;const d=Math.abs(e.x-S.x);if(d<TUT_MENZIL+e.r*0.5&&d<ed){ed=d;en=e;tip='d'}}
  if(YV('B'))for(const v of VAR){if(v.d!=='yer'&&v.d!=='dus')continue;const d=Math.abs(v.x-S.x);if(d<TUT_MENZIL&&d<ed){ed=d;en=v;tip='v'}}
  return en?{tip,o:en}:null;
}
function tutBitir(){GIR.tut=null;dmKolBirak('N')}
function aTut(bas){      // basılı tut = tut, bırak = bırak
  if(bas){
    if(S.durum!=='oyun'||GIR.tut||S.pence||S.sarj>0||S.ust||tutan('N')||varilElde('N'))return;
    const h=tutHedef();dmKol('N',-5,1);
    if(!h){GIR.tut={bos:true,t0:S.t};return}      // menzilde bir şey yok: el uzanıp geri gelir
    const yn=Math.sign(h.o.x-S.x)||S.yon;if(yn!==S.yon)donDon(yn);
    GIR.tut={tip:h.tip,o:h.o,t0:S.t,ok:false};return;
  }
  const g=GIR.tut;if(!g)return;
  if(g.ok&&g.tip==='v'){const v=VAR.find(z=>z.d==='tut'&&z.k==='N');if(v){v.k=null;v.d='dus';v.vx=S.vx*0.5;v.vy=0;v.vr=0}}
  else if(g.ok&&g.tip==='d'){const e=g.o;if(e.tut){e.tut=null;e.iki=false;e.vx=e.vy=0;e.st=S.t+0.5}}
  tutBitir();
}
function aYirt(){      // tutarken: düşmanı yırt, varili ileri fırlat
  const g=GIR.tut;if(!g||!g.ok||S.durum!=='oyun')return;
  if(g.tip==='v'){const v=VAR.find(z=>z.d==='tut'&&z.k==='N');if(v){v.k=null;v.d='uc';v.f=0.6;v.vx=S.yon*2600;v.vy=900;v.vr=4*S.yon}tutBitir();return}
  const e=g.o;if(!e.tut||e.olu){tutBitir();return}
  if(!YIRT())return;
  dmKol('F',190,1);e.iki=true;
  const ger=Math.max(1,Math.ceil((e.hp-1e-9)*(YA('R')?0.5:1)));
  if(enerji(ger))yirt(e,2600);else tutReddet(e);
  tutBitir();dmKolBirak('F');
}
function aLB(){if(S.yer&&YV('E')&&!GIR.tut&&Math.abs(S.vx)>=HIZ*0.5)ciftAtil(Math.sign(S.vx));else aTut(true)}      // joystick LB: koşarken kayar tekme, değilse tut
function klvAksiyon(a){      // a: aksiyon adı (TUS tablosu); tut ayrı (basılı tutma, girdi.js)
  if(a==='yumruk')aYumruk(false);else if(a==='tekme')aTekme();else if(a==='super')ikiliBas('h');else if(a==='bicak')ikiliBas('g');
  else if(a==='doner')ozelTus('b');else if(a==='yer')ozelTus('n');else if(a==='kay')aKayma();
  else if(a==='isp')ispCep();else if(a==='yirt')aYirt();
}
function kontrolGuncelle(dt){      // her kare (dongu.js)
  if(GIR.sarjT&&S.t>=GIR.sarjT){GIR.sarjT=0;if(S.sarj>0)ates(GIR.sarjD,0.05,1,EL.N.wx,EL.N.wy)}      // klavye/joystick aduketi: kısa şarjdan sonra atılır
  const g=GIR.tut;if(!g)return;
  if(S.durum!=='oyun'){tutBitir();return}
  if(g.bos){if(S.t-g.t0>0.25)tutBitir();else dmKol('N',-5,1);return}
  dmKol('N',-5,1);
  if(!g.ok){
    if(S.t-g.t0<0.12)return;
    if(g.tip==='d'){const e=g.o;if(e.olu||e.tut){tutBitir();return}dmTut('N',e);bufCal(GRS,1)}
    else{const v=g.o;if(v.d!=='yer'&&v.d!=='dus'){tutBitir();return}v.d='tut';v.k='N';v.rot=0;v.vx=v.vy=0;S.uzan=null;bufCal(GRS,1)}
    g.ok=true;return;
  }
  if(g.tip==='d'&&!tutan('N'))tutBitir();else if(g.tip==='v'&&!varilElde('N'))tutBitir();
}

// ---------- joystick (standart düzen) ----------
const PAD={on:false,onc:[],yon:{sol:false,sag:false,ust:false,alt:false}};
addEventListener('gamepadconnected',()=>{if(!PAD.on){PAD.on=true;requestAnimationFrame(padOku)}});
function padOku(){
  const gps=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];
  if(!gps.length){PAD.on=false;PAD.onc=[];return}
  requestAnimationFrame(padOku);
  const gp=gps[0],b=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>0.5));
  const ax=gp.axes[0]||0,ay=gp.axes[1]||0,bs=[];for(let i=0;i<17;i++)bs[i]=b(i);
  const st={sol:bs[14]||ax<-0.5,sag:bs[15]||ax>0.5,ust:bs[12]||ay<-0.6,alt:bs[13]||ay>0.6},ys=PAD.yon;
  const yeni=i=>bs[i]&&!PAD.onc[i],bit=i=>!bs[i]&&PAD.onc[i];
  if(tusAcik&&TLB){for(let i=0;i<12;i++)if(i!==9&&yeni(i)){tusAta(PADT,TLB,i);TLB=null;tuslarAc(true);break}}      // tuş ataması: basılan düğme seçili aksiyona verilir
  else if(girisAcik){if(yeni(9)||yeni(0))document.getElementById('g_basla').click()}
  else if(menuAcik||agacAcik||listeAcik||hakAcik||tusAcik){if(yeni(9)||yeni(1)){if(tusAcik)tuslarAc(false);else if(menuAcik)menuAc(false);else if(listeAcik)listeAc(false);else if(agacAcik)agacAc(false)}}
  else{
    if(st.sol!==ys.sol){key.sol=st.sol;if(st.sol)yonKaydet('L')}
    if(st.sag!==ys.sag){key.sag=st.sag;if(st.sag)yonKaydet('R')}
    if(st.alt!==ys.alt){key.asagi=st.alt;if(st.alt)yonKaydet('a')}
    if(st.ust&&!ys.ust){if(!key.zipla)ziplaBas();key.zipla=true}else if(!st.ust&&ys.ust)key.zipla=false;
    const P=PADT;if(yeni(P.yumruk))aYumruk(true);if(yeni(P.tekme))aTekme();if(yeni(P.super))ikiliBas('h');if(yeni(P.bicak))ikiliBas('g');
    if(yeni(P.tut))aLB();if(bit(P.tut))aTut(false);
    if(yeni(P.doner))ozelTus('b');if(yeni(P.yer))ozelTus('n');if(yeni(P.isp))ispCep();if(yeni(9))menuAc(true);
  }
  PAD.onc=bs;Object.assign(ys,st);
}

// ---------- tuş listesi paneli (menüde klavye/joystick seçiliyken satır sonundaki liste simgesi) ----------
let tusAcik=false,TLB=null;      // TLB: yeni tuşu beklenen aksiyon
const TL=[      // [etiket (dil anahtarı ya da yet_X), klavye, joystick, yetenek (kilitliyse soluk), değiştirilebilen aksiyon]; %ad% = o aksiyonun şu anki tuşu
  ['tl_yuru','← →  ·  A D','D-pad ◀ ▶  ·  L-stick'],['tl_zipla','↑  ·  W  ·  Space','D-pad ▲  ·  L-stick ▲'],['tl_egil','↓  ·  S','D-pad ▼  ·  L-stick ▼'],
  ['yet_C','%yumruk%','%yumruk%',0,'yumruk'],['tl_tekme','%tekme%','%tekme%',0,'tekme'],['yet_S','%super%','%super%','S','super'],['yet_P','%bicak%','%bicak%','P','bicak'],['yet_L','%doner%','%doner%','L','doner'],
  ['yet_N','%yer% ({yer})','%yer% ({yer})','N','yer'],['yet_U','%yer% ({hava})','%yer% ({hava})','U'],['yet_E','%kay% ({kos})','%tut% ({kos})','E','kay'],
  ['yet_YT','%kay% + {yon} ({hava})  ·  ↓ + %tekme%','↓ + %tekme% ({hava})','YT'],['yet_Y','↓ → %yumruk%','↓ → %yumruk%','Y'],['yet_J','→ ↓ → %yumruk%','→ ↓ → %yumruk%','J'],
  ['yet_AL','%super% + %bicak%','%super% + %bicak%','AL'],['tl_tut','%tut%','%tut%',0,'tut'],['tl_yirt','%yirt%','%tut% + %yumruk%',0,'yirt'],['yet_Z','→ + %bicak% ({bicak})','→ + %bicak% ({bicak})','Z'],
  ['yet_TOP','%isp%','%isp%','TOP','isp'],['tl_menu','Esc','Start'],
];
function tuslarAc(a){
  const el=document.getElementById('tuslar');tusAcik=a;el.hidden=!a;if(!a){TLB=null;return}
  const joy=KMOD==='joy',ic=document.getElementById('tl_ic'),h=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const kos=t=>t.replace(/\{(yer|hava|kos|bicak|yon)\}/g,(_,k)=>dil('tl_'+k)).replace(/%(\w+)%/g,(_,k)=>joy?(PAD_AD[PADT[k]]||'?'):(TUS[k]||'?').toUpperCase());
  document.getElementById('tl_bas').textContent=dil('tl_atama').toLocaleUpperCase(DIL)+' · '+dil('km_'+KMOD);
  document.getElementById('tl_not').textContent=dil('tl_degis');document.getElementById('tl_sifir').textContent=dil('tl_sifir');
  ic.innerHTML=TL.map(r=>{const ad=dil(r[0]).split(' (')[0],kil=r[3]&&!AG.acik.has(r[3]),dg=r[4]&&!(joy&&r[4]==='yirt')&&!(joy&&r[4]==='kay');
    return `<div class="tl_s${kil?' kil':''}${dg?' deg':''}${TLB&&TLB===r[4]?' bek':''}"${dg?` data-a="${r[4]}"`:''}><span>${h(ad)}</span><b>${h(TLB&&TLB===r[4]?dil('tl_bekle'):kos(joy?r[2]:r[1]))}</b></div>`}).join('');
}
document.getElementById('tuslar').addEventListener('click',e=>{
  if(e.target.id==='tuslar'||e.target.id==='tl_kap'){tuslarAc(false);return}
  if(e.target.id==='tl_sifir'){if(KMOD==='joy')PADT={...PAD_VAR};else TUS={...TUS_VAR};tusKaydet();TLB=null;tuslarAc(true);return}
  const r=e.target.closest('.tl_s.deg');if(r){TLB=TLB===r.dataset.a?null:r.dataset.a;tuslarAc(true)}      // satıra dokun: yeni tuşu bekler (tekrar dokununca vazgeçer)
});
addEventListener('keydown',e=>{      // tuş ataması: beklenen aksiyona basılan harf/rakam verilir (Esc vazgeçer)
  if(!tusAcik||!TLB)return;e.preventDefault();e.stopImmediatePropagation();
  if(e.key==='Escape'){TLB=null;tuslarAc(true);return}
  const c=e.key.length===1?e.key.toLowerCase():'';if(!/^[a-z0-9]$/.test(c)||'adwsz'.includes(c))return;      // yön harfleri (A D W S Z) ayrılmış
  tusAta(TUS,TLB,c);TLB=null;tuslarAc(true);
},true);
DIL_DIN.push(()=>{if(tusAcik)tuslarAc(true)});

// ---------- dokunmatik modda skill önizlemesi: beklenen parmak hareketi ----------
// Her yetenek için parmak izleri: [[t,x,y],...] (x,y ekranın oranı; ya da 'zipla'/'sag'/'isp' butonu). İlk noktada basar (küçülür), son noktada kalkar.
const PCV=document.getElementById('pc'),PCX=PCV.getContext('2d');let PIM=null;yukle('ui/parmak.webp',im=>PIM=im);
const pTap=(a,x,y)=>[[a-0.05,x,y],[a+0.06,x,y]],pKay=(a,x0,y0,x1,y1,d)=>[[a-(d||0.12),x0,y0],[a,x1,y1]];
const pIki=(a,dxL,dyL,dxR,dyR,y,d)=>[pKay(a,0.36,y,0.36+dxL,y+dyL,d),pKay(a,0.64,y,0.64+dxR,y+dyR,d)];      // iki parmak birlikte
const pDaire=(a0,a1,cx,cy)=>{const r=[];for(let i=0;i<=12;i++){const u=i/12;r.push([a0+(a1-a0)*u,cx+0.07*Math.cos(u*2*Math.PI-Math.PI/2)*innerHeight/innerWidth,cy+0.09*Math.sin(u*2*Math.PI-Math.PI/2)])}return r};
const pSira=(L,f)=>L.map((a,i)=>f(a,i));
const PARMAK={
  C:()=>[pTap(0.2,0.72,0.45),pTap(0.5,0.28,0.45),pTap(0.8,0.72,0.45)],
  I:()=>[pTap(0.2,0.72,0.45),pTap(0.5,0.28,0.45)],
  H:()=>pSira([0.2,0.5,0.8,1.4,1.7,2.0],a=>pTap(a,a*10%2<1?0.72:0.28,0.45)),
  Q:()=>pSira([0.2,0.9,1.6],a=>pTap(a,0.53,0.9)),
  T:()=>[...pIki(0.15,0,-0.3,0,-0.3,0.7),...pSira([0.7,1.0,1.3,1.6,1.9],a=>pTap(a,a*10%2<1?0.72:0.28,0.45)),...pIki(2.6,0,-0.3,0,-0.3,0.7)],
  A:()=>[[[0.2,0.66,0.5],[0.7,0.78,0.47],[1.9,0.78,0.47]]],
  B:()=>[[[0.1,0.66,0.55],[0.5,0.8,0.62],[1.3,0.8,0.62],[1.8,0.84,0.3],[2.3,0.86,0.28]]],
  F:()=>[[[0.15,0.46,0.5],[0.85,0.2,0.5],[1.0,0.2,0.5]],[[0.15,0.54,0.5],[0.85,0.8,0.5],[1.0,0.8,0.5]]],
  N:()=>pIki(0.2,0,0.4,0,0.4,0.35),
  S:()=>pIki(0.2,0.22,0,0.22,0,0.48),
  Y:()=>[[...pDaire(0.1,1.0,0.36,0.5),[1.1,0.36,0.5]],[...pDaire(0.1,1.0,0.64,0.5),[1.1,0.64,0.5]]],
  D:()=>[pTap(0.1,'zipla'),pTap(0.45,'zipla')],
  K:()=>[pTap(0.1,'zipla')],
  E:()=>[[[0.02,'sag'],[0.38,'sag']],pKay(0.4,0.55,0.5,0.85,0.5)],
  L:()=>pIki(0.2,-0.22,0,0.22,0,0.5),
  U:()=>[pTap(0.1,'zipla'),...pIki(0.5,0,0.4,0,0.4,0.35)],
  J:()=>[pKay(0.2,0.72,0.72,0.72,0.25)],
  P:()=>[...pIki(0.2,0,-0.3,0,-0.3,0.7),...pIki(2.3,0,-0.3,0,-0.3,0.7)],
  Z:()=>[pKay(0.6,0.55,0.5,0.85,0.5)],      // bıçak atlama: sadece tek parmak ileri kaydırma
  AL:()=>[pKay(0.2,0.2,0.5,0.45,0.5,0.2),pKay(0.2,0.8,0.5,0.55,0.5,0.2)],
  YT:()=>[pTap(0.1,'zipla'),pKay(0.45,0.6,0.3,0.78,0.65)],
  TOP:()=>[pTap(0.1,'isp')],
};
PARMAK.G=PARMAK.A;PARMAK.R=PARMAK.F;PARMAK.M=PARMAK.H;
function pNok(p){      // [t,x,y] ya da [t,'buton'] → ekran px
  if(typeof p[1]==='string'){const el=document.getElementById({zipla:'zipla',sag:'sag',isp:'ispB'}[p[1]]),r=el&&el.getBoundingClientRect();
    if(r&&r.width)return [r.left+r.width/2,r.top+r.height/2];return [innerWidth*0.88,innerHeight*0.85]}
  return [p[1]*innerWidth,p[2]*innerHeight];
}
function parmakTemizle(){PCX.setTransform(1,0,0,1,0,0);PCX.clearRect(0,0,PCV.width,PCV.height)}
function parmakCiz(t){
  const d=Math.min(devicePixelRatio||1,GR_DPR[GR]),w=Math.round(innerWidth*d),hh=Math.round(innerHeight*d);
  if(PCV.width!==w||PCV.height!==hh){PCV.width=w;PCV.height=hh}
  parmakTemizle();
  if(KMOD!=='dokun'||!DEMO||!agacAcik||!PIM)return;
  const f=PARMAK[DEMO.k];if(!f)return;
  PCX.setTransform(d,0,0,d,0,0);
  for(const iz of f()){
    const t0=iz[0][0],t1=iz[iz.length-1][0],on=0.3;if(t<t0-on||t>t1+on)continue;
    let q;if(t<=t0)q=pNok(iz[0]);else if(t>=t1)q=pNok(iz[iz.length-1]);
    else{let i=0;while(i<iz.length-2&&t>iz[i+1][0])i++;const a=pNok(iz[i]),b=pNok(iz[i+1]),u=kisit((t-iz[i][0])/Math.max(0.01,iz[i+1][0]-iz[i][0]),0,1),e=u*u*(3-2*u);q=[a[0]+(b[0]-a[0])*e,a[1]+(b[1]-a[1])*e]}
    const p=t<t0?1-kisit((t0-t)/0.15,0,1):t>t1?1-kisit((t-t1)/0.15,0,1):1;      // basma: büyükten küçüğe
    const al=t<t0?kisit((t-(t0-on))/0.1,0,1):t>t1?kisit((t1+on-t)/0.1,0,1):1;
    const sk=1.18-0.3*p,ph=innerHeight*0.17*sk,pw=ph*PIM.width/PIM.height;
    PCX.globalAlpha=al;
    if(p>0.6){PCX.strokeStyle=`rgba(255,255,255,${0.8*(p-0.6)/0.4})`;PCX.lineWidth=3;PCX.beginPath();PCX.arc(q[0],q[1],innerHeight*0.035,0,7);PCX.stroke()}      // basılan yer
    PCX.drawImage(dk(PIM,ph*2/PIM.height),q[0]-pw*0.43,q[1]-ph*0.03,pw,ph);
  }
  PCX.globalAlpha=1;
}
