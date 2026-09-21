const host=document.getElementById('scene');
const openButton=document.getElementById('open');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealScene=()=>{};
function reveal(){document.getElementById('intro').hidden=true;document.getElementById('dedication').hidden=false;document.getElementById('hint').hidden=false;revealScene();}
openButton.addEventListener('click',reveal);
document.getElementById('replay').addEventListener('click',()=>revealScene());
try {
const THREE=await import('./three.module.js');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,.5,10);camera.lookAt(0,.45,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffefcb,0x25452a,2.1));
const key=new THREE.DirectionalLight(0xffe2a0,3.3);key.position.set(-3,5,6);scene.add(key);
const rim=new THREE.DirectionalLight(0xffb52e,2.1);rim.position.set(4,2,-2);scene.add(rim);
const fill=new THREE.DirectionalLight(0xffffff,1);fill.position.set(1,1,4);scene.add(fill);
const bouquet=new THREE.Group();bouquet.scale.setScalar(.96);scene.add(bouquet);
const gold=new THREE.MeshStandardMaterial({color:0xffc72b,roughness:.43,metalness:.04,side:THREE.DoubleSide});
const pale=new THREE.MeshStandardMaterial({color:0xffdd48,roughness:.5,side:THREE.DoubleSide});
const green=new THREE.MeshStandardMaterial({color:0x487536,roughness:.65,side:THREE.DoubleSide});
const stemMat=new THREE.MeshStandardMaterial({color:0x4c7734,roughness:.65});
const brown=new THREE.MeshStandardMaterial({color:0x382010,roughness:.94});
const seedMat=new THREE.MeshStandardMaterial({color:0x815122,roughness:.85});
function petalGeometry(length,width,curl){const positions=[],uv=[],idx=[],rows=16,cols=6;for(let i=0;i<=rows;i++){let t=i/rows;let w=Math.pow(Math.sin(Math.PI*t),.7)*width;for(let j=0;j<=cols;j++){let v=j/cols*2-1;positions.push(v*w,t*length,Math.sin(t*Math.PI)*curl+v*v*.09*Math.sin(t*Math.PI)-t*t*.11);uv.push(j/cols,t);}}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){let a=i*(cols+1)+j,b=a+cols+1;idx.push(a,b,a+1,b,b+1,a+1);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
const petal=petalGeometry(.78,.14,.18),leaf=petalGeometry(.92,.24,.13);
const flowers=[];
function flower(x,y,z,size,tilt){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.set(-.07,tilt,tilt*.25);bouquet.add(group);const head=new THREE.Group();group.add(head);for(let ring=0;ring<2;ring++)for(let j=0;j<19;j++){const p=new THREE.Mesh(petal,ring?pale:gold),a=j/19*Math.PI*2+ring*.14;p.position.set(-Math.sin(a)*.19,Math.cos(a)*.19,ring*.055);p.rotation.z=a;p.rotation.x=ring?-.07:.13;p.scale.setScalar(ring?.86:1);head.add(p);}const center=new THREE.Mesh(new THREE.SphereGeometry(.275,24,16),brown);center.scale.z=.4;center.position.z=.1;head.add(center);
const seeds=new THREE.InstancedMesh(new THREE.SphereGeometry(.018,5,4),seedMat,210);const dummy=new THREE.Object3D();for(let k=0;k<210;k++){const r=.254*Math.sqrt(k/210),a=k*2.399963;dummy.position.set(Math.cos(a)*r,Math.sin(a)*r,.14+.085*Math.sqrt(1-r*r/.075));dummy.scale.set(1,1,1.2);dummy.updateMatrix();seeds.setMatrixAt(k,dummy.matrix);}head.add(seeds);group.scale.setScalar(size);
const path=new THREE.CatmullRomCurve3([new THREE.Vector3(x*.12,-2.5,z*.1),new THREE.Vector3(x*.5,-.9,z*.45),new THREE.Vector3(x,y,z)]);bouquet.add(new THREE.Mesh(new THREE.TubeGeometry(path,22,.027,6,false),stemMat));
for(let j=0;j<2;j++){const l=new THREE.Mesh(leaf,green);l.position.copy(path.getPoint(.38+j*.21));l.rotation.set(.3,j?-.5:.6,(j?1:-1)*(1.0+Math.abs(x)*.22));l.scale.setScalar(.6+size*.3);bouquet.add(l);}flowers.push({group,size,delay:flowers.length*.12});}
flower(-1.12,.85,-.24,.83,-.2);flower(.95,1.15,-.35,.88,.2);flower(-.35,1.88,-.43,.88,-.08);flower(.0,.56,.4,1.0,.0);flower(-1.1,-.1,.25,.64,-.28);flower(1.14,-.05,.18,.71,.3);flower(.42,-.12,.72,.54,.1);
// Three overlapping sheets gather at the ribbon, with a low front edge
// that keeps the flowers visible and a taller, pleated back collar.
const wrapping=new THREE.Group();bouquet.add(wrapping);
const paperCream=new THREE.MeshStandardMaterial({color:0xf3dfb6,roughness:.86,side:THREE.DoubleSide});
const paperIvory=new THREE.MeshStandardMaterial({color:0xffefd3,roughness:.82,side:THREE.DoubleSide});
const paperHoney=new THREE.MeshStandardMaterial({color:0xd3ac72,roughness:.8,side:THREE.DoubleSide});
const ribbonMat=new THREE.MeshStandardMaterial({color:0xc28c20,metalness:.52,roughness:.3,side:THREE.DoubleSide});
function paperSheet(from,to,material,offset,lift){
  const positions=[],indices=[],edge=[],rows=24,cols=48;
  for(let row=0;row<=rows;row++){
    const t=row/rows;
    for(let col=0;col<=cols;col++){
      const u=col/cols,a=from+(to-from)*u;
      const rimY=.27-1.04*Math.cos(a)+lift+.17*Math.sin(u*Math.PI*3);
      const lower=t<.22;
      const flare=lower?1-t/.22:(t-.22)/.78;
      const fold=Math.cos(a*10+offset*14)*.045*Math.pow(flare,1.2);
      const radius=(lower?.24+.19*flare:.24+1.47*Math.pow(flare,1.05))+fold+offset;
      const y=lower?-2.48+t/.22*.65:-1.83+flare*(rimY+1.83);
      const x=Math.sin(a)*radius;
      const z=Math.cos(a)*radius*.61-.06;
      positions.push(x,y,z);
      if(row===rows)edge.push(new THREE.Vector3(x,y,z));
    }
  }
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const a=row*(cols+1)+col,b=a+cols+1;indices.push(a,a+1,b,b,a+1,b+1);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  wrapping.add(new THREE.Mesh(geometry,material));
  // A fine gold border follows the folded upper edge of each sheet.
  wrapping.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge),72,.008,4,false),ribbonMat));
}
paperSheet(1.15,5.2,paperHoney,0,.05);
paperSheet(-1.95,.38,paperCream,.035,.04);
paperSheet(-.22,1.95,paperIvory,.068,-.03);
const ribbonBand=new THREE.Mesh(new THREE.CylinderGeometry(.325,.325,.13,48,1,true),ribbonMat);
ribbonBand.scale.z=.7;ribbonBand.position.set(0,-1.83,-.06);wrapping.add(ribbonBand);
const knot=new THREE.Mesh(new THREE.SphereGeometry(.13,20,14),ribbonMat);
knot.scale.set(1,.8,.65);knot.position.set(0,-1.8,.29);wrapping.add(knot);
function satinRibbon(points,width){
  const path=new THREE.CatmullRomCurve3(points),positions=[],indices=[],steps=40;
  for(let i=0;i<=steps;i++){
    const t=i/steps,p=path.getPoint(t),direction=path.getTangent(t);
    const across=new THREE.Vector3(-direction.y,direction.x,.32*Math.sin(t*Math.PI*2)).normalize();
    const half=width*(.8+.2*Math.sin(Math.PI*t))*.5;
    for(const side of [-1,1]){const v=p.clone().addScaledVector(across,side*half);positions.push(v.x,v.y,v.z);}
    if(i<steps){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();wrapping.add(new THREE.Mesh(geometry,ribbonMat));
}
for(const side of [-1,1]){
  const v=(x,y,z)=>new THREE.Vector3(side*x,-1.8+y,.3+z);
  satinRibbon([v(.03,0,0),v(.32,.22,.07),v(.58,.22,0),v(.57,.03,-.07),v(.3,-.06,-.035),v(.03,0,.01)],.14);
  satinRibbon([v(.05,-.04,.01),v(.17,-.22,.09),v(.26,-.43,.075),v(.4,-.59,.02)],.18);
}
const count=95,points=new Float32Array(count*3);for(let i=0;i<count;i++){points[i*3]=(Math.random()-.5)*11;points[i*3+1]=(Math.random()-.5)*7;points[i*3+2]=(Math.random()-.5)*4-1;}
const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.BufferAttribute(points,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffdb70,size:.025,transparent:true,opacity:.66,depthWrite:false}));scene.add(stars);
let start=0,opened=false,target=0,dragging=false,lastX=0;
revealScene=()=>{opened=true;start=performance.now();if(reduced)start-=5000;};
if(document.getElementById('intro').hidden)revealScene();
document.getElementById('rotate').onclick=()=>{target+=Math.PI/3;};
host.addEventListener('pointerdown',e=>{if(!opened)return;dragging=true;lastX=e.clientX;host.setPointerCapture(e.pointerId);});host.addEventListener('pointermove',e=>{if(dragging){target+=(e.clientX-lastX)*.009;lastX=e.clientX;}});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=camera.aspect<1?11.4:9.3;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
function animate(now){requestAnimationFrame(animate);if(document.hidden)return;const t=now*.001;const elapsed=(now-start)*.001;for(const f of flowers){let progress=opened?THREE.MathUtils.clamp((elapsed-f.delay)/1.5,0,1):.16;progress=1-Math.pow(1-progress,3);f.group.scale.setScalar(f.size*(.08+.92*progress));}bouquet.rotation.y+=(target-bouquet.rotation.y)*.045;if(!reduced){bouquet.rotation.z=Math.sin(t*.65)*.022;bouquet.position.y=Math.sin(t*.8)*.035;stars.rotation.y=t*.018;}renderer.render(scene,camera);}requestAnimationFrame(animate);
}catch(error){document.getElementById('fallback').hidden=false;document.getElementById('hint').hidden=true;document.getElementById('rotate').hidden=true;document.querySelector('.divider').hidden=true;revealScene=()=>{document.getElementById('hint').hidden=true;};console.warn('Vista alternativa de flores disponible.',error);}

