import * as T from './vendor/three.module.min.js';
import {menuCatalog} from './live-menu-catalog.js';
const cache=new Map();let renderer,scene,camera;
export function foodThumbnail(id){return modelThumbnail(()=>menuCatalog.build(id),id);}
export function modelThumbnail(build,id){
 if(cache.has(id))return cache.get(id);
 try{
  if(!renderer){renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setSize(144,144);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;scene=new T.Scene();scene.add(new T.HemisphereLight(0xffffff,0xa6916f,2));const light=new T.DirectionalLight(0xffeed4,3);light.position.set(-3,5,4);scene.add(light);camera=new T.OrthographicCamera(-1.25,1.25,1.25,-1.25,.1,30);camera.position.set(4,3,5);camera.lookAt(0,0,0);}
  const model=build(),bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=1.85/Math.max(size.x,size.y,size.z,.01);model.scale.multiplyScalar(scale);model.position.sub(center).multiplyScalar(scale);scene.add(model);renderer.render(scene,camera);const url=renderer.domElement.toDataURL('image/png');scene.remove(model);cache.set(id,url);return url;
 }catch{return '';}
}
