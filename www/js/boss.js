'use strict';
// Boss'lara özel mekanikler (v0.484): her bölüm boss'unun kendine ait bir özelliği var.
// p kaptan: tabanca · m kılıç ustası: çevik kaçış (usta.js) · y buz lordu: yakalayıp çekiçle vurma (korsan.js yakGuncelle)
// z firavun: çekiçle yere vurup ŞOK DALGASI yollar (üstünden zıplanır), canı %66 ve %33'e inince 2 MUMYA çağırır
// t yosun lordu: 4 sn vurulmazsa İYİLEŞİR, oyuncunun ayağının altından KÖK çıkarır (yer kararınca kaçılır)
// x demir şerif: HÜCUM eder (üstünden zıplanır; duvara çarparsa sersemler), canı %35 altında ÖFKELENİR (daha hızlı)
const BFX=[];      // boss efektleri: {tip:'sok'|'kok', x, ...}
function bossVur(dm,vx,vy){      // boss özel saldırısı oyuncuya değdi: blok yarıya indirir ve fırlatmayı engeller
  if(!dokunulmaz())return false;
  let d=Math.max(1,Math.round(dm*ZKD()));
  if(S.blok)d=Math.max(1,Math.round(d*0.5));
  else{S.vx=vx;S.vy=vy;S.yer=false;S.firlatT=S.t+0.6;S.hitR={t0:S.t,z:'govde',bk:-1}}
  S.hp-=d;S.inv=S.t+0.5;S.sars=Math.max(S.sars,12);titre(60);bufCal(DEVS||DSS,1);
  S.pops.push({x:S.x,y:S.y+1050,t:0,txt:'-'+d,f:0.4});
  return true;
}
function bossCagir(e){      // firavun: iki yanında yerden mumya savaşçı çıkar (en çok 4 canlı mumya)
  let n=0;for(const o of DUS)if(o.cag&&!o.olu)n++;
  const sag=arSinir()+W/2/SC-AR_DDUVAR-60;
  for(const sg of [-1,1]){
    if(n>=4)break;n++;
    const x=Math.min(sag,e.x+sg*(430+Math.random()*160)),m=korsanYap(x,'b'),hp=Math.round(110*ZK());
    Object.assign(m,{sk:'d',hp,max:hp,dm:16,vk:0.95,hz:1.05,xp:Math.round(8*XPK()),cag:true,akt:true,ic:true,st:S.t+0.7,yon:S.x>=x?1:-1});
    DUS.push(m);patlat(x,0.9);
  }
  S.sars=Math.max(S.sars,10);titre(60);
}
function bossGuncelle(dt){      // her karede bir kez (dusmanGuncelle başında): şok dalgası, kökler, sahipsiz mumyalar
  if(DEMO)return;
  for(let i=BFX.length-1;i>=0;i--){const f=BFX[i];
    if(f.tip==='sok'){
      f.x+=f.yn*1500*dt;f.yol+=1500*dt;
      if(GR>0&&Math.random()<dt*14)tasSac(f.x,1,0.5);
      if(!f.hit&&Math.abs(S.x-f.x)<110&&S.y<=zemin(S.x)+90&&bossVur(f.dm,f.yn*900,1500))f.hit=true;
      if(f.yol>1900)BFX.splice(i,1);
    }else{
      const u=S.t-f.t0;
      if(!f.cik&&u>=0.9){f.cik=true;tasSac(f.x,3,0.9);bufCal(DEVS||DSS,0.8);if(Math.abs(S.x-f.x)<170&&S.y<=zemin(S.x)+160)bossVur(f.dm,0,1900)}
      if(u>1.7)BFX.splice(i,1);
    }
  }
  if(S.bossGeldi&&!DUS.some(e=>e.boss&&!e.olu&&e.hp>0))for(const e of DUS)if(e.cag&&!e.olu){e.olu=true;e.ol=0;e.hp=0;e.ka=null;e.vx=(Math.random()-0.5)*600;e.vy=700}      // firavun ölünce mumyaları dağılır
}
function bossKontrol(e,dt,dx,stun,yer){      // true: bu karede boss özel hareketini yapıyor (normal yapay zekâ çalışmaz)
  if(e.olu||e.hp<=0||e.tut||DEMO||!'ztx'.includes(e.sk||'-'))return false;
  if(stun||!yer){e.bz=null;return false}
  const ad=Math.abs(dx),b=e.bz,oyun=S.durum==='oyun';
  if(e.bT===undefined)e.bT=S.t+3;
  if(e.sk==='z'){
    if(b){const u=S.t-b.t0;e.moving=false;
      if(b.tip==='cagir'){if(!b.ok&&u>=0.8){b.ok=true;bossCagir(e)}if(u>=1.25)e.bz=null;return true}
      if(!b.ok&&u>=0.42){b.ok=true;const x=e.x+e.yon*260;BFX.push({tip:'sok',x,yn:e.yon,yol:0,dm:(e.dm||30)*0.6});patlat(x,1);S.sars=Math.max(S.sars,14);titre(50);bufCal(DEVS||DSS,1)}
      if(u>=0.95){e.bz=null;e.bT=S.t+4.5+Math.random()*2}
      return true}
    if(!oyun||!e.akt||e.ka)return false;
    const kd=e.hp/e.max;
    if((kd<0.66&&!e.c1)||(kd<0.33&&!e.c2)){if(kd<0.33)e.c2=true;e.c1=true;e.yon=dx>=0?1:-1;e.bz={tip:'cagir',t0:S.t};S.mesaj='boss_cagir';S.mesajT=S.t;bufCal(GRS||DSS,1);return true}
    if(ad>560&&ad<1900&&S.t>=e.bT){e.yon=dx>=0?1:-1;e.bz={tip:'sok',t0:S.t};savurCal(e.x);return true}
    return false;
  }
  if(e.sk==='t'){
    if(e.hp<e.max&&S.t-(e.vurT||-9)>4){      // 4 sn vurulmadıysa saniyede maks. canın %1.2'si dolar
      e.hp=Math.min(e.max,e.hp+e.max*0.012*dt);
      if(S.t>=(e.rgT||0)){e.rgT=S.t+1;S.pops.push({x:e.x,y:e.y+e.cy+e.r+60,t:0,txt:'+'+Math.round(e.max*0.012),f:0.35,mavi:1})}}
    if(b){e.moving=false;if(S.t-b.t0>=0.7){e.bz=null;e.bT=S.t+(e.hp<e.max*0.5?3.2:5)+Math.random()*1.5}return true}
    if(!oyun||!e.akt||e.ka)return false;
    if(ad>300&&ad<2400&&S.t>=e.bT){e.yon=dx>=0?1:-1;e.bz={tip:'kok',t0:S.t};
      const n=e.hp<e.max*0.5?3:1;      // canı yarının altında: üç kök birden
      for(let i=0;i<n;i++)BFX.push({tip:'kok',x:S.x+(i?(i===1?380:-380):S.vx*0.3),t0:S.t+i*0.18,dm:(e.dm||30)*0.5});
      bufCal(GRS||DSS,0.8);return true}
    return false;
  }
  // x: demir şerif
  if(!e.ofke&&e.hp<e.max*0.35){e.ofke=true;e.hz=0.72;e.vk=1.35;S.mesaj='boss_ofke';S.mesajT=S.t;titre(80)}
  if(b){const u=S.t-b.t0;
    if(u<0.7){e.yon=b.yn;e.moving=false;return true}      // hazırlık: geri yaslanır
    e.x+=b.yn*2500*dt;e.moving=true;e.wf=(e.wf||0)+dt*16;
    if(GR>0&&Math.random()<dt*12)tasSac(e.x,1,0.5);
    {const k=Math.floor(e.wf/Math.PI);if(k!==b.adk){b.adk=k;adimCal(e.x,2.2)}}
    if(!b.hit&&Math.abs(S.x-e.x)<250&&S.y<e.y+520&&bossVur((e.dm||38)*0.9,b.yn*2600,1300)){b.hit=true;b.dur=S.t+0.12}
    const hw=W/2/SC,sag=arSinir()+hw-AR_DDUVAR,sol=KX-hw+AR_DDUVAR;let carp=false;
    if(e.x>=sag&&b.yn>0){e.x=sag;carp=true}else if(e.x<=sol&&b.yn<0){e.x=sol;carp=true}
    if(carp||u>=2||(b.dur&&S.t>=b.dur)){
      e.bz=null;e.moving=false;e.bT=S.t+(e.ofke?4:6)+Math.random()*2;e.st=S.t+(carp&&!b.hit?1.7:0.8);
      if(carp&&!b.hit){e.ser=e.st;patlat(e.x,1.2);S.sars=Math.max(S.sars,16);titre(70);bufCal(WDS||DEVS||DSS,1);if(typeof sersCal==='function')sersCal()}}      // ıskalayıp duvara çarptı: sersemler (vurma fırsatı)
    return true}
  if(!oyun||!e.akt||e.ka)return false;
  if(ad>650&&ad<2800&&S.t>=e.bT){const yn=dx>=0?1:-1;e.yon=yn;e.bz={tip:'hucum',t0:S.t,yn};bufCal(GRS||DSS,1);return true}
  return false;
}
function bossPoz(e,p){      // özel hareket pozu (korsanPoz sonunda)
  const b=e.bz,u=S.t-b.t0,ez=x=>x*x*(3-2*x);
  if(b.tip==='cagir')return kKar(p,KPZ.yakKal,ez(kisit(u<0.9?u/0.3:(1.25-u)/0.35,0,1)));
  if(b.tip==='sok'){const q=u/0.95;return q<0.32?kKar(p,KPZ.hazB,ez(q/0.32)):q<0.45?kKar(KPZ.hazB,KPZ.vurB,ez((q-0.32)/0.13)):q<0.7?Object.assign({},KPZ.vurB):kKar(KPZ.vurB,p,ez(kisit((q-0.7)/0.3,0,1)))}
  if(b.tip==='kok')return kKar(p,KPZ.yakAt,ez(Math.sin(Math.PI*kisit(u/0.7,0,1))));
  if(u<0.7)return kKar(p,Object.assign({},KPZ.hazB,{torso:-16,hx:-40,lN:8,kN:14,lF:-20,kF:22}),ez(kisit(u/0.35,0,1)));
  return Object.assign(p,{torso:30,bas:8,hx:60,uN:-70,rN:-30,wN:60,uF:-40,rF:-90});      // hücum: öne eğik koşar (bacaklar yürüyüşten)
}
function bossFxCiz(){      // dusmanCiz'den sonra: şok dalgası ve kökler (görsel yok, düz çizim: hafif)
  for(const f of BFX){
    const sx=W/2+(f.x-KX)*SC,sy=ZY()-(zemin(f.x)-S.camY)*SC,k=SC;if(sx<-300||sx>W+300)continue;
    if(f.tip==='sok'){
      ctx.save();ctx.translate(sx,sy);ctx.scale(f.yn,1);ctx.globalAlpha=0.9*Math.max(0,1-f.yol/1900);
      ctx.fillStyle='#ecd9a0';ctx.strokeStyle='#5a4420';ctx.lineWidth=Math.max(1,5*k);
      ctx.beginPath();ctx.moveTo(-90*k,0);ctx.quadraticCurveTo(20*k,-260*k,110*k,0);ctx.quadraticCurveTo(20*k,-100*k,-90*k,0);ctx.fill();ctx.stroke();
      ctx.restore();
    }else{
      const u=S.t-f.t0;if(u<0)continue;
      ctx.save();
      if(u<0.9){ctx.globalAlpha=0.4+0.25*Math.sin(u*26);ctx.fillStyle='#1d130a';ctx.beginPath();ctx.ellipse(sx,sy,170*k*(0.45+0.55*u/0.9),24*k,0,0,Math.PI*2);ctx.fill()}
      else{const g=u<1.05?(u-0.9)/0.15:u<1.45?1:Math.max(0,1-(u-1.45)/0.25);
        ctx.fillStyle='#4b3619';ctx.strokeStyle='#1b1208';ctx.lineWidth=Math.max(1,5*k);
        for(let j=-2;j<=2;j++){const x=sx+j*62*k,h=(320-55*Math.abs(j))*k*g,w=34*k;
          ctx.beginPath();ctx.moveTo(x-w,sy);ctx.lineTo(x+j*14*k,sy-h);ctx.lineTo(x+w,sy);ctx.closePath();ctx.fill();ctx.stroke()}
        ctx.fillStyle='#6f9a2c';ctx.beginPath();ctx.ellipse(sx,sy,150*k,16*k,0,0,Math.PI*2);ctx.fill()}
      ctx.restore();
    }
  }
}
