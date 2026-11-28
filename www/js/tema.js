'use strict';
// 3–9. bölümler için ortak çok-katmanlı çevre motoru (cevre.js ile birebir aynı paralaks, zıplama kamera tepkisi ve geniş zemin mantığı).
const TEMA_CACHE={},TEMA_GOK={};
function temaDizilim(key,evHavuz,objHavuz,evIm,objIm){
  const c=TEMA_CACHE[key];if(c&&c.evH===evHavuz.join(','))return c;
  let t=0x13579bdf^(key.length*2654435761);const r=()=>{t=(Math.imul(t,1103515245)+12345)>>>0;return (t>>>8)/16777216};
  const evler=[],objeler=[],bosluk=[],EV_H_PX=1050*0.8;
  let lx=-4200,sag=null;const SON=(BOSS_X+3500)*EV_P;
  while(lx<SON){
    if(sag!==null)bosluk.push([sag,lx]);
    const n=2+Math.floor(r()*2);let son=-1;
    for(let i=0;i<n;i++){let k;do k=evHavuz[Math.floor(r()*evHavuz.length)];while(k===son&&evHavuz.length>1);son=k;
      const im=evIm[k],oran=im&&im.height?im.width/im.height:1.15,eh=EV_H_PX*(0.92+r()*0.16),ew=eh*oran;
      evler.push({k,x:lx,h:eh,w:ew});sag=lx+ew;lx+=ew+20+r()*60}
    lx+=700+r()*900;
  }
  for(const [a0,b0] of bosluk){
    let x=a0+90;const bit=b0-90;let ilk=true,son=-1;
    for(;;){
      if(x>=bit-120||(!ilk&&r()<0.35))break;
      let k;do k=objHavuz[Math.floor(r()*objHavuz.length)];while(k===son&&objHavuz.length>1);son=k;
      const im=objIm[k],oran=im&&im.height?im.width/im.height:1.0,isAg=String(k).startsWith('a');
      const dy=Math.round(5+r()*35),sc=1+dy/300,oh=(isAg?680:460)*0.8*sc,ow=oh*oran;
      if(x+ow>bit)break;
      objeler.push({k,x:x+ow/2,h:oh,dy});ilk=false;x+=ow+120+r()*180;
    }
  }
  for(const e of evler){
    if(r()>0.55)continue;
    const k=objHavuz[Math.floor(r()*objHavuz.length)],im=objIm[k],oran=im&&im.height?im.width/im.height:1.0,isAg=String(k).startsWith('a');
    const dy=Math.round(55+r()*65),sc=1+dy/300,oh=(isAg?600:420)*0.8*sc;
    if(oh*oran>e.w*0.6)continue;
    objeler.push({k,x:e.x+e.w*(0.15+r()*0.55),h:oh,dy});
  }
  objeler.sort((a,b)=>a.dy-b.dy);
  return TEMA_CACHE[key]={evH:evHavuz.join(','),evler,objeler};
}
function temaArka(cfg,camX,zeminY){
  const gece=!!cfg.gece,pal=gece?cfg.gokGece:cfg.gokGunduz;
  const gAlt=cfg.dag?Math.min(H,Math.max(1,Math.round(dagTaban(zeminY))+2)):H;      // v0.475: gökyüzü yalnız dağın tabanına kadar boyanır (altı zaten zeminle kaplanır: boşa boyama yok)
  if(GR===0){ctx.fillStyle=pal[1];ctx.fillRect(0,0,W,gAlt)}      // LOW: tek düz gökyüzü dolgusu (gradyan yok)
  else{
    const gk=cfg.id+'_'+(gece?1:0),zR=Math.round(zeminY);
    let g=TEMA_GOK[gk];
    if(!g||g.z!==zR){const gr=ctx.createLinearGradient(0,0,0,zR);gr.addColorStop(0,pal[0]);gr.addColorStop(0.6,pal[1]);gr.addColorStop(1,pal[2]);g=TEMA_GOK[gk]={z:zR,gr}}
    ctx.fillStyle=g.gr;ctx.fillRect(0,0,W,gAlt);
  }
  if(gece){
    ctx.save();
    if(GR>0){ctx.fillStyle='rgba(255,250,220,0.65)';
      const stN=GR===2?28:12;
      for(let i=0;i<stN;i++){const sx=((Math.imul(i+1,2654435761)>>>0)%1000)/1000*W-camX*0.02,sy=((Math.imul(i+7,1103515245)>>>0)%450)/1000*zeminY;ctx.fillRect(((sx%W)+W)%W,sy,2,2)}}
    const ax=W*0.78,ay=H*0.16,ar=Math.min(W,H)*0.045;
    ctx.fillStyle='rgba(255,244,195,0.9)';ctx.beginPath();ctx.arc(ax,ay,ar,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  const gp=evTaban(),s=SC*EV_P;
  // 1) Uzak dağlar: cevre.js dagCiz ile birebir aynı (yatay DAG_H, dikey EV_H ile iner — zıplayınca zeminden kopmaz)
  if(cfg.dag){
    const Dg=cfg.dag,ds=SC*DAG_P,dh=DAG_BOY*(cfg.dagOlcek||0.72)*ds,dw=dh*Dg.width/Dg.height;
    const taban=Math.round(dagTaban(zeminY));
    {const alt=cfg.zemin?Math.min(H,Math.ceil(gp+ZEM_ALT*s)+2):H;if(taban<alt){ctx.fillStyle=cfg.dagAlt||'#6e6058';ctx.fillRect(0,taban-2,W,alt-taban+2)}}      // dağ altı dolgusu zeminin alt kenarına kadar
    const db=dkh(Dg,dh);
    for(let x=((W/2-camX*DAG_H*SC)%dw+dw)%dw-dw;x<W;x+=dw-1)ctx.drawImage(db,Math.floor(x),taban-Math.round(dh),Math.ceil(dw)+1,Math.round(dh));
  }
  // 2) Geniş orta zemin katmanı: cevre.js (1. bölüm) zemin.webp ile birebir aynı ZEM_BOY/ZEM_ALT yerleşimi (evlerin arkasından yürünen yolun altına kadar kesintisiz uzanır)
  const gy=zeminY+S.camY*SC;
  if(cfg.zemin){
    const Z=cfg.zemin,zAlt=gp+ZEM_ALT*s,zh=ZEM_BOY*s,zw=zh*Z.width/Z.height,zUst=Math.round(zAlt-zh);
    if(zAlt<H){ctx.fillStyle=(cfg.zeminAlt&&cfg.zeminAlt[1])||'#7a90a0';ctx.fillRect(0,Math.floor(zAlt)-2,W,H-Math.floor(zAlt)+4)}
    const zb=dkh(Z,zh);
    for(let x=((W/2-camX*EV_H*SC)%zw+zw)%zw-zw;x<W;x+=zw-1)ctx.drawImage(zb,Math.floor(x),zUst,Math.ceil(zw)+1,Math.ceil(zh));
  }
  // 3) Evler ve objeler/ağaçlar geniş orta zeminin üzerinde (EV_H paralaksı)
  const dz=temaDizilim(cfg.id+(gece?'_g':'_d'),cfg.evIdx,cfg.objIdx,cfg.evIm,cfg.objIm);
  for(const e of dz.evler){const im=cfg.evIm[e.k];if(!im)continue;cvCiz(im,W/2+(e.x+e.w/2-camX*EV_P)*s,gp,e.h*s)}
  if(GR>0){      // LOW modda dekoratif orta-plan objeleri atlanır (ciddi FPS kazancı, evler ve yol tam kalır)
    const step=GR===1?2:1;
    for(let i=0;i<dz.objeler.length;i+=step){const o=dz.objeler[i],im=cfg.objIm[o.k];if(!im)continue;cvCiz(im,W/2+(o.x-camX*EV_P)*s,Math.round(gp+o.dy*s),o.h*s)}
  }
  // 4) Gece karartma efekti (2. tur bölümler)
  if(gece){ctx.fillStyle=cfg.geceTon||'rgba(8,14,34,0.44)';ctx.fillRect(0,0,W,H)}
  // 5) Yürünen yol (en önde, 1.0 paralaks)
  if(cfg.yol){const Y=cfg.yol,tw=TAHTA_W*SC,th=tw*Y.height/Y.width,y0=gy-th*(cfg.yolOfs||0.34);
    const yb=dkw(Y,tw);
    for(let x=((W/2-camX*SC)%tw+tw)%tw-tw;x<W;x+=tw-1)ctx.drawImage(yb,Math.floor(x),y0,Math.ceil(tw)+1,th)}
}
function temaHazir(cfg){      // v0.475: bölüm temasının ekran boyu kopyaları önceden istenir (temaArka'daki ölçülerle aynı)
  const k=DK_KO,h=(im,b)=>{if(im)dkOn(im,b/im.height)};
  h(cfg.dag,DAG_BOY*(cfg.dagOlcek||0.72)*DAG_P*k);h(cfg.zemin,ZEM_BOY*EV_P*k);
  if(cfg.yol)dkOn(cfg.yol,TAHTA_W*k/cfg.yol.width);
  for(const i of cfg.evIdx)h(cfg.evIm[i],1050*0.8*1.08*EV_P*k);
  for(const i of cfg.objIdx)h(cfg.objIm[i],(String(i).startsWith('a')?680:460)*0.8*1.4*EV_P*k);
}
function bolumCfg(){return BATI()?batiCfg():BATAK()?batakCfg():MISIR()?misirCfg():KARLI()?karCfg():null}      // o anki bölümün teması (liman: null)
