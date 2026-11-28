'use strict';
// AdMob reklamları (@capacitor-community/admob). Sadece Android uygulamasında çalışır. Tarayıcıda (githack testi) reklam çıkmaz; ödüllü reklamlar test için hemen ödül verir.
// banner: sadece giriş ekranında (oyun başlayınca kalkar) · açılış: uygulama açılınca ve uygulamaya geri dönülünce · ödüllü video: ölünce kurtulma (el fırlayan play butonu)
// ödüllü geçiş: skill ağacında +1 skill puanı (klaketli el) · geçiş: kurtulmadan yeniden başlarken (en çok 3 dakikada bir)
const RK_ID={banner:'ca-app-pub-7983529419004158/8529591582',acilis:'ca-app-pub-7983529419004158/9898513572',odul:'ca-app-pub-7983529419004158/2114945214',
  odulGecis:'ca-app-pub-7983529419004158/8770806720',gecis:'ca-app-pub-7983529419004158/6150840258'};
const ADM=(()=>{try{const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return null;return (C.Plugins&&C.Plugins.AdMob)||(C.registerPlugin?C.registerPlugin('AdMob'):null)}catch(_){return null}})();
const RK={hazir:false,mesgul:false,son:0,gizliT:0,gecisT:0,banner:false,yuklu:{},odulAldi:false,bitir:null};
function rkYukle(tur){      // reklamı önceden yükler (gösterince yenisi yüklenir)
  if(!ADM||!RK.hazir||RK.yuklu[tur]==='y'||RK.yuklu[tur]===true)return;RK.yuklu[tur]='y';
  const f={odul:'prepareRewardVideoAd',odulGecis:'prepareRewardInterstitialAd',gecis:'prepareInterstitial',acilis:'loadAppOpen'}[tur];
  ADM[f]({adId:RK_ID[tur]}).then(()=>{RK.yuklu[tur]=true}).catch(()=>{RK.yuklu[tur]=false;setTimeout(()=>rkYukle(tur),30000)});
}
function rkBanner(ac){
  if(!ADM||!RK.hazir)return;
  if(ac&&!RK.banner){RK.banner=true;ADM.showBanner({adId:RK_ID.banner,adSize:'ADAPTIVE_BANNER',position:'BOTTOM_CENTER',margin:0}).catch(()=>{RK.banner=false})}
  else if(!ac&&RK.banner){RK.banner=false;ADM.removeBanner().catch(()=>{})}
}
function rkBitti(odul){      // reklam kapandı: oyun sesi geri gelir, ödül verilir
  RK.mesgul=false;RK.son=Date.now();const b=RK.bitir;RK.bitir=null;if(b)b(odul)}
function rkGoster(tur,cb){      // cb(odul: true/false)
  if(RK.mesgul)return;
  if(!ADM){cb&&cb(true);return}      // tarayıcı testi: reklamsız ödül
  if(RK.yuklu[tur]!==true){rkYukle(tur);S.pops.push({x:S.x,y:S.y+1200,t:0,txt:dil('rk_yok'),f:0.6});cb&&cb(false);return}
  const f={odul:'showRewardVideoAd',odulGecis:'showRewardInterstitialAd',gecis:'showInterstitial',acilis:'showAppOpen'}[tur];
  RK.mesgul=true;RK.odulAldi=false;RK.yuklu[tur]=false;
  RK.bitir=odul=>{rkYukle(tur);cb&&cb(odul)};
  ADM[f]().then(r=>{if(r&&tur.startsWith('odul'))RK.odulAldi=true}).catch(()=>rkBitti(false));
}
// v0.476: uygulama ilk açılırken reklam yok. 1. bölümde (ZOR_N=0) geçiş ve geri dönüş reklamı da yok; 2. bölümden itibaren başlar.
function rkGecis(){if(ADM&&ZOR_N>=1&&Date.now()-RK.gecisT>180000&&RK.yuklu.gecis===true){RK.gecisT=Date.now();rkGoster('gecis')}}
function rkAcilis(){if(ADM&&ZOR_N>=1&&!RK.mesgul&&Date.now()-RK.son>5000&&RK.yuklu.acilis===true)rkGoster('acilis')}
if(ADM){
  const kapandi=()=>rkBitti(RK.odulAldi),odul=()=>{RK.odulAldi=true},hata=()=>rkBitti(false);
  for(const [e,fn] of [['onRewardedVideoAdReward',odul],['onRewardedVideoAdDismissed',kapandi],['onRewardedVideoAdFailedToShow',hata],
    ['onRewardedInterstitialAdReward',odul],['onRewardedInterstitialAdDismissed',kapandi],['onRewardedInterstitialAdFailedToShow',hata],
    ['interstitialAdDismissed',kapandi],['interstitialAdFailedToShow',hata],['appOpenAdClosed',kapandi],['appOpenAdFailedToShow',hata]])try{ADM.addListener(e,fn)}catch(_){}
  (async()=>{
    try{await ADM.initialize({})}catch(_){return}
    try{const c=await ADM.requestConsentInfo();if(c&&c.isConsentFormAvailable&&c.status==='REQUIRED')await ADM.showConsentForm()}catch(_){}      // AB kullanıcıları için izin formu
    RK.hazir=true;
    for(const t of ['acilis','odul','odulGecis','gecis'])rkYukle(t);
    if(girisAcik)rkBanner(true);
  })();
  document.addEventListener('visibilitychange',()=>{      // uygulamaya geri dönünce (en az 10 sn arkadaysa) açılış reklamı
    if(document.hidden){if(!RK.mesgul)RK.gizliT=Date.now();return}
    if(RK.gizliT&&!RK.mesgul&&Date.now()-RK.gizliT>10000)rkAcilis();RK.gizliT=0;
  });
}
// ---- ölünce kurtulma (ödüllü video): ceza yok, olduğu yerde can/enerji dolu kalkar, 3 sn dokunulmaz ----
function rkKurtul(){
  rkGoster('odul',ok=>{if(!ok||S.durum!=='yenildi')return;
    if(antiMod)antiKapat();if(hakAcik)hakAc(false);
    S.durum='oyun';S.ol=null;S.antiBek=0;S.hakBek=0;S.hp=HPMAX;S.en=ENMAX;S.inv=S.t+3;S.spin=0;S.vx=0;S.vy=0;S.yer=true;S.y=zemin(S.x);S.hasT=S.t;
    S.pops.push({x:S.x,y:S.y+1250,t:0,txt:dil('rk_kurtuldu'),f:1.2,mavi:true})});
}
// ---- skill ağacında video izle: +1 skill puanı (ödüllü geçiş) ----
function rkPuan(){rkGoster('odulGecis',ok=>{if(!ok)return;AG.ek=(AG.ek|0)+1;agHesap();agKaydet();agBtn();if(window.agacYenile)agacYenile();bufCal(LVS,1)})}
// ---- verilecek skill yoksa ölünce: BİR HAK DAHA ekranı (video izle kurtul / yeniden başla) ----
let hakAcik=false;
{
  const el=document.getElementById('hak'),ic=document.getElementById('hak_ic'),sec=document.getElementById('hak_sec'),sy=document.getElementById('hak_sy'),az=document.getElementById('hak_azalt');
  window.hakAc=a=>{hakAcik=a;el.hidden=!a;if(a){ic.hidden=false;sec.hidden=true;izler.clear();kizler.clear();KOL.N.ak=false;KOL.F.ak=false;key.sol=key.sag=key.asagi=key.zipla=false}};
  document.getElementById('hak_vid').addEventListener('click',rkKurtul);
  document.getElementById('hak_yeni').addEventListener('click',()=>{ic.hidden=true;sec.hidden=false;const ok=HPMAX>100;sy.textContent=dil(ok?'hak_sor':'hak_son');az.hidden=!ok});
  az.addEventListener('click',()=>{hakAc(false);olumCeza();rkGecis();yeniOyun()});
  document.getElementById('hak_sifir').addEventListener('click',()=>{hakAc(false);tamSifirla();rkGecis();yeniOyun()});
  document.getElementById('hak_geri').addEventListener('click',()=>{sec.hidden=true;ic.hidden=false});
}
