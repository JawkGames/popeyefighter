'use strict';
// Giriş ekranı: oyunun kendi çevre görselleriyle (cevre/: gökyüzü, dağ, zemin, evler, objeler, iskele tahtası, kazık, sokak lambası, deniz) kurulan liman. Hareketli: deniz akar, gökyüzü/bulutlar kayar, lambalar titrer.
// Ölçü birimi U = ekran yüksekliğinin %1'i; sahne ortadan kurulur, geniş telefonlarda yanlara gökyüzü, dağlar, iskele ve deniz devam eder.
// BAŞLA oyunu başlatır, AYARLAR menüyü açar (menü kapanınca giriş ekranına dönülür). Giriş açıkken oyun döngüsü durur (dongu.js girisAcik).
let girisAcik=true;
{
  const gel=document.getElementById('giris'),gc=document.getElementById('gc'),g=gc.getContext('2d');
  let GW=0,GH=0,GD=1,U=1,CX=0,ARKA=null,ISK=null,ON=null,FEN=[];
  let YUK_OK=false;
  const rn=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
  const tuval=()=>{const k=document.createElement('canvas');k.width=gc.width;k.height=gc.height;const c=k.getContext('2d');c.setTransform(GD,0,0,GD,0,0);return [k,c]};

  // ---------- görseller (oyunun kendi çevre görselleri, cevre/*.webp) ----------
  const GA=['gok2','dag_yakin','zemin','deniz','tahta','kazik','sokak_lamba','yev0','yev1','yev2','yev3','yev4','yev5','yev6','yev7','o_variller','o_samanaraba','o_teker','o_cit','o_fici_cicek','o_kasacuval','o_saman','o_kuyu','o_cali','o_kaya'];
  const GI=CVR;      // v0.475: giriş ekranı görselleri ayrıca yüklenmez; oyunun çevre görselleri (cevre.js CVR) ve onların ekran boyu kopyaları (dk) kullanılır
  const gHazir=()=>GA.every(n=>CVR[n]);
  const gb=(im,h)=>dk(im,h*GD/im.height);      // giriş ekranında h (CSS px) boyunda çizilecek kopya
  function gIste(){      // sahnedeki boylarla kopyaları önceden iste
    const B={gok2:60,dag_yakin:34,zemin:71,deniz:Math.max(GH/U-80,24),tahta:19,kazik:34,sokak_lamba:62};
    for(const n of GA){const im=GI[n];if(im)dkOn(im,(B[n]||(n[0]==='y'?21:11))*U*GD/im.height)}
  }
  function resim(c,n,x,y,h,ayna,alt){      // x orta, y taban (alt=true) ya da üst; h yükseklik
    const im=GI[n];if(!im)return;const w=h*im.width/im.height,yy=alt===false?y:y-h;
    const b=gb(im,h);
    if(ayna){c.save();c.translate(x,0);c.scale(-1,1);c.drawImage(b,-w/2,yy,w,h);c.restore()}else c.drawImage(b,x-w/2,yy,w,h)}
  function seritDose(c,n,y,h,ofs,duz){      // duz: aynalamadan döşe (çapraz tahtalar V yapmasın)      // yatay döşeme, ortadan başlar, her ikinci kopya aynalı (dikişsiz)
    const im=GI[n];if(!im)return;const w=h*im.width/im.height,b=gb(im,h);let i0=Math.floor((-CX-ofs)/w)-1;
    for(let i=i0;;i++){const x=CX+ofs+i*w;if(x>GW)break;if(x+w<0)continue;
      if(i&1&&!duz){c.save();c.translate(x+w,0);c.scale(-1,1);c.drawImage(b,0,y,w+1,h);c.restore()}else c.drawImage(b,x,y,w+1,h)}}
  const EV_ADAY=['yev0','yev1','yev2','yev3','yev4','yev5','yev6','yev7'];
  function evSira(n){const r=[];while(r.length<n){const al=EV_ADAY.filter(a=>a!==r[r.length-1]&&a!==r[r.length-2]);r.push(al[Math.floor(Math.random()*al.length)])}return r}      // rastgele, aynı ev art arda (ve bir arayla) gelmez
  let EVS=evSira(12),EVS_S=evSira(12);
  function sahneArka(c){
    const X=v=>CX+v*U;
    seritDose(c,'dag_yakin',25*U,34*U,0);
    seritDose(c,'zemin',24*U,71*U,-10*U,true);      // kumlu zemin büyük: üst kenarı dağın eteğini kapatır (arada boşluk kalmaz), alt kısmı iskelenin/denizin altında kalır
    // evler: ortada logo/butonlar için boşluk; geniş ekranda yanlara devam eder
    const EVH={yev0:23,yev1:21,yev2:23,yev3:23,yev4:22,yev5:26,yev6:25,yev7:23},K=0.8;      // K: evler ve objeler %20 küçük (v0.437)
    for(const s of [-1,1]){const L=s<0?EVS:EVS_S;let x=30,i=0;
      while(x<CX/U+20){const n=L[i%L.length],h=EVH[n]*K*U,w=h*GI[n].width/GI[n].height;resim(c,n,X(s*(x+w/U/2)),62*U,h,s>0&&i%2===1);x+=w/U-1.5;i++}}
    resim(c,'o_cit',X(-14),64*U,7*K*U);resim(c,'o_cit',X(14),64*U,7*K*U,true);
    resim(c,'o_kuyu',X(-25),68*U,13*K*U);resim(c,'o_fici_cicek',X(-35),69*U,8*K*U);
    resim(c,'o_samanaraba',X(27),69*U,11*K*U,true);resim(c,'o_variller',X(42),69*U,10*K*U);resim(c,'o_saman',X(55),68*U,8*K*U);
    resim(c,'o_cali',X(-6),65*U,4*K*U);resim(c,'o_kaya',X(5),66*U,3.5*K*U);
  }
  function sahneIskele(c){      // iskele tahtası (denizin önünde); üstünde obje yok
    const im=GI.tahta;if(!im)return;const h=19*U,y=70*U;
    {const gr=c.createLinearGradient(0,y+h*0.6,0,y+h*1.4);gr.addColorStop(0,'rgba(20,40,60,.38)');gr.addColorStop(1,'rgba(20,40,60,0)');c.fillStyle=gr;c.fillRect(0,y+h*0.6,GW,h*0.8)}      // iskelenin altında gölge
    seritDose(c,'tahta',y,h,0,true);
  }
  const KZ=[];
  function sahneOn(c){
    const X=v=>CX+v*U;KZ.length=0;
    for(let k=0;k<4;k++){const x=GW*(k+0.5)/4;KZ.push(x);resim(c,'kazik',x,81*U,34*U,k&1,false)}      // 4 kazık, ekrana eşit dağılır
    FEN=[];for(const s of [-1,1]){const h=62*U,im=GI.sokak_lamba;if(!im)continue;const w=h*im.width/im.height,px=X(s*84);      // direk görselin sol ~%12'sinde, fener ~%75 / ~%30
      const sol=s<0?px-w*0.12:px+w*0.12-w,taban=74*U;resim(c,'sokak_lamba',sol+w/2,taban,h,s>0);      // lamba iskelenin üst yüzeyinde durur
      FEN.push([s<0?sol+w*0.76:sol+w*0.24,taban-h*0.7])}
  }
  function fenerCiz(t){      // lambaların titreyen ışığı
    for(let i=0;i<FEN.length;i++){const [x,y]=FEN[i],a=0.75+0.12*Math.sin(t*9+i*2)+0.08*Math.sin(t*23+i);
      g.save();g.globalCompositeOperation='lighter';const r=14*U*(0.95+0.05*a),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(255,200,90,${0.5*a})`);gr.addColorStop(1,'rgba(255,170,60,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);g.restore()}
  }
  function suCiz(t){      // deniz görseli akar, üstünde kayan ışık çizgileri ve parıltılar
    const y0=80*U;g.fillStyle='#1d8fcf';g.fillRect(0,y0,GW,GH-y0);      // deniz iskelenin altına kadar yukarı girer
    const im=GI.deniz;if(im&&dkVar(im)){const h=Math.max(GH-y0,24*U),w=h*im.width/im.height,o=((t*4*U)%(2*w)+2*w)%(2*w),b=gb(im,h);
      for(let x=-o-2*w;x<GW;x+=w){const i=Math.round((x+o)/w);if(x+w<0)continue;if(i&1){g.save();g.translate(x+w,0);g.scale(-1,1);g.drawImage(b,0,y0,w+1,h);g.restore()}else g.drawImage(b,x,y0,w+1,h)}}
    for(let j=0;j<5;j++){const y=y0+9*U+j*2.2*U;if(y>GH)break;const yon=j%2?1:-1,L=(12+j*2)*U,A=(0.3+j*0.07)*U;
      g.beginPath();for(let x=-6;x<=GW+6;x+=4)g.lineTo(x,y+A*Math.sin(x/L*Math.PI*2+t*2.4*yon));
      g.setLineDash([L*0.4,L*0.5]);g.lineDashOffset=-t*(9+j*3)*U*yon;g.lineWidth=0.3*U;g.strokeStyle='rgba(220,248,255,.22)';g.stroke()}      // çizgiler saydam (v0.437)
    g.setLineDash([]);
    for(let i=0;i<GW/(6*U);i++){const a=Math.sin(t*2.5+i*1.7);if(a<0.4)continue;const x=((rn(i*4.2)*GW+t*5*U*(i%2?1:-1))%GW+GW)%GW,y=y0+(9+rn(i*8.9)*10)*U;
      g.strokeStyle=`rgba(255,255,255,${(a-0.4)*0.75})`;g.lineWidth=0.3*U;g.beginPath();g.moveTo(x-0.9*U,y);g.lineTo(x+0.9*U,y);g.stroke()}
  }

  // ---------- kurulum ve döngü ----------
  function boyutla(){
    GW=innerWidth;GH=innerHeight;GD=Math.min(devicePixelRatio||1,GR_DPR[GR]);U=GH/100;CX=GW/2;
    gc.width=Math.round(GW*GD);gc.height=Math.round(GH*GD);
    birak();
    if(!gHazir())return;
    gIste();const no=boyutla.no=(boyutla.no||0)+1;
    dkBekle(()=>{      // kopyalar hazır olunca sabit katmanlar bir kez çizilir (tam boy görsel hiç çizilmez)
      if(!girisAcik||no!==boyutla.no)return;
      let c;[ARKA,c]=tuval();sahneArka(c);
      [ISK,c]=tuval();sahneIskele(c);
      [ON,c]=tuval();sahneOn(c)});
  }
  function birak(){for(const k of [ARKA,ISK,ON])if(k)try{k.width=k.height=0}catch(_){}ARKA=ISK=ON=null}      // katman tuvallerinin belleğini bırak
  function adim(ms){
    if(!girisAcik)return;requestAnimationFrame(adim);
    const t=ms/1000;
    g.setTransform(GD,0,0,GD,0,0);
    g.fillStyle='#8cc6ee';g.fillRect(0,0,GW,GH);
    {const im=GI.gok2;if(im&&dkVar(im)){const h=60*U,w=h*im.width/im.height,o=(t*1.5*U)%(2*w),b=gb(im,h);      // gökyüzü görseli yavaşça kayar (bulutlar)
      for(let x=-o;x<GW;x+=w){const i=Math.round((x+o)/w);if(i&1){g.save();g.translate(x+w,0);g.scale(-1,1);g.drawImage(b,0,0,w+1,h);g.restore()}else g.drawImage(b,x,0,w+1,h)}}}
    if(ARKA){g.setTransform(1,0,0,1,0,0);g.drawImage(ARKA,0,0);g.setTransform(GD,0,0,GD,0,0)}
    suCiz(t);
    if(ISK){g.setTransform(1,0,0,1,0,0);g.drawImage(ISK,0,0);g.setTransform(GD,0,0,GD,0,0)}
    if(ON){g.setTransform(1,0,0,1,0,0);g.drawImage(ON,0,0);g.setTransform(GD,0,0,GD,0,0)}
    fenerCiz(t);
  }
  window.girisAc=a=>{
    if(typeof DEMO!=='undefined'&&DEMO&&typeof demoBitir==='function')demoBitir();
    girisAcik=a;gel.hidden=!a;document.body.classList.toggle('giris',a);rkBanner(a);      // banner sadece giriş ekranında
    if(a){EVS=evSira(12);EVS_S=evSira(12);boyutla();requestAnimationFrame(adim)}      // her açılışta yeni rastgele ev sırası
    else{birak();try{gc.width=gc.height=1}catch(_){}      // v0.475: oyun başlarken giriş ekranının tuvalleri bellekten bırakılır, oyun tuvali baştan kurulur
      if(typeof tuvalYenile==='function')tuvalYenile();if(typeof oyunKurtar==='function')oyunKurtar()}
  };
  document.getElementById('g_basla').addEventListener('click',()=>{if(!YUK_OK)return;girisAc(false);if(window.ogrBasla)ogrBasla();if(typeof sesAc==='function')try{sesAc()}catch(_){}});
  document.getElementById('g_ayar').addEventListener('click',()=>menuAc(true));
  document.getElementById('g_ogr').addEventListener('click',()=>{if(!YUK_OK)return;girisAc(false);if(window.ogrBasla)ogrBasla(true)});      // pusula: oyunu başlatıp öğreticiyi baştan açar
  document.getElementById('g_sur').textContent=OYUN_SURUM;
  addEventListener('resize',()=>{if(girisAcik)boyutla()});
  girisAc(true);
  // v0.439 açılış = yükleme ekranı: giriş görselleri + oyun görselleri + sesler hazır olunca (en az 1.8 sn, en çok 25 sn) kalkar; o zamana kadar BAŞLA çalışmaz
  {const t0=performance.now(),el=document.getElementById('acilis'),cub=document.getElementById('ac_gri');
    const bak=()=>{
      const n=performance.now()-t0,hz=typeof HAZ_OK!=='undefined'&&HAZ_OK&&!!ARKA,top=YUK_TOP+SES_TOP+12,bit=YUK_BIT+Math.min(SES_BIT,SES_TOP)+(hz?12:Math.max(0,10-DK_IS*0.05));      // son pay: kopyalar + ısınma
      if(cub){const p=Math.min(1,bit/Math.max(1,top));cub.style.setProperty('--p',(p*112-6).toFixed(1)+'%')}      // v0.447: açılış görseli soldan sağa siyah-beyazdan renkliye döner (yükleme)
      if(n<1800||(n<25000&&(!hz||kalan>0||!gorselHazir.ok||typeof dongu!=='function'||SES_BIT<SES_TOP))){setTimeout(bak,100);return}
      YUK_OK=true;el.classList.add('bit');setTimeout(()=>el.remove(),600)};
    bak()}
  (function b(){if(gHazir()){if(girisAcik)boyutla()}else setTimeout(b,100)})();      // çevre görselleri inince sahne kurulur
}
