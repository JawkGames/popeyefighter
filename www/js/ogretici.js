'use strict';
// Öğretici (v0.441): ilk BAŞLA'da bir kez (localStorage pf_ogr); linkte ?ogretici varsa her açılışta. Oyuncu düşmansız alana (OGR_X) alınır.
// Adımlar: hoş geldin → sağa yürü → sola yürü → zıpla → eğil → yumruk (3) → tekme (2) → kol sürükle → çapaya dokun (yetenek ağacı) → ağaçta yeteneğe dokun → bitti.
// Yazılar dil.js (ogr_*), parmak ui/parmak.webp (kontrol.js PIM). Dokunmatik olmayan ekranda / klavye / joystick modunda tuş adları yazılır, kol adımı atlanır; eğim modunda yürüme/zıplama/eğilme adımları atlanır.
const OGR_X=-1400;
let ogrAcik=false;
{
  const kok=document.createElement('div');kok.id='ogr';kok.hidden=true;
  kok.innerHTML='<canvas id="ogrC"></canvas><div id="ogrK"><div id="ogrY" dir="auto"></div><div id="ogrN"></div><div id="ogrG"></div></div><img id="ogrP" alt="">';
  document.body.appendChild(kok);
  const cvs=kok.querySelector('#ogrC'),c=cvs.getContext('2d'),kutu=kok.querySelector('#ogrK'),yazi=kok.querySelector('#ogrY'),nok=kok.querySelector('#ogrN'),gec=kok.querySelector('#ogrG'),pm=kok.querySelector('#ogrP');
  pm.src='ui/parmak.webp'+SURUM;
  const dokunmatik=()=>KMOD==='dokun'&&matchMedia('(pointer:coarse)').matches;
  const tip=()=>KMOD==='joy'?'joy':dokunmatik()?'dokun':KMOD==='egim'?'egim':'klavye';
  const TUSA={sag:{dokun:'→',klavye:'→ / D',joy:'D▶'},sol:{dokun:'←',klavye:'← / A',joy:'D◀'},zip:{dokun:'↑',klavye:'↑ / W',joy:'D▲'},egil:{dokun:'↓',klavye:'↓ / S',joy:'D▼'}};
  const aksAd=a=>tip()==='joy'?PAD_AD[PADT[a]]||'?':(TUS[a]||'?').toUpperCase();
  const el=id=>document.getElementById(id);
  const merkez=id=>{const r=el(id).getBoundingClientRect();return r.width?[r.left+r.width/2,r.top+r.height/2]:null};
  const atkTur=()=>S.atk?(/^#?(kick|diz)/.test(S.atk.ad)?'t':'y'):null;
  // ---- adımlar: yaz() metin, bas() başlangıç, tamam(dt) bitti mi, iz(t) parmak [x,y,basma 0..1] , vurgu: parlayan düğme, bolge: tuvalde çizilen alan
  const yer=(f,b)=>{const p=merkez(b);return p?[...p,f]:null};
  const tap=(t,p)=>{const u=(t%1.3)/1.3;return [p[0],p[1],u>0.35&&u<0.6?1:0]};
  const tut=(t,p)=>{const u=(t%2.2)/2.2;return [p[0],p[1],u>0.2&&u<0.85?1:0]};
  const kay=(t,a,b)=>{const u=(t%2.4)/2.4;if(u<0.2)return [a[0],a[1],u>0.12?1:0];if(u>0.8)return [b[0],b[1],u<0.86?1:0];const e=(u-0.2)/0.6,s=e*e*(3-2*e);return [a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s,1]};
  const A=[
    {ad:'hos',yaz:()=>dil('ogr_hos'),sure:2.8},
    {ad:'sag',hareket:1,vurgu:'sag',yaz:()=>dil('ogr_sag',TUSA.sag[tip()]),bas:o=>o.x0=S.x,tamam:o=>S.x>o.x0+450,iz:t=>{const p=merkez('sag');return p&&tut(t,p)}},
    {ad:'sol',hareket:1,vurgu:'sol',yaz:()=>dil('ogr_sol',TUSA.sol[tip()]),bas:o=>o.x0=S.x,tamam:o=>S.x<o.x0-450,iz:t=>{const p=merkez('sol');return p&&tut(t,p)}},
    {ad:'zip',hareket:1,vurgu:'zipla',yaz:()=>dil('ogr_zip',TUSA.zip[tip()]),tamam:()=>!S.yer,iz:t=>{const p=merkez('zipla');return p&&tap(t,p)}},
    {ad:'egil',hareket:1,vurgu:'asa',yaz:()=>dil('ogr_egil',TUSA.egil[tip()]),bas:o=>o.s=0,tamam:(o,dt)=>(o.s+=S.yer&&asagiMi()?dt:0)>0.35,iz:t=>{const p=merkez('asa');return p&&tut(t,p)}},
    {ad:'yum',yaz:()=>tip()==='dokun'?dil('ogr_yum'):dil('ogr_yum_k',aksAd('yumruk')),bas:o=>{o.n=0;o.a=S.atk},tamam:o=>{if(S.atk&&S.atk!==o.a&&atkTur()==='y')o.n++;o.a=S.atk;return o.n>=3},
      bolge:'yum',iz:t=>{const k=Math.floor(t/1.3)%2;return tap(t,[innerWidth*(k?0.28:0.72),innerHeight*0.42])}},
    {ad:'tek',yaz:()=>tip()==='dokun'?dil('ogr_tek'):dil('ogr_tek_k',aksAd('tekme')),bas:o=>{o.n=0;o.a=S.atk},tamam:o=>{if(S.atk&&S.atk!==o.a&&atkTur()==='t')o.n++;o.a=S.atk;return o.n>=2},
      bolge:'tek',iz:t=>tap(t,[innerWidth*0.56,innerHeight*0.86])},
    {ad:'kol',dokun:1,yaz:()=>dil('ogr_kol'),bas:o=>o.s=0,tamam:(o,dt)=>{let v=false;for(const z of izler.values())if(z.maxd>70)v=true;return (o.s+=v?dt:0)>0.7},
      bolge:'kol',iz:t=>kay(t,[innerWidth*0.7,innerHeight*0.52],[innerWidth*0.84,innerHeight*0.24])},
    {ad:'agac',vurgu:'agacB',uzun:1,yaz:()=>dil('ogr_agac'),tamam:()=>agacAcik,iz:t=>{const p=merkez('agacB');return p&&tap(t,p)}},
    {ad:'agac2',agac:1,yaz:()=>dil('ogr_agac2'),bas:o=>o.d=0,tamam:o=>{if(DEMO)o.d=1;return !agacAcik}},
    {ad:'bit',yaz:()=>dil('ogr_bit'),sure:3.2,son:1},
  ];
  let L=[],i=0,o={},t=0,iyiT=-1,vurEl=null,son=0;
  const gecerli=a=>!(a.hareket&&tip()==='egim')&&!(a.dokun&&tip()!=='dokun');
  function vurgula(id){if(vurEl)vurEl.classList.remove('ogr_vur');vurEl=id?el(id):null;if(vurEl)vurEl.classList.add('ogr_vur')}
  function adim(n){
    i=n;o={};t=0;iyiT=-1;const a=L[i];if(!a){bitir();return}
    if(a.bas)a.bas(o);
    yazi.textContent=a.yaz();kutu.classList.remove('iyi');kutu.classList.toggle('uzun',!!a.uzun);
    kutu.classList.remove('gir');void kutu.offsetWidth;kutu.classList.add('gir');
    nok.innerHTML=L.map((_,k)=>`<i class="${k<i?'ok':k===i?'su':''}"></i>`).join('');
    vurgula(a.vurgu);
  }
  function bitir(){
    ogrAcik=false;kok.hidden=true;vurgula(null);document.body.classList.remove('ogr_acik');
    try{localStorage.setItem('pf_ogr','1')}catch(_){}
  }
  gec.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();bitir()});
  DIL_DIN.push(()=>{gec.textContent=dil('ogr_gec');if(ogrAcik&&L[i])yazi.textContent=L[i].yaz()});gec.textContent=dil('ogr_gec');
  function ciz(a,ps){      // basılacak alan / sürükleme yolu ve parmak
    const d=Math.min(devicePixelRatio||1,2),w=Math.round(innerWidth*d),h=Math.round(innerHeight*d);
    if(cvs.width!==w||cvs.height!==h){cvs.width=w;cvs.height=h}
    c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w,h);c.setTransform(d,0,0,d,0,0);
    const nab=0.5+0.5*Math.sin(t*5),W2=innerWidth/2,HH=innerHeight;
    if(a.bolge==='tek'&&tip()==='dokun'){      // tekme bölgesi (girdi.js tekmeBolgesi): orta çizginin iki yanında çatı biçimi
      const g=0.26*innerWidth;c.beginPath();c.moveTo(W2-g,HH);c.lineTo(W2-g,HH*0.725);c.lineTo(W2,HH*0.57);c.lineTo(W2+g,HH*0.725);c.lineTo(W2+g,HH);c.closePath();
      c.fillStyle=`rgba(255,216,74,${0.12+0.1*nab})`;c.fill();c.setLineDash([10,8]);c.lineWidth=3;c.strokeStyle='rgba(255,236,160,.9)';c.stroke();c.setLineDash([])}
    if(a.bolge==='yum'&&tip()==='dokun')for(const x of [0.28,0.72]){c.beginPath();c.arc(innerWidth*x,HH*0.42,HH*(0.07+0.012*nab),0,7);c.lineWidth=3;c.setLineDash([8,7]);c.strokeStyle='rgba(255,236,160,.85)';c.stroke();c.setLineDash([])}
    if(a.bolge==='kol'){const x0=innerWidth*0.7,y0=HH*0.52,x1=innerWidth*0.84,y1=HH*0.24;
      c.setLineDash([10,9]);c.lineDashOffset=-t*30;c.lineWidth=4;c.strokeStyle='rgba(255,236,160,.9)';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();c.setLineDash([]);
      const an=Math.atan2(y1-y0,x1-x0),k=16;c.fillStyle='rgba(255,236,160,.95)';c.beginPath();c.moveTo(x1+Math.cos(an)*k,y1+Math.sin(an)*k);c.lineTo(x1+Math.cos(an+2.5)*k,y1+Math.sin(an+2.5)*k);c.lineTo(x1+Math.cos(an-2.5)*k,y1+Math.sin(an-2.5)*k);c.fill()}
    if(ps&&ps[2]>0.5){c.beginPath();c.arc(ps[0],ps[1],HH*0.035,0,7);c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.85)';c.stroke()}
  }
  function parmak(ps){
    if(!ps||!(tip()==='dokun'||tip()==='egim'||ps.agac)){pm.style.display='none';return}      // klavye/joystick: parmak sadece çapayı gösterir
    const sk=ps[2]>0.5?0.9:1.12,ph=innerHeight*0.17*sk,im=pm.naturalWidth?pm:null,pw=im?ph*im.naturalWidth/im.naturalHeight:ph*0.6;
    pm.style.display='block';pm.style.width=pw+'px';pm.style.height=ph+'px';pm.style.transform=`translate(${ps[0]-pw*0.43}px,${ps[1]-ph*0.03}px)`;
  }
  function dongu_(ms){
    if(!ogrAcik)return;requestAnimationFrame(dongu_);
    const dt=Math.min(0.05,(ms-(son||ms))/1000);son=ms;
    const a=L[i];if(!a)return;
    const gizle=girisAcik||menuAcik||listeAcik||hakAcik||tusAcik||S.durum!=='oyun'||(agacAcik&&!a.agac&&a.ad!=='agac');
    kok.classList.toggle('gizli',gizle);if(gizle)return;
    kok.classList.toggle('ust',!!a.agac||a.ad==='agac');
    t+=dt;
    if(iyiT>=0){iyiT+=dt;if(iyiT>0.9){let n=i+1;while(L[n]&&!gecerli(L[n]))n++;adim(n)}ciz(a,null);parmak(null);return}
    if(a.sure){if(t>=a.sure){if(a.son)bitir();else adim(i+1)}ciz(a,null);parmak(null);return}
    if(a.tamam(o,dt)){if(a.agac){adim(i+1);return}iyiT=0;yazi.textContent=dil('ogr_iyi');kutu.classList.add('iyi');vurgula(null);bufCal(LVS,0.35);return}
    const ps=a.iz&&t>0.6?a.iz(t):null;if(ps&&a.ad==='agac')ps.agac=1;
    ciz(a,ps);parmak(ps);
  }
  window.ogrBasla=zorla=>{
    let yap=zorla;try{yap=yap||localStorage.getItem('pf_ogr')!=='1'||new URLSearchParams(location.search).has('ogretici')}catch(_){}
    if(!yap||ogrAcik)return;
    L=A.filter(gecerli);ogrAcik=true;kok.hidden=false;document.body.classList.add('ogr_acik');
    S.x=OGR_X;KX=S.x;S.vx=0;S.camY=0;      // düşmanların olmadığı yer
    son=0;adim(0);requestAnimationFrame(dongu_);
  };
}
