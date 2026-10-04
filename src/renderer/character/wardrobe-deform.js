// A connected textured mesh: no cut-out arms, overlapping sprites or exposed seams.
(function(root){
'use strict';
function create(canvas){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true});if(!gl)return null;
 const vertex=`attribute vec2 position;varying vec2 uv;uniform vec4 arms;uniform vec4 feet;
 float region(float a,float b,float v){return smoothstep(a,b,v);}
 vec2 turn(vec2 p,vec2 pivot,float angle){float c=cos(angle),s=sin(angle);vec2 q=p-pivot;return pivot+vec2(c*q.x-s*q.y,s*q.x+c*q.y);}
 void main(){vec2 p=position;uv=p/vec2(220.,260.);
 float ly=region(140.,172.,p.y)*(1.-region(210.,230.,p.y));
 float lw=(1.-region(35.,65.,p.x))*ly,rw=region(155.,185.,p.x)*ly;
 vec2 q=p+(turn(p,vec2(51.,153.),arms.x)-p)*lw+(turn(p,vec2(169.,153.),arms.y)-p)*rw;
 float fw=region(223.,243.,p.y);q.y+=fw*mix(feet.x,feet.y,region(105.,115.,p.x));
 gl_Position=vec4((q.x+20.)/130.-1.,1.-(q.y+20.)/150.,0.,1.);}`;
 const fragment=`precision mediump float;uniform sampler2D body;varying vec2 uv;void main(){gl_FragColor=texture2D(body,uv);}`;
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 const program=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;gl.useProgram(program);
 const vertices=[];for(let y=0;y<260;y+=4)for(let x=0;x<220;x+=4){const b=Math.min(260,y+4),r=Math.min(220,x+4);vertices.push(x,y,r,y,x,b,r,y,r,b,x,b);}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
 const armLocation=gl.getUniformLocation(program,'arms'),footLocation=gl.getUniformLocation(program,'feet');let loaded=false;
 function draw(left=0,right=0,lf=0,rf=0){if(!loaded||gl.isContextLost())return false;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform4f(armLocation,left,right,0,0);gl.uniform4f(footLocation,lf,rf,0,0);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);return gl.getError()===gl.NO_ERROR;}
 return {setImage(img){try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);loaded=gl.getError()===gl.NO_ERROR;return loaded&&draw();}catch(_){loaded=false;return false;}},draw,dispose(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);}};
}
root.createWardrobeDeform=create;
})(window);
