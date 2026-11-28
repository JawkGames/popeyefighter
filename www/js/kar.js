'use strict';
// Karlı dağ bölümü (v0.468): 3. bölüm gündüz, 4. bölüm gece + ayrı ev/obje seti.
const AGAC=[],KARH={},KAR_EV=[],KAR_OBJ={};
paketEk('kar',()=>{      // v0.475: bu temanın arka plan görselleri bölüme gelince yüklenir
  yukle('fx/kar/dag.webp',im=>KARH.dag=im);
  yukle('fx/kar/yol.webp',im=>KARH.yol=im);
  yukle('fx/kar/kar_zemin.png',im=>KARH.zemin=im);
  for(let i=0;i<8;i++)yukle('fx/kar/agac'+i+'.webp',im=>{AGAC[i]=im;KAR_OBJ['a'+i]=im});
  for(let i=0;i<4;i++)yukle('fx/kar/ev'+i+'.png',im=>KAR_EV[i]=im);
  for(let i=0;i<6;i++)yukle('fx/kar/obj'+i+'.png',im=>KAR_OBJ['o'+i]=im);
});
const KARLI=()=>ZOR_N>=2&&ZOR_N<4;
function karCfg(){
  const g=ZOR_N>=3;
  return {id:'kar',gece:g,gokGunduz:['#9cc8e6','#d5ecfa','#eef7fc'],gokGece:['#0a152b','#152c52','#244270'],
    dag:KARH.dag,dagOlcek:0.85,dagAlt:'#7a8f9e',zemin:KARH.zemin,zeminAlt:['#8da3b2','#b9cddb'],yol:KARH.yol,yolOfs:0.35,
    evIm:KAR_EV,objIm:KAR_OBJ,evIdx:g?[2,3]:[0,1],objIdx:g?['o3','o4','o5','a2','a5','a6','a7']:['o0','o1','o2','a0','a1','a3','a4']
  };
}
function karArka(camX,zeminY){temaArka(karCfg(),camX,zeminY)}
function bossGit(){      // PC testi: bulunulan bölümün dalgalarını atlayıp direkt boss alanına ışınlar
  DUS.length=0;MERMI.length=0;EMER.length=0;EFL.length=0;
  AR.i=AR.n;AR.kilit=false;AR.bek=null;AR.yak=false;AR.of=0;AR.v=0;arOk(false);
  const bx=AR.bossX-arBosluk();
  S.x=bx;S.y=zemin(S.x);S.vx=0;S.vy=0;S.yer=true;S.yon=1;KX=bx;S.camY=S.y;
  S.bossGeldi=false;bossKur();
  const b=DUS[DUS.length-1];if(b)b.akt=true;
  if(typeof muzikGuncelle==='function')muzikGuncelle();
}
function bolumGit(n,boss){      // PC testi: n. bölümü başlatır (boss=true ise direkt boss ekranı)
  if(girisAcik||menuAcik||agacAcik||listeAcik||hakAcik||antiMod||tusAcik||PK_BEK)return;
  if(typeof ogrAcik!=='undefined'&&ogrAcik){const g=document.getElementById('ogrG');if(g)g.dispatchEvent(new PointerEvent('pointerdown'))}
  ZOR_N=n-1;S.tamSif=false;if(S.durum==='tamam')S.durum='oyun';yeniOyun();if(boss)bossGit();sesSeviye();
}
if(!UYGULAMA_K())addEventListener('keydown',e=>{
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
  const m=/^(?:Digit|Numpad)([0-9])$/.exec(e.code),d=m?+m[1]:'0123456789'.indexOf(e.key);
  if(d===0)bolumGit(ZOR_N+1,true);
  else if(d>0)bolumGit(d,e.shiftKey||(ZOR_N===d-1&&!S.bossGeldi&&S.durum==='oyun'));
});
function UYGULAMA_K(){try{return !!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}catch(_){return false}}
