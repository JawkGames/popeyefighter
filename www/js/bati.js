'use strict';
// Vahşi Batı Kanyonu / Kasaba bölümü (v0.468): 9. bölüm kızgın gün batımı (10. bölümde gece hazır).
const BATI_AGAC=[],BATIH={},BATI_EV=[],BATI_OBJ={};
paketEk('bati',()=>{      // v0.475: bu temanın arka plan görselleri bölüme gelince yüklenir
  yukle('fx/bati/bati_dag.png',im=>BATIH.dag=im);
  yukle('fx/bati/bati_yol.png',im=>BATIH.yol=im);
  yukle('fx/bati/bati_zemin.png',im=>BATIH.zemin=im);
  for(let i=0;i<6;i++)yukle('fx/bati/bati_agac'+i+'.png',im=>{BATI_AGAC[i]=im;BATI_OBJ['a'+i]=im});
  for(let i=0;i<4;i++)yukle('fx/bati/ev'+i+'.png',im=>BATI_EV[i]=im);
  for(let i=0;i<6;i++)yukle('fx/bati/obj'+i+'.png',im=>BATI_OBJ['o'+i]=im);
});
const BATI=()=>ZOR_N>=8;
function batiCfg(){
  const g=ZOR_N>=9;
  return {id:'bati',gece:g,gokGunduz:['#c94b3b','#f08a49','#f8c673'],gokGece:['#140d24','#2c193d','#4a2645'],
    geceTon:'rgba(18,8,24,0.44)',dag:BATIH.dag,dagOlcek:0.75,dagAlt:'#8a4227',zemin:BATIH.zemin,zeminAlt:['#9b4f2b','#be6b3a'],yol:BATIH.yol,yolOfs:0.22,
    evIm:BATI_EV,objIm:BATI_OBJ,evIdx:g?[2,3]:[0,1],objIdx:g?['o3','o4','o5','a3','a4','a5']:['o0','o1','o2','a0','a1','a2']
  };
}
function batiArka(camX,zeminY){temaArka(batiCfg(),camX,zeminY)}
