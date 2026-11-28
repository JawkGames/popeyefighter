'use strict';
// Mobil uygulama (APK/AAB) davranışları (v0.443). Oyun telefonda uygulama olarak çalışır; tarayıcı sürümü sadece test içindir.
// geriTus(): Android geri tuşu (MainActivity.java çağırır): açık paneli kapatır, oyundaysa menüyü açar (duraklat), giriş ekranında 2 sn içinde ikinci basış 'cik' döndürür (uygulama kapanır).
// Arka plana gidince (ev tuşu, arama) oyun menüyle duraklar. Otomatik grafik: oyuncu grafik ayarını elle seçmediyse oyunun ilk dakikasında FPS ölçülür, düşükse seviye kendiliğinden iner (AYAR.grEl = elle seçildi).
let GERI_SON=0;
function geriTus(){
  if(antiMod||hakAcik)return '';
  if(tusAcik){tuslarAc(false);return ''}
  if(listeAcik){listeAc(false);return ''}
  if(agacAcik){agacAc(false);return ''}
  if(menuAcik){menuAc(false);return ''}
  if(girisAcik){const n=performance.now();if(n-GERI_SON<2000)return 'cik';GERI_SON=n;return ''}
  menuAc(true);return '';
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!girisAcik)try{tuvalYenile()}catch(_){}      // v0.475: uygulamaya geri dönünce oyun tuvalinin grafik belleği baştan kurulur
  if(document.hidden&&!girisAcik&&!menuAcik&&!agacAcik&&!listeAcik&&!hakAcik&&!antiMod&&!tusAcik&&!DEMO)menuAc(true)});
{
  let n=0,top=0,son=0,olc=0;      // olc: ölçülen oyun süresi (sn)
  const bak=ms=>{
    const dt=son?ms-son:0;son=ms;
    if(AYAR.grEl||GR===0||olc>60)return;      // elle seçildiyse ya da 1 dk ölçüldüyse bitti
    requestAnimationFrame(bak);
    if(document.hidden||girisAcik||menuAcik||agacAcik||listeAcik||hakAcik||dt<=0||dt>250)return;
    n++;top+=dt;olc+=dt/1000;
    if(top>=4000){const fps=n*1000/top;n=0;top=0;
      if(fps<38&&GR>0){AYAR.gr=GR-1;ayarKaydet();GR=AYAR.gr;try{dispatchEvent(new Event('resize'))}catch(_){}}}      // her 4 sn'de ortalama 38 FPS altıysa bir seviye in
  };
  requestAnimationFrame(bak);
}
