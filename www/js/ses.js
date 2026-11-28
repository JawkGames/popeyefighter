'use strict';
function bosKes(b){      // sesin başındaki sessizliği kes (~4 ms pay bırak)
  const d=b.getChannelData(0);let i=0;while(i<d.length&&Math.abs(d[i])<0.004)i++;
  i=Math.max(0,i-Math.round(b.sampleRate*0.004));if(i<=0)return b;
  const o=AC.createBuffer(b.numberOfChannels,b.length-i,b.sampleRate);
  for(let c=0;c<b.numberOfChannels;c++)o.getChannelData(c).set(b.getChannelData(c).subarray(i));return o}
// Sesler (WebAudio), titreşim
let AC=null,SFXG=null,MUZG=null,SES_TOP=0,SES_BIT=0;      // SES_TOP/SES_BIT: yükleme çubuğu için toplam / biten ses
const AYAR={ses:true,muz:true,amb:true,gr:2};try{Object.assign(AYAR,JSON.parse(localStorage.getItem('pf_ayar')||'{}'))}catch(_){}      // menü ayarları: ses efektleri, müzik
function ayarKaydet(){try{localStorage.setItem('pf_ayar',JSON.stringify(AYAR))}catch(_){}sesSeviye()}
function sesSeviye(){if(SFXG)SFXG.gain.value=AYAR.ses?1:0;if(MUZG)MUZG.gain.value=AYAR.muz?1:0;if(ARK_GAIN)ARK_GAIN.gain.value=AYAR.amb&&!(typeof KARLI==='function'&&KARLI())&&!(typeof MISIR==='function'&&MISIR())&&!(typeof BATAK==='function'&&BATAK())&&!(typeof BATI==='function'&&BATI())?0.35:0;if(!AYAR.muz){if(MUZ_SRC){try{MUZ_SRC.stop()}catch(_){}MUZ_SRC=null}MUZ_AKT=null}}
const SFXC=()=>SFXG||AC.destination,MUZC=()=>MUZG||AC.destination;      // efekt / müzik çıkışı (menüden kapatılır)
function sesKur(){
  if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();SFXG=AC.createGain();SFXG.connect(AC.destination);MUZG=AC.createGain();MUZG.connect(AC.destination);sesSeviye()}catch(_){AC=null;return false}}
  sesYukle();return true;
}
function sesAc(){
  if(!sesKur())return;
  if(AC.state==='suspended'&&!document.hidden){const p=AC.resume();if(p&&p.then)p.then(arkaCal,()=>{})}else arkaCal();
}
// v0.439: sesler açılış (yükleme) ekranında önceden indirilip çözülür; eskiden ilk dokunuşta (BAŞLA) ~100 ses birden çözülüyordu ve oyun başında takılıyordu. Ses ilk dokunuşta açılır.
addEventListener('DOMContentLoaded',()=>{try{sesKur()}catch(_){}});
function arkaPlanSes(){if(!AC)return;if(document.hidden){if(AC.state==='running')AC.suspend()}else if(AC.state==='suspended')AC.resume()}      // oyun arkaya düşünce (sekme, uygulama, ekran kilidi) tüm sesler susar
document.addEventListener('visibilitychange',arkaPlanSes);addEventListener('pagehide',()=>{if(AC&&AC.state==='running')AC.suspend()});addEventListener('pageshow',arkaPlanSes);
['pointerdown','keydown','touchstart','click'].forEach(ev=>addEventListener(ev,sesAc,{passive:true}));
const SES_SON={};
let SULS=null,WWS=null,VKS=null,PDS=null,SARJ=null,FPAT=null,BUYS=null,ENPOS=[],SWD=null,YAR=null,HAZ=null,PAT=null,PPAR=null,SAPLA=null,SYUK=false,AD_SON=0,EMER=[],EFL=[];      // HAZ/PAT: kaptanın nişan ve ateş sesi, PPAR: yırtma, SAPLA: bıçak saplanma; EMER: düşman mermileri, EFL: namlu ateşi
const ADKR=[],ADKRBAG=[];let YARS=null;      // ADKR: karlı bölüm adım sesleri, YARS: yarık açık kaldıkça çalan ses (karlı bölüm)
const PB=[],PBAG=[],AD=[],ADBAG=[],TK=[],TKBAG=[],KLC=[],WH=[],WHBAG=[],JP=[];let JPBAG=[],JPSON=-1;      // yumruk, adım, tekme, bıçak sesleri (torba: hepsi bir kez çalınmadan aynısı tekrar gelmez)
const TD=[],TDBAG=[],DMR=[],DMRBAG=[];let TCS=null,GOS=null,GOH=null;      // GOS: kaybedince (game over), GOH: kanca bize takılınca      // varil: tahta parçası yere düşme, demir halka, ilk kırılma sesi
const BLD=[],BLDBAG=[],INS=[],INSBAG=[],OLS={};let WDS=null,TVS=null,OLDS=null,ADKS=null,ADKC=null,LVS=null,KALPS=null,BOPEN=null,USTS=null,GRS=null,DSS=null,DEVS=null,ARK=null,ARKSRC=null,ARK_GAIN=null;      // bıçak vuruşu, yere iniş, ölüm (k/b/p/h), üstüne atlama, tutma, düşman düşmesi, arka plan müziği
// Müzik (menüdeki müzik düğmesi): normal oyun = bgm_ambient, kaptan boss savaşı = bgm_silah, kılıç ustası boss savaşı = bgm_kilic. Deniz sesi ayrı (ambiyans düğmesi)
let MUZ_BUF={amb:null,kilic:null,silah:null};
let MUZ_SRC=null,MUZ_GAIN=null,MUZ_AKT=null,MUZ_BT='';
// v0.485: her bölümün kendi müziği (ses/m_b1..9.mp3) + ortak boss müziği (m_boss, 3. bölümden sonraki boss'lar). Hepsi CC0 (OpenGameArt).
// Bölüm müziği açılışta değil o bölüme gelince indirilip çözülür; başka bölümlerinki bellekten bırakılır. Hazır olana kadar 'amb' çalar.
const MUZ_IST={};
function muzikIste(tip){      // 'b1'..'b9' | 'boss': arka planda yükle
  if(MUZ_BUF[tip]||MUZ_IST[tip]||!AC)return;MUZ_IST[tip]=1;
  fetch('ses/m_'+tip+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(b=>AC.decodeAudioData(b)).then(b=>{MUZ_BUF[tip]=b;MUZ_IST[tip]=0}).catch(()=>{MUZ_IST[tip]=0;MUZ_HATA[tip]=(MUZ_HATA[tip]||0)+1});
}
const MUZ_HATA={};
function muzikCal(tip){      // 'amb' | 'kilic' | 'silah' | 'b1'..'b9' | 'boss' — aynı tip çalıyorsa değiştirme
  if(!AC||!AYAR.muz)return;
  if(!MUZ_BUF[tip]&&tip.length<=4&&tip!=='amb'){if((MUZ_HATA[tip]||0)<3)muzikIste(tip);if(MUZ_AKT)return;tip='amb'}      // daha yüklenmedi: çalan devam eder (hiç yoksa 'amb')
  if(!MUZ_BUF[tip]||MUZ_AKT===tip)return;
  MUZ_AKT=tip;
  for(const k in MUZ_BUF)if(/^b\d$/.test(k)&&k!==tip&&k!==MUZ_BT)MUZ_BUF[k]=null;      // çalmayan bölüm müzikleri bellekten çıkar
  if(MUZ_SRC){try{MUZ_SRC.stop()}catch(_){}MUZ_SRC=null}
  const g=MUZ_GAIN||(MUZ_GAIN=AC.createGain(),MUZ_GAIN.gain.value=0.5,MUZ_GAIN.connect(MUZC()),MUZ_GAIN);
  const s=AC.createBufferSource();s.buffer=MUZ_BUF[tip];s.loop=true;s.connect(g);s.start();MUZ_SRC=s;
}
function muzikGuncelle(){      // dongu.js'den her frame: yaşayan boss varsa onun müziği, yoksa normal oyun müziği
  if(!AC)return;
  if(S.durum==='yenildi'){if(MUZ_SRC){try{MUZ_SRC.stop()}catch(_){}MUZ_SRC=null}MUZ_AKT=null;return}      // ölünce müzik susar (sadece ölüm sesi), yeni oyunda geri gelir
  const D=typeof DUS!=='undefined'?DUS:[];
  const b=D.find(e=>e.boss&&e.hp>0);
  const bt='b'+(Math.min(typeof ZOR_N==='number'?ZOR_N:0,8)+1);
  if(MUZ_BT!==bt){MUZ_BT=bt;for(const k in MUZ_BUF)if(/^b\d$/.test(k)&&k!==bt&&k!==MUZ_AKT)MUZ_BUF[k]=null;if(bt>='b3')muzikIste('boss')}      // bölüm değişti: eski bölüm müziği bellekten çıkar, boss müziği önceden istenir
  muzikCal(b?(b.sk==='m'?'kilic':!b.sk?'silah':'boss'):bt);
}
function arkaCal(){      // arka plan deniz sesi: döngü; her kopyanın son 0.5 sn'sinde bir sonraki başlar, üst üste binerek geçer (atlama duyulmaz)
  if(!AC||!ARK||ARKSRC)return;ARKSRC=true;
  ARK_GAIN=AC.createGain();ARK_GAIN.gain.value=AYAR.amb&&!(typeof KARLI==='function'&&KARLI())&&!(typeof MISIR==='function'&&MISIR())&&!(typeof BATAK==='function'&&BATAK())&&!(typeof BATI==='function'&&BATI())?0.35:0;      // karlı/mısır/bataklık/batı bölümünde deniz sesi yok
 ARK_GAIN.connect(AC.destination);      // deniz sesi sadece ambiyans düğmesine bağlı (müzik düğmesi etkilemez)
  const D=ARK.duration,X=0.5,g=ARK_GAIN;let t=AC.currentTime+0.05;
  const bas=t0=>{const s=AC.createBufferSource(),f=AC.createGain();s.buffer=ARK;s.connect(f);f.connect(g);
    f.gain.setValueAtTime(0,t0);f.gain.linearRampToValueAtTime(1,t0+X);f.gain.setValueAtTime(1,t0+D-X);f.gain.linearRampToValueAtTime(0,t0+D);s.start(t0);s.stop(t0+D+0.05)};
  const sira=()=>{if(t<AC.currentTime)t=AC.currentTime+0.05;bas(t);t+=D-X;setTimeout(sira,Math.max(200,(t-AC.currentTime-2)*1000))};
  sira();
}
function bufCal(buf,v){if(!AC||!buf||DEMO)return;const src=AC.createBufferSource(),g=AC.createGain();src.buffer=buf;g.gain.value=v||1;src.connect(g);g.connect(SFXC());src.start()}
function torbaCal(L,B,v){if(!L.length)return;if(!B.length)B.push(...L.keys());bufCal(L[B.splice(Math.floor(Math.random()*B.length),1)[0]],v)}
function sesYukle(){
  if(SYUK||!AC)return;SYUK=true;
  const y=(ad,al)=>{SES_TOP++;return fetch('ses/'+ad+'.mp3').then(r=>r.arrayBuffer()).then(b=>AC.decodeAudioData(b)).then(al).catch(e=>console.warn('Ses yüklenemedi: ses/'+ad+'.mp3',e)).then(()=>{SES_BIT++})};
  for(let i=1;i<=29;i++)y('woodfoot_'+i,b=>AD.push(b));
  for(let i=2;i<=6;i++)y('stepsnow_'+i,b=>ADKR.push(b));y('yarildi_sonra',b=>YARS=b);      // karlı bölüm      // tahta iskele adım sesleri (herkes için, torba ile rastgele)
  for(let i=1;i<=6;i++)y('kick_'+i,b=>TK.push(b));
  for(const i of [1,5,6,7])y('punch_'+i,b=>PB.push(b));
  y('blade',b=>SWD=b);y('gameover',b=>GOS=b);y('getoverhere',b=>GOH=b);
  for(let i=1;i<=3;i++)y('kilic_'+i,b=>KLC.push(b));
  for(let i=1;i<=5;i++)y('whoosh_'+i,b=>WH.push(b));
  for(let i=1;i<=3;i++)y('jump_'+i,b=>JP.push(b));      // sallama (boşta da dolu da): yumruk, tekme, bıçak
  for(const n of ['blade','blade_1','blade_2'])y(n,b=>BLD.push(b));for(const i of [1,2])y('inis_'+i,b=>INS.push(bosKes(b)));for(const k of ['k','b','p','h','f','m'])y('olum_'+k,b=>OLS[k]=b);
  y('ust_atla',b=>USTS=b);y('grap',b=>GRS=b);y('bladeopen',b=>BOPEN=b);y('dusme',b=>DSS=b);y('devrilses',b=>DEVS=b);y('deniz',b=>{ARK=b;if(AC.state==='running')arkaCal()});      // arka plan: deniz sesi
  y('bgm_ambient',b=>MUZ_BUF.amb=b);y('bgm_kilic',b=>MUZ_BUF.kilic=b);y('bgm_silah',b=>MUZ_BUF.silah=b);
  y('sersem_vurus',b=>SERSV=b);y('superman_ucus',b=>SMANS=b);
  y('tahta_carpma',b=>TCS=b);for(let i=1;i<=4;i++)y('tahta_dus_'+i,b=>TD.push(b));
  y('spinach-drop',b=>ISPS=b);y('levelup',b=>LVS=b);y('skill_oldur',b=>OLDS=b);y('tahtavurma',b=>TVS=b);y('wooddusme',b=>WDS=bosKes(b));      // havadan tahtaya düşme
  y('wateraduket',b=>ADKS=b);y('aduket_carpma',b=>ADKC=b);y('kalpsesi',b=>KALPS=b);y('yemeses',b=>YEMS=b);
  y('parcalanma',b=>PPAR=b);y('yarildi',b=>YAR=b);y('sapla',b=>SAPLA=b);y('mermi_haz',b=>HAZ=b);y('mermi_patla',b=>PAT=b);y('f_ates',b=>FPAT=b);y('buyu',b=>BUYS=b);y('varil_kafa',b=>VKS=b);y('su_sarj',b=>SULS=b);y('waterwhoosh',b=>WWS=b);y('popeye_die',b=>PDS=b);y('kiz_sarjor',b=>SARJ=b);
}
function ziplaCal(){            // zıplama sesi: torba sırası, peş peşe iki zıplama (ilk ve ikinci) asla aynı ses olmaz
  sesYay();      // zıplama gürültüsü: ekrandaki düşmanlar fark eder
  if(!AC||AC.state!=='running'||!JP.length)return;
  if(!JPBAG.length)JPBAG=[...JP.keys()];
  let c=JPBAG.filter(i=>i!==JPSON);if(!c.length)c=JPBAG;
  const i=c[Math.floor(Math.random()*c.length)];JPBAG.splice(JPBAG.indexOf(i),1);JPSON=i;bufCal(JP[i],0.8);
}
function savurCal(x){            // sallama sesi: herkes için; uzaktakiler daha kısık
  if(!AC||AC.state!=='running')return;
  const g0=kisit(1-Math.abs(x-S.x)/4500,0,1);if(g0<0.04)return;
  torbaCal(WH,WHBAG,0.8*g0);
}
function adimCal(x,g=1){            // ayak basış sesi; uzaktakiler daha kısık; g: ağırlık (kaptan daha gür)
  if(!AC||AC.state!=='running')return;
  const n=AC.currentTime;if(n-AD_SON<0.05)return;
  const g0=kisit(1-Math.abs(x-S.x)/4500,0,1);if(g0<0.04)return;AD_SON=n;
  if(KARLI()&&ADKR.length)torbaCal(ADKR,ADKRBAG,Math.min(1,0.2*g0*g));else torbaCal(AD,ADBAG,Math.min(1,0.2*g0*g));
}
function ses(tip){              // tip: 'yumruk' | 'tekme' | 'parca'; aynı anda çok vuruş = tek ses (düğüm yığılmasın)
  if(!AC||AC.state!=='running')return;
  const n=AC.currentTime;if(n-(SES_SON[tip]||-1)<0.045)return;SES_SON[tip]=n;
  if(tip==='parca')bufCal(PPAR,1);else torbaCal(tip==='tekme'?TK:PB,tip==='tekme'?TKBAG:PBAG,0.95);
}
let SMANS=null,SERSV=null,SERS_SON=-9;      // SMANS: süpermen uçuş sesi
      // sersemletme vuruşu sesi
function sersCal(){if(S.t-SERS_SON<0.15)return;SERS_SON=S.t;bufCal(SERSV,0.9)}      // aynı anda hem sersemletip hem düşüren vuruşta tek ses
let TITRE_SON=0;
function titre(ms){if(DEMO)return;const n=performance.now();if(n-TITRE_SON<60)return;TITRE_SON=n;try{if(navigator.vibrate)navigator.vibrate(ms)}catch(_){}}
