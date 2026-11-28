'use strict';
// Menü: sağ üstteki ayarlar düğmesi. Oyun ekranında sadece can barı, yön/zıplama tuşları ve ıspanak kalır;
// ses efektleri, müzik, eğim sensörü (+dengele), tam ekran, dil, kombo listesi, yetenek ağacı ve sürüm bu menünün içindedir. Menü açıkken oyun durur.
let menuAcik=false;
{
  const el=document.getElementById('menu'),btn=document.getElementById('menuB');
  const tg=k=>el.querySelector(`.m_sat[data-k="${k}"] .m_tg`);
  const grAl=()=>AYAR.gr===0||AYAR.gr===1?AYAR.gr:2;
  // grafik seviyesi menü kapanınca uygulanır (tıklarken sadece simge değişir): çözünürlük değiştiği için tuvaller yeniden boyutlanır
  function grUygula(){const g=grAl();if(g===GR)return;GR=g;try{dispatchEvent(new Event('resize'))}catch(_){boyut()}}
  for(let i=0;i<3;i++)new Image().src='ui/m_gr'+i+'.webp'+SURUM;
  function menuYenile(){
    tg('amb').classList.toggle('ac',!!AYAR.amb);
    tg('ses').classList.toggle('ac',!!AYAR.ses);
    tg('muz').classList.toggle('ac',!!AYAR.muz);
    document.getElementById('m_kmI').style.backgroundImage=`url(ui/${KM_IKON[KMOD]}.webp${SURUM})`;document.getElementById('m_kmY').textContent=dil('km_'+KMOD);      // kontrol modu
    document.getElementById('m_kal').hidden=!(KMOD==='egim'&&GYRO.ak);{const kj=!(KMOD==='klavye'||KMOD==='joy');document.getElementById('m_kmL').hidden=kj;document.getElementById('m_kmA').hidden=kj}
    document.getElementById('m_dilA').textContent=DIL.toUpperCase();
    document.getElementById('m_grI').style.backgroundImage=`url(ui/m_gr${grAl()}.webp${SURUM})`;
    document.getElementById('m_sur').textContent='POPEYE FIGHTER '+OYUN_SURUM;
  }
  window.menuYenile=menuYenile;
  window.menuAc=a=>{
    if(a){if(agacAcik)agacAc(false);if(listeAcik)listeAc(false);if(DEMO)demoBitir();izler.clear();kizler.clear();KOL.N.ak=false;KOL.F.ak=false;key.sol=key.sag=key.asagi=key.zipla=false;menuYenile()}
    menuAcik=a;el.hidden=!a;btn.classList.toggle('aktif',a);
    if(!a){grUygula();if(DEMO)demoBitir();oyunKurtar()}
  };
  btn.addEventListener('click',()=>menuAc(!menuAcik));
  el.addEventListener('click',e=>{if(e.target===el)menuAc(false)});      // panelin dışına dokununca kapanır
  el.querySelectorAll('.m_sat').forEach(r=>r.addEventListener('click',async e=>{
    const k=r.dataset.k;
    if(k==='amb'){AYAR.amb=!AYAR.amb;ayarKaydet()}
    else if(k==='ses'){AYAR.ses=!AYAR.ses;ayarKaydet()}
    else if(k==='muz'){AYAR.muz=!AYAR.muz;ayarKaydet()}
    else if(k==='kmod'){if(e.target.id==='m_kal'){document.getElementById('sifir').click();return}if(e.target.id==='m_kmL'||e.target.id==='m_kmA'){tuslarAc(true);return}await kmodSec(KMODLAR[(KMODLAR.indexOf(KMOD)+1)%KMODLAR.length])}      // sıradaki kontrol modu
    else if(k==='dil')dilSonraki();
    menuYenile();
  }));
  // giriş ekranından açılınca: giriş geçici kapanır (önizleme oyunun arkasında oynar), liste/ağaç kapanınca giriş geri gelir
  let gDon=false;const gGec=()=>{if(girisAcik){gDon=true;girisAc(false)}};
  const gGeri=()=>setTimeout(()=>{if(gDon&&!agacAcik&&!listeAcik){gDon=false;girisAc(true)}},0);
  {const ag=window.agacAc,li=window.listeAc;window.agacAc=a=>{ag(a);if(!a)gGeri()};window.listeAc=a=>{li(a);if(!a)gGeri()}}
  document.getElementById('m_kombo').addEventListener('click',()=>{menuAc(false);gGec();listeAc(true)});
  document.getElementById('m_gr').addEventListener('click',()=>{AYAR.gr=(grAl()+1)%3;AYAR.grEl=true;ayarKaydet();menuYenile()});      // düşük → orta → yüksek → düşük
  document.getElementById('m_devam').addEventListener('click',()=>menuAc(false));
  document.addEventListener('fullscreenchange',()=>{if(menuAcik)menuYenile()});
  DIL_DIN.push(()=>{if(menuAcik)menuYenile()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&menuAcik)menuAc(false)});
}
