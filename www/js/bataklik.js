'use strict';
// Karanlık Bataklık / Sisli Orman bölümü (v0.468): 7. bölüm sisli akşam, 8. bölüm zifiri gece + ayrı ev/obje seti.
const BATAK_AGAC=[],BATAKH={},BATAK_EV=[],BATAK_OBJ={};
paketEk('batak',()=>{      // v0.475: bu temanın arka plan görselleri bölüme gelince yüklenir
  yukle('fx/bataklik/bataklik_dag.png',im=>BATAKH.dag=im);
  yukle('fx/bataklik/bataklik_yol.png',im=>BATAKH.yol=im);
  yukle('fx/bataklik/bataklik_zemin.png',im=>BATAKH.zemin=im);
  for(let i=0;i<6;i++)yukle('fx/bataklik/bataklik_agac'+i+'.png',im=>{BATAK_AGAC[i]=im;BATAK_OBJ['a'+i]=im});
  for(let i=0;i<4;i++)yukle('fx/bataklik/ev'+i+'.png',im=>BATAK_EV[i]=im);
  for(let i=0;i<6;i++)yukle('fx/bataklik/obj'+i+'.png',im=>BATAK_OBJ['o'+i]=im);
});
const BATAK=()=>ZOR_N>=6&&ZOR_N<8;
function batakCfg(){
  const g=ZOR_N>=7;
  return {id:'batak',gece:g,gokGunduz:['#2b3d38','#577368','#7d9685'],gokGece:['#091412','#122621','#1d3830'],
    geceTon:'rgba(6,18,14,0.48)',dag:BATAKH.dag,dagOlcek:1.1,dagAlt:'#2c382a',zemin:BATAKH.zemin,zeminAlt:['#2d3626','#3f4a33'],yol:BATAKH.yol,yolOfs:0.24,
    evIm:BATAK_EV,objIm:BATAK_OBJ,evIdx:g?[2,3]:[0,1],objIdx:g?['o3','o4','o5','a3','a4','a5']:['o0','o1','o2','a0','a1','a2']
  };
}
function batakArka(camX,zeminY){temaArka(batakCfg(),camX,zeminY)}
