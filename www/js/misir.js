'use strict';
// Mısır Çölü & Mumya bölümü (v0.468): 5. bölüm gündüz, 6. bölüm gece + ayrı ev/obje seti.
const MISIR_AGAC=[],MISIRH={},MISIR_EV=[],MISIR_OBJ={};
paketEk('misir',()=>{      // v0.475: bu temanın arka plan görselleri bölüme gelince yüklenir
  yukle('fx/misir/misir_dag.png',im=>MISIRH.dag=im);
  yukle('fx/misir/misir_yol.png',im=>MISIRH.yol=im);
  yukle('fx/misir/misir_zemin.png',im=>MISIRH.zemin=im);
  for(let i=0;i<6;i++)yukle('fx/misir/misir_agac'+i+'.png',im=>{MISIR_AGAC[i]=im;MISIR_OBJ['a'+i]=im});
  for(let i=0;i<4;i++)yukle('fx/misir/ev'+i+'.png',im=>MISIR_EV[i]=im);
  for(let i=0;i<6;i++)yukle('fx/misir/obj'+i+'.png',im=>MISIR_OBJ['o'+i]=im);
});
const MISIR=()=>ZOR_N>=4&&ZOR_N<6;
function misirCfg(){
  const g=ZOR_N>=5;
  return {id:'misir',gece:g,gokGunduz:['#e89c4c','#f8d186','#fce7b2'],gokGece:['#110f29','#27214d','#40346e'],
    geceTon:'rgba(14,10,36,0.44)',dag:MISIRH.dag,dagOlcek:0.62,dagAlt:'#b98c56',zemin:MISIRH.zemin,zeminAlt:['#c79a56','#dfb572'],yol:MISIRH.yol,yolOfs:0.22,
    evIm:MISIR_EV,objIm:MISIR_OBJ,evIdx:g?[2,3]:[0,1],objIdx:g?['o3','o4','o5','a3','a4','a5']:['o0','o1','o2','a0','a1','a2']
  };
}
function misirArka(camX,zeminY){temaArka(misirCfg(),camX,zeminY)}
