'use strict';
// Arka plan, çizim, ana döngü
function arkaPlan(camX,zeminY){
  if(BATI()){batiArka(camX,zeminY);return}      // 9. bölüm: Vahşi Batı (bati.js). Temalar gökyüzünü kendi boyar (v0.475: önce liman göğü boyanıp üstüne tema göğü boyanmaz)
  if(BATAK()){batakArka(camX,zeminY);return}      // 7-8. bölüm: karanlık bataklık (bataklik.js)
  if(MISIR()){misirArka(camX,zeminY);return}      // 5-6. bölüm: Mısır çölü (misir.js)
  if(KARLI()){karArka(camX,zeminY);return}      // 3-4. bölüm: karlı dağ (kar.js)
  const gece=ZOR_N===1,G=gece?null:CVR[GOK_AD];
  const gAlt=Math.min(H,Math.max(1,Math.ceil(dagTaban(zeminY))+4));      // v0.475: gökyüzü yalnız dağın tabanına kadar çizilir (altı toprak/deniz/zeminle kaplanır: boşa boyama yok)
  if(gece){
    if(GR===0){ctx.fillStyle='#102242';ctx.fillRect(0,0,W,gAlt)}
    else{if(!GOK_G){GOK_G=ctx.createLinearGradient(0,0,0,zeminY);GOK_G.addColorStop(0,'#081229');GOK_G.addColorStop(1,'#1c3461')}ctx.fillStyle=GOK_G;ctx.fillRect(0,0,W,gAlt)}
  }else if(!G||!dkVar(G)){      // gökyüzü görseli ekranı tam kaplar: hazırsa altına ayrıca renk boyanmaz
    if(GR===0){ctx.fillStyle='#d9e7e0';ctx.fillRect(0,0,W,gAlt)}
    else{if(!GOK){GOK=ctx.createLinearGradient(0,0,0,zeminY);GOK.addColorStop(0,'#bfe3ee');GOK.addColorStop(1,'#f1ead2')}ctx.fillStyle=GOK;ctx.fillRect(0,0,W,gAlt)}
  }
  // en arka: gökyüzü görseli, ekran boyunu kaplar, uç uca döşenir (her ikinci kopya aynalanır: kenarlar dikişsiz), çok yavaş kayar
  if(G){const ek=H*0.12,th=H+ek,tw=th*G.width/G.height,gy=Math.round(-ek+Math.min(ek,S.camY*SC*GOK_H)),ofs=KX*SC*GOK_H,i0=Math.floor(ofs/tw);      // parallaks: yatay/dikey GOK_H; görsel ekrandan biraz uzun, zıplayınca aşağı iner
    const gb=dkh(G,th),fr=kisit((gAlt-gy)/th,0,1),kw=gb.width,kh=gb.height*fr,dw=Math.ceil(tw)+1,dh=th*fr;      // sadece görünen üst kısmı çizilir
    if(fr>0)for(let i=i0;(i-i0)*tw-((ofs%tw)+tw)%tw<W;i++){const x=Math.floor((i-i0)*tw-((ofs%tw)+tw)%tw);
      if(i&1){ctx.save();ctx.translate(x+Math.ceil(tw),0);ctx.scale(-1,1);ctx.drawImage(gb,0,0,kw,kh,0,gy,dw,dh);ctx.restore()}else ctx.drawImage(gb,0,0,kw,kh,x,gy,dw,dh)}}
  else if(gece){ctx.save();if(GR>0){ctx.fillStyle='rgba(255,250,220,0.65)';for(let i=0;i<(GR===2?24:10);i++){const sx=((Math.imul(i+3,2654435761)>>>0)%1000)/1000*W-camX*0.02,sy=((Math.imul(i+11,1103515245)>>>0)%450)/1000*zeminY;ctx.fillRect(((sx%W)+W)%W,sy,2,2)}}ctx.fillStyle='rgba(255,244,195,0.9)';ctx.beginPath();ctx.arc(W*0.78,H*0.16,Math.min(W,H)*0.045,0,Math.PI*2);ctx.fill();ctx.restore()}
  cevreArka(zeminY);      // evler, tahta iskele, iskele nesneleri (cevre.js)
}
function ciz(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const zeminY=ZY();
  S.shx=S.sars>0.3?(Math.random()-.5)*S.sars:0;S.shy=S.sars>0.3?(Math.random()-.5)*S.sars:0;
  ctx.translate(S.shx,S.shy);
  arkaPlan(KX,zeminY);
  catlakCiz();
  varilCiz(false);      // yerdeki variller düşmanların arkasında
  dusmanCiz();bossFxCiz();
  antiCiz();      // yanan düşman ateşi, bumerang bıçak
  ispCiz();
  if(GR>0&&!S.ol)kanCiz();      // LOW modda kan çizimi kapalı
  fxCiz(false);
  VT=ctx.getTransform();
  ctx.save();
  ctx.translate(W/2+(S.x-KX)*SC,zeminY-(S.y-S.camY)*SC);
  ctx.scale(SC*S.yon,SC);
  if(S.pence&&GR===2){ctx.shadowColor='#ffb02e';ctx.shadowBlur=(14+5*Math.sin(S.t*9))*DPR}      // bıçak modu: kenarlarından enerji barı renginde parlar
  karakter();
  ctx.restore();
  if(S.dag&&R.blade){      // blade: bıçak atlama uçuşu sırasında oyuncunun önünde bıçak görseli (artık arka planın üstünde çizilir)
    const bsx=W/2+(S.x-KX)*SC,bsy=zeminY-(S.y+200-S.camY)*SC;
    const bw=R.blade.width*SC*0.6,bh=R.blade.height*SC*0.6;
    ctx.save();ctx.translate(bsx,bsy);ctx.scale(S.dag.dir,1);ctx.globalAlpha=0.85;ctx.drawImage(dkw(R.blade,bw),-bw/2,-bh/2,bw,bh);ctx.restore();
  }
  if(GR>0&&S.ol)kanCiz();
  atesElCiz();      // (ıspanak yaprakları oyuncu.js'te, kutunun arkasında); yakan yumruğun alevi karakterin önünde
  varilCiz(true);
  fxCiz(true);
  if(GR>0)karCiz();
  if(!KARLI()&&!MISIR()&&!BATAK()&&!BATI())cevreOn(zeminY);
  efektCiz();
  ctx.setTransform(DPR,0,0,DPR,0,0);hud(S.dtG||0.016);
}

// ---------- Bölüm hazırlığı (v0.475) ----------
// Bir bölüm oynanmadan önce (açılışta ve bölüm değişince): 1) o temanın paketi yüklenir, 2) çizilecek her görselin ekran boyu kopyası hazırlanır (onIste),
// 3) kopyalar grafik belleğine bir kez çizilerek yüklenir ve sahne birkaç kez boşa çizilir (ısınma). Bunlar yükleme ekranının arkasında olur: oyun açıldığında ilk kare bile takılmaz.
let PK_BEK=false,HAZ_N=-1,HAZ_OK=false;      // PK_BEK: bölüm hazırlanıyor (oyun bekler); HAZ_N: hazırlanan bölüm; HAZ_OK: açılış hazırlığı bitti (giris.js yükleme ekranı bunu bekler)
function kare(f){let ok=false;const g=()=>{if(ok)return;ok=true;f()};requestAnimationFrame(g);setTimeout(g,250)}      // sonraki kare (sekme arkadaysa da ilerler)
function onIste(){
  if(R.w_buyu&&typeof MISIR==='function'&&MISIR())dkOn(R.w_buyu,DK_KO);      // büyücü kadının ateş büyüsü

  const k=DK_KO;
  for(const a of ADLAR)dkOn(R[a],DK_OY);
  for(const L of [YUZ,YUZA,YUZY])for(const im of L)dkOn(im,DK_OY*1.15);
  for(const im of YARAI)dkOn(im,DK_OY*0.5);
  const T={k:1,b:1};      // önizleme (yetenek ağacı) hep k ve b korsanını kullanır
  for(const e of DUS){const q=e.sk||e.kc;if(q&&KSK[q])T[q]=Math.max(T[q]||0,e.bs||1)}
  {const b=ZOR_N>=8?'x':ZOR_N>=6?'t':ZOR_N>=4?'z':ZOR_N>=2?'y':ZOR_N>=1?'m':'p';T[b]=Math.max(T[b]||0,1.25)}      // bölüm sonu boss'u (mermi.js bossKur ile aynı sıra)
  for(const q in T){const K=KSK[q];if(!K||!R[K.p+'govde'])continue;const r=K.sc*T[q]*krpMx(K)*k;for(const n in R)if(n.startsWith(K.p))dkOn(R[n],r)}
  for(const L of [KANI,KARI,TASI,KIYI])for(const im of L)dkOn(im,k);
  for(const n of ['patla','sprey','yarik','aduket_su','damla','yaprak','yarik2','p_mermi','p_ates','f_ates','blade'])dkOn(R[n],k);
  for(const n of ['v_varil','v_h0','v_h1','v_h2',...[...Array(14).keys()].map(i=>'v_c'+i)])dkOn(R[n],V_PX*k);
  for(const n of ['isp','ispB'])if(R[n])dkOn(R[n],ISP_BOY*k/R[n].width);
  for(const n of ['bos','can','en','kalp','cerceve']){const im=R['bar_'+n];if(im)dkOn(im,barGen()*1.1*DPR/im.width)}
  const c=bolumCfg();if(c)temaHazir(c);else cevreHazir();
}
function isit(cb){      // kopyaları grafik belleğine yükler: her biri bir kez küçücük çizilir (parça parça, kare başına 40), sonra sahne 3 kez çizilir
  const L=[];for(const im of DK_L){const b=im._d&&im._d.b;if(!b)continue;L.push(b);const v=b._v;if(v)for(const n in v)L.push(v[n])}
  let i=0;
  const adim=()=>{
    try{ctx.setTransform(1,0,0,1,0,0);for(let n=0;n<40&&i<L.length;n++,i++)try{ctx.drawImage(L[i],0,0,2,2)}catch(_){}}catch(_){}
    if(i<L.length){kare(adim);return}
    let m=0;const sah=()=>{try{ciz()}catch(_){}if(++m<3)kare(sah);else cb()};kare(sah)};
  kare(adim);
}
function bolumHazirla(cb){
  const ad=paketAd(ZOR_N);let bitti=false;
  const son=()=>{if(bitti)return;bitti=true;try{tuvalYenile()}catch(_){}cb()};
  setTimeout(son,20000);      // güvenlik: ne olursa olsun 20 sn'de oyun açılır
  const hazir=()=>{try{paketBirak(ad);onIste()}catch(_){}
    dkBekle(()=>{try{dkTurHazir()}catch(_){}
      isit(()=>dkBekle(()=>{try{dkTurHazir()}catch(_){}isit(son)}))})};      // ilk ısınmada istenen kopyalar (ör. HUD) hazır olunca bir tur daha
  const bekle=()=>{if(kalan>0||!gorselHazir.ok){YUK_CB.push(bekle);return}paketYukle(ad,hazir)};
  bekle();
}
function bolumGecis(){      // yeniOyun sonunda: bölüm değiştiyse yükleme yazısıyla hazırlanır, o sırada oyun bekler
  if(HAZ_N<0||HAZ_N===ZOR_N)return;
  HAZ_N=ZOR_N;PK_BEK=true;const y=document.getElementById('yuk');y.textContent=dil('yuk');y.hidden=false;
  bolumHazirla(()=>{PK_BEK=false;y.hidden=true});
}
// ---------- Döngü ----------
let son=0;
function dongu(ms){
  if(ms===dongu.ms)return;dongu.ms=ms;      // aynı kare iki kez çağrılırsa (çift döngü) atlanır
  requestAnimationFrame(dongu);      // önce sonraki kare istenir: bir karede hata olsa bile oyun donmaz
  if(!agacAcik&&DEMO)demoBitir();      // güvenlik kilidi: yetenek ağacı kapalıyken önizleme kesinlikle kalamaz, oyun ve karakterler anında geri yüklenir
  if(girisAcik||hakAcik||menuAcik||listeAcik||PK_BEK||(agacAcik&&!DEMO)){son=ms;return}      // kombo listesi / ağaç açıkken oyun durur (ağaçta yetenek önizlemesi hariç)
  if(DEMO)demoAdim();
  if(!Number.isFinite(S.x)||!Number.isFinite(S.y)||!Number.isFinite(S.camY)||!Number.isFinite(SC)||SC<=0)oyunKurtar();
  let dt=Math.min(0.05,(ms-son)/1000||0.016);      // 20 FPS'e kadar gerçek zamanlı (yavaş telefonda ağır çekime girmez)
  son=ms;S.dtG=dt;
  if(S.dur>0){S.dur-=dt;dt*=0.08}
  S.sars*=Math.pow(0.002,dt);S.t+=dt;
  const gA=DEMO?0:gyroAx(),ax=(S.ol||S.cg||S.yak||S.t<(S.firlatT||0))?0:Math.max(-1,Math.min(1,(key.sag?1:0)-(key.sol?1:0)+gA)), yon=Math.abs(ax)>0.01?Math.sign(ax):0;
  const hed=ax*HIZ*(S.atk&&S.yer?0.35:1)*(S.yer&&asagiMi()?0.45:1)*antiHiz();
  const ivme=S.yer?((gA===0&&S.vx*hed>=0&&Math.abs(hed)>Math.abs(S.vx))?2800:9000):6000;      // tuşla koşu yavaş hızlanır (telefon eğimi aynı kalır)
  if(yon){S.yon=yon;S.vx+=Math.sign(hed-S.vx)*Math.min(Math.abs(hed-S.vx),ivme*dt)}
  else if(S.t>=(S.firlatT||0)){S.vx-=Math.sign(S.vx)*Math.min(Math.abs(S.vx),(S.yer?12000:2500)*dt)}
  if(S.sman){
    const m=S.sman,u=(S.t-m.t0)/m.T;
    if(u>=1){S.sman=null;S.spin=0}
    else{S.yon=m.dir;S.spin=Math.PI/2*(u<0.2?u/0.2:(u>0.8?(1-u)/0.2:1));S.vx=m.dir*3800*(u<0.85?1:(1-(u-0.85)/0.15))}
  }
  if(S.atk){const mv=HAREKET[S.atk.ad];if(mv&&mv.dash){const u=S.atk.t/mv.dur;if(u>=mv.dash[0]&&u<mv.dash[1])S.vx=S.yon*mv.dash[2]/((mv.dash[1]-mv.dash[0])*mv.dur)}}   // ileri atılan hareketler (uçan tekme vb.)
  if(S.yy){const m=S.yy,u=(S.t-m.t0)/m.T;S.vx=0;S.yon=m.dir;if(u>=1)S.yy=null;else if(!m.hit&&u>=0.3){m.hit=true;yerYumrukVur(m)}}
  if(S.alk){const m=S.alk,u=(S.t-m.t0)/m.T;if(u>=1)S.alk=null;else{if(u<0.4)S.vx*=0.8;if(!m.hit&&u>=0.4)alkisVur()}}
  antiGuncelle(dt);kontrolGuncelle(dt);catlakGuncelle();kanGuncelle(dt);karGuncelle(dt);
  if(S.pence){S.en-=dt*7.5;if(S.en<=0){S.en=0;penceKapa()}else if(S.blok&&S.t-S.pence.t0>0.5)penceKapa()}      // pençe: enerji dolma hızının 3 katı hızla biter; guard alınca bıçaklar girer
  else S.en=Math.min(ENMAX,S.en+dt*2.5*(S.t<(S.ispEnT||0)?2:1));      // ıspanaktan sonra 10 sn 2 kat dolum
  if(S._rh!==undefined&&S.hp<S._rh-0.001){S.hasT=S.t;S.regB=6+2*Math.random()}      // son hasar zamanı
  if(S.durum==='oyun'&&S.hp>0&&S.hp<HPMAX&&((S.t-(S.hasT||-9)>=(S.regB||6)&&!antiDolumYok())||(S.blok&&YV('W'))))S.hp=Math.min(HPMAX,S.hp+HPMAX*0.01*(YV('X')?3:YV('O')?2:1)*dt);      // saniyede max canın %1'i; Can Dolumu %2 / %3; Kalkanlı Savunma: blokta vurulsa da hemen dolar
  ispCepCiz();      // hasardan 6-8 sn (rastgele) sonra iyileşir
  S._rh=S.hp;
  if(S.t<S.lungeT){const u=(S.t-S.lungeS)/Math.max(0.1,S.lungeT-S.lungeS);S.vx=S.lungeV*(1-u*u)}
  if(S.kayKilit&&S.t>=S.lungeT){      // kayma bitince: durur/yavaşlarsa ya da koşarak biraz yol alırsa yeni kayma açılır (koş-kay-koş-kay)
    const v=Math.abs(S.vx);if(v<=HIZ*1.02&&v>=HIZ*0.5)S.kayYol=(S.kayYol||0)+v*dt;
    if(v<HIZ*0.5||(S.kayYol||0)>=KAY_YOL){S.kayKilit=false;S.kayYol=0}}
  if(S.dkick)S.vx=S.dkick.vx;
  if(S.ust)ustGuncelle();
  if(S.dag)dagGuncelle(dt);
  if(S.sup&&S.t<S.sup.t0+S.sup.T)S.vx=0;      // kayarak yumruk: kısa süre öne atılır
  ispGuncelle(dt);varilGuncelle(dt);
  if(typeof yakGuncelle==='function')yakGuncelle();
  if(!S.yak||(S.yak.e.sk==='y'&&S.yak.e.yak&&S.yak.e.yak.ph!=='tut')){
  {const nx=S.x+S.vx*dt;                                        // yüksek basamak/kutu duvar gibidir: üstüne zıplamak gerekir
    if(zemin(nx)>S.y+(S.yer?75:30)){S.vx=0;S.lungeT=-1}else S.x=nx}
  atkGuncelle(dt);
  const zH=zemin(S.x);
  if(S.yer){
    if(zH<S.y-70){S.yer=false;S.vy=0}                      // yüksek basamaktan düşme
    else{S.y+=(zH-S.y)*(1-Math.exp(-dt*(zH>S.y?28:22)));if(Math.abs(S.y-zH)<0.4)S.y=zH}
  }
  if(!S.yer){
    S.vy+=G*dt;S.y-=S.vy*dt;
    if(S.tats>0){const u=S.t-S.tats;if(u>0.8){S.tats=0;S.spin=0}else{S.vy=-250;S.spin+=dt*Math.PI*2*2/0.8}}   // kasırga: havada asılı döner
    if(S.donuyor){S.spin+=dt*Math.PI*2/ROLL_SURE;if(S.spin>=Math.PI*2){S.spin=0;S.donuyor=false}}
    if(S.y<=zH&&(S.vy>=0||S.y<zH-1)){S.y=zH;S.vy=0;S.yer=true;S.firlatT=0;if(WDS)bufCal(WDS,0.9);else torbaCal(INS,INSBAG,0.9);if(!S.slam&&!S.dkick)antiInis(zH);S.donuyor=false;S.tuck=0;S.spin=0;S.shoryu=0;S.tats=0;
      if(S.slam){S.slam=false;zeminVur(1.15,50*PK());S.sup={t0:S.t,T:0.6};karBas(S.x,300,KMIN-6,false);S.karYer=true}      // iki ayak yere: iki patlama
      if(S.dkick){const t0=S.dkick.t0;S.dkick=null;zeminVur(0.5,0,t0);karBas(S.x,230,KMIN-4,false);S.karYer=true}}      // tek ayak: bir patlama
  }
  }
  arGuncelle(dt);      // dalga kilidi, sağ duvar ve kamera (dusman_kur.js)
  const z0=zemin(S.x),zJ=1-0.2*kisit((S.y-z0-500)/1100,0,1);      // yükseğe çıkınca (500 üstü) kamera geri çekilir: en çok %20 daha uzak (1600'de)
  {const hz=ZOOM*zJ;if(Math.abs(hz-ZM)>1e-4){ZM+=(hz-ZM)*(1-Math.exp(-dt*4));if(Math.abs(hz-ZM)<1e-3)ZM=hz;SC=SC0*ZM;GOK=null}}      // zıpkın modunda %50 uzak (alttan açmaz, üste açar)
  {const hd=Math.max(Math.min(S.y,z0),S.y+KARAKTER_BOY-(ZY()-H*0.1)/SC);S.camY+=(hd-S.camY)*(1-Math.exp(-dt*5))}      // ölü bölge: kamera yerde kalır, sadece kafa ekranın üst %10'una girince yukarı takip eder
  if(S.yer&&Math.abs(S.vx)>40)S.faz+=dt*Math.abs(S.vx)/HIZ*2*Math.PI*1.05*(1+0.45*kisit((Math.abs(S.vx)/HIZ-0.55)/0.35,0,1));
  {const k=Math.floor(S.faz/Math.PI);if(S.adk!==undefined&&k!==S.adk&&S.yer){adimCal(S.x,asagiMi()?0.5:1);karBas(S.x+S.yon*(k%2?70:10),85,KMIN,KARLI(),-S.yon);if(KARLI())for(let j=0;j<3;j++)karAt(S.x+S.yon*(k%2?60:0),zemin(S.x)+10,-S.yon*(120+Math.random()*280),220+Math.random()*380,false)}S.adk=k}      // her adım karda iz bırakır
  olumGuncelle(dt);rkGuncelle(dt);pozGuncelle(dt);
  ciz();
  elHiz(dt);vurusKontrol();grabKontrol(dt);ikiElKontrol(dt);elDurum(dt);mermiGuncelle(dt);emerGuncelle(dt);dusmanGuncelle(dt);carpisma();blokGuncelle(dt);zitKontrol();ciftKontrol();yereKontrol();alkisKontrol();inisGuncelle();oyuncuHasar();muzikGuncelle();
}
dusmanKur();      // ilk düşmanlar (tüm dosyalar yüklendikten sonra)
HAZ_N=ZOR_N;bolumHazirla(()=>{HAZ_OK=true});      // açılış: kayıtlı bölümün paketi + kopyalar + ısınma (yükleme ekranı bitince oyun hazır)
