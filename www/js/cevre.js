'use strict';
// Liman çevresi: en arkada gökyüzü/deniz (gok, dongu.js arkaPlan), evler (derinlik katmanı), tahta iskele zemini (uç uca döşenir), en önde iskele kazıkları.
// Katmanlar: ev katmanı p=0.85 (uzak: yavaş kayar, küçük görünür), iskele + kazıklar p=1 (karakterlerle aynı). Kazıklar çift sıra: ön sıra karakterlerin önünde, arka sıra (küçük) iskelenin arkasında.
// Diğer nesneler (kasa, lamba, palmiye, fener…) netlik yetersiz olduğu için şimdilik kaldırıldı; daha net görseller gelince eklenecek. Ölçüler oyun birimi (Popeye boyu KARAKTER_BOY=1020).
const CVR={};
const EV_SET='yev';      // ev seti: yev0-7 (köy kulübeleri)
const GOK_AD='gok2';      // en arka plan: gökyüzü (3:1)
const CV_OBJ_AD='tezgah kuyu kasacuval variller samanaraba ilan yonlevha camasir balta saksi bank saman cit kaya cali fici_cicek fici_bitki teker cuval kup kutuk'.split(' ');      // v0.426: köy obje seti (21 obje), eski liman objeleri silindi
const CV_ADLAR=[GOK_AD,'zemin','dag_yakin','deniz',...CV_OBJ_AD.map(a=>'o_'+a),'tahta','kazik','sokak_lamba',...[0,1,2,3,4,5,6,7].map(i=>EV_SET+i)];
for(const a of CV_ADLAR)yukle('cevre/'+a+'.webp',im=>CVR[a]=/^(o_|yev)/.test(a)?soluk(im):im);      // evler ve objeler %15 soluk
const TAHTA_W=2400,TAHTA_AYAK=0.346;      // bir tahta şeridinin dünya eni; ayakların bastığı çizgi görselin üstünden bu oranda (yüzeyin ortası)
const TAHTA_ARKA=150;                     // tahta yüzeyinin arka kenarı: ayak çizgisinden bu kadar geride (evler buraya oturur)
const EV_P=0.75,EV_GERI=160,EV_BOL=[[0,1,3,5],[2,4,6,7]],EV_K=0.8;      // EV_K: evler %20 küçük (v0.437); 1. ve 2. bölüm evleri tamamen ayrı
      // ev katmanı derinliği (v0.379: 0.85→0.75, daha uzak/küçük) ve tabanının iskele arka kenarından geride (yukarıda) kalışı (dünya birimi)
const EV_TAB={yev:{boy:[1293,1200,1325,1308,1240,1500,1405,1310],oran:[1.095,1.136,1.024,1.074,1.118,0.906,1.062,0.921]}};
const EV_BOY=EV_TAB[EV_SET].boy,EV_ORAN=EV_TAB[EV_SET].oran;
const KAZIK_BOY=976,KAZIK_ON=332,KAZIK_ARK=15,KAZIK_KUC=0.78,KAZIK_ARA=TAHTA_W;      // uzun kazık (v0.365): tepeleri eskisiyle aynı yerde (ön: ayak çizgisinin 156 altı, arka: 396 üstü), altları suya iner; KAZIK_ON/ARK = kazık ortası;      // iskele kazıkları (yolla aynı katman, aynı hız): ön kazığın ortası iskelenin ön kenarında (ayak çizgisinin 159 altı), arka kazık arka kenarda ve perspektifle küçük; aralık = bir tahta şeridi
const LAMBA_BOY=1400,LAMBA_GERI=100;      // sokak lambaları: dünya boyu; tabanı ayak çizgisinin bu kadar gerisinde (iskelenin arka yarısı, karakterlerin arkası)
let CV_EV=[],CV_LMB=[],CV_OBJ=[];
// Çevre objeleri: giriş ekranındaki ev-obje oranları korunur; 1. ve 2. bölümde benzer objeler iki ayrı sete bölünür (hiç ortak yok).
const CV_OBJ_BOL=[
  ['tezgah','kasacuval','variller','samanaraba','ilan','balta','bank','cit','cali','fici_cicek','kup'],
  ['kuyu','camasir','yonlevha','saman','saksi','kaya','fici_bitki','teker','cuval','kutuk']
];
const CV_OBJ_BOY={tezgah:720,kuyu:728,ilan:620,camasir:640,yonlevha:580,samanaraba:616,kasacuval:460,teker:420,cit:392,saman:448,variller:560,bank:380,fici_cicek:448,fici_bitki:420,balta:340,cali:224,saksi:280,kaya:196,cuval:280,kup:270,kutuk:220},CV_OBJ_ORAN={tezgah:1.009,kuyu:0.89,kasacuval:0.843,variller:1.162,samanaraba:1.315,ilan:0.884,yonlevha:0.684,camasir:1.316,balta:1.066,saksi:1.32,bank:1.614,saman:1.193,cit:1.934,kaya:1.665,cali:1.234,fici_cicek:0.951,fici_bitki:1.175,teker:2.006,cuval:1.47,kup:0.849,kutuk:1.973},CV_OBJ_K=0.8;      // giriş ekranı ev-obje oranı + %20 küçük (v0.467)
function cevreKur(t1,t2){      // tohumlu rastgele dizilim; ilk açılış sabit tohum, her yeniden başlamada (yeniOyun) yeni tohum
  CV_EV=[];CV_LMB=[];CV_OBJ=[];
  const bi=(typeof ZOR_N!=='undefined'&&ZOR_N===1)?1:0,EV_HAVUZ=EV_BOL[bi],OBJ_HAVUZ=CV_OBJ_BOL[bi];
  let tohum=t1;const r=()=>{tohum=(Math.imul(tohum,1103515245)+12345)>>>0;return (tohum>>>8)/16777216};
  // evler: 2-3'lü sokak kümeleri, aralarda boşluk (arkadaki deniz görünür); evler birbirine binmez. bosluk: kümeler arası evsiz aralıklar (objeler buraya)
  let lx=-4200,son=-1,sag=null;const SON=(BOSS_X+3500)*EV_P,bosluk=[];      // v0.441: öğretici alanı (OGR_X) için evler daha soldan başlar
  while(lx<SON){
    if(sag!==null)bosluk.push([sag,lx]);
    const n=2+Math.floor(r()*2);
    for(let i=0;i<n;i++){let k;do k=EV_HAVUZ[Math.floor(r()*EV_HAVUZ.length)];while(k===son&&EV_HAVUZ.length>1);son=k;const eh=EV_BOY[k]*EV_K,ew=eh*EV_ORAN[k];CV_EV.push({ad:EV_SET+k,x:lx,h:eh});sag=lx+ew;lx+=ew+20+r()*60}      // evler arası dar sokak aralığı
    lx+=700+r()*900;
  }
  for(let x=-400;x<BOSS_X+2500;x+=1800+r()*2000){if(V_KONUM.some(v=>Math.abs(v-x)<450))x+=600;CV_LMB.push({x})}      // lambalar rastgele aralıklarla, varillerin üstüne gelmez
  {let tt=t2;const q=()=>{tt=(Math.imul(tt,1103515245)+12345)>>>0;return (tt>>>8)/16777216};      // objeler: ayrı tohum
    let son2='';
    for(const [a0,b0] of bosluk){let c=a0+90;const bit=b0-90;      // evlere her iki yandan 90 pay: değmez
      let ilk=true;
      for(;;){
        const dy=Math.round(5+q()*35),k=1+dy/300;
        const sig=OBJ_HAVUZ.filter(n=>n!==son2&&CV_OBJ_BOY[n]*CV_OBJ_K*k*CV_OBJ_ORAN[n]<=bit-c);
        if(!sig.length||(!ilk&&q()<0.35))break;
        const ad=sig[Math.floor(q()*sig.length)],w=CV_OBJ_BOY[ad]*CV_OBJ_K*k*CV_OBJ_ORAN[ad];
        CV_OBJ.push({ad,x:c+w/2,dy});son2=ad;ilk=false;c+=w+120+q()*180}      // objeler birbirine değmez
    }
    // evlerin önünde de objeler: daha yüksek dy ile daha aşağıda (daha yakın) görünür
    for(const e of CV_EV){
      if(q()>0.55)continue;      // her evin önünde %55 ihtimalle obje
      const idx=parseInt(e.ad.slice(EV_SET.length));
      const ew=e.h*EV_ORAN[idx];
      const c=e.x+ew*(0.15+q()*0.55);      // evin genişliğinde rastgele konum (%15-%70)
      const dy=Math.round(55+q()*65);      // 55-120: boşluktakinden (5-40) daha aşağıda
      const k=1+dy/300;
      const sig=OBJ_HAVUZ.filter(n=>n!==son2&&CV_OBJ_BOY[n]*CV_OBJ_K*k*CV_OBJ_ORAN[n]<ew*0.6);
      if(!sig.length)continue;
      const ad=sig[Math.floor(q()*sig.length)];
      CV_OBJ.push({ad,x:c+CV_OBJ_BOY[ad]*CV_OBJ_K*k*CV_OBJ_ORAN[ad]/2,dy});son2=ad;
    }
    {const sx=[...CV_OBJ].sort((a,b)=>a.x-b.x),gw=n=>CV_OBJ_BOY[n]*CV_OBJ_ORAN[n];      // soldan sağa: aynı obje art arda gelmez (eşi varsa aynı genişlikte ya da daha dar başka obje)
      for(let i=1;i<sx.length;i++)if(sx[i].ad===sx[i-1].ad){const nx=sx[i+1]&&sx[i+1].ad,al=OBJ_HAVUZ.filter(n=>n!==sx[i].ad&&n!==nx&&gw(n)<=gw(sx[i].ad));if(al.length)sx[i].ad=al[Math.floor(q()*al.length)]}}
    CV_OBJ.sort((a,b)=>a.dy-b.dy)}      // arkadakiler önce
}
cevreKur(20261024,20261027);
function cvCiz(im,sx,taban,h){      // taban: ekranda alt kenar (px), h: ekranda boy (px)
  if(!im)return;const w=h*im.width/im.height;
  if(sx+w/2<-40||sx-w/2>W+40)return;
  ctx.drawImage(dkh(im,h),Math.round(sx-w/2),Math.round(taban-h),Math.round(w),Math.round(h));
}
function atesCiz(sx,taban,h,w,id){      // kamp ateşi alevi (v0.385): odunların üstünde sürekli yanan harlı alev; üst odunları örter, alt odunlar az görünür
  if(sx+w<-40||sx-w>W+40)return;
  const t=performance.now()/1000+id*3.7,by=taban-h*0.5,bw=w*0.72,fh=h*1.35;
  ctx.save();ctx.globalCompositeOperation='lighter';
  const g=ctx.createRadialGradient(sx,by-fh*0.3,0,sx,by-fh*0.3,fh*1.1);g.addColorStop(0,'rgba(255,150,40,'+(0.3+0.06*Math.sin(t*11))+')');g.addColorStop(1,'rgba(255,120,30,0)');
  ctx.fillStyle=g;ctx.fillRect(sx-fh*1.1,by-fh*1.4,fh*2.2,fh*2.2);
  ctx.globalCompositeOperation='source-over';
  const L=[['#c8321a',1,1],['#ff7a1a',0.8,0.82],['#ffc23a',0.58,0.62],['#fff2b0',0.32,0.36]];
  for(let l=0;l<L.length;l++){const c=L[l][0],ww=bw*L[l][1],kh=L[l][2],n=5,tw=ww/n*1.5;ctx.fillStyle=c;
    ctx.beginPath();ctx.ellipse(sx,by,ww/2,ww*0.1,0,0,Math.PI*2);ctx.fill();
    for(let i=0;i<n;i++){const u=(i+0.5)/n-0.5,x=sx+u*ww*0.85,env=1-Math.abs(u)*1.3,fl=0.75+0.25*Math.sin(t*9+i*2.1+l)+0.12*Math.sin(t*23+i*5.3),th=fh*kh*env*fl,sw=Math.sin(t*6+i*1.7+l*0.5)*ww*0.08;
      ctx.beginPath();ctx.moveTo(x-tw/2,by);ctx.quadraticCurveTo(x-tw*0.5,by-th*0.5,x+sw,by-th);ctx.quadraticCurveTo(x+tw*0.5,by-th*0.5,x+tw/2,by);ctx.closePath();ctx.fill()}}
  ctx.globalCompositeOperation='lighter';ctx.fillStyle='#ffb040';
  for(let j=0;j<6;j++){const p=(t*0.7+j/6)%1,x=sx+Math.sin(j*12.9+t*2)*bw*0.3*(1+p),y=by-fh*(0.4+p*1.1);ctx.globalAlpha=1-p;ctx.beginPath();ctx.arc(x,y,h*0.025*(1-p*0.5),0,Math.PI*2);ctx.fill()}
  ctx.restore();
}
// ---------- Parallaks (v0.415) ----------
const DAG_P=0.35,DAG_BOY=2795,DAG_GERI=360;      // dağ: ölçek DAG_P, kayma DAG_H; tabanı iskele arka kenarından DAG_GERI geride
// Her katmanın tek bir kayma katsayısı var (h): kamera yatayda S.x, dikeyde S.camY kadar gidince katman ekranda h katı kayar. Aynı katmandaki her şey (evler, objeler, evlerin bastığı zemin) aynı h ile kayar: birbirinden kopmaz.
// Gökyüzü GOK_H < dağ DAG_H < zemin+evler+objeler EV_H < deniz (kıyıdan iskeleye doğru EV_H → DZ_H1) < iskele/lamba/kazık 1. Zıplayınca uzak katman az, yakın katman çok aşağı iner.
const EV_H=EV_P*EV_P,DAG_H=DAG_P*DAG_P,GOK_H=0.05,DZ_H1=1.18;
const ZEM_ALT=430,ZEM_BOY=1220;      // v0.422: zemin %15 büyük (alt sabit, yukarı büyür)
      // zemin görseli (ev katmanı ölçeğinde): alt kenarı ev tabanının ZEM_ALT altında (iskelenin arkasında kalır), boyu ZEM_BOY (üstü dağın eteğini örter)
const evTaban=()=>Math.round(ZY()-(TAHTA_ARKA+EV_GERI)*SC+6*SC*EV_P+S.camY*SC*EV_H)+3;      // evlerin, objelerin ve zeminin ortak taban çizgisi (ekran px)
function cevreArka(zeminY){      // arkaPlan'ın sonunda: dağ, zemin+deniz, evler, objeler, arka kazıklar, tahta iskele, lambalar
  const gy=zeminY+S.camY*SC;      // dünya y=0 (ayak çizgisi) ekranda
  const T=CVR.tahta;if(!T)return;
  const tw=TAHTA_W*SC,th=tw*T.height/T.width,y0=gy-th*TAHTA_AYAK;
  {const gp=evTaban(),s=SC*EV_P;      // ev katmanı: ölçek EV_P, kayma EV_H (yatay ve dikey)
    dagCiz(zeminY);      // en arka katman: dağ
    if(CVR.zemin&&CVR.deniz)zeminDeniz(zeminY,gp,s);      // evlerin bastığı zemin (ev katmanı) + önündeki deniz (derinliğe göre)
    for(const e of CV_EV){const im=CVR[e.ad];if(!im)continue;const w=e.h*im.width/im.height;cvCiz(im,W/2+(e.x+w/2-KX*EV_P)*s,gp,e.h*s)}
    if(GR>0){const st=GR===1?2:1;for(let i=0;i<CV_OBJ.length;i+=st){const o=CV_OBJ[i],im=CVR['o_'+o.ad];if(!im)continue;const k=1+o.dy/300,ox=W/2+(o.x-KX*EV_P)*s,ty=Math.round(gp+o.dy*s),oh=CV_OBJ_BOY[o.ad]*CV_OBJ_K*k*s;cvCiz(im,ox,ty,oh);if(o.ad==='ates'&&GR===2)atesCiz(ox,ty,oh,oh*im.width/im.height,i)}}}      // LOW modda dekoratif objeler kapalı; MEDIUM yarısı; HIGH tamamı
  if(GR>0){const a=Math.round(y0+th*0.55),b=Math.round(y0+th*1.35);if(!cevreArka._sg||cevreArka._sa!==a||cevreArka._sb!==b){const g=ctx.createLinearGradient(0,a,0,b);g.addColorStop(0,'rgba(20,40,60,0.38)');g.addColorStop(1,'rgba(20,40,60,0)');cevreArka._sg=g;cevreArka._sa=a;cevreArka._sb=b}ctx.fillStyle=cevreArka._sg;ctx.fillRect(0,a,W,b-a)}      // iskelenin altında gölge (önbellekli)
  if(ZOR_N===1){ctx.fillStyle='rgba(8,14,34,0.44)';ctx.fillRect(0,0,W,H)}      // 2. bölüm gece karartması (fener ışıkları üstünde parlar)
  kazikCiz(zeminY,false);      // arka kazıklar: alt yarısı iskele tahtasının arkasında kalır
  {const tb=dkw(T,tw);for(let x=((W/2-KX*SC)%tw+tw)%tw-tw;x<W;x+=tw-1)ctx.drawImage(tb,Math.floor(x),y0,Math.ceil(tw)+1,th)}
  if(GR>0)denizCizgi(y0+th*0.97);      // iskelenin altında kalan suda kayan ışık çizgileri ve parıltılar (giriş ekranındaki gibi)
  if(GR>0)sicramaCiz(y0+th*0.97);      // tahtanın alt kenarına vuran su
  const ly=gy-LAMBA_GERI*SC,L=CVR.sokak_lamba;for(const l of CV_LMB)cvCiz(L,W/2+(l.x-KX)*SC,ly,LAMBA_BOY*SC);      // sokak lambaları iskelenin üstünde
  if(L&&GR>0){const h=LAMBA_BOY*SC,w=h*L.width/L.height,t=performance.now()/1000;      // fenerlerin titreyen ışığı (giriş ekranındaki gibi)
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<CV_LMB.length;i++){const x=W/2+(CV_LMB[i].x-KX)*SC-w/2+w*0.76,y=ly-h*0.7,a=0.75+0.12*Math.sin(t*9+i*2)+0.08*Math.sin(t*23+i),r=h*0.226*(0.95+0.05*a);if(x+r<0||x-r>W)continue;
      const gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(255,200,90,${0.5*a})`);gr.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,2*r,2*r)}
    ctx.restore()}
}
function denizCizgi(y0){      // y0: suyun görünen üst kenarı (ekran px); çizgiler giriş ekranındakinden daha saydam
  if(y0>=H)return;const U=H/100,t=performance.now()/1000,ox=KX*SC*0.3;
  ctx.save();
  for(let j=0;j<5;j++){const y=y0+3*U+j*2.2*U;if(y>H)break;const yon=j%2?1:-1,L=(12+j*2)*U,A=(0.3+j*0.07)*U;
    ctx.beginPath();for(let x=-6;x<=W+6;x+=6)ctx.lineTo(x,y+A*Math.sin((x+ox)/L*Math.PI*2+t*2.4*yon));
    ctx.setLineDash([L*0.4,L*0.5]);ctx.lineDashOffset=-t*(9+j*3)*U*yon+ox;ctx.lineWidth=0.3*U;ctx.strokeStyle='rgba(220,248,255,.22)';ctx.stroke()}
  ctx.setLineDash([]);ctx.lineWidth=0.3*U;
  for(let i=0;i<W/(6*U);i++){const a=Math.sin(t*2.5+i*1.7);if(a<0.4)continue;const x=((((i*4.2*9301+49297)%233280)/233280*W+t*5*U*(i%2?1:-1)-ox)%W+W)%W,y=y0+(3+(((i*8.9*9301+49297)%233280)/233280)*10)*U;
    ctx.strokeStyle=`rgba(255,255,255,${(a-0.4)*0.75})`;ctx.beginPath();ctx.moveTo(x-0.9*U,y);ctx.lineTo(x+0.9*U,y);ctx.stroke()}
  ctx.restore();
}
const DZ_AKIS=70;      // deniz kendi kendine sola akar (dünya birimi/sn)
let DZ_X=0,DZ_T=-1;
const dagTaban=zeminY=>zeminY-(TAHTA_ARKA+DAG_GERI)*SC+S.camY*SC*EV_H;      // dağın alt kenarı (ekranda); v0.422: dikeyde zeminle birlikte iner (zıplayınca zeminin arkasından çıkmaz), yatayda yavaş (DAG_H)
function dagCiz(zeminY){      // dağ: uç uca döşenir; altı toprak rengiyle dolar (zıplayınca zemin dağdan hızlı iner, arada boşluk görünmez)
  const D=CVR.dag_yakin;if(!D)return;const s=SC*DAG_P,h=DAG_BOY*s,w=h*D.width/D.height;
  const taban=Math.round(dagTaban(zeminY));
  {const alt=CVR.deniz&&CVR.zemin?Math.min(H,Math.ceil(evTaban()+ZEM_ALT*SC*EV_P)+2):H;if(taban<alt){ctx.fillStyle='#8c6749';ctx.fillRect(0,taban-2,W,alt-taban+2)}}      // v0.475: toprak dolgusu yalnız denizin başladığı yere kadar (altı zaten deniz görseliyle kaplanır: boşa boyama yok)
  const db=dkh(D,h);
  for(let x=((W/2-KX*DAG_H*SC)%w+w)%w-w;x<W;x+=w-1)ctx.drawImage(db,Math.floor(x),taban-Math.round(h),Math.ceil(w)+1,Math.round(h));
}
function zeminDeniz(zeminY,gp,s){      // zemin (ev katmanı, tek parça, evlerle aynı kayma) + deniz (kıyıda EV_H, aşağı doğru DZ_H1'e kadar artan kayma: perspektif)
  const Z=CVR.zemin,DZ=CVR.deniz;
  const zAlt=gp+ZEM_ALT*s,zh=ZEM_BOY*s,zw=zh*Z.width/Z.height;
  // deniz: kıyıdan (zeminin alt kenarı, kamera yerdeyken) ekranın altına kadar yatay dilimler
  const yT0=gp-S.camY*SC*EV_H+ZEM_ALT*s,yB0=Math.max(yT0+40,H+8),N=36;
  const hb=i=>EV_H+(DZ_H1-EV_H)*i/N,yb=i=>yT0+(yB0-yT0)*i/N+S.camY*SC*hb(i);
  if(DZ_T>=0)DZ_X+=Math.max(0,Math.min(0.1,S.t-DZ_T))*DZ_AKIS;DZ_T=S.t;      // dere gibi sürekli sola akış
  {const top=Math.floor(yb(0)),bot=Math.max(Math.ceil(yb(N)),H+8),dh=bot-top,dw=dh*DZ.width/DZ.height,hk=(EV_H+DZ_H1)/2;      // v0.437: giriş ekranındaki gibi tek parça deniz görseli akar (her ikinci kopya aynalı, dikişsiz)
    const zb=dkh(DZ,Math.max(dh,H*0.7));if(!dkVar(DZ)){ctx.fillStyle='#1d8fcf';ctx.fillRect(0,top,W,dh)}      // v0.475: deniz görseli saydamsız, altına ayrıca mavi boyanmaz (görsel hazır değilse boyanır)
    const o=((((KX*hk+DZ_X)*SC-W/2)%(2*dw))+2*dw)%(2*dw);
    for(let x=-o;x<W;x+=dw){if(x+dw<0)continue;if(Math.round((x+o)/dw)&1){ctx.save();ctx.translate(Math.floor(x)+dw,0);ctx.scale(-1,1);ctx.drawImage(zb,0,top,dw+1,dh);ctx.restore()}else ctx.drawImage(zb,Math.floor(x),top,dw+1,dh)}}
  // zemin: denizin üstüne, evlerle aynı hızda (yatay EV_H, dikey EV_H)
  {const yb2=dkh(Z,zh);for(let x=((W/2-KX*EV_H*SC)%zw+zw)%zw-zw;x<W;x+=zw-1)ctx.drawImage(yb2,Math.floor(x),Math.round(zAlt-zh),Math.ceil(zw)+1,Math.ceil(zh))}
}
// Su sıçraması: iskele tahtasının alt kenarına dalga vurur, damlacıklar saçılır (dünya koordinatı)
let SICRA=[],SICRA_T=0;
function sicramaCiz(yAlt){      // yAlt: tahtanın alt kenarı (ekran px)
  const dt=S.dtG||0.016;
  if(S.t>SICRA_T){SICRA_T=S.t+2.5+Math.random()*4;      // seyrek: dalga ekrandaki bir ön kazığa vurur
    const L=Math.ceil((KX-W/2/SC)/KAZIK_ARA),R2=Math.floor((KX+W/2/SC)/KAZIK_ARA);
    if(R2>=L){const wx=(L+Math.floor(Math.random()*(R2-L+1)))*KAZIK_ARA,wy=S.camY+(ZY()-(H-4))/SC,n=8+Math.random()*6|0;      // kazığın x ortası, ekranın altında su hizası (kazığın dibi görünmez)
      for(let i=0;i<n&&SICRA.length<120;i++)SICRA.push({x:wx+(Math.random()-0.5)*120,y:wy,vx:(Math.random()-0.5)*600,vy:700+Math.random()*900,r:4+Math.random()*6,t0:S.t,yy:wy})
      SICRA.push({x:wx,y:wy,kopuk:1,t0:S.t,r:90+Math.random()*50})}}
  ctx.save();
  for(let i=SICRA.length-1;i>=0;i--){const d=SICRA[i],sx=W/2+(d.x-KX)*SC,sy=ZY()-(d.y-S.camY)*SC;
    if(d.kopuk){const u=(S.t-d.t0)/0.45;if(u>=1){SICRA.splice(i,1);continue}      // vuran dalganın köpük yayı
      ctx.globalAlpha=0.45*(1-u);ctx.strokeStyle='#f4fdff';ctx.lineWidth=Math.max(1.5,5*SC*(1-u)+1);ctx.beginPath();ctx.ellipse(sx,sy,d.r*SC*(0.5+u),d.r*SC*0.35*(0.4+u),0,Math.PI,2*Math.PI);ctx.stroke();continue}
    d.vy-=G*0.55*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;
    if(d.y<d.yy-60){SICRA.splice(i,1);continue}
    const a=kisit(1-Math.max(0,d.yy-d.y)/60,0,1);ctx.globalAlpha=0.5*a;
    ctx.fillStyle='#d9f6ff';ctx.beginPath();ctx.ellipse(sx,sy,d.r*SC,d.r*SC*1.25,Math.atan2(-d.vy,d.vx)+Math.PI/2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(sx-d.r*SC*0.3,sy-d.r*SC*0.35,d.r*SC*0.35,0,Math.PI*2);ctx.fill()}
  ctx.restore();
}
function kazikCiz(zeminY,on){      // on: karakterlerin önündeki sıra (iskelenin ön kenarı), değilse arka sıra (arka kenar, iskele tahtasının arkasında kalır)
  const K=CVR.kazik;if(!K)return;
  const k=on?1:KAZIK_KUC,h=KAZIK_BOY*k*SC,w=h*K.width/K.height,orta=zeminY+S.camY*SC+(on?KAZIK_ON:-KAZIK_ARK)*SC;
  const ara=KAZIK_ARA*SC,ofs=W/2-KX*SC;
  const kb=dk(K,KAZIK_BOY*DK_KO/K.height);      // ön ve arka sıra aynı kopyayı kullanır
  for(let x=((ofs%ara)+ara)%ara-ara;x<W+ara;x+=ara){if(x+w/2<0||x-w/2>W)continue;ctx.drawImage(kb,Math.round(x-w/2),Math.round(orta-h/2),Math.round(w),Math.round(h))}
}
function cevreOn(zeminY){kazikCiz(zeminY,true)}      // karakterlerin önünde: ön kazık sırası
function cevreHazir(){      // v0.475: liman görsellerinin ekran boyu kopyaları önceden istenir (yükleme ekranında hazırlanır; çizimdeki ölçülerle aynı)
  const k=DK_KO,h=(im,b)=>{if(im)dkOn(im,b/im.height)};
  h(CVR[GOK_AD],H*1.12*DPR);h(CVR.dag_yakin,DAG_BOY*DAG_P*k);h(CVR.zemin,ZEM_BOY*EV_P*k);h(CVR.deniz,H*0.7*DPR);h(CVR.kazik,KAZIK_BOY*k);h(CVR.sokak_lamba,LAMBA_BOY*k);
  if(CVR.tahta)dkOn(CVR.tahta,TAHTA_W*k/CVR.tahta.width);
  for(let i=0;i<8;i++)h(CVR[EV_SET+i],EV_BOY[i]*EV_K*EV_P*k);
  for(const a of CV_OBJ_AD)h(CVR['o_'+a],CV_OBJ_BOY[a]*CV_OBJ_K*1.4*EV_P*k);
}
