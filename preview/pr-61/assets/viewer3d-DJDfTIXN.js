import"./modulepreload-polyfill-B5Qt9EMX.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ha="182",Ai={ROTATE:0,DOLLY:1,PAN:2},yi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},hc=0,oo=1,uc=2,zr=1,dc=2,Ki=3,kn=0,Bt=1,Tn=2,Rn=0,wi=1,Ws=2,lo=3,co=4,fc=5,Qn=100,pc=101,mc=102,gc=103,_c=104,xc=200,vc=201,Sc=202,Mc=203,Xs=204,qs=205,Ec=206,yc=207,bc=208,Tc=209,Ac=210,wc=211,Rc=212,Cc=213,Pc=214,Ys=0,$s=1,Ks=2,Ci=3,Zs=4,js=5,Js=6,Qs=7,pl=0,Dc=1,Lc=2,pn=0,ml=1,gl=2,_l=3,xl=4,vl=5,Sl=6,Ml=7,El=300,ri=301,Pi=302,ea=303,ta=304,is=306,na=1e3,An=1001,ia=1002,Mt=1003,Ic=1004,lr=1005,At=1006,us=1007,ti=1008,Jt=1009,yl=1010,bl=1011,Qi=1012,ka=1013,_n=1014,dn=1015,Pn=1016,Wa=1017,Xa=1018,er=1020,Tl=35902,Al=35899,wl=1021,Rl=1022,on=1023,Dn=1026,ni=1027,Cl=1028,qa=1029,Di=1030,Ya=1031,$a=1033,Vr=33776,Gr=33777,Hr=33778,kr=33779,ra=35840,sa=35841,aa=35842,oa=35843,la=36196,ca=37492,ha=37496,ua=37488,da=37489,fa=37490,pa=37491,ma=37808,ga=37809,_a=37810,xa=37811,va=37812,Sa=37813,Ma=37814,Ea=37815,ya=37816,ba=37817,Ta=37818,Aa=37819,wa=37820,Ra=37821,Ca=36492,Pa=36494,Da=36495,La=36283,Ia=36284,Ua=36285,Na=36286,Uc=3200,Nc=0,Fc=1,Gn="",Zt="srgb",Li="srgb-linear",qr="linear",Je="srgb",ci=7680,ho=519,Oc=512,Bc=513,zc=514,Ka=515,Vc=516,Gc=517,Za=518,Hc=519,uo=35044,fo="300 es",fn=2e3,Yr=2001;function Pl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function kc(){const i=$r("canvas");return i.style.display="block",i}const po={};function mo(...i){const e="THREE."+i.shift();console.log(e,...i)}function we(...i){const e="THREE."+i.shift();console.warn(e,...i)}function qe(...i){const e="THREE."+i.shift();console.error(e,...i)}function tr(...i){const e=i.join(" ");e in po||(po[e]=!0,we(...i))}function Wc(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}class ai{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ji=Math.PI/180,Fa=180/Math.PI;function ir(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(bt[i&255]+bt[i>>8&255]+bt[i>>16&255]+bt[i>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function Xc(i,e){return(i%e+e)%e}function ds(i,e,t){return(1-t)*i+t*e}function Vi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const qc={DEG2RAD:Ji};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class si{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],d=n[r+3],f=s[a+0],m=s[a+1],_=s[a+2],x=s[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(o>=1){e[t+0]=f,e[t+1]=m,e[t+2]=_,e[t+3]=x;return}if(d!==x||c!==f||l!==m||u!==_){let p=c*f+l*m+u*_+d*x;p<0&&(f=-f,m=-m,_=-_,x=-x,p=-p);let h=1-o;if(p<.9995){const b=Math.acos(p),y=Math.sin(b);h=Math.sin(h*b)/y,o=Math.sin(o*b)/y,c=c*h+f*o,l=l*h+m*o,u=u*h+_*o,d=d*h+x*o}else{c=c*h+f*o,l=l*h+m*o,u=u*h+_*o,d=d*h+x*o;const b=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=b,l*=b,u*=b,d*=b}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],d=s[a],f=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+u*d+c*m-l*f,e[t+1]=c*_+u*f+l*d-o*m,e[t+2]=l*_+u*m+o*f-c*d,e[t+3]=u*_-o*d-c*f-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),d=o(s/2),f=c(n/2),m=c(r/2),_=c(s/2);switch(a){case"XYZ":this._x=f*u*d+l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d-f*m*_;break;case"YXZ":this._x=f*u*d+l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d+f*m*_;break;case"ZXY":this._x=f*u*d-l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d-f*m*_;break;case"ZYX":this._x=f*u*d-l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d+f*m*_;break;case"YZX":this._x=f*u*d+l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d-f*m*_;break;case"XZY":this._x=f*u*d-l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d+f*m*_;break;default:we("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(go.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(go.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+c*l+a*d-o*u,this.y=n+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fs.copy(this).projectOnVector(e),this.sub(fs)}reflect(e){return this.sub(fs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fs=new U,go=new si;class De{constructor(e,t,n,r,s,a,o,c,l){De.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l)}set(e,t,n,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],d=n[7],f=n[2],m=n[5],_=n[8],x=r[0],p=r[3],h=r[6],b=r[1],y=r[4],T=r[7],A=r[2],w=r[5],C=r[8];return s[0]=a*x+o*b+c*A,s[3]=a*p+o*y+c*w,s[6]=a*h+o*T+c*C,s[1]=l*x+u*b+d*A,s[4]=l*p+u*y+d*w,s[7]=l*h+u*T+d*C,s[2]=f*x+m*b+_*A,s[5]=f*p+m*y+_*w,s[8]=f*h+m*T+_*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,f=o*c-u*s,m=l*s-a*c,_=t*d+n*f+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=d*x,e[1]=(r*l-u*n)*x,e[2]=(o*n-r*a)*x,e[3]=f*x,e[4]=(u*t-r*c)*x,e[5]=(r*s-o*t)*x,e[6]=m*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ps.makeScale(e,t)),this}rotate(e){return this.premultiply(ps.makeRotation(-e)),this}translate(e,t){return this.premultiply(ps.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ps=new De,_o=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xo=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yc(){const i={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Je&&(r.r=Cn(r.r),r.g=Cn(r.g),r.b=Cn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(r.r=Ri(r.r),r.g=Ri(r.g),r.b=Ri(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Gn?qr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return tr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return tr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Li]:{primaries:e,whitePoint:n,transfer:qr,toXYZ:_o,fromXYZ:xo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Zt},outputColorSpaceConfig:{drawingBufferColorSpace:Zt}},[Zt]:{primaries:e,whitePoint:n,transfer:Je,toXYZ:_o,fromXYZ:xo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Zt}}}),i}const He=Yc();function Cn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ri(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let hi;class $c{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{hi===void 0&&(hi=$r("canvas")),hi.width=e.width,hi.height=e.height;const r=hi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=hi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$r("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Cn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Cn(t[n]/255)*255):t[n]=Cn(t[n]);return{data:t,width:e.width,height:e.height}}else return we("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Kc=0;class ja{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=ir(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ms(r[a].image)):s.push(ms(r[a]))}else s=ms(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function ms(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?$c.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(we("Texture: Unable to serialize Texture."),{})}let Zc=0;const gs=new U;class Pt extends ai{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,n=An,r=An,s=At,a=ti,o=on,c=Jt,l=Pt.DEFAULT_ANISOTROPY,u=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zc++}),this.uuid=ir(),this.name="",this.source=new ja(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(gs).x}get height(){return this.source.getSize(gs).y}get depth(){return this.source.getSize(gs).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){we(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){we(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==El)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case na:e.x=e.x-Math.floor(e.x);break;case An:e.x=e.x<0?0:1;break;case ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case na:e.y=e.y-Math.floor(e.y);break;case An:e.y=e.y<0?0:1;break;case ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=El;Pt.DEFAULT_ANISOTROPY=1;class dt{constructor(e=0,t=0,n=0,r=1){dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],m=c[5],_=c[9],x=c[2],p=c[6],h=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-x)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+x)<.1&&Math.abs(_+p)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,T=(m+1)/2,A=(h+1)/2,w=(u+f)/4,C=(d+x)/4,F=(_+p)/4;return y>T&&y>A?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=w/n,s=C/n):T>A?T<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),n=w/r,s=F/r):A<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),n=C/s,r=F/s),this.set(n,r,s,t),this}let b=Math.sqrt((p-_)*(p-_)+(d-x)*(d-x)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(p-_)/b,this.y=(d-x)/b,this.z=(f-u)/b,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jc extends ai{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:At,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);const r={width:e,height:t,depth:n.depth},s=new Pt(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:At,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new ja(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mn extends jc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Dl extends Pt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jc extends Pt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rr{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,tn):tn.fromBufferAttribute(s,a),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cr.copy(n.boundingBox)),cr.applyMatrix4(e.matrixWorld),this.union(cr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gi),hr.subVectors(this.max,Gi),ui.subVectors(e.a,Gi),di.subVectors(e.b,Gi),fi.subVectors(e.c,Gi),Un.subVectors(di,ui),Nn.subVectors(fi,di),Yn.subVectors(ui,fi);let t=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-Yn.z,Yn.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,Yn.z,0,-Yn.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-Yn.y,Yn.x,0];return!_s(t,ui,di,fi,hr)||(t=[1,0,0,0,1,0,0,0,1],!_s(t,ui,di,fi,hr))?!1:(ur.crossVectors(Un,Nn),t=[ur.x,ur.y,ur.z],_s(t,ui,di,fi,hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Sn=[new U,new U,new U,new U,new U,new U,new U,new U],tn=new U,cr=new rr,ui=new U,di=new U,fi=new U,Un=new U,Nn=new U,Yn=new U,Gi=new U,hr=new U,ur=new U,$n=new U;function _s(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){$n.fromArray(i,s);const o=r.x*Math.abs($n.x)+r.y*Math.abs($n.y)+r.z*Math.abs($n.z),c=e.dot($n),l=t.dot($n),u=n.dot($n);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const Qc=new rr,Hi=new U,xs=new U;class sr{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Qc.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hi.subVectors(e,this.center);const t=Hi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Hi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hi.copy(e.center).add(xs)),this.expandByPoint(Hi.copy(e.center).sub(xs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mn=new U,vs=new U,dr=new U,Fn=new U,Ss=new U,fr=new U,Ms=new U;class rs{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mn.copy(this.origin).addScaledVector(this.direction,t),Mn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){vs.copy(e).add(t).multiplyScalar(.5),dr.copy(t).sub(e).normalize(),Fn.copy(this.origin).sub(vs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(dr),o=Fn.dot(this.direction),c=-Fn.dot(dr),l=Fn.lengthSq(),u=Math.abs(1-a*a);let d,f,m,_;if(u>0)if(d=a*c-o,f=a*o-c,_=s*u,d>=0)if(f>=-_)if(f<=_){const x=1/u;d*=x,f*=x,m=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f<=-_?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l):f<=_?(d=0,f=Math.min(Math.max(-s,-c),s),m=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(vs).addScaledVector(dr,f),m}intersectSphere(e,t){Mn.subVectors(e.center,this.origin);const n=Mn.dot(this.direction),r=Mn.dot(Mn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Mn)!==null}intersectTriangle(e,t,n,r,s){Ss.subVectors(t,e),fr.subVectors(n,e),Ms.crossVectors(Ss,fr);let a=this.direction.dot(Ms),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fn.subVectors(this.origin,e);const c=o*this.direction.dot(fr.crossVectors(Fn,fr));if(c<0)return null;const l=o*this.direction.dot(Ss.cross(Fn));if(l<0||c+l>a)return null;const u=-o*Fn.dot(Ms);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,n,r,s,a,o,c,l,u,d,f,m,_,x,p){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l,u,d,f,m,_,x,p)}set(e,t,n,r,s,a,o,c,l,u,d,f,m,_,x,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=u,h[10]=d,h[14]=f,h[3]=m,h[7]=_,h[11]=x,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,r=1/pi.setFromMatrixColumn(e,0).length(),s=1/pi.setFromMatrixColumn(e,1).length(),a=1/pi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,m=a*d,_=o*u,x=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=m+_*l,t[5]=f-x*l,t[9]=-o*c,t[2]=x-f*l,t[6]=_+m*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,m=c*d,_=l*u,x=l*d;t[0]=f+x*o,t[4]=_*o-m,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=m*o-_,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,m=c*d,_=l*u,x=l*d;t[0]=f-x*o,t[4]=-a*d,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*u,t[9]=x-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,m=a*d,_=o*u,x=o*d;t[0]=c*u,t[4]=_*l-m,t[8]=f*l+x,t[1]=c*d,t[5]=x*l+f,t[9]=m*l-_,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*l,_=o*c,x=o*l;t[0]=c*u,t[4]=x-f*d,t[8]=_*d+m,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=m*d+_,t[10]=f-x*d}else if(e.order==="XZY"){const f=a*c,m=a*l,_=o*c,x=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+x,t[5]=a*u,t[9]=m*d-_,t[2]=_*d-m,t[6]=o*u,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(eh,e,th)}lookAt(e,t,n){const r=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),On.crossVectors(n,kt),On.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),On.crossVectors(n,kt)),On.normalize(),pr.crossVectors(kt,On),r[0]=On.x,r[4]=pr.x,r[8]=kt.x,r[1]=On.y,r[5]=pr.y,r[9]=kt.y,r[2]=On.z,r[6]=pr.z,r[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],d=n[5],f=n[9],m=n[13],_=n[2],x=n[6],p=n[10],h=n[14],b=n[3],y=n[7],T=n[11],A=n[15],w=r[0],C=r[4],F=r[8],S=r[12],M=r[1],D=r[5],V=r[9],B=r[13],W=r[2],Y=r[6],G=r[10],k=r[14],Z=r[3],he=r[7],ae=r[11],ue=r[15];return s[0]=a*w+o*M+c*W+l*Z,s[4]=a*C+o*D+c*Y+l*he,s[8]=a*F+o*V+c*G+l*ae,s[12]=a*S+o*B+c*k+l*ue,s[1]=u*w+d*M+f*W+m*Z,s[5]=u*C+d*D+f*Y+m*he,s[9]=u*F+d*V+f*G+m*ae,s[13]=u*S+d*B+f*k+m*ue,s[2]=_*w+x*M+p*W+h*Z,s[6]=_*C+x*D+p*Y+h*he,s[10]=_*F+x*V+p*G+h*ae,s[14]=_*S+x*B+p*k+h*ue,s[3]=b*w+y*M+T*W+A*Z,s[7]=b*C+y*D+T*Y+A*he,s[11]=b*F+y*V+T*G+A*ae,s[15]=b*S+y*B+T*k+A*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],m=e[14],_=e[3],x=e[7],p=e[11],h=e[15],b=c*m-l*f,y=o*m-l*d,T=o*f-c*d,A=a*m-l*u,w=a*f-c*u,C=a*d-o*u;return t*(x*b-p*y+h*T)-n*(_*b-p*A+h*w)+r*(_*y-x*A+h*C)-s*(_*T-x*w+p*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],m=e[11],_=e[12],x=e[13],p=e[14],h=e[15],b=d*p*l-x*f*l+x*c*m-o*p*m-d*c*h+o*f*h,y=_*f*l-u*p*l-_*c*m+a*p*m+u*c*h-a*f*h,T=u*x*l-_*d*l+_*o*m-a*x*m-u*o*h+a*d*h,A=_*d*c-u*x*c-_*o*f+a*x*f+u*o*p-a*d*p,w=t*b+n*y+r*T+s*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/w;return e[0]=b*C,e[1]=(x*f*s-d*p*s-x*r*m+n*p*m+d*r*h-n*f*h)*C,e[2]=(o*p*s-x*c*s+x*r*l-n*p*l-o*r*h+n*c*h)*C,e[3]=(d*c*s-o*f*s-d*r*l+n*f*l+o*r*m-n*c*m)*C,e[4]=y*C,e[5]=(u*p*s-_*f*s+_*r*m-t*p*m-u*r*h+t*f*h)*C,e[6]=(_*c*s-a*p*s-_*r*l+t*p*l+a*r*h-t*c*h)*C,e[7]=(a*f*s-u*c*s+u*r*l-t*f*l-a*r*m+t*c*m)*C,e[8]=T*C,e[9]=(_*d*s-u*x*s-_*n*m+t*x*m+u*n*h-t*d*h)*C,e[10]=(a*x*s-_*o*s+_*n*l-t*x*l-a*n*h+t*o*h)*C,e[11]=(u*o*s-a*d*s-u*n*l+t*d*l+a*n*m-t*o*m)*C,e[12]=A*C,e[13]=(u*x*r-_*d*r+_*n*f-t*x*f-u*n*p+t*d*p)*C,e[14]=(_*o*r-a*x*r-_*n*c+t*x*c+a*n*p-t*o*p)*C,e[15]=(a*d*r-u*o*r+u*n*c-t*d*c-a*n*f+t*o*f)*C,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,f=s*l,m=s*u,_=s*d,x=a*u,p=a*d,h=o*d,b=c*l,y=c*u,T=c*d,A=n.x,w=n.y,C=n.z;return r[0]=(1-(x+h))*A,r[1]=(m+T)*A,r[2]=(_-y)*A,r[3]=0,r[4]=(m-T)*w,r[5]=(1-(f+h))*w,r[6]=(p+b)*w,r[7]=0,r[8]=(_+y)*C,r[9]=(p-b)*C,r[10]=(1-(f+x))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;if(e.x=r[12],e.y=r[13],e.z=r[14],this.determinant()===0)return n.set(1,1,1),t.identity(),this;let s=pi.set(r[0],r[1],r[2]).length();const a=pi.set(r[4],r[5],r[6]).length(),o=pi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),nn.copy(this);const l=1/s,u=1/a,d=1/o;return nn.elements[0]*=l,nn.elements[1]*=l,nn.elements[2]*=l,nn.elements[4]*=u,nn.elements[5]*=u,nn.elements[6]*=u,nn.elements[8]*=d,nn.elements[9]*=d,nn.elements[10]*=d,t.setFromRotationMatrix(nn),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=fn,c=!1){const l=this.elements,u=2*s/(t-e),d=2*s/(n-r),f=(t+e)/(t-e),m=(n+r)/(n-r);let _,x;if(c)_=s/(a-s),x=a*s/(a-s);else if(o===fn)_=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Yr)_=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=fn,c=!1){const l=this.elements,u=2/(t-e),d=2/(n-r),f=-(t+e)/(t-e),m=-(n+r)/(n-r);let _,x;if(c)_=1/(a-s),x=a/(a-s);else if(o===fn)_=-2/(a-s),x=-(a+s)/(a-s);else if(o===Yr)_=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=_,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const pi=new U,nn=new ut,eh=new U(0,0,0),th=new U(1,1,1),On=new U,pr=new U,kt=new U,vo=new ut,So=new si;class Ln{constructor(e=0,t=0,n=0,r=Ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:we("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return So.setFromEuler(this),this.setFromQuaternion(So,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ln.DEFAULT_ORDER="XYZ";class Ll{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let nh=0;const Mo=new U,mi=new si,En=new ut,mr=new U,ki=new U,ih=new U,rh=new si,Eo=new U(1,0,0),yo=new U(0,1,0),bo=new U(0,0,1),To={type:"added"},sh={type:"removed"},gi={type:"childadded",child:null},Es={type:"childremoved",child:null};class Dt extends ai{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=ir(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new U,t=new Ln,n=new si,r=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ut},normalMatrix:{value:new De}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ll,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return mi.setFromAxisAngle(e,t),this.quaternion.multiply(mi),this}rotateOnWorldAxis(e,t){return mi.setFromAxisAngle(e,t),this.quaternion.premultiply(mi),this}rotateX(e){return this.rotateOnAxis(Eo,e)}rotateY(e){return this.rotateOnAxis(yo,e)}rotateZ(e){return this.rotateOnAxis(bo,e)}translateOnAxis(e,t){return Mo.copy(e).applyQuaternion(this.quaternion),this.position.add(Mo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Eo,e)}translateY(e){return this.translateOnAxis(yo,e)}translateZ(e){return this.translateOnAxis(bo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(En.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mr.copy(e):mr.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ki.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?En.lookAt(ki,mr,this.up):En.lookAt(mr,ki,this.up),this.quaternion.setFromRotationMatrix(En),r&&(En.extractRotation(r.matrixWorld),mi.setFromRotationMatrix(En),this.quaternion.premultiply(mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(To),gi.child=e,this.dispatchEvent(gi),gi.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(sh),Es.child=e,this.dispatchEvent(Es),Es.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),En.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),En.multiply(e.parent.matrixWorld)),e.applyMatrix4(En),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(To),gi.child=e,this.dispatchEvent(gi),gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ki,e,ih),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ki,rh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=r,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Dt.DEFAULT_UP=new U(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const rn=new U,yn=new U,ys=new U,bn=new U,_i=new U,xi=new U,Ao=new U,bs=new U,Ts=new U,As=new U,ws=new dt,Rs=new dt,Cs=new dt;class Qt{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),rn.subVectors(e,t),r.cross(rn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){rn.subVectors(r,t),yn.subVectors(n,t),ys.subVectors(e,t);const a=rn.dot(rn),o=rn.dot(yn),c=rn.dot(ys),l=yn.dot(yn),u=yn.dot(ys),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,m=(l*c-o*u)*f,_=(a*u-o*c)*f;return s.set(1-m-_,_,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getInterpolation(e,t,n,r,s,a,o,c){return this.getBarycoord(e,t,n,r,bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,bn.x),c.addScaledVector(a,bn.y),c.addScaledVector(o,bn.z),c)}static getInterpolatedAttribute(e,t,n,r,s,a){return ws.setScalar(0),Rs.setScalar(0),Cs.setScalar(0),ws.fromBufferAttribute(e,t),Rs.fromBufferAttribute(e,n),Cs.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ws,s.x),a.addScaledVector(Rs,s.y),a.addScaledVector(Cs,s.z),a}static isFrontFacing(e,t,n,r){return rn.subVectors(n,t),yn.subVectors(e,t),rn.cross(yn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return rn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),rn.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Qt.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;_i.subVectors(r,n),xi.subVectors(s,n),bs.subVectors(e,n);const c=_i.dot(bs),l=xi.dot(bs);if(c<=0&&l<=0)return t.copy(n);Ts.subVectors(e,r);const u=_i.dot(Ts),d=xi.dot(Ts);if(u>=0&&d<=u)return t.copy(r);const f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(_i,a);As.subVectors(e,s);const m=_i.dot(As),_=xi.dot(As);if(_>=0&&m<=_)return t.copy(s);const x=m*l-c*_;if(x<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(n).addScaledVector(xi,o);const p=u*_-m*d;if(p<=0&&d-u>=0&&m-_>=0)return Ao.subVectors(s,r),o=(d-u)/(d-u+(m-_)),t.copy(r).addScaledVector(Ao,o);const h=1/(p+x+f);return a=x*h,o=f*h,t.copy(n).addScaledVector(_i,a).addScaledVector(xi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Il={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},gr={h:0,s:0,l:0};function Ps(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=He.workingColorSpace){return this.r=e,this.g=t,this.b=n,He.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=He.workingColorSpace){if(e=Xc(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ps(a,s,e+1/3),this.g=Ps(a,s,e),this.b=Ps(a,s,e-1/3)}return He.colorSpaceToWorking(this,r),this}setStyle(e,t=Zt){function n(s){s!==void 0&&parseFloat(s)<1&&we("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:we("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);we("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zt){const n=Il[e.toLowerCase()];return n!==void 0?this.setHex(n,t):we("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cn(e.r),this.g=Cn(e.g),this.b=Cn(e.b),this}copyLinearToSRGB(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zt){return He.workingToColorSpace(Tt.copy(this),e),Math.round(ze(Tt.r*255,0,255))*65536+Math.round(ze(Tt.g*255,0,255))*256+Math.round(ze(Tt.b*255,0,255))}getHexString(e=Zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.workingToColorSpace(Tt.copy(this),t);const n=Tt.r,r=Tt.g,s=Tt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=He.workingColorSpace){return He.workingToColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=Zt){He.workingToColorSpace(Tt.copy(this),e);const t=Tt.r,n=Tt.g,r=Tt.b;return e!==Zt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(gr);const n=ds(Bn.h,gr.h,t),r=ds(Bn.s,gr.s,t),s=ds(Bn.l,gr.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tt=new $e;$e.NAMES=Il;let ah=0;class Ni extends ai{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=ir(),this.name="",this.type="Material",this.blending=wi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xs,this.blendDst=qs,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=Ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ho,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ci,this.stencilZFail=ci,this.stencilZPass=ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){we(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){we(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xs&&(n.blendSrc=this.blendSrc),this.blendDst!==qs&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ci&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ho&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ul extends Ni{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.combine=pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new U,_r=new Fe;let oh=0;class gn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:oh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=uo,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Vi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==uo&&(e.usage=this.usage),e}}class Nl extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Fl extends gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Lt extends gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let lh=0;const Kt=new ut,Ds=new Dt,vi=new U,Wt=new rr,Wi=new rr,St=new U;class Vt extends ai{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lh++}),this.uuid=ir(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pl(e)?Fl:Nl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new De().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,n){return Kt.makeTranslation(e,t,n),this.applyMatrix4(Kt),this}scale(e,t,n){return Kt.makeScale(e,t,n),this.applyMatrix4(Kt),this}lookAt(e){return Ds.lookAt(e),Ds.updateMatrix(),this.applyMatrix4(Ds.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Lt(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&we("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Wt.setFromBufferAttribute(s),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new sr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Wi.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(Wt.min,Wi.min),Wt.expandByPoint(St),St.addVectors(Wt.max,Wi.max),Wt.expandByPoint(St)):(Wt.expandByPoint(Wi.min),Wt.expandByPoint(Wi.max))}Wt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)St.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(St));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)St.fromBufferAttribute(o,l),c&&(vi.fromBufferAttribute(e,l),St.add(vi)),r=Math.max(r,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let F=0;F<n.count;F++)o[F]=new U,c[F]=new U;const l=new U,u=new U,d=new U,f=new Fe,m=new Fe,_=new Fe,x=new U,p=new U;function h(F,S,M){l.fromBufferAttribute(n,F),u.fromBufferAttribute(n,S),d.fromBufferAttribute(n,M),f.fromBufferAttribute(s,F),m.fromBufferAttribute(s,S),_.fromBufferAttribute(s,M),u.sub(l),d.sub(l),m.sub(f),_.sub(f);const D=1/(m.x*_.y-_.x*m.y);isFinite(D)&&(x.copy(u).multiplyScalar(_.y).addScaledVector(d,-m.y).multiplyScalar(D),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(D),o[F].add(x),o[S].add(x),o[M].add(x),c[F].add(p),c[S].add(p),c[M].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let F=0,S=b.length;F<S;++F){const M=b[F],D=M.start,V=M.count;for(let B=D,W=D+V;B<W;B+=3)h(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const y=new U,T=new U,A=new U,w=new U;function C(F){A.fromBufferAttribute(r,F),w.copy(A);const S=o[F];y.copy(S),y.sub(A.multiplyScalar(A.dot(S))).normalize(),T.crossVectors(w,S);const D=T.dot(c[F])<0?-1:1;a.setXYZW(F,y.x,y.y,y.z,D)}for(let F=0,S=b.length;F<S;++F){const M=b[F],D=M.start,V=M.count;for(let B=D,W=D+V;B<W;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const r=new U,s=new U,a=new U,o=new U,c=new U,l=new U,u=new U,d=new U;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),x=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,_),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),o.add(u),c.add(u),l.add(u),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,f=new l.constructor(c.length*u);let m=0,_=0;for(let x=0,p=c.length;x<p;x++){o.isInterleavedBufferAttribute?m=c[x]*o.data.stride+o.offset:m=c[x]*u;for(let h=0;h<u;h++)f[_++]=l[m++]}return new gn(f,u,d)}if(this.index===null)return we("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Vt,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,n);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){const f=l[u],m=e(f,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){const m=l[d];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],d=s[l];for(let f=0,m=d.length;f<m;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const wo=new ut,Kn=new rs,xr=new sr,Ro=new U,vr=new U,Sr=new U,Mr=new U,Ls=new U,Er=new U,Co=new U,yr=new U;class In extends Dt{constructor(e=new Vt,t=new Ul){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Er.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],d=s[c];u!==0&&(Ls.fromBufferAttribute(d,e),a?Er.addScaledVector(Ls,u):Er.addScaledVector(Ls.sub(t),u))}t.add(Er)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xr.copy(n.boundingSphere),xr.applyMatrix4(s),Kn.copy(e.ray).recast(e.near),!(xr.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(xr,Ro)===null||Kn.origin.distanceToSquared(Ro)>(e.far-e.near)**2))&&(wo.copy(s).invert(),Kn.copy(e.ray).applyMatrix4(wo),!(n.boundingBox!==null&&Kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Kn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,x=f.length;_<x;_++){const p=f[_],h=a[p.materialIndex],b=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let T=b,A=y;T<A;T+=3){const w=o.getX(T),C=o.getX(T+1),F=o.getX(T+2);r=br(this,h,e,n,l,u,d,w,C,F),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=_,h=x;p<h;p+=3){const b=o.getX(p),y=o.getX(p+1),T=o.getX(p+2);r=br(this,a,e,n,l,u,d,b,y,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,x=f.length;_<x;_++){const p=f[_],h=a[p.materialIndex],b=Math.max(p.start,m.start),y=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let T=b,A=y;T<A;T+=3){const w=T,C=T+1,F=T+2;r=br(this,h,e,n,l,u,d,w,C,F),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let p=_,h=x;p<h;p+=3){const b=p,y=p+1,T=p+2;r=br(this,a,e,n,l,u,d,b,y,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function ch(i,e,t,n,r,s,a,o){let c;if(e.side===Bt?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,e.side===kn,o),c===null)return null;yr.copy(o),yr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(yr);return l<t.near||l>t.far?null:{distance:l,point:yr.clone(),object:i}}function br(i,e,t,n,r,s,a,o,c,l){i.getVertexPosition(o,vr),i.getVertexPosition(c,Sr),i.getVertexPosition(l,Mr);const u=ch(i,e,t,n,vr,Sr,Mr,Co);if(u){const d=new U;Qt.getBarycoord(Co,vr,Sr,Mr,d),r&&(u.uv=Qt.getInterpolatedAttribute(r,o,c,l,d,new Fe)),s&&(u.uv1=Qt.getInterpolatedAttribute(s,o,c,l,d,new Fe)),a&&(u.normal=Qt.getInterpolatedAttribute(a,o,c,l,d,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new U,materialIndex:0};Qt.getNormal(vr,Sr,Mr,f.normal),u.face=f,u.barycoord=d}return u}class Fi extends Vt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],d=[];let f=0,m=0;_("z","y","x",-1,-1,n,t,e,a,s,0),_("z","y","x",1,-1,n,t,-e,a,s,1),_("x","z","y",1,1,e,n,t,r,a,2),_("x","z","y",1,-1,e,n,-t,r,a,3),_("x","y","z",1,-1,e,t,n,r,s,4),_("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Lt(l,3)),this.setAttribute("normal",new Lt(u,3)),this.setAttribute("uv",new Lt(d,2));function _(x,p,h,b,y,T,A,w,C,F,S){const M=T/C,D=A/F,V=T/2,B=A/2,W=w/2,Y=C+1,G=F+1;let k=0,Z=0;const he=new U;for(let ae=0;ae<G;ae++){const ue=ae*D-B;for(let Oe=0;Oe<Y;Oe++){const Ie=Oe*M-V;he[x]=Ie*b,he[p]=ue*y,he[h]=W,l.push(he.x,he.y,he.z),he[x]=0,he[p]=0,he[h]=w>0?1:-1,u.push(he.x,he.y,he.z),d.push(Oe/C),d.push(1-ae/F),k+=1}}for(let ae=0;ae<F;ae++)for(let ue=0;ue<C;ue++){const Oe=f+ue+Y*ae,Ie=f+ue+Y*(ae+1),lt=f+(ue+1)+Y*(ae+1),ot=f+(ue+1)+Y*ae;c.push(Oe,Ie,ot),c.push(Ie,lt,ot),Z+=6}o.addGroup(m,Z,S),m+=Z,f+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ii(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(we("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Ct(i){const e={};for(let t=0;t<i.length;t++){const n=Ii(i[t]);for(const r in n)e[r]=n[r]}return e}function hh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ol(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const uh={clone:Ii,merge:Ct};var dh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xn extends Ni{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dh,this.fragmentShader=fh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ii(e.uniforms),this.uniformsGroups=hh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Bl extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new U,Po=new Fe,Do=new Fe;class jt extends Bl{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ji*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,Po,Do),t.subVectors(Do,Po)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ji*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Si=-90,Mi=1;class ph extends Dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new jt(Si,Mi,e,t);r.layers=this.layers,this.add(r);const s=new jt(Si,Mi,e,t);s.layers=this.layers,this.add(s);const a=new jt(Si,Mi,e,t);a.layers=this.layers,this.add(a);const o=new jt(Si,Mi,e,t);o.layers=this.layers,this.add(o);const c=new jt(Si,Mi,e,t);c.layers=this.layers,this.add(c);const l=new jt(Si,Mi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===fn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Yr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(d,f,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class zl extends Pt{constructor(e=[],t=ri,n,r,s,a,o,c,l,u){super(e,t,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Vl extends mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new zl(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Fi(5,5,5),s=new xn({name:"CubemapFromEquirect",uniforms:Ii(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Bt,blending:Rn});s.uniforms.tEquirect.value=t;const a=new In(r,s),o=t.minFilter;return t.minFilter===ti&&(t.minFilter=At),new ph(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}class Tr extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mh={type:"move"};class Is{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,n),h=this._getHandJoint(l,x);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),m=.02,_=.005;l.inputState.pinching&&f>m+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=m-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mh)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Tr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class gh extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ln,this.environmentIntensity=1,this.environmentRotation=new Ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class _h extends Pt{constructor(e=null,t=1,n=1,r,s,a,o,c,l=Mt,u=Mt,d,f){super(null,a,o,c,l,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Us=new U,xh=new U,vh=new De;class Vn{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Us.subVectors(n,t).cross(xh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Us),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||vh.getNormalMatrix(e),r=this.coplanarPoint(Us).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zn=new sr,Sh=new Fe(.5,.5),Ar=new U;class Gl{constructor(e=new Vn,t=new Vn,n=new Vn,r=new Vn,s=new Vn,a=new Vn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fn,n=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],u=s[4],d=s[5],f=s[6],m=s[7],_=s[8],x=s[9],p=s[10],h=s[11],b=s[12],y=s[13],T=s[14],A=s[15];if(r[0].setComponents(l-a,m-u,h-_,A-b).normalize(),r[1].setComponents(l+a,m+u,h+_,A+b).normalize(),r[2].setComponents(l+o,m+d,h+x,A+y).normalize(),r[3].setComponents(l-o,m-d,h-x,A-y).normalize(),n)r[4].setComponents(c,f,p,T).normalize(),r[5].setComponents(l-c,m-f,h-p,A-T).normalize();else if(r[4].setComponents(l-c,m-f,h-p,A-T).normalize(),t===fn)r[5].setComponents(l+c,m+f,h+p,A+T).normalize();else if(t===Yr)r[5].setComponents(c,f,p,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(e){Zn.center.set(0,0,0);const t=Sh.distanceTo(e.center);return Zn.radius=.7071067811865476+t,Zn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Ar.x=r.normal.x>0?e.max.x:e.min.x,Ar.y=r.normal.y>0?e.max.y:e.min.y,Ar.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oa extends Ni{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Kr=new U,Zr=new U,Lo=new ut,Xi=new rs,wr=new sr,Ns=new U,Io=new U;class Hl extends Dt{constructor(e=new Vt,t=new Oa){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)Kr.fromBufferAttribute(t,r-1),Zr.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=Kr.distanceTo(Zr);e.setAttribute("lineDistance",new Lt(n,1))}else we("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(r),wr.radius+=s,e.ray.intersectsSphere(wr)===!1)return;Lo.copy(r).invert(),Xi.copy(e.ray).applyMatrix4(Lo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const m=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let x=m,p=_-1;x<p;x+=l){const h=u.getX(x),b=u.getX(x+1),y=Rr(this,e,Xi,c,h,b,x);y&&t.push(y)}if(this.isLineLoop){const x=u.getX(_-1),p=u.getX(m),h=Rr(this,e,Xi,c,x,p,_-1);h&&t.push(h)}}else{const m=Math.max(0,a.start),_=Math.min(f.count,a.start+a.count);for(let x=m,p=_-1;x<p;x+=l){const h=Rr(this,e,Xi,c,x,x+1,x);h&&t.push(h)}if(this.isLineLoop){const x=Rr(this,e,Xi,c,_-1,m,_-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Rr(i,e,t,n,r,s,a){const o=i.geometry.attributes.position;if(Kr.fromBufferAttribute(o,r),Zr.fromBufferAttribute(o,s),t.distanceSqToSegment(Kr,Zr,Ns,Io)>n)return;Ns.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ns);if(!(l<e.near||l>e.far))return{distance:l,point:Io.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Uo=new U,No=new U;class Mh extends Hl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Uo.fromBufferAttribute(t,r),No.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Uo.distanceTo(No);e.setAttribute("lineDistance",new Lt(n,1))}else we("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kl extends Ni{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Fo=new ut,Ba=new rs,Cr=new sr,Pr=new U;class Eh extends Dt{constructor(e=new Vt,t=new kl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(r),Cr.radius+=s,e.ray.intersectsSphere(Cr)===!1)return;Fo.copy(r).invert(),Ba.copy(e.ray).applyMatrix4(Fo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),m=Math.min(l.count,a.start+a.count);for(let _=f,x=m;_<x;_++){const p=l.getX(_);Pr.fromBufferAttribute(d,p),Oo(Pr,p,c,r,e,t,this)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,x=m;_<x;_++)Pr.fromBufferAttribute(d,_),Oo(Pr,_,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Oo(i,e,t,n,r,s,a){const o=Ba.distanceSqToPoint(i);if(o<t){const c=new U;Ba.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class nr extends Pt{constructor(e,t,n=_n,r,s,a,o=Mt,c=Mt,l,u=Dn,d=1){if(u!==Dn&&u!==ni)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ja(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class yh extends nr{constructor(e,t=_n,n=ri,r,s,a=Mt,o=Mt,c,l=Dn){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Wl extends Pt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}const Dr=new U,Lr=new U,Fs=new U,Ir=new Qt;class bh extends Vt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(Ji*t),a=e.getIndex(),o=e.getAttribute("position"),c=a?a.count:o.count,l=[0,0,0],u=["a","b","c"],d=new Array(3),f={},m=[];for(let _=0;_<c;_+=3){a?(l[0]=a.getX(_),l[1]=a.getX(_+1),l[2]=a.getX(_+2)):(l[0]=_,l[1]=_+1,l[2]=_+2);const{a:x,b:p,c:h}=Ir;if(x.fromBufferAttribute(o,l[0]),p.fromBufferAttribute(o,l[1]),h.fromBufferAttribute(o,l[2]),Ir.getNormal(Fs),d[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,d[1]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,d[2]=`${Math.round(h.x*r)},${Math.round(h.y*r)},${Math.round(h.z*r)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let b=0;b<3;b++){const y=(b+1)%3,T=d[b],A=d[y],w=Ir[u[b]],C=Ir[u[y]],F=`${T}_${A}`,S=`${A}_${T}`;S in f&&f[S]?(Fs.dot(f[S].normal)<=s&&(m.push(w.x,w.y,w.z),m.push(C.x,C.y,C.z)),f[S]=null):F in f||(f[F]={index0:l[b],index1:l[y],normal:Fs.clone()})}}for(const _ in f)if(f[_]){const{index0:x,index1:p}=f[_];Dr.fromBufferAttribute(o,x),Lr.fromBufferAttribute(o,p),m.push(Dr.x,Dr.y,Dr.z),m.push(Lr.x,Lr.y,Lr.z)}this.setAttribute("position",new Lt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ss extends Vt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,d=e/o,f=t/c,m=[],_=[],x=[],p=[];for(let h=0;h<u;h++){const b=h*f-a;for(let y=0;y<l;y++){const T=y*d-s;_.push(T,-b,0),x.push(0,0,1),p.push(y/o),p.push(1-h/c)}}for(let h=0;h<c;h++)for(let b=0;b<o;b++){const y=b+l*h,T=b+l*(h+1),A=b+1+l*(h+1),w=b+1+l*h;m.push(y,T,w),m.push(T,A,w)}this.setIndex(m),this.setAttribute("position",new Lt(_,3)),this.setAttribute("normal",new Lt(x,3)),this.setAttribute("uv",new Lt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ss(e.width,e.height,e.widthSegments,e.heightSegments)}}class Th extends xn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ah extends Ni{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class wh extends Ni{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Xl extends Bl{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Rh extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Bo{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ch extends ai{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){we("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function zo(i,e,t,n){const r=Ph(n);switch(t){case wl:return i*e;case Cl:return i*e/r.components*r.byteLength;case qa:return i*e/r.components*r.byteLength;case Di:return i*e*2/r.components*r.byteLength;case Ya:return i*e*2/r.components*r.byteLength;case Rl:return i*e*3/r.components*r.byteLength;case on:return i*e*4/r.components*r.byteLength;case $a:return i*e*4/r.components*r.byteLength;case Vr:case Gr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Hr:case kr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case sa:case oa:return Math.max(i,16)*Math.max(e,8)/4;case ra:case aa:return Math.max(i,8)*Math.max(e,8)/2;case la:case ca:case ua:case da:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ha:case fa:case pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ga:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case _a:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case xa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ya:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ra:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ca:case Pa:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*16;case La:case Ia:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ua:case Na:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ph(i){switch(i){case Jt:case yl:return{byteLength:1,components:1};case Qi:case bl:case Pn:return{byteLength:2,components:1};case Wa:case Xa:return{byteLength:2,components:4};case _n:case ka:case dn:return{byteLength:4,components:1};case Tl:case Al:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ha}}));typeof window<"u"&&(window.__THREE__?we("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ha);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ql(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Dh(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,u),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const u=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,u);else{d.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<d.length;m++){const _=d[f],x=d[m];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++f,d[f]=x)}d.length=f+1;for(let m=0,_=d.length;m<_;m++){const x=d[m];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Lh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ih=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Uh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Nh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Oh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,zh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Gh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Xh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,qh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Yh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,$h=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,eu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,tu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,nu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,iu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ru=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,su=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,au=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ou=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lu="gl_FragColor = linearToOutputTexel( gl_FragColor );",cu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,uu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,du=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,fu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_u=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Su=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Eu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Tu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Au=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ru=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pu=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Du=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Lu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Iu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Uu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ou=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ku=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yu=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,$u=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ku=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Zu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ju=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ju=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ed=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,td=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,id=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ad=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,od=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ld=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ud=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,pd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,md=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,_d=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,vd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Md=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ed=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Td=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ad=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ld=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Id=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ud=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Od=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,zd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Vd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Gd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Hd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$d=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Zd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jd=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Jd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Qd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ef=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,af=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,of=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,uf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Le={alphahash_fragment:Lh,alphahash_pars_fragment:Ih,alphamap_fragment:Uh,alphamap_pars_fragment:Nh,alphatest_fragment:Fh,alphatest_pars_fragment:Oh,aomap_fragment:Bh,aomap_pars_fragment:zh,batching_pars_vertex:Vh,batching_vertex:Gh,begin_vertex:Hh,beginnormal_vertex:kh,bsdfs:Wh,iridescence_fragment:Xh,bumpmap_pars_fragment:qh,clipping_planes_fragment:Yh,clipping_planes_pars_fragment:$h,clipping_planes_pars_vertex:Kh,clipping_planes_vertex:Zh,color_fragment:jh,color_pars_fragment:Jh,color_pars_vertex:Qh,color_vertex:eu,common:tu,cube_uv_reflection_fragment:nu,defaultnormal_vertex:iu,displacementmap_pars_vertex:ru,displacementmap_vertex:su,emissivemap_fragment:au,emissivemap_pars_fragment:ou,colorspace_fragment:lu,colorspace_pars_fragment:cu,envmap_fragment:hu,envmap_common_pars_fragment:uu,envmap_pars_fragment:du,envmap_pars_vertex:fu,envmap_physical_pars_fragment:bu,envmap_vertex:pu,fog_vertex:mu,fog_pars_vertex:gu,fog_fragment:_u,fog_pars_fragment:xu,gradientmap_pars_fragment:vu,lightmap_pars_fragment:Su,lights_lambert_fragment:Mu,lights_lambert_pars_fragment:Eu,lights_pars_begin:yu,lights_toon_fragment:Tu,lights_toon_pars_fragment:Au,lights_phong_fragment:wu,lights_phong_pars_fragment:Ru,lights_physical_fragment:Cu,lights_physical_pars_fragment:Pu,lights_fragment_begin:Du,lights_fragment_maps:Lu,lights_fragment_end:Iu,logdepthbuf_fragment:Uu,logdepthbuf_pars_fragment:Nu,logdepthbuf_pars_vertex:Fu,logdepthbuf_vertex:Ou,map_fragment:Bu,map_pars_fragment:zu,map_particle_fragment:Vu,map_particle_pars_fragment:Gu,metalnessmap_fragment:Hu,metalnessmap_pars_fragment:ku,morphinstance_vertex:Wu,morphcolor_vertex:Xu,morphnormal_vertex:qu,morphtarget_pars_vertex:Yu,morphtarget_vertex:$u,normal_fragment_begin:Ku,normal_fragment_maps:Zu,normal_pars_fragment:ju,normal_pars_vertex:Ju,normal_vertex:Qu,normalmap_pars_fragment:ed,clearcoat_normal_fragment_begin:td,clearcoat_normal_fragment_maps:nd,clearcoat_pars_fragment:id,iridescence_pars_fragment:rd,opaque_fragment:sd,packing:ad,premultiplied_alpha_fragment:od,project_vertex:ld,dithering_fragment:cd,dithering_pars_fragment:hd,roughnessmap_fragment:ud,roughnessmap_pars_fragment:dd,shadowmap_pars_fragment:fd,shadowmap_pars_vertex:pd,shadowmap_vertex:md,shadowmask_pars_fragment:gd,skinbase_vertex:_d,skinning_pars_vertex:xd,skinning_vertex:vd,skinnormal_vertex:Sd,specularmap_fragment:Md,specularmap_pars_fragment:Ed,tonemapping_fragment:yd,tonemapping_pars_fragment:bd,transmission_fragment:Td,transmission_pars_fragment:Ad,uv_pars_fragment:wd,uv_pars_vertex:Rd,uv_vertex:Cd,worldpos_vertex:Pd,background_vert:Dd,background_frag:Ld,backgroundCube_vert:Id,backgroundCube_frag:Ud,cube_vert:Nd,cube_frag:Fd,depth_vert:Od,depth_frag:Bd,distance_vert:zd,distance_frag:Vd,equirect_vert:Gd,equirect_frag:Hd,linedashed_vert:kd,linedashed_frag:Wd,meshbasic_vert:Xd,meshbasic_frag:qd,meshlambert_vert:Yd,meshlambert_frag:$d,meshmatcap_vert:Kd,meshmatcap_frag:Zd,meshnormal_vert:jd,meshnormal_frag:Jd,meshphong_vert:Qd,meshphong_frag:ef,meshphysical_vert:tf,meshphysical_frag:nf,meshtoon_vert:rf,meshtoon_frag:sf,points_vert:af,points_frag:of,shadow_vert:lf,shadow_frag:cf,sprite_vert:hf,sprite_frag:uf},oe={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},un={basic:{uniforms:Ct([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Le.meshbasic_vert,fragmentShader:Le.meshbasic_frag},lambert:{uniforms:Ct([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new $e(0)}}]),vertexShader:Le.meshlambert_vert,fragmentShader:Le.meshlambert_frag},phong:{uniforms:Ct([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:Le.meshphong_vert,fragmentShader:Le.meshphong_frag},standard:{uniforms:Ct([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Le.meshphysical_vert,fragmentShader:Le.meshphysical_frag},toon:{uniforms:Ct([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new $e(0)}}]),vertexShader:Le.meshtoon_vert,fragmentShader:Le.meshtoon_frag},matcap:{uniforms:Ct([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Le.meshmatcap_vert,fragmentShader:Le.meshmatcap_frag},points:{uniforms:Ct([oe.points,oe.fog]),vertexShader:Le.points_vert,fragmentShader:Le.points_frag},dashed:{uniforms:Ct([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Le.linedashed_vert,fragmentShader:Le.linedashed_frag},depth:{uniforms:Ct([oe.common,oe.displacementmap]),vertexShader:Le.depth_vert,fragmentShader:Le.depth_frag},normal:{uniforms:Ct([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Le.meshnormal_vert,fragmentShader:Le.meshnormal_frag},sprite:{uniforms:Ct([oe.sprite,oe.fog]),vertexShader:Le.sprite_vert,fragmentShader:Le.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Le.background_vert,fragmentShader:Le.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Le.backgroundCube_vert,fragmentShader:Le.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Le.cube_vert,fragmentShader:Le.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Le.equirect_vert,fragmentShader:Le.equirect_frag},distance:{uniforms:Ct([oe.common,oe.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Le.distance_vert,fragmentShader:Le.distance_frag},shadow:{uniforms:Ct([oe.lights,oe.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Le.shadow_vert,fragmentShader:Le.shadow_frag}};un.physical={uniforms:Ct([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Le.meshphysical_vert,fragmentShader:Le.meshphysical_frag};const Ur={r:0,b:0,g:0},jn=new Ln,df=new ut;function ff(i,e,t,n,r,s,a){const o=new $e(0);let c=s===!0?0:1,l,u,d=null,f=0,m=null;function _(y){let T=y.isScene===!0?y.background:null;return T&&T.isTexture&&(T=(y.backgroundBlurriness>0?t:e).get(T)),T}function x(y){let T=!1;const A=_(y);A===null?h(o,c):A&&A.isColor&&(h(A,1),T=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||T)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(y,T){const A=_(T);A&&(A.isCubeTexture||A.mapping===is)?(u===void 0&&(u=new In(new Fi(1,1,1),new xn({name:"BackgroundCubeMaterial",uniforms:Ii(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,C,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),jn.copy(T.backgroundRotation),jn.x*=-1,jn.y*=-1,jn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(df.makeRotationFromEuler(jn)),u.material.toneMapped=He.getTransfer(A.colorSpace)!==Je,(d!==A||f!==A.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,d=A,f=A.version,m=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new In(new ss(2,2),new xn({name:"BackgroundMaterial",uniforms:Ii(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=He.getTransfer(A.colorSpace)!==Je,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||f!==A.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=A,f=A.version,m=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function h(y,T){y.getRGB(Ur,Ol(i)),n.buffers.color.setClear(Ur.r,Ur.g,Ur.b,T,a)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,T=1){o.set(y),c=T,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,h(o,c)},render:x,addToRenderList:p,dispose:b}}function pf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let s=r,a=!1;function o(M,D,V,B,W){let Y=!1;const G=d(B,V,D);s!==G&&(s=G,l(s.object)),Y=m(M,B,V,W),Y&&_(M,B,V,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,T(M,D,V,B),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function d(M,D,V){const B=V.wireframe===!0;let W=n[M.id];W===void 0&&(W={},n[M.id]=W);let Y=W[D.id];Y===void 0&&(Y={},W[D.id]=Y);let G=Y[B];return G===void 0&&(G=f(c()),Y[B]=G),G}function f(M){const D=[],V=[],B=[];for(let W=0;W<t;W++)D[W]=0,V[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:B,object:M,attributes:{},index:null}}function m(M,D,V,B){const W=s.attributes,Y=D.attributes;let G=0;const k=V.getAttributes();for(const Z in k)if(k[Z].location>=0){const ae=W[Z];let ue=Y[Z];if(ue===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(ue=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(ue=M.instanceColor)),ae===void 0||ae.attribute!==ue||ue&&ae.data!==ue.data)return!0;G++}return s.attributesNum!==G||s.index!==B}function _(M,D,V,B){const W={},Y=D.attributes;let G=0;const k=V.getAttributes();for(const Z in k)if(k[Z].location>=0){let ae=Y[Z];ae===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor));const ue={};ue.attribute=ae,ae&&ae.data&&(ue.data=ae.data),W[Z]=ue,G++}s.attributes=W,s.attributesNum=G,s.index=B}function x(){const M=s.newAttributes;for(let D=0,V=M.length;D<V;D++)M[D]=0}function p(M){h(M,0)}function h(M,D){const V=s.newAttributes,B=s.enabledAttributes,W=s.attributeDivisors;V[M]=1,B[M]===0&&(i.enableVertexAttribArray(M),B[M]=1),W[M]!==D&&(i.vertexAttribDivisor(M,D),W[M]=D)}function b(){const M=s.newAttributes,D=s.enabledAttributes;for(let V=0,B=D.length;V<B;V++)D[V]!==M[V]&&(i.disableVertexAttribArray(V),D[V]=0)}function y(M,D,V,B,W,Y,G){G===!0?i.vertexAttribIPointer(M,D,V,W,Y):i.vertexAttribPointer(M,D,V,B,W,Y)}function T(M,D,V,B){x();const W=B.attributes,Y=V.getAttributes(),G=D.defaultAttributeValues;for(const k in Y){const Z=Y[k];if(Z.location>=0){let he=W[k];if(he===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(he=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(he=M.instanceColor)),he!==void 0){const ae=he.normalized,ue=he.itemSize,Oe=e.get(he);if(Oe===void 0)continue;const Ie=Oe.buffer,lt=Oe.type,ot=Oe.bytesPerElement,q=lt===i.INT||lt===i.UNSIGNED_INT||he.gpuType===ka;if(he.isInterleavedBufferAttribute){const j=he.data,pe=j.stride,Pe=he.offset;if(j.isInstancedInterleavedBuffer){for(let _e=0;_e<Z.locationSize;_e++)h(Z.location+_e,j.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let _e=0;_e<Z.locationSize;_e++)p(Z.location+_e);i.bindBuffer(i.ARRAY_BUFFER,Ie);for(let _e=0;_e<Z.locationSize;_e++)y(Z.location+_e,ue/Z.locationSize,lt,ae,pe*ot,(Pe+ue/Z.locationSize*_e)*ot,q)}else{if(he.isInstancedBufferAttribute){for(let j=0;j<Z.locationSize;j++)h(Z.location+j,he.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let j=0;j<Z.locationSize;j++)p(Z.location+j);i.bindBuffer(i.ARRAY_BUFFER,Ie);for(let j=0;j<Z.locationSize;j++)y(Z.location+j,ue/Z.locationSize,lt,ae,ue*ot,ue/Z.locationSize*j*ot,q)}}else if(G!==void 0){const ae=G[k];if(ae!==void 0)switch(ae.length){case 2:i.vertexAttrib2fv(Z.location,ae);break;case 3:i.vertexAttrib3fv(Z.location,ae);break;case 4:i.vertexAttrib4fv(Z.location,ae);break;default:i.vertexAttrib1fv(Z.location,ae)}}}}b()}function A(){F();for(const M in n){const D=n[M];for(const V in D){const B=D[V];for(const W in B)u(B[W].object),delete B[W];delete D[V]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const D=n[M.id];for(const V in D){const B=D[V];for(const W in B)u(B[W].object),delete B[W];delete D[V]}delete n[M.id]}function C(M){for(const D in n){const V=n[D];if(V[M.id]===void 0)continue;const B=V[M.id];for(const W in B)u(B[W].object),delete B[W];delete V[M.id]}}function F(){S(),a=!0,s!==r&&(s=r,l(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:F,resetDefaultState:S,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:p,disableUnusedAttributes:b}}function mf(i,e,t){let n;function r(l){n=l}function s(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function a(l,u,d){d!==0&&(i.drawArraysInstanced(n,l,u,d),t.update(u,n,d))}function o(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,d);let m=0;for(let _=0;_<d;_++)m+=u[_];t.update(m,n,1)}function c(l,u,d,f){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<l.length;_++)a(l[_],u[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,u,0,f,0,d);let _=0;for(let x=0;x<d;x++)_+=u[x]*f[x];t.update(_,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function gf(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==on&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const F=C===Pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Jt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==dn&&!F)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(we("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:T,maxSamples:A,samples:w}}function _f(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new Vn,o=new De,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||r;return r=f,n=d.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,m){const _=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,h=i.get(d);if(!r||_===null||_.length===0||s&&!p)s?u(null):l();else{const b=s?0:n,y=b*4;let T=h.clippingState||null;c.value=T,T=u(_,f,y,m);for(let A=0;A!==y;++A)T[A]=t[A];h.clippingState=T,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,m,_){const x=d!==null?d.length:0;let p=null;if(x!==0){if(p=c.value,_!==!0||p===null){const h=m+x*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<h)&&(p=new Float32Array(h));for(let y=0,T=m;y!==x;++y,T+=4)a.copy(d[y]).applyMatrix4(b,o),a.normal.toArray(p,T),p[T+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function xf(i){let e=new WeakMap;function t(a,o){return o===ea?a.mapping=ri:o===ta&&(a.mapping=Pi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ea||o===ta)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Vl(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",r),t(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const Hn=4,Vo=[.125,.215,.35,.446,.526,.582],ei=20,vf=256,qi=new Xl,Go=new $e;let Os=null,Bs=0,zs=0,Vs=!1;const Sf=new U;class Ho{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=Sf}=s;Os=this._renderer.getRenderTarget(),Bs=this._renderer.getActiveCubeFace(),zs=this._renderer.getActiveMipmapLevel(),Vs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Os,Bs,zs),this._renderer.xr.enabled=Vs,e.scissorTest=!1,Ei(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ri||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Os=this._renderer.getRenderTarget(),Bs=this._renderer.getActiveCubeFace(),zs=this._renderer.getActiveMipmapLevel(),Vs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:At,minFilter:At,generateMipmaps:!1,type:Pn,format:on,colorSpace:Li,depthBuffer:!1},r=ko(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ko(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Mf(s)),this._blurMaterial=yf(s,e,t),this._ggxMaterial=Ef(s,e,t)}return r}_compileMaterial(e){const t=new In(new Vt,e);this._renderer.compile(t,qi)}_sceneToCubeUV(e,t,n,r,s){const c=new jt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,m=d.toneMapping;d.getClearColor(Go),d.toneMapping=pn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new In(new Fi,new Ul({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,p=x.material;let h=!1;const b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,h=!0):(p.color.copy(Go),h=!0);for(let y=0;y<6;y++){const T=y%3;T===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[y],s.y,s.z)):T===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[y]));const A=this._cubeSize;Ei(r,T*A,y>2?A:0,A,A),d.setRenderTarget(r),h&&d.render(x,c),d.render(e,c)}d.toneMapping=m,d.autoClear=f,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===ri||e.mapping===Pi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wo());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Ei(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,qi)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),f=0+l*1.25,m=d*f,{_lodMax:_}=this,x=this._sizeLods[n],p=3*x*(n>_-Hn?n-_+Hn:0),h=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=_-t,Ei(s,p,h,3*x,2*x),r.setRenderTarget(s),r.render(o,qi),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=_-n,Ei(e,p,h,3*x,2*x),r.setRenderTarget(e),r.render(o,qi)}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&qe("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[r];d.material=l;const f=l.uniforms,m=this._sizeLods[n]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*ei-1),x=s/_,p=isFinite(s)?1+Math.floor(u*x):ei;p>ei&&we(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const h=[];let b=0;for(let C=0;C<ei;++C){const F=C/x,S=Math.exp(-F*F/2);h.push(S),C===0?b+=S:C<p&&(b+=2*S)}for(let C=0;C<h.length;C++)h[C]=h[C]/b;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=_,f.mipInt.value=y-n;const T=this._sizeLods[r],A=3*T*(r>y-Hn?r-y+Hn:0),w=4*(this._cubeSize-T);Ei(t,A,w,3*T,2*T),c.setRenderTarget(t),c.render(d,qi)}}function Mf(i){const e=[],t=[],n=[];let r=i;const s=i-Hn+1+Vo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-Hn?c=Vo[a-i+Hn-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],m=6,_=6,x=3,p=2,h=1,b=new Float32Array(x*_*m),y=new Float32Array(p*_*m),T=new Float32Array(h*_*m);for(let w=0;w<m;w++){const C=w%3*2/3-1,F=w>2?0:-1,S=[C,F,0,C+2/3,F,0,C+2/3,F+1,0,C,F,0,C+2/3,F+1,0,C,F+1,0];b.set(S,x*_*w),y.set(f,p*_*w);const M=[w,w,w,w,w,w];T.set(M,h*_*w)}const A=new Vt;A.setAttribute("position",new gn(b,x)),A.setAttribute("uv",new gn(y,p)),A.setAttribute("faceIndex",new gn(T,h)),n.push(new In(A,null)),r>Hn&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ko(i,e,t){const n=new mn(i,e,t);return n.texture.mapping=is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ei(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Ef(i,e,t){return new xn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:vf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:as(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function yf(i,e,t){const n=new Float32Array(ei),r=new U(0,1,0);return new xn({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:as(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Wo(){return new xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:as(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Xo(){return new xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:as(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function as(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function bf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===ea||c===ta,u=c===ri||c===Pi;if(l||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Ho(i)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const m=o.image;return l&&m&&m.height>0||u&&m&&r(m)?(t===null&&(t=new Ho(i)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Tf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&tr("WebGLRenderer: "+n+" extension not supported."),r}}}function Af(i,e,t,n){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function l(d){const f=[],m=d.index,_=d.attributes.position;let x=0;if(m!==null){const b=m.array;x=m.version;for(let y=0,T=b.length;y<T;y+=3){const A=b[y+0],w=b[y+1],C=b[y+2];f.push(A,w,w,C,C,A)}}else if(_!==void 0){const b=_.array;x=_.version;for(let y=0,T=b.length/3-1;y<T;y+=3){const A=y+0,w=y+1,C=y+2;f.push(A,w,w,C,C,A)}}else return;const p=new(Pl(f)?Fl:Nl)(f,1);p.version=x;const h=s.get(d);h&&e.remove(h),s.set(d,p)}function u(d){const f=s.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function wf(i,e,t){let n;function r(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function c(f,m){i.drawElements(n,m,s,f*a),t.update(m,n,1)}function l(f,m,_){_!==0&&(i.drawElementsInstanced(n,m,s,f*a,_),t.update(m,n,_))}function u(f,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,f,0,_);let p=0;for(let h=0;h<_;h++)p+=m[h];t.update(p,n,1)}function d(f,m,_,x){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<f.length;h++)l(f[h]/a,m[h],x[h]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,s,f,0,x,0,_);let h=0;for(let b=0;b<_;b++)h+=m[b]*x[b];t.update(h,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Rf(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:qe("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Cf(i,e,t){const n=new WeakMap,r=new dt;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;m===!0&&(y=1),_===!0&&(y=2),x===!0&&(y=3);let T=o.attributes.position.count*y,A=1;T>e.maxTextureSize&&(A=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const w=new Float32Array(T*A*4*d),C=new Dl(w,T,A,d);C.type=dn,C.needsUpdate=!0;const F=y*4;for(let M=0;M<d;M++){const D=p[M],V=h[M],B=b[M],W=T*A*4*M;for(let Y=0;Y<D.count;Y++){const G=Y*F;m===!0&&(r.fromBufferAttribute(D,Y),w[W+G+0]=r.x,w[W+G+1]=r.y,w[W+G+2]=r.z,w[W+G+3]=0),_===!0&&(r.fromBufferAttribute(V,Y),w[W+G+4]=r.x,w[W+G+5]=r.y,w[W+G+6]=r.z,w[W+G+7]=0),x===!0&&(r.fromBufferAttribute(B,Y),w[W+G+8]=r.x,w[W+G+9]=r.y,w[W+G+10]=r.z,w[W+G+11]=B.itemSize===4?r.w:1)}}f={count:d,texture:C,size:new Fe(T,A)},n.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let x=0;x<l.length;x++)m+=l[x];const _=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:s}}function Pf(i,e,t,n){let r=new WeakMap;function s(c){const l=n.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:a}}const Df={[ml]:"LINEAR_TONE_MAPPING",[gl]:"REINHARD_TONE_MAPPING",[_l]:"CINEON_TONE_MAPPING",[xl]:"ACES_FILMIC_TONE_MAPPING",[Sl]:"AGX_TONE_MAPPING",[Ml]:"NEUTRAL_TONE_MAPPING",[vl]:"CUSTOM_TONE_MAPPING"};function Lf(i,e,t,n,r){const s=new mn(e,t,{type:i,depthBuffer:n,stencilBuffer:r}),a=new mn(e,t,{type:Pn,depthBuffer:!1,stencilBuffer:!1}),o=new Vt;o.setAttribute("position",new Lt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Lt([0,2,0,0,2,0],2));const c=new Th({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new In(o,c),u=new Xl(-1,1,1,-1,0,1);let d=null,f=null,m=!1,_,x=null,p=[],h=!1;this.setSize=function(b,y){s.setSize(b,y),a.setSize(b,y);for(let T=0;T<p.length;T++){const A=p[T];A.setSize&&A.setSize(b,y)}},this.setEffects=function(b){p=b,h=p.length>0&&p[0].isRenderPass===!0;const y=s.width,T=s.height;for(let A=0;A<p.length;A++){const w=p[A];w.setSize&&w.setSize(y,T)}},this.begin=function(b,y){if(m||b.toneMapping===pn&&p.length===0)return!1;if(x=y,y!==null){const T=y.width,A=y.height;(s.width!==T||s.height!==A)&&this.setSize(T,A)}return h===!1&&b.setRenderTarget(s),_=b.toneMapping,b.toneMapping=pn,!0},this.hasRenderPass=function(){return h},this.end=function(b,y){b.toneMapping=_,m=!0;let T=s,A=a;for(let w=0;w<p.length;w++){const C=p[w];if(C.enabled!==!1&&(C.render(b,A,T,y),C.needsSwap!==!1)){const F=T;T=A,A=F}}if(d!==b.outputColorSpace||f!==b.toneMapping){d=b.outputColorSpace,f=b.toneMapping,c.defines={},He.getTransfer(d)===Je&&(c.defines.SRGB_TRANSFER="");const w=Df[f];w&&(c.defines[w]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=T.texture,b.setRenderTarget(x),b.render(l,u),x=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),c.dispose()}}const Yl=new Pt,za=new nr(1,1),$l=new Dl,Kl=new Jc,Zl=new zl,qo=[],Yo=[],$o=new Float32Array(16),Ko=new Float32Array(9),Zo=new Float32Array(4);function Oi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=qo[r];if(s===void 0&&(s=new Float32Array(r),qo[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function _t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function os(i,e){let t=Yo[e];t===void 0&&(t=new Int32Array(e),Yo[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function If(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Uf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2fv(this.addr,e),xt(t,e)}}function Nf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;i.uniform3fv(this.addr,e),xt(t,e)}}function Ff(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4fv(this.addr,e),xt(t,e)}}function Of(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,n))return;Zo.set(n),i.uniformMatrix2fv(this.addr,!1,Zo),xt(t,n)}}function Bf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,n))return;Ko.set(n),i.uniformMatrix3fv(this.addr,!1,Ko),xt(t,n)}}function zf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,n))return;$o.set(n),i.uniformMatrix4fv(this.addr,!1,$o),xt(t,n)}}function Vf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2iv(this.addr,e),xt(t,e)}}function Hf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3iv(this.addr,e),xt(t,e)}}function kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4iv(this.addr,e),xt(t,e)}}function Wf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Xf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2uiv(this.addr,e),xt(t,e)}}function qf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3uiv(this.addr,e),xt(t,e)}}function Yf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4uiv(this.addr,e),xt(t,e)}}function $f(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(za.compareFunction=t.isReversedDepthBuffer()?Za:Ka,s=za):s=Yl,t.setTexture2D(e||s,r)}function Kf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Kl,r)}function Zf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Zl,r)}function jf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||$l,r)}function Jf(i){switch(i){case 5126:return If;case 35664:return Uf;case 35665:return Nf;case 35666:return Ff;case 35674:return Of;case 35675:return Bf;case 35676:return zf;case 5124:case 35670:return Vf;case 35667:case 35671:return Gf;case 35668:case 35672:return Hf;case 35669:case 35673:return kf;case 5125:return Wf;case 36294:return Xf;case 36295:return qf;case 36296:return Yf;case 35678:case 36198:case 36298:case 36306:case 35682:return $f;case 35679:case 36299:case 36307:return Kf;case 35680:case 36300:case 36308:case 36293:return Zf;case 36289:case 36303:case 36311:case 36292:return jf}}function Qf(i,e){i.uniform1fv(this.addr,e)}function ep(i,e){const t=Oi(e,this.size,2);i.uniform2fv(this.addr,t)}function tp(i,e){const t=Oi(e,this.size,3);i.uniform3fv(this.addr,t)}function np(i,e){const t=Oi(e,this.size,4);i.uniform4fv(this.addr,t)}function ip(i,e){const t=Oi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function rp(i,e){const t=Oi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function sp(i,e){const t=Oi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ap(i,e){i.uniform1iv(this.addr,e)}function op(i,e){i.uniform2iv(this.addr,e)}function lp(i,e){i.uniform3iv(this.addr,e)}function cp(i,e){i.uniform4iv(this.addr,e)}function hp(i,e){i.uniform1uiv(this.addr,e)}function up(i,e){i.uniform2uiv(this.addr,e)}function dp(i,e){i.uniform3uiv(this.addr,e)}function fp(i,e){i.uniform4uiv(this.addr,e)}function pp(i,e,t){const n=this.cache,r=e.length,s=os(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),xt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=za:a=Yl;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function mp(i,e,t){const n=this.cache,r=e.length,s=os(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),xt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Kl,s[a])}function gp(i,e,t){const n=this.cache,r=e.length,s=os(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),xt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Zl,s[a])}function _p(i,e,t){const n=this.cache,r=e.length,s=os(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),xt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||$l,s[a])}function xp(i){switch(i){case 5126:return Qf;case 35664:return ep;case 35665:return tp;case 35666:return np;case 35674:return ip;case 35675:return rp;case 35676:return sp;case 5124:case 35670:return ap;case 35667:case 35671:return op;case 35668:case 35672:return lp;case 35669:case 35673:return cp;case 5125:return hp;case 36294:return up;case 36295:return dp;case 36296:return fp;case 35678:case 36198:case 36298:case 36306:case 35682:return pp;case 35679:case 36299:case 36307:return mp;case 35680:case 36300:case 36308:case 36293:return gp;case 36289:case 36303:case 36311:case 36292:return _p}}class vp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Jf(t.type)}}class Sp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xp(t.type)}}class Mp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const Gs=/(\w+)(\])?(\[|\.)?/g;function jo(i,e){i.seq.push(e),i.map[e.id]=e}function Ep(i,e,t){const n=i.name,r=n.length;for(Gs.lastIndex=0;;){const s=Gs.exec(n),a=Gs.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){jo(t,l===void 0?new vp(o,i,e):new Sp(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Mp(o),jo(t,d)),t=d}}}class Wr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);Ep(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function Jo(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const yp=37297;let bp=0;function Tp(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Qo=new De;function Ap(i){He._getMatrix(Qo,He.workingColorSpace,i);const e=`mat3( ${Qo.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(i)){case qr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return we("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function el(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Tp(i.getShaderSource(e),o)}else return s}function wp(i,e){const t=Ap(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Rp={[ml]:"Linear",[gl]:"Reinhard",[_l]:"Cineon",[xl]:"ACESFilmic",[Sl]:"AgX",[Ml]:"Neutral",[vl]:"Custom"};function Cp(i,e){const t=Rp[e];return t===void 0?(we("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Nr=new U;function Pp(){He.getLuminanceCoefficients(Nr);const i=Nr.x.toFixed(4),e=Nr.y.toFixed(4),t=Nr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zi).join(`
`)}function Lp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ip(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zi(i){return i!==""}function tl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Up=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(i){return i.replace(Up,Fp)}const Np=new Map;function Fp(i,e){let t=Le[e];if(t===void 0){const n=Np.get(e);if(n!==void 0)t=Le[n],we('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const Op=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function il(i){return i.replace(Op,Bp)}function Bp(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function rl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const zp={[zr]:"SHADOWMAP_TYPE_PCF",[Ki]:"SHADOWMAP_TYPE_VSM"};function Vp(i){return zp[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Gp={[ri]:"ENVMAP_TYPE_CUBE",[Pi]:"ENVMAP_TYPE_CUBE",[is]:"ENVMAP_TYPE_CUBE_UV"};function Hp(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Gp[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const kp={[Pi]:"ENVMAP_MODE_REFRACTION"};function Wp(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":kp[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Xp={[pl]:"ENVMAP_BLENDING_MULTIPLY",[Dc]:"ENVMAP_BLENDING_MIX",[Lc]:"ENVMAP_BLENDING_ADD"};function qp(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Xp[i.combine]||"ENVMAP_BLENDING_NONE"}function Yp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function $p(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Vp(t),l=Hp(t),u=Wp(t),d=qp(t),f=Yp(t),m=Dp(t),_=Lp(s),x=r.createProgram();let p,h,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zi).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zi).join(`
`),h.length>0&&(h+=`
`)):(p=[rl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zi).join(`
`),h=[rl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pn?"#define TONE_MAPPING":"",t.toneMapping!==pn?Le.tonemapping_pars_fragment:"",t.toneMapping!==pn?Cp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Le.colorspace_pars_fragment,wp("linearToOutputTexel",t.outputColorSpace),Pp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zi).join(`
`)),a=Va(a),a=tl(a,t),a=nl(a,t),o=Va(o),o=tl(o,t),o=nl(o,t),a=il(a),o=il(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===fo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===fo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const y=b+p+a,T=b+h+o,A=Jo(r,r.VERTEX_SHADER,y),w=Jo(r,r.FRAGMENT_SHADER,T);r.attachShader(x,A),r.attachShader(x,w),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function C(D){if(i.debug.checkShaderErrors){const V=r.getProgramInfoLog(x)||"",B=r.getShaderInfoLog(A)||"",W=r.getShaderInfoLog(w)||"",Y=V.trim(),G=B.trim(),k=W.trim();let Z=!0,he=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,A,w);else{const ae=el(r,A,"vertex"),ue=el(r,w,"fragment");qe("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+Y+`
`+ae+`
`+ue)}else Y!==""?we("WebGLProgram: Program Info Log:",Y):(G===""||k==="")&&(he=!1);he&&(D.diagnostics={runnable:Z,programLog:Y,vertexShader:{log:G,prefix:p},fragmentShader:{log:k,prefix:h}})}r.deleteShader(A),r.deleteShader(w),F=new Wr(r,x),S=Ip(r,x)}let F;this.getUniforms=function(){return F===void 0&&C(this),F};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(x,yp)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bp++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=w,this}let Kp=0;class Zp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new jp(e),t.set(e,n)),n}}class jp{constructor(e){this.id=Kp++,this.code=e,this.usedTimes=0}}function Jp(i,e,t,n,r,s,a){const o=new Ll,c=new Zp,l=new Set,u=[],d=new Map,f=r.logarithmicDepthBuffer;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return l.add(S),S===0?"uv":`uv${S}`}function p(S,M,D,V,B){const W=V.fog,Y=B.geometry,G=S.isMeshStandardMaterial?V.environment:null,k=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),Z=k&&k.mapping===is?k.image.height:null,he=_[S.type];S.precision!==null&&(m=r.getMaxPrecision(S.precision),m!==S.precision&&we("WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const ae=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ue=ae!==void 0?ae.length:0;let Oe=0;Y.morphAttributes.position!==void 0&&(Oe=1),Y.morphAttributes.normal!==void 0&&(Oe=2),Y.morphAttributes.color!==void 0&&(Oe=3);let Ie,lt,ot,q;if(he){const Ze=un[he];Ie=Ze.vertexShader,lt=Ze.fragmentShader}else Ie=S.vertexShader,lt=S.fragmentShader,c.update(S),ot=c.getVertexShaderID(S),q=c.getFragmentShaderID(S);const j=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),Pe=B.isInstancedMesh===!0,_e=B.isBatchedMesh===!0,We=!!S.map,vt=!!S.matcap,Ge=!!k,Ke=!!S.aoMap,nt=!!S.lightMap,Ue=!!S.bumpMap,ft=!!S.normalMap,R=!!S.displacementMap,pt=!!S.emissiveMap,Ye=!!S.metalnessMap,rt=!!S.roughnessMap,ve=S.anisotropy>0,E=S.clearcoat>0,g=S.dispersion>0,L=S.iridescence>0,X=S.sheen>0,K=S.transmission>0,H=ve&&!!S.anisotropyMap,Me=E&&!!S.clearcoatMap,ne=E&&!!S.clearcoatNormalMap,xe=E&&!!S.clearcoatRoughnessMap,Ae=L&&!!S.iridescenceMap,Q=L&&!!S.iridescenceThicknessMap,re=X&&!!S.sheenColorMap,ge=X&&!!S.sheenRoughnessMap,Se=!!S.specularMap,ie=!!S.specularColorMap,Ne=!!S.specularIntensityMap,P=K&&!!S.transmissionMap,ce=K&&!!S.thicknessMap,ee=!!S.gradientMap,de=!!S.alphaMap,J=S.alphaTest>0,$=!!S.alphaHash,te=!!S.extensions;let Re=pn;S.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Re=i.toneMapping);const st={shaderID:he,shaderType:S.type,shaderName:S.name,vertexShader:Ie,fragmentShader:lt,defines:S.defines,customVertexShaderID:ot,customFragmentShaderID:q,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:_e,batchingColor:_e&&B._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&B.instanceColor!==null,instancingMorph:Pe&&B.morphTexture!==null,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Li,alphaToCoverage:!!S.alphaToCoverage,map:We,matcap:vt,envMap:Ge,envMapMode:Ge&&k.mapping,envMapCubeUVHeight:Z,aoMap:Ke,lightMap:nt,bumpMap:Ue,normalMap:ft,displacementMap:R,emissiveMap:pt,normalMapObjectSpace:ft&&S.normalMapType===Fc,normalMapTangentSpace:ft&&S.normalMapType===Nc,metalnessMap:Ye,roughnessMap:rt,anisotropy:ve,anisotropyMap:H,clearcoat:E,clearcoatMap:Me,clearcoatNormalMap:ne,clearcoatRoughnessMap:xe,dispersion:g,iridescence:L,iridescenceMap:Ae,iridescenceThicknessMap:Q,sheen:X,sheenColorMap:re,sheenRoughnessMap:ge,specularMap:Se,specularColorMap:ie,specularIntensityMap:Ne,transmission:K,transmissionMap:P,thicknessMap:ce,gradientMap:ee,opaque:S.transparent===!1&&S.blending===wi&&S.alphaToCoverage===!1,alphaMap:de,alphaTest:J,alphaHash:$,combine:S.combine,mapUv:We&&x(S.map.channel),aoMapUv:Ke&&x(S.aoMap.channel),lightMapUv:nt&&x(S.lightMap.channel),bumpMapUv:Ue&&x(S.bumpMap.channel),normalMapUv:ft&&x(S.normalMap.channel),displacementMapUv:R&&x(S.displacementMap.channel),emissiveMapUv:pt&&x(S.emissiveMap.channel),metalnessMapUv:Ye&&x(S.metalnessMap.channel),roughnessMapUv:rt&&x(S.roughnessMap.channel),anisotropyMapUv:H&&x(S.anisotropyMap.channel),clearcoatMapUv:Me&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:ne&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:re&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:ge&&x(S.sheenRoughnessMap.channel),specularMapUv:Se&&x(S.specularMap.channel),specularColorMapUv:ie&&x(S.specularColorMap.channel),specularIntensityMapUv:Ne&&x(S.specularIntensityMap.channel),transmissionMapUv:P&&x(S.transmissionMap.channel),thicknessMapUv:ce&&x(S.thicknessMap.channel),alphaMapUv:de&&x(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ft||ve),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Y.attributes.uv&&(We||de),fog:!!W,useFog:S.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:pe,skinning:B.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Oe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Re,decodeVideoTexture:We&&S.map.isVideoTexture===!0&&He.getTransfer(S.map.colorSpace)===Je,decodeVideoTextureEmissive:pt&&S.emissiveMap.isVideoTexture===!0&&He.getTransfer(S.emissiveMap.colorSpace)===Je,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Tn,flipSided:S.side===Bt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:te&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(te&&S.extensions.multiDraw===!0||_e)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return st.vertexUv1s=l.has(1),st.vertexUv2s=l.has(2),st.vertexUv3s=l.has(3),l.clear(),st}function h(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const D in S.defines)M.push(D),M.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(b(M,S),y(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function b(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function y(S,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),S.push(o.mask)}function T(S){const M=_[S.type];let D;if(M){const V=un[M];D=uh.clone(V.uniforms)}else D=S.uniforms;return D}function A(S,M){let D=d.get(M);return D!==void 0?++D.usedTimes:(D=new $p(i,M,S,s),u.push(D),d.set(M,D)),D}function w(S){if(--S.usedTimes===0){const M=u.indexOf(S);u[M]=u[u.length-1],u.pop(),d.delete(S.cacheKey),S.destroy()}}function C(S){c.remove(S)}function F(){c.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:T,acquireProgram:A,releaseProgram:w,releaseShaderCache:C,programs:u,dispose:F}}function Qp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function em(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function sl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function al(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(d,f,m,_,x,p){let h=i[e];return h===void 0?(h={id:d.id,object:d,geometry:f,material:m,groupOrder:_,renderOrder:d.renderOrder,z:x,group:p},i[e]=h):(h.id=d.id,h.object=d,h.geometry=f,h.material=m,h.groupOrder=_,h.renderOrder=d.renderOrder,h.z=x,h.group=p),e++,h}function o(d,f,m,_,x,p){const h=a(d,f,m,_,x,p);m.transmission>0?n.push(h):m.transparent===!0?r.push(h):t.push(h)}function c(d,f,m,_,x,p){const h=a(d,f,m,_,x,p);m.transmission>0?n.unshift(h):m.transparent===!0?r.unshift(h):t.unshift(h)}function l(d,f){t.length>1&&t.sort(d||em),n.length>1&&n.sort(f||sl),r.length>1&&r.sort(f||sl)}function u(){for(let d=e,f=i.length;d<f;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function tm(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new al,i.set(n,[a])):r>=s.length?(a=new al,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function nm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new $e};break;case"SpotLight":t={position:new U,direction:new U,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function im(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let rm=0;function sm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function am(i){const e=new nm,t=im(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const r=new U,s=new ut,a=new ut;function o(l){let u=0,d=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let m=0,_=0,x=0,p=0,h=0,b=0,y=0,T=0,A=0,w=0,C=0;l.sort(sm);for(let S=0,M=l.length;S<M;S++){const D=l[S],V=D.color,B=D.intensity,W=D.distance;let Y=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Di?Y=D.shadow.map.texture:Y=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=V.r*B,d+=V.g*B,f+=V.b*B;else if(D.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(D.sh.coefficients[G],B);C++}else if(D.isDirectionalLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const k=D.shadow,Z=t.get(D);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,n.directionalShadow[m]=Z,n.directionalShadowMap[m]=Y,n.directionalShadowMatrix[m]=D.shadow.matrix,b++}n.directional[m]=G,m++}else if(D.isSpotLight){const G=e.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(V).multiplyScalar(B),G.distance=W,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,n.spot[x]=G;const k=D.shadow;if(D.map&&(n.spotLightMap[A]=D.map,A++,k.updateMatrices(D),D.castShadow&&w++),n.spotLightMatrix[x]=k.matrix,D.castShadow){const Z=t.get(D);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,n.spotShadow[x]=Z,n.spotShadowMap[x]=Y,T++}x++}else if(D.isRectAreaLight){const G=e.get(D);G.color.copy(V).multiplyScalar(B),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),n.rectArea[p]=G,p++}else if(D.isPointLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){const k=D.shadow,Z=t.get(D);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,Z.shadowCameraNear=k.camera.near,Z.shadowCameraFar=k.camera.far,n.pointShadow[_]=Z,n.pointShadowMap[_]=Y,n.pointShadowMatrix[_]=D.shadow.matrix,y++}n.point[_]=G,_++}else if(D.isHemisphereLight){const G=e.get(D);G.skyColor.copy(D.color).multiplyScalar(B),G.groundColor.copy(D.groundColor).multiplyScalar(B),n.hemi[h]=G,h++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const F=n.hash;(F.directionalLength!==m||F.pointLength!==_||F.spotLength!==x||F.rectAreaLength!==p||F.hemiLength!==h||F.numDirectionalShadows!==b||F.numPointShadows!==y||F.numSpotShadows!==T||F.numSpotMaps!==A||F.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=x,n.rectArea.length=p,n.point.length=_,n.hemi.length=h,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=T+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,F.directionalLength=m,F.pointLength=_,F.spotLength=x,F.rectAreaLength=p,F.hemiLength=h,F.numDirectionalShadows=b,F.numPointShadows=y,F.numSpotShadows=T,F.numSpotMaps=A,F.numLightProbes=C,n.version=rm++)}function c(l,u){let d=0,f=0,m=0,_=0,x=0;const p=u.matrixWorldInverse;for(let h=0,b=l.length;h<b;h++){const y=l[h];if(y.isDirectionalLight){const T=n.directional[d];T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),d++}else if(y.isSpotLight){const T=n.spot[m];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const T=n.rectArea[_];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),a.identity(),s.copy(y.matrixWorld),s.premultiply(p),a.extractRotation(s),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const T=n.hemi[x];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),x++}}}return{setup:o,setupView:c,state:n}}function ol(i){const e=new am(i),t=[],n=[];function r(u){l.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function om(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new ol(i),e.set(r,[o])):s>=a.length?(o=new ol(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const lm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,hm=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],um=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],ll=new ut,Yi=new U,Hs=new U;function dm(i,e,t){let n=new Gl;const r=new Fe,s=new Fe,a=new dt,o=new Ah,c=new wh,l={},u=t.maxTextureSize,d={[kn]:Bt,[Bt]:kn,[Tn]:Tn},f=new xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:lm,fragmentShader:cm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new Vt;_.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new In(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zr;let h=this.type;this.render=function(w,C,F){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;w.type===dc&&(we("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),w.type=zr);const S=i.getRenderTarget(),M=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),V=i.state;V.setBlending(Rn),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const B=h!==this.type;B&&C.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(Y=>Y.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,Y=w.length;W<Y;W++){const G=w[W],k=G.shadow;if(k===void 0){we("WebGLShadowMap:",G,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const Z=k.getFrameExtents();if(r.multiply(Z),s.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Z.x),r.x=s.x*Z.x,k.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Z.y),r.y=s.y*Z.y,k.mapSize.y=s.y)),k.map===null||B===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Ki){if(G.isPointLight){we("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new mn(r.x,r.y,{format:Di,type:Pn,minFilter:At,magFilter:At,generateMipmaps:!1}),k.map.texture.name=G.name+".shadowMap",k.map.depthTexture=new nr(r.x,r.y,dn),k.map.depthTexture.name=G.name+".shadowMapDepth",k.map.depthTexture.format=Dn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Mt,k.map.depthTexture.magFilter=Mt}else{G.isPointLight?(k.map=new Vl(r.x),k.map.depthTexture=new yh(r.x,_n)):(k.map=new mn(r.x,r.y),k.map.depthTexture=new nr(r.x,r.y,_n)),k.map.depthTexture.name=G.name+".shadowMap",k.map.depthTexture.format=Dn;const ae=i.state.buffers.depth.getReversed();this.type===zr?(k.map.depthTexture.compareFunction=ae?Za:Ka,k.map.depthTexture.minFilter=At,k.map.depthTexture.magFilter=At):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Mt,k.map.depthTexture.magFilter=Mt)}k.camera.updateProjectionMatrix()}const he=k.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<he;ae++){if(k.map.isWebGLCubeRenderTarget)i.setRenderTarget(k.map,ae),i.clear();else{ae===0&&(i.setRenderTarget(k.map),i.clear());const ue=k.getViewport(ae);a.set(s.x*ue.x,s.y*ue.y,s.x*ue.z,s.y*ue.w),V.viewport(a)}if(G.isPointLight){const ue=k.camera,Oe=k.matrix,Ie=G.distance||ue.far;Ie!==ue.far&&(ue.far=Ie,ue.updateProjectionMatrix()),Yi.setFromMatrixPosition(G.matrixWorld),ue.position.copy(Yi),Hs.copy(ue.position),Hs.add(hm[ae]),ue.up.copy(um[ae]),ue.lookAt(Hs),ue.updateMatrixWorld(),Oe.makeTranslation(-Yi.x,-Yi.y,-Yi.z),ll.multiplyMatrices(ue.projectionMatrix,ue.matrixWorldInverse),k._frustum.setFromProjectionMatrix(ll,ue.coordinateSystem,ue.reversedDepth)}else k.updateMatrices(G);n=k.getFrustum(),T(C,F,k.camera,G,this.type)}k.isPointLightShadow!==!0&&this.type===Ki&&b(k,F),k.needsUpdate=!1}h=this.type,p.needsUpdate=!1,i.setRenderTarget(S,M,D)};function b(w,C){const F=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new mn(r.x,r.y,{format:Di,type:Pn})),f.uniforms.shadow_pass.value=w.map.depthTexture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,F,f,x,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,F,m,x,null)}function y(w,C,F,S){let M=null;const D=F.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)M=D;else if(M=F.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const V=M.uuid,B=C.uuid;let W=l[V];W===void 0&&(W={},l[V]=W);let Y=W[B];Y===void 0&&(Y=M.clone(),W[B]=Y,C.addEventListener("dispose",A)),M=Y}if(M.visible=C.visible,M.wireframe=C.wireframe,S===Ki?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:d[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,F.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=i.properties.get(M);V.light=F}return M}function T(w,C,F,S,M){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Ki)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,w.matrixWorld);const B=e.update(w),W=w.material;if(Array.isArray(W)){const Y=B.groups;for(let G=0,k=Y.length;G<k;G++){const Z=Y[G],he=W[Z.materialIndex];if(he&&he.visible){const ae=y(w,he,S,M);w.onBeforeShadow(i,w,C,F,B,ae,Z),i.renderBufferDirect(F,null,B,ae,w,Z),w.onAfterShadow(i,w,C,F,B,ae,Z)}}}else if(W.visible){const Y=y(w,W,S,M);w.onBeforeShadow(i,w,C,F,B,Y,null),i.renderBufferDirect(F,null,B,Y,w,null),w.onAfterShadow(i,w,C,F,B,Y,null)}}const V=w.children;for(let B=0,W=V.length;B<W;B++)T(V[B],C,F,S,M)}function A(w){w.target.removeEventListener("dispose",A);for(const F in l){const S=l[F],M=w.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const fm={[Ys]:$s,[Ks]:Js,[Zs]:Qs,[Ci]:js,[$s]:Ys,[Js]:Ks,[Qs]:Zs,[js]:Ci};function pm(i,e){function t(){let P=!1;const ce=new dt;let ee=null;const de=new dt(0,0,0,0);return{setMask:function(J){ee!==J&&!P&&(i.colorMask(J,J,J,J),ee=J)},setLocked:function(J){P=J},setClear:function(J,$,te,Re,st){st===!0&&(J*=Re,$*=Re,te*=Re),ce.set(J,$,te,Re),de.equals(ce)===!1&&(i.clearColor(J,$,te,Re),de.copy(ce))},reset:function(){P=!1,ee=null,de.set(-1,0,0,0)}}}function n(){let P=!1,ce=!1,ee=null,de=null,J=null;return{setReversed:function($){if(ce!==$){const te=e.get("EXT_clip_control");$?te.clipControlEXT(te.LOWER_LEFT_EXT,te.ZERO_TO_ONE_EXT):te.clipControlEXT(te.LOWER_LEFT_EXT,te.NEGATIVE_ONE_TO_ONE_EXT),ce=$;const Re=J;J=null,this.setClear(Re)}},getReversed:function(){return ce},setTest:function($){$?j(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function($){ee!==$&&!P&&(i.depthMask($),ee=$)},setFunc:function($){if(ce&&($=fm[$]),de!==$){switch($){case Ys:i.depthFunc(i.NEVER);break;case $s:i.depthFunc(i.ALWAYS);break;case Ks:i.depthFunc(i.LESS);break;case Ci:i.depthFunc(i.LEQUAL);break;case Zs:i.depthFunc(i.EQUAL);break;case js:i.depthFunc(i.GEQUAL);break;case Js:i.depthFunc(i.GREATER);break;case Qs:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=$}},setLocked:function($){P=$},setClear:function($){J!==$&&(ce&&($=1-$),i.clearDepth($),J=$)},reset:function(){P=!1,ee=null,de=null,J=null,ce=!1}}}function r(){let P=!1,ce=null,ee=null,de=null,J=null,$=null,te=null,Re=null,st=null;return{setTest:function(Ze){P||(Ze?j(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(Ze){ce!==Ze&&!P&&(i.stencilMask(Ze),ce=Ze)},setFunc:function(Ze,cn,vn){(ee!==Ze||de!==cn||J!==vn)&&(i.stencilFunc(Ze,cn,vn),ee=Ze,de=cn,J=vn)},setOp:function(Ze,cn,vn){($!==Ze||te!==cn||Re!==vn)&&(i.stencilOp(Ze,cn,vn),$=Ze,te=cn,Re=vn)},setLocked:function(Ze){P=Ze},setClear:function(Ze){st!==Ze&&(i.clearStencil(Ze),st=Ze)},reset:function(){P=!1,ce=null,ee=null,de=null,J=null,$=null,te=null,Re=null,st=null}}}const s=new t,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let u={},d={},f=new WeakMap,m=[],_=null,x=!1,p=null,h=null,b=null,y=null,T=null,A=null,w=null,C=new $e(0,0,0),F=0,S=!1,M=null,D=null,V=null,B=null,W=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,k=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(Z)[1]),G=k>=1):Z.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),G=k>=2);let he=null,ae={};const ue=i.getParameter(i.SCISSOR_BOX),Oe=i.getParameter(i.VIEWPORT),Ie=new dt().fromArray(ue),lt=new dt().fromArray(Oe);function ot(P,ce,ee,de){const J=new Uint8Array(4),$=i.createTexture();i.bindTexture(P,$),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<ee;te++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ce,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(ce+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return $}const q={};q[i.TEXTURE_2D]=ot(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=ot(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=ot(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=ot(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(Ci),Ue(!1),ft(oo),j(i.CULL_FACE),Ke(Rn);function j(P){u[P]!==!0&&(i.enable(P),u[P]=!0)}function pe(P){u[P]!==!1&&(i.disable(P),u[P]=!1)}function Pe(P,ce){return d[P]!==ce?(i.bindFramebuffer(P,ce),d[P]=ce,P===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ce),P===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ce),!0):!1}function _e(P,ce){let ee=m,de=!1;if(P){ee=f.get(ce),ee===void 0&&(ee=[],f.set(ce,ee));const J=P.textures;if(ee.length!==J.length||ee[0]!==i.COLOR_ATTACHMENT0){for(let $=0,te=J.length;$<te;$++)ee[$]=i.COLOR_ATTACHMENT0+$;ee.length=J.length,de=!0}}else ee[0]!==i.BACK&&(ee[0]=i.BACK,de=!0);de&&i.drawBuffers(ee)}function We(P){return _!==P?(i.useProgram(P),_=P,!0):!1}const vt={[Qn]:i.FUNC_ADD,[pc]:i.FUNC_SUBTRACT,[mc]:i.FUNC_REVERSE_SUBTRACT};vt[gc]=i.MIN,vt[_c]=i.MAX;const Ge={[xc]:i.ZERO,[vc]:i.ONE,[Sc]:i.SRC_COLOR,[Xs]:i.SRC_ALPHA,[Ac]:i.SRC_ALPHA_SATURATE,[bc]:i.DST_COLOR,[Ec]:i.DST_ALPHA,[Mc]:i.ONE_MINUS_SRC_COLOR,[qs]:i.ONE_MINUS_SRC_ALPHA,[Tc]:i.ONE_MINUS_DST_COLOR,[yc]:i.ONE_MINUS_DST_ALPHA,[wc]:i.CONSTANT_COLOR,[Rc]:i.ONE_MINUS_CONSTANT_COLOR,[Cc]:i.CONSTANT_ALPHA,[Pc]:i.ONE_MINUS_CONSTANT_ALPHA};function Ke(P,ce,ee,de,J,$,te,Re,st,Ze){if(P===Rn){x===!0&&(pe(i.BLEND),x=!1);return}if(x===!1&&(j(i.BLEND),x=!0),P!==fc){if(P!==p||Ze!==S){if((h!==Qn||T!==Qn)&&(i.blendEquation(i.FUNC_ADD),h=Qn,T=Qn),Ze)switch(P){case wi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ws:i.blendFunc(i.ONE,i.ONE);break;case lo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case co:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qe("WebGLState: Invalid blending: ",P);break}else switch(P){case wi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ws:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case lo:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case co:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",P);break}b=null,y=null,A=null,w=null,C.set(0,0,0),F=0,p=P,S=Ze}return}J=J||ce,$=$||ee,te=te||de,(ce!==h||J!==T)&&(i.blendEquationSeparate(vt[ce],vt[J]),h=ce,T=J),(ee!==b||de!==y||$!==A||te!==w)&&(i.blendFuncSeparate(Ge[ee],Ge[de],Ge[$],Ge[te]),b=ee,y=de,A=$,w=te),(Re.equals(C)===!1||st!==F)&&(i.blendColor(Re.r,Re.g,Re.b,st),C.copy(Re),F=st),p=P,S=!1}function nt(P,ce){P.side===Tn?pe(i.CULL_FACE):j(i.CULL_FACE);let ee=P.side===Bt;ce&&(ee=!ee),Ue(ee),P.blending===wi&&P.transparent===!1?Ke(Rn):Ke(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),s.setMask(P.colorWrite);const de=P.stencilWrite;o.setTest(de),de&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),pt(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(P){M!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),M=P)}function ft(P){P!==hc?(j(i.CULL_FACE),P!==D&&(P===oo?i.cullFace(i.BACK):P===uc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),D=P}function R(P){P!==V&&(G&&i.lineWidth(P),V=P)}function pt(P,ce,ee){P?(j(i.POLYGON_OFFSET_FILL),(B!==ce||W!==ee)&&(i.polygonOffset(ce,ee),B=ce,W=ee)):pe(i.POLYGON_OFFSET_FILL)}function Ye(P){P?j(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function rt(P){P===void 0&&(P=i.TEXTURE0+Y-1),he!==P&&(i.activeTexture(P),he=P)}function ve(P,ce,ee){ee===void 0&&(he===null?ee=i.TEXTURE0+Y-1:ee=he);let de=ae[ee];de===void 0&&(de={type:void 0,texture:void 0},ae[ee]=de),(de.type!==P||de.texture!==ce)&&(he!==ee&&(i.activeTexture(ee),he=ee),i.bindTexture(P,ce||q[P]),de.type=P,de.texture=ce)}function E(){const P=ae[he];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(P){qe("WebGLState:",P)}}function L(){try{i.compressedTexImage3D(...arguments)}catch(P){qe("WebGLState:",P)}}function X(){try{i.texSubImage2D(...arguments)}catch(P){qe("WebGLState:",P)}}function K(){try{i.texSubImage3D(...arguments)}catch(P){qe("WebGLState:",P)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(P){qe("WebGLState:",P)}}function Me(){try{i.compressedTexSubImage3D(...arguments)}catch(P){qe("WebGLState:",P)}}function ne(){try{i.texStorage2D(...arguments)}catch(P){qe("WebGLState:",P)}}function xe(){try{i.texStorage3D(...arguments)}catch(P){qe("WebGLState:",P)}}function Ae(){try{i.texImage2D(...arguments)}catch(P){qe("WebGLState:",P)}}function Q(){try{i.texImage3D(...arguments)}catch(P){qe("WebGLState:",P)}}function re(P){Ie.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),Ie.copy(P))}function ge(P){lt.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),lt.copy(P))}function Se(P,ce){let ee=l.get(ce);ee===void 0&&(ee=new WeakMap,l.set(ce,ee));let de=ee.get(P);de===void 0&&(de=i.getUniformBlockIndex(ce,P.name),ee.set(P,de))}function ie(P,ce){const de=l.get(ce).get(P);c.get(ce)!==de&&(i.uniformBlockBinding(ce,de,P.__bindingPointIndex),c.set(ce,de))}function Ne(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},he=null,ae={},d={},f=new WeakMap,m=[],_=null,x=!1,p=null,h=null,b=null,y=null,T=null,A=null,w=null,C=new $e(0,0,0),F=0,S=!1,M=null,D=null,V=null,B=null,W=null,Ie.set(0,0,i.canvas.width,i.canvas.height),lt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:j,disable:pe,bindFramebuffer:Pe,drawBuffers:_e,useProgram:We,setBlending:Ke,setMaterial:nt,setFlipSided:Ue,setCullFace:ft,setLineWidth:R,setPolygonOffset:pt,setScissorTest:Ye,activeTexture:rt,bindTexture:ve,unbindTexture:E,compressedTexImage2D:g,compressedTexImage3D:L,texImage2D:Ae,texImage3D:Q,updateUBOMapping:Se,uniformBlockBinding:ie,texStorage2D:ne,texStorage3D:xe,texSubImage2D:X,texSubImage3D:K,compressedTexSubImage2D:H,compressedTexSubImage3D:Me,scissor:re,viewport:ge,reset:Ne}}function mm(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Fe,u=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,g){return m?new OffscreenCanvas(E,g):$r("canvas")}function x(E,g,L){let X=1;const K=ve(E);if((K.width>L||K.height>L)&&(X=L/Math.max(K.width,K.height)),X<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const H=Math.floor(X*K.width),Me=Math.floor(X*K.height);d===void 0&&(d=_(H,Me));const ne=g?_(H,Me):d;return ne.width=H,ne.height=Me,ne.getContext("2d").drawImage(E,0,0,H,Me),we("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+H+"x"+Me+")."),ne}else return"data"in E&&we("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),E;return E}function p(E){return E.generateMipmaps}function h(E){i.generateMipmap(E)}function b(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(E,g,L,X,K=!1){if(E!==null){if(i[E]!==void 0)return i[E];we("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let H=g;if(g===i.RED&&(L===i.FLOAT&&(H=i.R32F),L===i.HALF_FLOAT&&(H=i.R16F),L===i.UNSIGNED_BYTE&&(H=i.R8)),g===i.RED_INTEGER&&(L===i.UNSIGNED_BYTE&&(H=i.R8UI),L===i.UNSIGNED_SHORT&&(H=i.R16UI),L===i.UNSIGNED_INT&&(H=i.R32UI),L===i.BYTE&&(H=i.R8I),L===i.SHORT&&(H=i.R16I),L===i.INT&&(H=i.R32I)),g===i.RG&&(L===i.FLOAT&&(H=i.RG32F),L===i.HALF_FLOAT&&(H=i.RG16F),L===i.UNSIGNED_BYTE&&(H=i.RG8)),g===i.RG_INTEGER&&(L===i.UNSIGNED_BYTE&&(H=i.RG8UI),L===i.UNSIGNED_SHORT&&(H=i.RG16UI),L===i.UNSIGNED_INT&&(H=i.RG32UI),L===i.BYTE&&(H=i.RG8I),L===i.SHORT&&(H=i.RG16I),L===i.INT&&(H=i.RG32I)),g===i.RGB_INTEGER&&(L===i.UNSIGNED_BYTE&&(H=i.RGB8UI),L===i.UNSIGNED_SHORT&&(H=i.RGB16UI),L===i.UNSIGNED_INT&&(H=i.RGB32UI),L===i.BYTE&&(H=i.RGB8I),L===i.SHORT&&(H=i.RGB16I),L===i.INT&&(H=i.RGB32I)),g===i.RGBA_INTEGER&&(L===i.UNSIGNED_BYTE&&(H=i.RGBA8UI),L===i.UNSIGNED_SHORT&&(H=i.RGBA16UI),L===i.UNSIGNED_INT&&(H=i.RGBA32UI),L===i.BYTE&&(H=i.RGBA8I),L===i.SHORT&&(H=i.RGBA16I),L===i.INT&&(H=i.RGBA32I)),g===i.RGB&&(L===i.UNSIGNED_INT_5_9_9_9_REV&&(H=i.RGB9_E5),L===i.UNSIGNED_INT_10F_11F_11F_REV&&(H=i.R11F_G11F_B10F)),g===i.RGBA){const Me=K?qr:He.getTransfer(X);L===i.FLOAT&&(H=i.RGBA32F),L===i.HALF_FLOAT&&(H=i.RGBA16F),L===i.UNSIGNED_BYTE&&(H=Me===Je?i.SRGB8_ALPHA8:i.RGBA8),L===i.UNSIGNED_SHORT_4_4_4_4&&(H=i.RGBA4),L===i.UNSIGNED_SHORT_5_5_5_1&&(H=i.RGB5_A1)}return(H===i.R16F||H===i.R32F||H===i.RG16F||H===i.RG32F||H===i.RGBA16F||H===i.RGBA32F)&&e.get("EXT_color_buffer_float"),H}function T(E,g){let L;return E?g===null||g===_n||g===er?L=i.DEPTH24_STENCIL8:g===dn?L=i.DEPTH32F_STENCIL8:g===Qi&&(L=i.DEPTH24_STENCIL8,we("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===_n||g===er?L=i.DEPTH_COMPONENT24:g===dn?L=i.DEPTH_COMPONENT32F:g===Qi&&(L=i.DEPTH_COMPONENT16),L}function A(E,g){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==Mt&&E.minFilter!==At?Math.log2(Math.max(g.width,g.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?g.mipmaps.length:1}function w(E){const g=E.target;g.removeEventListener("dispose",w),F(g),g.isVideoTexture&&u.delete(g)}function C(E){const g=E.target;g.removeEventListener("dispose",C),M(g)}function F(E){const g=n.get(E);if(g.__webglInit===void 0)return;const L=E.source,X=f.get(L);if(X){const K=X[g.__cacheKey];K.usedTimes--,K.usedTimes===0&&S(E),Object.keys(X).length===0&&f.delete(L)}n.remove(E)}function S(E){const g=n.get(E);i.deleteTexture(g.__webglTexture);const L=E.source,X=f.get(L);delete X[g.__cacheKey],a.memory.textures--}function M(E){const g=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let K=0;K<g.__webglFramebuffer[X].length;K++)i.deleteFramebuffer(g.__webglFramebuffer[X][K]);else i.deleteFramebuffer(g.__webglFramebuffer[X]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)i.deleteFramebuffer(g.__webglFramebuffer[X]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let X=0;X<g.__webglColorRenderbuffer.length;X++)g.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[X]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const L=E.textures;for(let X=0,K=L.length;X<K;X++){const H=n.get(L[X]);H.__webglTexture&&(i.deleteTexture(H.__webglTexture),a.memory.textures--),n.remove(L[X])}n.remove(E)}let D=0;function V(){D=0}function B(){const E=D;return E>=r.maxTextures&&we("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),D+=1,E}function W(E){const g=[];return g.push(E.wrapS),g.push(E.wrapT),g.push(E.wrapR||0),g.push(E.magFilter),g.push(E.minFilter),g.push(E.anisotropy),g.push(E.internalFormat),g.push(E.format),g.push(E.type),g.push(E.generateMipmaps),g.push(E.premultiplyAlpha),g.push(E.flipY),g.push(E.unpackAlignment),g.push(E.colorSpace),g.join()}function Y(E,g){const L=n.get(E);if(E.isVideoTexture&&Ye(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&L.__version!==E.version){const X=E.image;if(X===null)we("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)we("WebGLRenderer: Texture marked for update but image is incomplete");else{q(L,E,g);return}}else E.isExternalTexture&&(L.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,L.__webglTexture,i.TEXTURE0+g)}function G(E,g){const L=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&L.__version!==E.version){q(L,E,g);return}else E.isExternalTexture&&(L.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,L.__webglTexture,i.TEXTURE0+g)}function k(E,g){const L=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&L.__version!==E.version){q(L,E,g);return}t.bindTexture(i.TEXTURE_3D,L.__webglTexture,i.TEXTURE0+g)}function Z(E,g){const L=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&L.__version!==E.version){j(L,E,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+g)}const he={[na]:i.REPEAT,[An]:i.CLAMP_TO_EDGE,[ia]:i.MIRRORED_REPEAT},ae={[Mt]:i.NEAREST,[Ic]:i.NEAREST_MIPMAP_NEAREST,[lr]:i.NEAREST_MIPMAP_LINEAR,[At]:i.LINEAR,[us]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},ue={[Oc]:i.NEVER,[Hc]:i.ALWAYS,[Bc]:i.LESS,[Ka]:i.LEQUAL,[zc]:i.EQUAL,[Za]:i.GEQUAL,[Vc]:i.GREATER,[Gc]:i.NOTEQUAL};function Oe(E,g){if(g.type===dn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===At||g.magFilter===us||g.magFilter===lr||g.magFilter===ti||g.minFilter===At||g.minFilter===us||g.minFilter===lr||g.minFilter===ti)&&we("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,he[g.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,he[g.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,he[g.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ae[g.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ae[g.minFilter]),g.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,ue[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Mt||g.minFilter!==lr&&g.minFilter!==ti||g.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const L=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Ie(E,g){let L=!1;E.__webglInit===void 0&&(E.__webglInit=!0,g.addEventListener("dispose",w));const X=g.source;let K=f.get(X);K===void 0&&(K={},f.set(X,K));const H=W(g);if(H!==E.__cacheKey){K[H]===void 0&&(K[H]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,L=!0),K[H].usedTimes++;const Me=K[E.__cacheKey];Me!==void 0&&(K[E.__cacheKey].usedTimes--,Me.usedTimes===0&&S(g)),E.__cacheKey=H,E.__webglTexture=K[H].texture}return L}function lt(E,g,L){return Math.floor(Math.floor(E/L)/g)}function ot(E,g,L,X){const H=E.updateRanges;if(H.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,L,X,g.data);else{H.sort((Q,re)=>Q.start-re.start);let Me=0;for(let Q=1;Q<H.length;Q++){const re=H[Me],ge=H[Q],Se=re.start+re.count,ie=lt(ge.start,g.width,4),Ne=lt(re.start,g.width,4);ge.start<=Se+1&&ie===Ne&&lt(ge.start+ge.count-1,g.width,4)===ie?re.count=Math.max(re.count,ge.start+ge.count-re.start):(++Me,H[Me]=ge)}H.length=Me+1;const ne=i.getParameter(i.UNPACK_ROW_LENGTH),xe=i.getParameter(i.UNPACK_SKIP_PIXELS),Ae=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let Q=0,re=H.length;Q<re;Q++){const ge=H[Q],Se=Math.floor(ge.start/4),ie=Math.ceil(ge.count/4),Ne=Se%g.width,P=Math.floor(Se/g.width),ce=ie,ee=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ne),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),t.texSubImage2D(i.TEXTURE_2D,0,Ne,P,ce,ee,L,X,g.data)}E.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ne),i.pixelStorei(i.UNPACK_SKIP_PIXELS,xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ae)}}function q(E,g,L){let X=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(X=i.TEXTURE_3D);const K=Ie(E,g),H=g.source;t.bindTexture(X,E.__webglTexture,i.TEXTURE0+L);const Me=n.get(H);if(H.version!==Me.__version||K===!0){t.activeTexture(i.TEXTURE0+L);const ne=He.getPrimaries(He.workingColorSpace),xe=g.colorSpace===Gn?null:He.getPrimaries(g.colorSpace),Ae=g.colorSpace===Gn||ne===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let Q=x(g.image,!1,r.maxTextureSize);Q=rt(g,Q);const re=s.convert(g.format,g.colorSpace),ge=s.convert(g.type);let Se=y(g.internalFormat,re,ge,g.colorSpace,g.isVideoTexture);Oe(X,g);let ie;const Ne=g.mipmaps,P=g.isVideoTexture!==!0,ce=Me.__version===void 0||K===!0,ee=H.dataReady,de=A(g,Q);if(g.isDepthTexture)Se=T(g.format===ni,g.type),ce&&(P?t.texStorage2D(i.TEXTURE_2D,1,Se,Q.width,Q.height):t.texImage2D(i.TEXTURE_2D,0,Se,Q.width,Q.height,0,re,ge,null));else if(g.isDataTexture)if(Ne.length>0){P&&ce&&t.texStorage2D(i.TEXTURE_2D,de,Se,Ne[0].width,Ne[0].height);for(let J=0,$=Ne.length;J<$;J++)ie=Ne[J],P?ee&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,re,ge,ie.data):t.texImage2D(i.TEXTURE_2D,J,Se,ie.width,ie.height,0,re,ge,ie.data);g.generateMipmaps=!1}else P?(ce&&t.texStorage2D(i.TEXTURE_2D,de,Se,Q.width,Q.height),ee&&ot(g,Q,re,ge)):t.texImage2D(i.TEXTURE_2D,0,Se,Q.width,Q.height,0,re,ge,Q.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){P&&ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Se,Ne[0].width,Ne[0].height,Q.depth);for(let J=0,$=Ne.length;J<$;J++)if(ie=Ne[J],g.format!==on)if(re!==null)if(P){if(ee)if(g.layerUpdates.size>0){const te=zo(ie.width,ie.height,g.format,g.type);for(const Re of g.layerUpdates){const st=ie.data.subarray(Re*te/ie.data.BYTES_PER_ELEMENT,(Re+1)*te/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Re,ie.width,ie.height,1,re,st)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,Q.depth,re,ie.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Se,ie.width,ie.height,Q.depth,0,ie.data,0,0);else we("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?ee&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,Q.depth,re,ge,ie.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,Se,ie.width,ie.height,Q.depth,0,re,ge,ie.data)}else{P&&ce&&t.texStorage2D(i.TEXTURE_2D,de,Se,Ne[0].width,Ne[0].height);for(let J=0,$=Ne.length;J<$;J++)ie=Ne[J],g.format!==on?re!==null?P?ee&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,re,ie.data):t.compressedTexImage2D(i.TEXTURE_2D,J,Se,ie.width,ie.height,0,ie.data):we("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?ee&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,re,ge,ie.data):t.texImage2D(i.TEXTURE_2D,J,Se,ie.width,ie.height,0,re,ge,ie.data)}else if(g.isDataArrayTexture)if(P){if(ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Se,Q.width,Q.height,Q.depth),ee)if(g.layerUpdates.size>0){const J=zo(Q.width,Q.height,g.format,g.type);for(const $ of g.layerUpdates){const te=Q.data.subarray($*J/Q.data.BYTES_PER_ELEMENT,($+1)*J/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,re,ge,te)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,re,ge,Q.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,Q.width,Q.height,Q.depth,0,re,ge,Q.data);else if(g.isData3DTexture)P?(ce&&t.texStorage3D(i.TEXTURE_3D,de,Se,Q.width,Q.height,Q.depth),ee&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,re,ge,Q.data)):t.texImage3D(i.TEXTURE_3D,0,Se,Q.width,Q.height,Q.depth,0,re,ge,Q.data);else if(g.isFramebufferTexture){if(ce)if(P)t.texStorage2D(i.TEXTURE_2D,de,Se,Q.width,Q.height);else{let J=Q.width,$=Q.height;for(let te=0;te<de;te++)t.texImage2D(i.TEXTURE_2D,te,Se,J,$,0,re,ge,null),J>>=1,$>>=1}}else if(Ne.length>0){if(P&&ce){const J=ve(Ne[0]);t.texStorage2D(i.TEXTURE_2D,de,Se,J.width,J.height)}for(let J=0,$=Ne.length;J<$;J++)ie=Ne[J],P?ee&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,re,ge,ie):t.texImage2D(i.TEXTURE_2D,J,Se,re,ge,ie);g.generateMipmaps=!1}else if(P){if(ce){const J=ve(Q);t.texStorage2D(i.TEXTURE_2D,de,Se,J.width,J.height)}ee&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re,ge,Q)}else t.texImage2D(i.TEXTURE_2D,0,Se,re,ge,Q);p(g)&&h(X),Me.__version=H.version,g.onUpdate&&g.onUpdate(g)}E.__version=g.version}function j(E,g,L){if(g.image.length!==6)return;const X=Ie(E,g),K=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+L);const H=n.get(K);if(K.version!==H.__version||X===!0){t.activeTexture(i.TEXTURE0+L);const Me=He.getPrimaries(He.workingColorSpace),ne=g.colorSpace===Gn?null:He.getPrimaries(g.colorSpace),xe=g.colorSpace===Gn||Me===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Ae=g.isCompressedTexture||g.image[0].isCompressedTexture,Q=g.image[0]&&g.image[0].isDataTexture,re=[];for(let $=0;$<6;$++)!Ae&&!Q?re[$]=x(g.image[$],!0,r.maxCubemapSize):re[$]=Q?g.image[$].image:g.image[$],re[$]=rt(g,re[$]);const ge=re[0],Se=s.convert(g.format,g.colorSpace),ie=s.convert(g.type),Ne=y(g.internalFormat,Se,ie,g.colorSpace),P=g.isVideoTexture!==!0,ce=H.__version===void 0||X===!0,ee=K.dataReady;let de=A(g,ge);Oe(i.TEXTURE_CUBE_MAP,g);let J;if(Ae){P&&ce&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ne,ge.width,ge.height);for(let $=0;$<6;$++){J=re[$].mipmaps;for(let te=0;te<J.length;te++){const Re=J[te];g.format!==on?Se!==null?P?ee&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te,0,0,Re.width,Re.height,Se,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te,Ne,Re.width,Re.height,0,Re.data):we("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te,0,0,Re.width,Re.height,Se,ie,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te,Ne,Re.width,Re.height,0,Se,ie,Re.data)}}}else{if(J=g.mipmaps,P&&ce){J.length>0&&de++;const $=ve(re[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ne,$.width,$.height)}for(let $=0;$<6;$++)if(Q){P?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,re[$].width,re[$].height,Se,ie,re[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ne,re[$].width,re[$].height,0,Se,ie,re[$].data);for(let te=0;te<J.length;te++){const st=J[te].image[$].image;P?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te+1,0,0,st.width,st.height,Se,ie,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te+1,Ne,st.width,st.height,0,Se,ie,st.data)}}else{P?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Se,ie,re[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ne,Se,ie,re[$]);for(let te=0;te<J.length;te++){const Re=J[te];P?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te+1,0,0,Se,ie,Re.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te+1,Ne,Se,ie,Re.image[$])}}}p(g)&&h(i.TEXTURE_CUBE_MAP),H.__version=K.version,g.onUpdate&&g.onUpdate(g)}E.__version=g.version}function pe(E,g,L,X,K,H){const Me=s.convert(L.format,L.colorSpace),ne=s.convert(L.type),xe=y(L.internalFormat,Me,ne,L.colorSpace),Ae=n.get(g),Q=n.get(L);if(Q.__renderTarget=g,!Ae.__hasExternalTextures){const re=Math.max(1,g.width>>H),ge=Math.max(1,g.height>>H);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,H,xe,re,ge,g.depth,0,Me,ne,null):t.texImage2D(K,H,xe,re,ge,0,Me,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),pt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,K,Q.__webglTexture,0,R(g)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,K,Q.__webglTexture,H),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pe(E,g,L){if(i.bindRenderbuffer(i.RENDERBUFFER,E),g.depthBuffer){const X=g.depthTexture,K=X&&X.isDepthTexture?X.type:null,H=T(g.stencilBuffer,K),Me=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;pt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(g),H,g.width,g.height):L?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(g),H,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,H,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,E)}else{const X=g.textures;for(let K=0;K<X.length;K++){const H=X[K],Me=s.convert(H.format,H.colorSpace),ne=s.convert(H.type),xe=y(H.internalFormat,Me,ne,H.colorSpace);pt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(g),xe,g.width,g.height):L?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(g),xe,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,xe,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _e(E,g,L){const X=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(g.depthTexture);if(K.__renderTarget=g,(!K.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X){if(K.__webglInit===void 0&&(K.__webglInit=!0,g.depthTexture.addEventListener("dispose",w)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Oe(i.TEXTURE_CUBE_MAP,g.depthTexture);const Ae=s.convert(g.depthTexture.format),Q=s.convert(g.depthTexture.type);let re;g.depthTexture.format===Dn?re=i.DEPTH_COMPONENT24:g.depthTexture.format===ni&&(re=i.DEPTH24_STENCIL8);for(let ge=0;ge<6;ge++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,re,g.width,g.height,0,Ae,Q,null)}}else Y(g.depthTexture,0);const H=K.__webglTexture,Me=R(g),ne=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+L:i.TEXTURE_2D,xe=g.depthTexture.format===ni?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===Dn)pt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,xe,ne,H,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,xe,ne,H,0);else if(g.depthTexture.format===ni)pt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,xe,ne,H,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,xe,ne,H,0);else throw new Error("Unknown depthTexture format")}function We(E){const g=n.get(E),L=E.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==E.depthTexture){const X=E.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),X){const K=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",K)};X.addEventListener("dispose",K),g.__depthDisposeCallback=K}g.__boundDepthTexture=X}if(E.depthTexture&&!g.__autoAllocateDepthBuffer)if(L)for(let X=0;X<6;X++)_e(g.__webglFramebuffer[X],E,X);else{const X=E.texture.mipmaps;X&&X.length>0?_e(g.__webglFramebuffer[0],E,0):_e(g.__webglFramebuffer,E,0)}else if(L){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=i.createRenderbuffer(),Pe(g.__webglDepthbuffer[X],E,!1);else{const K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,H=g.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,H),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,H)}}else{const X=E.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Pe(g.__webglDepthbuffer,E,!1);else{const K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,H=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,H),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,H)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function vt(E,g,L){const X=n.get(E);g!==void 0&&pe(X.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),L!==void 0&&We(E)}function Ge(E){const g=E.texture,L=n.get(E),X=n.get(g);E.addEventListener("dispose",C);const K=E.textures,H=E.isWebGLCubeRenderTarget===!0,Me=K.length>1;if(Me||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=g.version,a.memory.textures++),H){L.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer[ne]=[];for(let xe=0;xe<g.mipmaps.length;xe++)L.__webglFramebuffer[ne][xe]=i.createFramebuffer()}else L.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)L.__webglFramebuffer[ne]=i.createFramebuffer()}else L.__webglFramebuffer=i.createFramebuffer();if(Me)for(let ne=0,xe=K.length;ne<xe;ne++){const Ae=n.get(K[ne]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&pt(E)===!1){L.__webglMultisampledFramebuffer=i.createFramebuffer(),L.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let ne=0;ne<K.length;ne++){const xe=K[ne];L.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,L.__webglColorRenderbuffer[ne]);const Ae=s.convert(xe.format,xe.colorSpace),Q=s.convert(xe.type),re=y(xe.internalFormat,Ae,Q,xe.colorSpace,E.isXRRenderTarget===!0),ge=R(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,ge,re,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,L.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(L.__webglDepthRenderbuffer=i.createRenderbuffer(),Pe(L.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(H){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Oe(i.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let xe=0;xe<g.mipmaps.length;xe++)pe(L.__webglFramebuffer[ne][xe],E,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe);else pe(L.__webglFramebuffer[ne],E,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);p(g)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let ne=0,xe=K.length;ne<xe;ne++){const Ae=K[ne],Q=n.get(Ae);let re=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(re=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,Q.__webglTexture),Oe(re,Ae),pe(L.__webglFramebuffer,E,Ae,i.COLOR_ATTACHMENT0+ne,re,0),p(Ae)&&h(re)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ne=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,X.__webglTexture),Oe(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let xe=0;xe<g.mipmaps.length;xe++)pe(L.__webglFramebuffer[xe],E,g,i.COLOR_ATTACHMENT0,ne,xe);else pe(L.__webglFramebuffer,E,g,i.COLOR_ATTACHMENT0,ne,0);p(g)&&h(ne),t.unbindTexture()}E.depthBuffer&&We(E)}function Ke(E){const g=E.textures;for(let L=0,X=g.length;L<X;L++){const K=g[L];if(p(K)){const H=b(E),Me=n.get(K).__webglTexture;t.bindTexture(H,Me),h(H),t.unbindTexture()}}}const nt=[],Ue=[];function ft(E){if(E.samples>0){if(pt(E)===!1){const g=E.textures,L=E.width,X=E.height;let K=i.COLOR_BUFFER_BIT;const H=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(E),ne=g.length>1;if(ne)for(let Ae=0;Ae<g.length;Ae++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const xe=E.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let Ae=0;Ae<g.length;Ae++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[Ae]);const Q=n.get(g[Ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,L,X,0,0,L,X,K,i.NEAREST),c===!0&&(nt.length=0,Ue.length=0,nt.push(i.COLOR_ATTACHMENT0+Ae),E.depthBuffer&&E.resolveDepthBuffer===!1&&(nt.push(H),Ue.push(H),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ue)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let Ae=0;Ae<g.length;Ae++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,Me.__webglColorRenderbuffer[Ae]);const Q=n.get(g[Ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,Q,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){const g=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function R(E){return Math.min(r.maxSamples,E.samples)}function pt(E){const g=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Ye(E){const g=a.render.frame;u.get(E)!==g&&(u.set(E,g),E.update())}function rt(E,g){const L=E.colorSpace,X=E.format,K=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||L!==Li&&L!==Gn&&(He.getTransfer(L)===Je?(X!==on||K!==Jt)&&we("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",L)),g}function ve(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=V,this.setTexture2D=Y,this.setTexture2DArray=G,this.setTexture3D=k,this.setTextureCube=Z,this.rebindTextures=vt,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=pt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function gm(i,e){function t(n,r=Gn){let s;const a=He.getTransfer(r);if(n===Jt)return i.UNSIGNED_BYTE;if(n===Wa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Tl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Al)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===yl)return i.BYTE;if(n===bl)return i.SHORT;if(n===Qi)return i.UNSIGNED_SHORT;if(n===ka)return i.INT;if(n===_n)return i.UNSIGNED_INT;if(n===dn)return i.FLOAT;if(n===Pn)return i.HALF_FLOAT;if(n===wl)return i.ALPHA;if(n===Rl)return i.RGB;if(n===on)return i.RGBA;if(n===Dn)return i.DEPTH_COMPONENT;if(n===ni)return i.DEPTH_STENCIL;if(n===Cl)return i.RED;if(n===qa)return i.RED_INTEGER;if(n===Di)return i.RG;if(n===Ya)return i.RG_INTEGER;if(n===$a)return i.RGBA_INTEGER;if(n===Vr||n===Gr||n===Hr||n===kr)if(a===Je)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Vr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===kr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Vr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===kr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ra||n===sa||n===aa||n===oa)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ra)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===sa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===aa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oa)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===la||n===ca||n===ha||n===ua||n===da||n===fa||n===pa)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===la||n===ca)return a===Je?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ha)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===ua)return s.COMPRESSED_R11_EAC;if(n===da)return s.COMPRESSED_SIGNED_R11_EAC;if(n===fa)return s.COMPRESSED_RG11_EAC;if(n===pa)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===ma||n===ga||n===_a||n===xa||n===va||n===Sa||n===Ma||n===Ea||n===ya||n===ba||n===Ta||n===Aa||n===wa||n===Ra)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===ma)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ga)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_a)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===xa)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===va)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sa)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ma)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ea)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ya)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ba)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ta)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ra)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ca||n===Pa||n===Da)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Ca)return a===Je?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Pa)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Da)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===La||n===Ia||n===Ua||n===Na)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===La)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ia)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ua)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Na)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===er?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const _m=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Wl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new xn({vertexShader:_m,fragmentShader:xm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new In(new ss(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Sm extends ai{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,f=null,m=null,_=null;const x=typeof XRWebGLBinding<"u",p=new vm,h={},b=t.getContextAttributes();let y=null,T=null;const A=[],w=[],C=new Fe;let F=null;const S=new jt;S.viewport=new dt;const M=new jt;M.viewport=new dt;const D=[S,M],V=new Rh;let B=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let j=A[q];return j===void 0&&(j=new Is,A[q]=j),j.getTargetRaySpace()},this.getControllerGrip=function(q){let j=A[q];return j===void 0&&(j=new Is,A[q]=j),j.getGripSpace()},this.getHand=function(q){let j=A[q];return j===void 0&&(j=new Is,A[q]=j),j.getHandSpace()};function Y(q){const j=w.indexOf(q.inputSource);if(j===-1)return;const pe=A[j];pe!==void 0&&(pe.update(q.inputSource,q.frame,l||a),pe.dispatchEvent({type:q.type,data:q.inputSource}))}function G(){r.removeEventListener("select",Y),r.removeEventListener("selectstart",Y),r.removeEventListener("selectend",Y),r.removeEventListener("squeeze",Y),r.removeEventListener("squeezestart",Y),r.removeEventListener("squeezeend",Y),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",k);for(let q=0;q<A.length;q++){const j=w[q];j!==null&&(w[q]=null,A[q].disconnect(j))}B=null,W=null,p.reset();for(const q in h)delete h[q];e.setRenderTarget(y),m=null,f=null,d=null,r=null,T=null,ot.stop(),n.isPresenting=!1,e.setPixelRatio(F),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&we("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&we("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(y=e.getRenderTarget(),r.addEventListener("select",Y),r.addEventListener("selectstart",Y),r.addEventListener("selectend",Y),r.addEventListener("squeeze",Y),r.addEventListener("squeezestart",Y),r.addEventListener("squeezeend",Y),r.addEventListener("end",G),r.addEventListener("inputsourceschange",k),b.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Pe=null,_e=null;b.depth&&(_e=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=b.stencil?ni:Dn,Pe=b.stencil?er:_n);const We={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(We),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),T=new mn(f.textureWidth,f.textureHeight,{format:on,type:Jt,depthTexture:new nr(f.textureWidth,f.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,pe),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),T=new mn(m.framebufferWidth,m.framebufferHeight,{format:on,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),ot.setContext(r),ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function k(q){for(let j=0;j<q.removed.length;j++){const pe=q.removed[j],Pe=w.indexOf(pe);Pe>=0&&(w[Pe]=null,A[Pe].disconnect(pe))}for(let j=0;j<q.added.length;j++){const pe=q.added[j];let Pe=w.indexOf(pe);if(Pe===-1){for(let We=0;We<A.length;We++)if(We>=w.length){w.push(pe),Pe=We;break}else if(w[We]===null){w[We]=pe,Pe=We;break}if(Pe===-1)break}const _e=A[Pe];_e&&_e.connect(pe)}}const Z=new U,he=new U;function ae(q,j,pe){Z.setFromMatrixPosition(j.matrixWorld),he.setFromMatrixPosition(pe.matrixWorld);const Pe=Z.distanceTo(he),_e=j.projectionMatrix.elements,We=pe.projectionMatrix.elements,vt=_e[14]/(_e[10]-1),Ge=_e[14]/(_e[10]+1),Ke=(_e[9]+1)/_e[5],nt=(_e[9]-1)/_e[5],Ue=(_e[8]-1)/_e[0],ft=(We[8]+1)/We[0],R=vt*Ue,pt=vt*ft,Ye=Pe/(-Ue+ft),rt=Ye*-Ue;if(j.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(rt),q.translateZ(Ye),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),_e[10]===-1)q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const ve=vt+Ye,E=Ge+Ye,g=R-rt,L=pt+(Pe-rt),X=Ke*Ge/E*ve,K=nt*Ge/E*ve;q.projectionMatrix.makePerspective(g,L,X,K,ve,E),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function ue(q,j){j===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(j.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let j=q.near,pe=q.far;p.texture!==null&&(p.depthNear>0&&(j=p.depthNear),p.depthFar>0&&(pe=p.depthFar)),V.near=M.near=S.near=j,V.far=M.far=S.far=pe,(B!==V.near||W!==V.far)&&(r.updateRenderState({depthNear:V.near,depthFar:V.far}),B=V.near,W=V.far),V.layers.mask=q.layers.mask|6,S.layers.mask=V.layers.mask&3,M.layers.mask=V.layers.mask&5;const Pe=q.parent,_e=V.cameras;ue(V,Pe);for(let We=0;We<_e.length;We++)ue(_e[We],Pe);_e.length===2?ae(V,S,M):V.projectionMatrix.copy(S.projectionMatrix),Oe(q,V,Pe)};function Oe(q,j,pe){pe===null?q.matrix.copy(j.matrixWorld):(q.matrix.copy(pe.matrixWorld),q.matrix.invert(),q.matrix.multiply(j.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Fa*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(q){c=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(V)},this.getCameraTexture=function(q){return h[q]};let Ie=null;function lt(q,j){if(u=j.getViewerPose(l||a),_=j,u!==null){const pe=u.views;m!==null&&(e.setRenderTargetFramebuffer(T,m.framebuffer),e.setRenderTarget(T));let Pe=!1;pe.length!==V.cameras.length&&(V.cameras.length=0,Pe=!0);for(let Ge=0;Ge<pe.length;Ge++){const Ke=pe[Ge];let nt=null;if(m!==null)nt=m.getViewport(Ke);else{const ft=d.getViewSubImage(f,Ke);nt=ft.viewport,Ge===0&&(e.setRenderTargetTextures(T,ft.colorTexture,ft.depthStencilTexture),e.setRenderTarget(T))}let Ue=D[Ge];Ue===void 0&&(Ue=new jt,Ue.layers.enable(Ge),Ue.viewport=new dt,D[Ge]=Ue),Ue.matrix.fromArray(Ke.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(Ke.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(nt.x,nt.y,nt.width,nt.height),Ge===0&&(V.matrix.copy(Ue.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Pe===!0&&V.cameras.push(Ue)}const _e=r.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const Ge=d.getDepthInformation(pe[0]);Ge&&Ge.isValid&&Ge.texture&&p.init(Ge,r.renderState)}if(_e&&_e.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Ge=0;Ge<pe.length;Ge++){const Ke=pe[Ge].camera;if(Ke){let nt=h[Ke];nt||(nt=new Wl,h[Ke]=nt);const Ue=d.getCameraImage(Ke);nt.sourceTexture=Ue}}}}for(let pe=0;pe<A.length;pe++){const Pe=w[pe],_e=A[pe];Pe!==null&&_e!==void 0&&_e.update(Pe,j,l||a)}Ie&&Ie(q,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),_=null}const ot=new ql;ot.setAnimationLoop(lt),this.setAnimationLoop=function(q){Ie=q},this.dispose=function(){}}}const Jn=new Ln,Mm=new ut;function Em(i,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function n(p,h){h.color.getRGB(p.fogColor.value,Ol(i)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function r(p,h,b,y,T){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(p,h):h.isMeshToonMaterial?(s(p,h),d(p,h)):h.isMeshPhongMaterial?(s(p,h),u(p,h)):h.isMeshStandardMaterial?(s(p,h),f(p,h),h.isMeshPhysicalMaterial&&m(p,h,T)):h.isMeshMatcapMaterial?(s(p,h),_(p,h)):h.isMeshDepthMaterial?s(p,h):h.isMeshDistanceMaterial?(s(p,h),x(p,h)):h.isMeshNormalMaterial?s(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?c(p,h,b,y):h.isSpriteMaterial?l(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===Bt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===Bt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const b=e.get(h),y=b.envMap,T=b.envMapRotation;y&&(p.envMap.value=y,Jn.copy(T),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),p.envMapRotation.value.setFromMatrix4(Mm.makeRotationFromEuler(Jn)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function c(p,h,b,y){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*b,p.scale.value=y*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function l(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function d(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,b){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Bt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,h){h.matcap&&(p.matcap.value=h.matcap)}function x(p,h){const b=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function ym(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,y){const T=y.program;n.uniformBlockBinding(b,T)}function l(b,y){let T=r[b.id];T===void 0&&(_(b),T=u(b),r[b.id]=T,b.addEventListener("dispose",p));const A=y.program;n.updateUBOMapping(b,A);const w=e.render.frame;s[b.id]!==w&&(f(b),s[b.id]=w)}function u(b){const y=d();b.__bindingPointIndex=y;const T=i.createBuffer(),A=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,T),T}function d(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){const y=r[b.id],T=b.uniforms,A=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let w=0,C=T.length;w<C;w++){const F=Array.isArray(T[w])?T[w]:[T[w]];for(let S=0,M=F.length;S<M;S++){const D=F[S];if(m(D,w,S,A)===!0){const V=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let W=0;for(let Y=0;Y<B.length;Y++){const G=B[Y],k=x(G);typeof G=="number"||typeof G=="boolean"?(D.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,V+W,D.__data)):G.isMatrix3?(D.__data[0]=G.elements[0],D.__data[1]=G.elements[1],D.__data[2]=G.elements[2],D.__data[3]=0,D.__data[4]=G.elements[3],D.__data[5]=G.elements[4],D.__data[6]=G.elements[5],D.__data[7]=0,D.__data[8]=G.elements[6],D.__data[9]=G.elements[7],D.__data[10]=G.elements[8],D.__data[11]=0):(G.toArray(D.__data,W),W+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,y,T,A){const w=b.value,C=y+"_"+T;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{const F=A[C];if(typeof w=="number"||typeof w=="boolean"){if(F!==w)return A[C]=w,!0}else if(F.equals(w)===!1)return F.copy(w),!0}return!1}function _(b){const y=b.uniforms;let T=0;const A=16;for(let C=0,F=y.length;C<F;C++){const S=Array.isArray(y[C])?y[C]:[y[C]];for(let M=0,D=S.length;M<D;M++){const V=S[M],B=Array.isArray(V.value)?V.value:[V.value];for(let W=0,Y=B.length;W<Y;W++){const G=B[W],k=x(G),Z=T%A,he=Z%k.boundary,ae=Z+he;T+=he,ae!==0&&A-ae<k.storage&&(T+=A-ae),V.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=T,T+=k.storage}}}const w=T%A;return w>0&&(T+=A-w),b.__size=T,b.__cache={},this}function x(b){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?we("WebGLRenderer: Texture samplers can not be part of an uniforms group."):we("WebGLRenderer: Unsupported uniform value type.",b),y}function p(b){const y=b.target;y.removeEventListener("dispose",p);const T=a.indexOf(y.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function h(){for(const b in r)i.deleteBuffer(r[b]);a=[],r={},s={}}return{bind:c,update:l,dispose:h}}const bm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let hn=null;function Tm(){return hn===null&&(hn=new _h(bm,16,16,Di,Pn),hn.name="DFG_LUT",hn.minFilter=At,hn.magFilter=At,hn.wrapS=An,hn.wrapT=An,hn.generateMipmaps=!1,hn.needsUpdate=!0),hn}class Am{constructor(e={}){const{canvas:t=kc(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:m=Jt}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;const x=m,p=new Set([$a,Ya,qa]),h=new Set([Jt,_n,Qi,er,Wa,Xa]),b=new Uint32Array(4),y=new Int32Array(4);let T=null,A=null;const w=[],C=[];let F=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let M=!1;this._outputColorSpace=Zt;let D=0,V=0,B=null,W=-1,Y=null;const G=new dt,k=new dt;let Z=null;const he=new $e(0);let ae=0,ue=t.width,Oe=t.height,Ie=1,lt=null,ot=null;const q=new dt(0,0,ue,Oe),j=new dt(0,0,ue,Oe);let pe=!1;const Pe=new Gl;let _e=!1,We=!1;const vt=new ut,Ge=new U,Ke=new dt,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ue=!1;function ft(){return B===null?Ie:1}let R=n;function pt(v,I){return t.getContext(v,I)}try{const v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ha}`),t.addEventListener("webglcontextlost",Re,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",Ze,!1),R===null){const I="webgl2";if(R=pt(I,v),R===null)throw pt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw qe("WebGLRenderer: "+v.message),v}let Ye,rt,ve,E,g,L,X,K,H,Me,ne,xe,Ae,Q,re,ge,Se,ie,Ne,P,ce,ee,de,J;function $(){Ye=new Tf(R),Ye.init(),ee=new gm(R,Ye),rt=new gf(R,Ye,e,ee),ve=new pm(R,Ye),rt.reversedDepthBuffer&&f&&ve.buffers.depth.setReversed(!0),E=new Rf(R),g=new Qp,L=new mm(R,Ye,ve,g,rt,ee,E),X=new xf(S),K=new bf(S),H=new Dh(R),de=new pf(R,H),Me=new Af(R,H,E,de),ne=new Pf(R,Me,H,E),Ne=new Cf(R,rt,L),ge=new _f(g),xe=new Jp(S,X,K,Ye,rt,de,ge),Ae=new Em(S,g),Q=new tm,re=new om(Ye),ie=new ff(S,X,K,ve,ne,_,c),Se=new dm(S,ne,rt),J=new ym(R,E,rt,ve),P=new mf(R,Ye,E),ce=new wf(R,Ye,E),E.programs=xe.programs,S.capabilities=rt,S.extensions=Ye,S.properties=g,S.renderLists=Q,S.shadowMap=Se,S.state=ve,S.info=E}$(),x!==Jt&&(F=new Lf(x,t.width,t.height,r,s));const te=new Sm(S,R);this.xr=te,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const v=Ye.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ye.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return Ie},this.setPixelRatio=function(v){v!==void 0&&(Ie=v,this.setSize(ue,Oe,!1))},this.getSize=function(v){return v.set(ue,Oe)},this.setSize=function(v,I,z=!0){if(te.isPresenting){we("WebGLRenderer: Can't change size while VR device is presenting.");return}ue=v,Oe=I,t.width=Math.floor(v*Ie),t.height=Math.floor(I*Ie),z===!0&&(t.style.width=v+"px",t.style.height=I+"px"),F!==null&&F.setSize(t.width,t.height),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(ue*Ie,Oe*Ie).floor()},this.setDrawingBufferSize=function(v,I,z){ue=v,Oe=I,Ie=z,t.width=Math.floor(v*z),t.height=Math.floor(I*z),this.setViewport(0,0,v,I)},this.setEffects=function(v){if(x===Jt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let I=0;I<v.length;I++)if(v[I].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}F.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(G)},this.getViewport=function(v){return v.copy(q)},this.setViewport=function(v,I,z,O){v.isVector4?q.set(v.x,v.y,v.z,v.w):q.set(v,I,z,O),ve.viewport(G.copy(q).multiplyScalar(Ie).round())},this.getScissor=function(v){return v.copy(j)},this.setScissor=function(v,I,z,O){v.isVector4?j.set(v.x,v.y,v.z,v.w):j.set(v,I,z,O),ve.scissor(k.copy(j).multiplyScalar(Ie).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(v){ve.setScissorTest(pe=v)},this.setOpaqueSort=function(v){lt=v},this.setTransparentSort=function(v){ot=v},this.getClearColor=function(v){return v.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,z=!0){let O=0;if(v){let N=!1;if(B!==null){const se=B.texture.format;N=p.has(se)}if(N){const se=B.texture.type,fe=h.has(se),le=ie.getClearColor(),me=ie.getClearAlpha(),Ee=le.r,Te=le.g,ye=le.b;fe?(b[0]=Ee,b[1]=Te,b[2]=ye,b[3]=me,R.clearBufferuiv(R.COLOR,0,b)):(y[0]=Ee,y[1]=Te,y[2]=ye,y[3]=me,R.clearBufferiv(R.COLOR,0,y))}else O|=R.COLOR_BUFFER_BIT}I&&(O|=R.DEPTH_BUFFER_BIT),z&&(O|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Re,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Ze,!1),ie.dispose(),Q.dispose(),re.dispose(),g.dispose(),X.dispose(),K.dispose(),ne.dispose(),de.dispose(),J.dispose(),xe.dispose(),te.dispose(),te.removeEventListener("sessionstart",eo),te.removeEventListener("sessionend",to),Xn.stop()};function Re(v){v.preventDefault(),mo("WebGLRenderer: Context Lost."),M=!0}function st(){mo("WebGLRenderer: Context Restored."),M=!1;const v=E.autoReset,I=Se.enabled,z=Se.autoUpdate,O=Se.needsUpdate,N=Se.type;$(),E.autoReset=v,Se.enabled=I,Se.autoUpdate=z,Se.needsUpdate=O,Se.type=N}function Ze(v){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function cn(v){const I=v.target;I.removeEventListener("dispose",cn),vn(I)}function vn(v){nc(v),g.remove(v)}function nc(v){const I=g.get(v).programs;I!==void 0&&(I.forEach(function(z){xe.releaseProgram(z)}),v.isShaderMaterial&&xe.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,z,O,N,se){I===null&&(I=nt);const fe=N.isMesh&&N.matrixWorld.determinant()<0,le=rc(v,I,z,O,N);ve.setMaterial(O,fe);let me=z.index,Ee=1;if(O.wireframe===!0){if(me=Me.getWireframeAttribute(z),me===void 0)return;Ee=2}const Te=z.drawRange,ye=z.attributes.position;let Be=Te.start*Ee,et=(Te.start+Te.count)*Ee;se!==null&&(Be=Math.max(Be,se.start*Ee),et=Math.min(et,(se.start+se.count)*Ee)),me!==null?(Be=Math.max(Be,0),et=Math.min(et,me.count)):ye!=null&&(Be=Math.max(Be,0),et=Math.min(et,ye.count));const ct=et-Be;if(ct<0||ct===1/0)return;de.setup(N,O,le,z,me);let ht,it=P;if(me!==null&&(ht=H.get(me),it=ce,it.setIndex(ht)),N.isMesh)O.wireframe===!0?(ve.setLineWidth(O.wireframeLinewidth*ft()),it.setMode(R.LINES)):it.setMode(R.TRIANGLES);else if(N.isLine){let be=O.linewidth;be===void 0&&(be=1),ve.setLineWidth(be*ft()),N.isLineSegments?it.setMode(R.LINES):N.isLineLoop?it.setMode(R.LINE_LOOP):it.setMode(R.LINE_STRIP)}else N.isPoints?it.setMode(R.POINTS):N.isSprite&&it.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)tr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),it.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))it.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const be=N._multiDrawStarts,je=N._multiDrawCounts,Xe=N._multiDrawCount,Gt=me?H.get(me).bytesPerElement:1,li=g.get(O).currentProgram.getUniforms();for(let Ht=0;Ht<Xe;Ht++)li.setValue(R,"_gl_DrawID",Ht),it.render(be[Ht]/Gt,je[Ht])}else if(N.isInstancedMesh)it.renderInstances(Be,ct,N.count);else if(z.isInstancedBufferGeometry){const be=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,je=Math.min(z.instanceCount,be);it.renderInstances(Be,ct,je)}else it.render(Be,ct)};function Qa(v,I,z){v.transparent===!0&&v.side===Tn&&v.forceSinglePass===!1?(v.side=Bt,v.needsUpdate=!0,or(v,I,z),v.side=kn,v.needsUpdate=!0,or(v,I,z),v.side=Tn):or(v,I,z)}this.compile=function(v,I,z=null){z===null&&(z=v),A=re.get(z),A.init(I),C.push(A),z.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(A.pushLight(N),N.castShadow&&A.pushShadow(N))}),v!==z&&v.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(A.pushLight(N),N.castShadow&&A.pushShadow(N))}),A.setupLights();const O=new Set;return v.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const se=N.material;if(se)if(Array.isArray(se))for(let fe=0;fe<se.length;fe++){const le=se[fe];Qa(le,z,N),O.add(le)}else Qa(se,z,N),O.add(se)}),A=C.pop(),O},this.compileAsync=function(v,I,z=null){const O=this.compile(v,I,z);return new Promise(N=>{function se(){if(O.forEach(function(fe){g.get(fe).currentProgram.isReady()&&O.delete(fe)}),O.size===0){N(v);return}setTimeout(se,10)}Ye.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let ls=null;function ic(v){ls&&ls(v)}function eo(){Xn.stop()}function to(){Xn.start()}const Xn=new ql;Xn.setAnimationLoop(ic),typeof self<"u"&&Xn.setContext(self),this.setAnimationLoop=function(v){ls=v,te.setAnimationLoop(v),v===null?Xn.stop():Xn.start()},te.addEventListener("sessionstart",eo),te.addEventListener("sessionend",to),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;const z=te.enabled===!0&&te.isPresenting===!0,O=F!==null&&(B===null||z)&&F.begin(S,B);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(te.cameraAutoUpdate===!0&&te.updateCamera(I),I=te.getCamera()),v.isScene===!0&&v.onBeforeRender(S,v,I,B),A=re.get(v,C.length),A.init(I),C.push(A),vt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Pe.setFromProjectionMatrix(vt,fn,I.reversedDepth),We=this.localClippingEnabled,_e=ge.init(this.clippingPlanes,We),T=Q.get(v,w.length),T.init(),w.push(T),te.enabled===!0&&te.isPresenting===!0){const fe=S.xr.getDepthSensingMesh();fe!==null&&cs(fe,I,-1/0,S.sortObjects)}cs(v,I,0,S.sortObjects),T.finish(),S.sortObjects===!0&&T.sort(lt,ot),Ue=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ue&&ie.addToRenderList(T,v),this.info.render.frame++,_e===!0&&ge.beginShadows();const N=A.state.shadowsArray;if(Se.render(N,v,I),_e===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(O&&F.hasRenderPass())===!1){const fe=T.opaque,le=T.transmissive;if(A.setupLights(),I.isArrayCamera){const me=I.cameras;if(le.length>0)for(let Ee=0,Te=me.length;Ee<Te;Ee++){const ye=me[Ee];io(fe,le,v,ye)}Ue&&ie.render(v);for(let Ee=0,Te=me.length;Ee<Te;Ee++){const ye=me[Ee];no(T,v,ye,ye.viewport)}}else le.length>0&&io(fe,le,v,I),Ue&&ie.render(v),no(T,v,I)}B!==null&&V===0&&(L.updateMultisampleRenderTarget(B),L.updateRenderTargetMipmap(B)),O&&F.end(S),v.isScene===!0&&v.onAfterRender(S,v,I),de.resetDefaultState(),W=-1,Y=null,C.pop(),C.length>0?(A=C[C.length-1],_e===!0&&ge.setGlobalState(S.clippingPlanes,A.state.camera)):A=null,w.pop(),w.length>0?T=w[w.length-1]:T=null};function cs(v,I,z,O){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)z=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)A.pushLight(v),v.castShadow&&A.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Pe.intersectsSprite(v)){O&&Ke.setFromMatrixPosition(v.matrixWorld).applyMatrix4(vt);const fe=ne.update(v),le=v.material;le.visible&&T.push(v,fe,le,z,Ke.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Pe.intersectsObject(v))){const fe=ne.update(v),le=v.material;if(O&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Ke.copy(v.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ke.copy(fe.boundingSphere.center)),Ke.applyMatrix4(v.matrixWorld).applyMatrix4(vt)),Array.isArray(le)){const me=fe.groups;for(let Ee=0,Te=me.length;Ee<Te;Ee++){const ye=me[Ee],Be=le[ye.materialIndex];Be&&Be.visible&&T.push(v,fe,Be,z,Ke.z,ye)}}else le.visible&&T.push(v,fe,le,z,Ke.z,null)}}const se=v.children;for(let fe=0,le=se.length;fe<le;fe++)cs(se[fe],I,z,O)}function no(v,I,z,O){const{opaque:N,transmissive:se,transparent:fe}=v;A.setupLightsView(z),_e===!0&&ge.setGlobalState(S.clippingPlanes,z),O&&ve.viewport(G.copy(O)),N.length>0&&ar(N,I,z),se.length>0&&ar(se,I,z),fe.length>0&&ar(fe,I,z),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function io(v,I,z,O){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[O.id]===void 0){const Be=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[O.id]=new mn(1,1,{generateMipmaps:!0,type:Be?Pn:Jt,minFilter:ti,samples:rt.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace})}const se=A.state.transmissionRenderTarget[O.id],fe=O.viewport||G;se.setSize(fe.z*S.transmissionResolutionScale,fe.w*S.transmissionResolutionScale);const le=S.getRenderTarget(),me=S.getActiveCubeFace(),Ee=S.getActiveMipmapLevel();S.setRenderTarget(se),S.getClearColor(he),ae=S.getClearAlpha(),ae<1&&S.setClearColor(16777215,.5),S.clear(),Ue&&ie.render(z);const Te=S.toneMapping;S.toneMapping=pn;const ye=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),A.setupLightsView(O),_e===!0&&ge.setGlobalState(S.clippingPlanes,O),ar(v,z,O),L.updateMultisampleRenderTarget(se),L.updateRenderTargetMipmap(se),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let et=0,ct=I.length;et<ct;et++){const ht=I[et],{object:it,geometry:be,material:je,group:Xe}=ht;if(je.side===Tn&&it.layers.test(O.layers)){const Gt=je.side;je.side=Bt,je.needsUpdate=!0,ro(it,z,O,be,je,Xe),je.side=Gt,je.needsUpdate=!0,Be=!0}}Be===!0&&(L.updateMultisampleRenderTarget(se),L.updateRenderTargetMipmap(se))}S.setRenderTarget(le,me,Ee),S.setClearColor(he,ae),ye!==void 0&&(O.viewport=ye),S.toneMapping=Te}function ar(v,I,z){const O=I.isScene===!0?I.overrideMaterial:null;for(let N=0,se=v.length;N<se;N++){const fe=v[N],{object:le,geometry:me,group:Ee}=fe;let Te=fe.material;Te.allowOverride===!0&&O!==null&&(Te=O),le.layers.test(z.layers)&&ro(le,I,z,me,Te,Ee)}}function ro(v,I,z,O,N,se){v.onBeforeRender(S,I,z,O,N,se),v.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),N.onBeforeRender(S,I,z,O,v,se),N.transparent===!0&&N.side===Tn&&N.forceSinglePass===!1?(N.side=Bt,N.needsUpdate=!0,S.renderBufferDirect(z,I,O,N,v,se),N.side=kn,N.needsUpdate=!0,S.renderBufferDirect(z,I,O,N,v,se),N.side=Tn):S.renderBufferDirect(z,I,O,N,v,se),v.onAfterRender(S,I,z,O,N,se)}function or(v,I,z){I.isScene!==!0&&(I=nt);const O=g.get(v),N=A.state.lights,se=A.state.shadowsArray,fe=N.state.version,le=xe.getParameters(v,N.state,se,I,z),me=xe.getProgramCacheKey(le);let Ee=O.programs;O.environment=v.isMeshStandardMaterial?I.environment:null,O.fog=I.fog,O.envMap=(v.isMeshStandardMaterial?K:X).get(v.envMap||O.environment),O.envMapRotation=O.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,Ee===void 0&&(v.addEventListener("dispose",cn),Ee=new Map,O.programs=Ee);let Te=Ee.get(me);if(Te!==void 0){if(O.currentProgram===Te&&O.lightsStateVersion===fe)return ao(v,le),Te}else le.uniforms=xe.getUniforms(v),v.onBeforeCompile(le,S),Te=xe.acquireProgram(le,me),Ee.set(me,Te),O.uniforms=le.uniforms;const ye=O.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(ye.clippingPlanes=ge.uniform),ao(v,le),O.needsLights=ac(v),O.lightsStateVersion=fe,O.needsLights&&(ye.ambientLightColor.value=N.state.ambient,ye.lightProbe.value=N.state.probe,ye.directionalLights.value=N.state.directional,ye.directionalLightShadows.value=N.state.directionalShadow,ye.spotLights.value=N.state.spot,ye.spotLightShadows.value=N.state.spotShadow,ye.rectAreaLights.value=N.state.rectArea,ye.ltc_1.value=N.state.rectAreaLTC1,ye.ltc_2.value=N.state.rectAreaLTC2,ye.pointLights.value=N.state.point,ye.pointLightShadows.value=N.state.pointShadow,ye.hemisphereLights.value=N.state.hemi,ye.directionalShadowMap.value=N.state.directionalShadowMap,ye.directionalShadowMatrix.value=N.state.directionalShadowMatrix,ye.spotShadowMap.value=N.state.spotShadowMap,ye.spotLightMatrix.value=N.state.spotLightMatrix,ye.spotLightMap.value=N.state.spotLightMap,ye.pointShadowMap.value=N.state.pointShadowMap,ye.pointShadowMatrix.value=N.state.pointShadowMatrix),O.currentProgram=Te,O.uniformsList=null,Te}function so(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=Wr.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function ao(v,I){const z=g.get(v);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function rc(v,I,z,O,N){I.isScene!==!0&&(I=nt),L.resetTextureUnits();const se=I.fog,fe=O.isMeshStandardMaterial?I.environment:null,le=B===null?S.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:Li,me=(O.isMeshStandardMaterial?K:X).get(O.envMap||fe),Ee=O.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Te=!!z.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),ye=!!z.morphAttributes.position,Be=!!z.morphAttributes.normal,et=!!z.morphAttributes.color;let ct=pn;O.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(ct=S.toneMapping);const ht=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,it=ht!==void 0?ht.length:0,be=g.get(O),je=A.state.lights;if(_e===!0&&(We===!0||v!==Y)){const Rt=v===Y&&O.id===W;ge.setState(O,v,Rt)}let Xe=!1;O.version===be.__version?(be.needsLights&&be.lightsStateVersion!==je.state.version||be.outputColorSpace!==le||N.isBatchedMesh&&be.batching===!1||!N.isBatchedMesh&&be.batching===!0||N.isBatchedMesh&&be.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&be.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&be.instancing===!1||!N.isInstancedMesh&&be.instancing===!0||N.isSkinnedMesh&&be.skinning===!1||!N.isSkinnedMesh&&be.skinning===!0||N.isInstancedMesh&&be.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&be.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&be.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&be.instancingMorph===!1&&N.morphTexture!==null||be.envMap!==me||O.fog===!0&&be.fog!==se||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==ge.numPlanes||be.numIntersection!==ge.numIntersection)||be.vertexAlphas!==Ee||be.vertexTangents!==Te||be.morphTargets!==ye||be.morphNormals!==Be||be.morphColors!==et||be.toneMapping!==ct||be.morphTargetsCount!==it)&&(Xe=!0):(Xe=!0,be.__version=O.version);let Gt=be.currentProgram;Xe===!0&&(Gt=or(O,I,N));let li=!1,Ht=!1,zi=!1;const at=Gt.getUniforms(),It=be.uniforms;if(ve.useProgram(Gt.program)&&(li=!0,Ht=!0,zi=!0),O.id!==W&&(W=O.id,Ht=!0),li||Y!==v){ve.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),at.setValue(R,"projectionMatrix",v.projectionMatrix),at.setValue(R,"viewMatrix",v.matrixWorldInverse);const Ut=at.map.cameraPosition;Ut!==void 0&&Ut.setValue(R,Ge.setFromMatrixPosition(v.matrixWorld)),rt.logarithmicDepthBuffer&&at.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&at.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),Y!==v&&(Y=v,Ht=!0,zi=!0)}if(be.needsLights&&(je.state.directionalShadowMap.length>0&&at.setValue(R,"directionalShadowMap",je.state.directionalShadowMap,L),je.state.spotShadowMap.length>0&&at.setValue(R,"spotShadowMap",je.state.spotShadowMap,L),je.state.pointShadowMap.length>0&&at.setValue(R,"pointShadowMap",je.state.pointShadowMap,L)),N.isSkinnedMesh){at.setOptional(R,N,"bindMatrix"),at.setOptional(R,N,"bindMatrixInverse");const Rt=N.skeleton;Rt&&(Rt.boneTexture===null&&Rt.computeBoneTexture(),at.setValue(R,"boneTexture",Rt.boneTexture,L))}N.isBatchedMesh&&(at.setOptional(R,N,"batchingTexture"),at.setValue(R,"batchingTexture",N._matricesTexture,L),at.setOptional(R,N,"batchingIdTexture"),at.setValue(R,"batchingIdTexture",N._indirectTexture,L),at.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&at.setValue(R,"batchingColorTexture",N._colorsTexture,L));const $t=z.morphAttributes;if(($t.position!==void 0||$t.normal!==void 0||$t.color!==void 0)&&Ne.update(N,z,Gt),(Ht||be.receiveShadow!==N.receiveShadow)&&(be.receiveShadow=N.receiveShadow,at.setValue(R,"receiveShadow",N.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(It.envMap.value=me,It.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),O.isMeshStandardMaterial&&O.envMap===null&&I.environment!==null&&(It.envMapIntensity.value=I.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=Tm()),Ht&&(at.setValue(R,"toneMappingExposure",S.toneMappingExposure),be.needsLights&&sc(It,zi),se&&O.fog===!0&&Ae.refreshFogUniforms(It,se),Ae.refreshMaterialUniforms(It,O,Ie,Oe,A.state.transmissionRenderTarget[v.id]),Wr.upload(R,so(be),It,L)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Wr.upload(R,so(be),It,L),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&at.setValue(R,"center",N.center),at.setValue(R,"modelViewMatrix",N.modelViewMatrix),at.setValue(R,"normalMatrix",N.normalMatrix),at.setValue(R,"modelMatrix",N.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const Rt=O.uniformsGroups;for(let Ut=0,hs=Rt.length;Ut<hs;Ut++){const qn=Rt[Ut];J.update(qn,Gt),J.bind(qn,Gt)}}return Gt}function sc(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function ac(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(v,I,z){const O=g.get(v);O.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1&&(O.__useRenderToTexture=!1),g.get(v.texture).__webglTexture=I,g.get(v.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:z,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const z=g.get(v);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0};const oc=R.createFramebuffer();this.setRenderTarget=function(v,I=0,z=0){B=v,D=I,V=z;let O=null,N=!1,se=!1;if(v){const le=g.get(v);if(le.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(R.FRAMEBUFFER,le.__webglFramebuffer),G.copy(v.viewport),k.copy(v.scissor),Z=v.scissorTest,ve.viewport(G),ve.scissor(k),ve.setScissorTest(Z),W=-1;return}else if(le.__webglFramebuffer===void 0)L.setupRenderTarget(v);else if(le.__hasExternalTextures)L.rebindTextures(v,g.get(v.texture).__webglTexture,g.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Te=v.depthTexture;if(le.__boundDepthTexture!==Te){if(Te!==null&&g.has(Te)&&(v.width!==Te.image.width||v.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(v)}}const me=v.texture;(me.isData3DTexture||me.isDataArrayTexture||me.isCompressedArrayTexture)&&(se=!0);const Ee=g.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ee[I])?O=Ee[I][z]:O=Ee[I],N=!0):v.samples>0&&L.useMultisampledRTT(v)===!1?O=g.get(v).__webglMultisampledFramebuffer:Array.isArray(Ee)?O=Ee[z]:O=Ee,G.copy(v.viewport),k.copy(v.scissor),Z=v.scissorTest}else G.copy(q).multiplyScalar(Ie).floor(),k.copy(j).multiplyScalar(Ie).floor(),Z=pe;if(z!==0&&(O=oc),ve.bindFramebuffer(R.FRAMEBUFFER,O)&&ve.drawBuffers(v,O),ve.viewport(G),ve.scissor(k),ve.setScissorTest(Z),N){const le=g.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,le.__webglTexture,z)}else if(se){const le=I;for(let me=0;me<v.textures.length;me++){const Ee=g.get(v.textures[me]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+me,Ee.__webglTexture,z,le)}}else if(v!==null&&z!==0){const le=g.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,le.__webglTexture,z)}W=-1},this.readRenderTargetPixels=function(v,I,z,O,N,se,fe,le=0){if(!(v&&v.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=g.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&fe!==void 0&&(me=me[fe]),me){ve.bindFramebuffer(R.FRAMEBUFFER,me);try{const Ee=v.textures[le],Te=Ee.format,ye=Ee.type;if(!rt.textureFormatReadable(Te)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(ye)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-O&&z>=0&&z<=v.height-N&&(v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+le),R.readPixels(I,z,O,N,ee.convert(Te),ee.convert(ye),se))}finally{const Ee=B!==null?g.get(B).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(v,I,z,O,N,se,fe,le=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=g.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&fe!==void 0&&(me=me[fe]),me)if(I>=0&&I<=v.width-O&&z>=0&&z<=v.height-N){ve.bindFramebuffer(R.FRAMEBUFFER,me);const Ee=v.textures[le],Te=Ee.format,ye=Ee.type;if(!rt.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Be=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Be),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+le),R.readPixels(I,z,O,N,ee.convert(Te),ee.convert(ye),0);const et=B!==null?g.get(B).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,et);const ct=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Wc(R,ct,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Be),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(Be),R.deleteSync(ct),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,z=0){const O=Math.pow(2,-z),N=Math.floor(v.image.width*O),se=Math.floor(v.image.height*O),fe=I!==null?I.x:0,le=I!==null?I.y:0;L.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,z,0,0,fe,le,N,se),ve.unbindTexture()};const lc=R.createFramebuffer(),cc=R.createFramebuffer();this.copyTextureToTexture=function(v,I,z=null,O=null,N=0,se=null){se===null&&(N!==0?(tr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=N,N=0):se=0);let fe,le,me,Ee,Te,ye,Be,et,ct;const ht=v.isCompressedTexture?v.mipmaps[se]:v.image;if(z!==null)fe=z.max.x-z.min.x,le=z.max.y-z.min.y,me=z.isBox3?z.max.z-z.min.z:1,Ee=z.min.x,Te=z.min.y,ye=z.isBox3?z.min.z:0;else{const $t=Math.pow(2,-N);fe=Math.floor(ht.width*$t),le=Math.floor(ht.height*$t),v.isDataArrayTexture?me=ht.depth:v.isData3DTexture?me=Math.floor(ht.depth*$t):me=1,Ee=0,Te=0,ye=0}O!==null?(Be=O.x,et=O.y,ct=O.z):(Be=0,et=0,ct=0);const it=ee.convert(I.format),be=ee.convert(I.type);let je;I.isData3DTexture?(L.setTexture3D(I,0),je=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(L.setTexture2DArray(I,0),je=R.TEXTURE_2D_ARRAY):(L.setTexture2D(I,0),je=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const Xe=R.getParameter(R.UNPACK_ROW_LENGTH),Gt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),li=R.getParameter(R.UNPACK_SKIP_PIXELS),Ht=R.getParameter(R.UNPACK_SKIP_ROWS),zi=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ht.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ht.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ee),R.pixelStorei(R.UNPACK_SKIP_ROWS,Te),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ye);const at=v.isDataArrayTexture||v.isData3DTexture,It=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const $t=g.get(v),Rt=g.get(I),Ut=g.get($t.__renderTarget),hs=g.get(Rt.__renderTarget);ve.bindFramebuffer(R.READ_FRAMEBUFFER,Ut.__webglFramebuffer),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,hs.__webglFramebuffer);for(let qn=0;qn<me;qn++)at&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,g.get(v).__webglTexture,N,ye+qn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,g.get(I).__webglTexture,se,ct+qn)),R.blitFramebuffer(Ee,Te,fe,le,Be,et,fe,le,R.DEPTH_BUFFER_BIT,R.NEAREST);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||v.isRenderTargetTexture||g.has(v)){const $t=g.get(v),Rt=g.get(I);ve.bindFramebuffer(R.READ_FRAMEBUFFER,lc),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,cc);for(let Ut=0;Ut<me;Ut++)at?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,$t.__webglTexture,N,ye+Ut):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,$t.__webglTexture,N),It?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Rt.__webglTexture,se,ct+Ut):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Rt.__webglTexture,se),N!==0?R.blitFramebuffer(Ee,Te,fe,le,Be,et,fe,le,R.COLOR_BUFFER_BIT,R.NEAREST):It?R.copyTexSubImage3D(je,se,Be,et,ct+Ut,Ee,Te,fe,le):R.copyTexSubImage2D(je,se,Be,et,Ee,Te,fe,le);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else It?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(je,se,Be,et,ct,fe,le,me,it,be,ht.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(je,se,Be,et,ct,fe,le,me,it,ht.data):R.texSubImage3D(je,se,Be,et,ct,fe,le,me,it,be,ht):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,se,Be,et,fe,le,it,be,ht.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,se,Be,et,ht.width,ht.height,it,ht.data):R.texSubImage2D(R.TEXTURE_2D,se,Be,et,fe,le,it,be,ht);R.pixelStorei(R.UNPACK_ROW_LENGTH,Xe),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Gt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,li),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ht),R.pixelStorei(R.UNPACK_SKIP_IMAGES,zi),se===0&&I.generateMipmaps&&R.generateMipmap(je),ve.unbindTexture()},this.initRenderTarget=function(v){g.get(v).__webglFramebuffer===void 0&&L.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?L.setTextureCube(v,0):v.isData3DTexture?L.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?L.setTexture2DArray(v,0):L.setTexture2D(v,0),ve.unbindTexture()},this.resetState=function(){D=0,V=0,B=null,ve.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}const cl={type:"change"},Ja={type:"start"},jl={type:"end"},Fr=new rs,hl=new Vn,wm=Math.cos(70*qc.DEG2RAD),gt=new U,Ft=2*Math.PI,tt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ks=1e-6;class Rm extends Ch{constructor(e,t=null){super(e,t),this.state=tt.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ai.ROTATE,MIDDLE:Ai.DOLLY,RIGHT:Ai.PAN},this.touches={ONE:yi.ROTATE,TWO:yi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new si,this._lastTargetPosition=new U,this._quat=new si().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Bo,this._sphericalDelta=new Bo,this._scale=1,this._panOffset=new U,this._rotateStart=new Fe,this._rotateEnd=new Fe,this._rotateDelta=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._panDelta=new Fe,this._dollyStart=new Fe,this._dollyEnd=new Fe,this._dollyDelta=new Fe,this._dollyDirection=new U,this._mouse=new Fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Pm.bind(this),this._onPointerDown=Cm.bind(this),this._onPointerUp=Dm.bind(this),this._onContextMenu=Bm.bind(this),this._onMouseWheel=Um.bind(this),this._onKeyDown=Nm.bind(this),this._onTouchStart=Fm.bind(this),this._onTouchMove=Om.bind(this),this._onMouseDown=Lm.bind(this),this._onMouseMove=Im.bind(this),this._interceptControlDown=zm.bind(this),this._interceptControlUp=Vm.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(cl),this.update(),this.state=tt.NONE}update(e=null){const t=this.object.position;gt.copy(t).sub(this.target),gt.applyQuaternion(this._quat),this._spherical.setFromVector3(gt),this.autoRotate&&this.state===tt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Ft:n>Math.PI&&(n-=Ft),r<-Math.PI?r+=Ft:r>Math.PI&&(r-=Ft),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(gt.setFromSpherical(this._spherical),gt.applyQuaternion(this._quatInverse),t.copy(this.target).add(gt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=gt.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=gt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Fr.origin.copy(this.object.position),Fr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Fr.direction))<wm?this.object.lookAt(this.target):(hl.setFromNormalAndCoplanarPoint(this.object.up,this.target),Fr.intersectPlane(hl,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>ks||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ks||this._lastTargetPosition.distanceToSquared(this.target)>ks?(this.dispatchEvent(cl),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ft/60*this.autoRotateSpeed*e:Ft/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){gt.setFromMatrixColumn(t,0),gt.multiplyScalar(-e),this._panOffset.add(gt)}_panUp(e,t){this.screenSpacePanning===!0?gt.setFromMatrixColumn(t,1):(gt.setFromMatrixColumn(t,0),gt.crossVectors(this.object.up,gt)),gt.multiplyScalar(e),this._panOffset.add(gt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;gt.copy(r).sub(this.target);let s=gt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ft*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ft*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ft*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ft*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ft*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ft*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ft*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ft*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Cm(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Pm(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Dm(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(jl),this.state=tt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Lm(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ai.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=tt.DOLLY;break;case Ai.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=tt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=tt.ROTATE}break;case Ai.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=tt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=tt.PAN}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Ja)}function Im(i){switch(this.state){case tt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case tt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Um(i){this.enabled===!1||this.enableZoom===!1||this.state!==tt.NONE||(i.preventDefault(),this.dispatchEvent(Ja),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(jl))}function Nm(i){this.enabled!==!1&&this._handleKeyDown(i)}function Fm(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case yi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=tt.TOUCH_ROTATE;break;case yi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=tt.TOUCH_PAN;break;default:this.state=tt.NONE}break;case 2:switch(this.touches.TWO){case yi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=tt.TOUCH_DOLLY_PAN;break;case yi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=tt.TOUCH_DOLLY_ROTATE;break;default:this.state=tt.NONE}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Ja)}function Om(i){switch(this._trackPointer(i),this.state){case tt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case tt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case tt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case tt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=tt.NONE}}function Bm(i){this.enabled!==!1&&i.preventDefault()}function zm(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Vm(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class Gm{static async parse(e){const t=new DataView(e);let n=0;if(String.fromCharCode(...new Uint8Array(e,0,4))!=="FLWA")throw new Error("Invalid FLWA file");n+=4,t.getUint16(n,!0),n+=2,t.getUint16(n,!0),n+=2;const s=t.getUint32(n,!0);n+=4;const a=t.getUint32(n,!0);n+=4;const o=t.getUint32(n,!0);n+=4;const c=t.getUint32(n,!0);n+=4;const l=t.getUint32(n,!0);n+=4,t.getUint32(n,!0),n+=4;const u=l,d=t.getFloat32(n,!0);n+=4,n+=16;const f=u*16,m=e.byteLength-f,_=[];let x=m;for(let b=0;b<u;b++){const y=new DataView(e,x),T=Number(y.getBigUint64(0,!0)),A=Number(y.getBigUint64(8,!0));_.push({offset:T,size:A}),x+=16}const p=s*a*o,h=[];for(let b=0;b<u;b++){const{offset:y}=_[b],T=new Float32Array(e,y,p*c);h.push(new Float32Array(T.slice(0,p)))}return{width:s,height:a,depth:o,channels:c,frameCount:u,dt:d,frames:h}}}const ul={sphere3d:{config:{width:64,height:64,depth:64,channels:1,dt:.2,kernel_radius:10,kernels:[{radius:1,rings:[{amplitude:1,distance:.5,width:.15}],weight:1,mu:.15,sigma:.015,source_channel:0,target_channel:0}],flow:{beta_a:1,n:2,distribution_size:1}},seed:{pattern:{type:"GaussianSphere",center:[.5,.5,.5],radius:.15,amplitude:1,channel:0}}},torus3d:{config:{width:64,height:64,depth:64,channels:1,dt:.15,kernel_radius:12,kernels:[{radius:1,rings:[{amplitude:1,distance:.5,width:.12}],weight:1,mu:.14,sigma:.014,source_channel:0,target_channel:0}],flow:{beta_a:1.2,n:2,distribution_size:1}},seed:{pattern:{type:"Torus3D",center:[.5,.5,.5],major_radius:.25,minor_radius:.08,amplitude:1,channel:0}}}};let $i=null;async function Jl(){if($i)return $i;try{return $i=await import("../pkg/flow_lenia.js"),await $i.default(),$i}catch(i){throw console.error("Failed to load WASM module:",i),new Error(`WASM load failed: ${i.message}`)}}async function Hm(){if(typeof navigator>"u"||!("gpu"in navigator))return!1;try{return await navigator.gpu.requestAdapter()!==null}catch{return!1}}const sn=[[.267,.004,.329],[.282,.141,.458],[.253,.265,.529],[.206,.371,.553],[.163,.471,.558],[.128,.566,.55],[.134,.658,.518],[.266,.749,.44],[.477,.821,.318],[.741,.873,.15],[.993,.906,.144]];function km(i){i=Math.max(0,Math.min(1,i));const e=i*(sn.length-1),t=Math.floor(e),n=Math.min(t+1,sn.length-1),r=e-t;return[sn[t][0]+r*(sn[n][0]-sn[t][0]),sn[t][1]+r*(sn[n][1]-sn[t][1]),sn[t][2]+r*(sn[n][2]-sn[t][2])]}let Ve=null,Yt=0,bi=!1,Ot=null,Wn=null,Qe=null,wn=!1,ln="cpu",jr=1,Ce=null,ke=[],Xt=!1,wt=0,Jr=60,qt=!1,ji=!1,Ti=100,Qr=1,es=.5,Ga=.05,zt="file";const Wm=document.getElementById("container"),ii=new gh,Ui=new jt(60,window.innerWidth/window.innerHeight,.1,1e3);Ui.position.set(100,100,100);const Bi=new Am({antialias:!0});Bi.setSize(window.innerWidth,window.innerHeight);Bi.setClearColor(1118481);Wm.appendChild(Bi.domElement);const ts=new Rm(Ui,Bi.domElement);ts.enableDamping=!0;function Xm(i){ii.children.filter(c=>c.userData.isHelper).forEach(c=>ii.remove(c));const e=i/2,t=new Fi(i,i,i),n=new bh(t),r=new Oa({color:4473924,transparent:!0,opacity:.5}),s=new Mh(n,r);s.userData.isHelper=!0,ii.add(s);const a=i*.6;[{dir:[1,0,0],color:16729156},{dir:[0,1,0],color:4521796},{dir:[0,0,1],color:4474111}].forEach(({dir:c,color:l})=>{const u=[new U(-e*c[0],-e*c[1],-e*c[2]),new U(a*c[0],a*c[1],a*c[2])],d=new Vt().setFromPoints(u),f=new Oa({color:l,linewidth:2}),m=new Hl(d,f);m.userData.isHelper=!0,ii.add(m)})}let Or=null,an=null,Xr=null;function Ql(i,e,t){Or&&(ii.remove(Or),an.dispose(),Xr.dispose());const n=[],r=[],s=[],a=i/2,o=e/2,c=t/2;for(let u=0;u<t;u++)for(let d=0;d<e;d++)for(let f=0;f<i;f++)n.push(f-a,d-o,u-c),r.push(0,0,0),s.push(1);an=new Vt,an.setAttribute("position",new Lt(n,3)),an.setAttribute("color",new Lt(r,3)),an.setAttribute("size",new Lt(s,1)),Xr=new kl({size:1.5,vertexColors:!0,transparent:!0,opacity:es,sizeAttenuation:!0,blending:Ws,depthWrite:!1}),Or=new Eh(an,Xr),ii.add(Or);const l=Math.max(i,e,t);Xm(l),Ui.position.set(l*1.5,l*1.5,l*1.5),ts.target.set(0,0,0),ts.update()}function yt(i,e,t,n){if(!an)return;const r=an.attributes.color.array,s=an.attributes.size.array;for(let a=0;a<i.length;a++){const o=i[a];if(o>Ga){const[c,l,u]=km(o);r[a*3+0]=c,r[a*3+1]=l,r[a*3+2]=u,s[a]=1+o*2}else r[a*3+0]=0,r[a*3+1]=0,r[a*3+2]=0,s[a]=0}an.attributes.color.needsUpdate=!0,an.attributes.size.needsUpdate=!0,Xr.opacity=es}function en(){const i=document.getElementById("info");if(zt==="file"&&Ve){const{width:e,height:t,depth:n,frameCount:r,dt:s}=Ve,a=Yt*s;i.textContent=`${e}x${t}x${n} | Frame ${Yt}/${r-1} | Time: ${a.toFixed(2)}s`,document.getElementById("frameNum").textContent=Yt,document.getElementById("frameSlider").value=Yt}else if(zt==="live"&&Xt&&ke.length>0){const{width:e,height:t,depth:n}=Ce;i.textContent=`${e}x${t}x${n} | Playback ${wt}/${ke.length-1} | ${Jr} fps`}else if(zt==="live"&&Qe){const{width:e,height:t,depth:n}=Ce,r=Qe.getStep(),s=Qe.getTime(),a=Qe.totalMass().toFixed(3),o=ke.length>0?` | Recorded: ${ke.length}`:"";i.textContent=`${e}x${t}x${n} | Step ${r} | Time: ${s.toFixed(2)}s | Mass: ${a} | ${ln.toUpperCase()}${o}`}else i.textContent="Drop a .flwa file or load JSON configs for live simulation"}document.querySelectorAll(".mode-tab").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".mode-tab").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".mode-content").forEach(e=>e.classList.remove("active")),i.classList.add("active"),zt=i.dataset.mode,document.getElementById(`${zt}-mode`).classList.add("active"),bi=!1,wn=!1,Xt=!1,document.getElementById("playBtn").textContent="Play",document.getElementById("playBtn").classList.remove("active"),document.getElementById("simPlayBtn").textContent="Play",document.getElementById("simPlayBtn").classList.remove("active"),document.getElementById("playRecordBtn").textContent="Play",document.getElementById("playRecordBtn").classList.remove("active"),en()})});async function ec(i){let e=await i.arrayBuffer();const t=new Uint8Array(e,0,2);if(t[0]===31&&t[1]===139)if(typeof DecompressionStream<"u"){const r=new Blob([e]).stream().pipeThrough(new DecompressionStream("gzip"));e=await(await new Response(r).blob()).arrayBuffer(),console.log(`Decompressed to ${e.byteLength} bytes`)}else throw new Error("Gzip decompression not supported in this browser");Ve=await Gm.parse(e),document.getElementById("frameSlider").max=Ve.frameCount-1,document.getElementById("frameSlider").disabled=!1,document.getElementById("playBtn").disabled=!1,document.getElementById("resetBtn").disabled=!1,Ql(Ve.width,Ve.height,Ve.depth),Yt=0,yt(Ve.frames[0],Ve.width,Ve.height,Ve.depth),en()}document.getElementById("flwaInput").addEventListener("change",i=>{i.target.files[0]&&ec(i.target.files[0])});document.getElementById("playBtn").addEventListener("click",()=>{bi=!bi,document.getElementById("playBtn").textContent=bi?"Pause":"Play",document.getElementById("playBtn").classList.toggle("active",bi)});document.getElementById("resetBtn").addEventListener("click",()=>{Yt=0,Ve&&(yt(Ve.frames[0],Ve.width,Ve.height,Ve.depth),en())});document.getElementById("frameSlider").addEventListener("input",i=>{Yt=parseInt(i.target.value),Ve&&(yt(Ve.frames[Yt],Ve.width,Ve.height,Ve.depth),en())});function Et(i,e){const t=document.getElementById("simStatus");t.textContent=i,t.className=`status ${e}`,t.style.display="block"}function ns(){const i=Ot!==null&&Wn!==null;return document.getElementById("initBtn").disabled=!i,i}document.getElementById("presetSelect").addEventListener("change",i=>{const e=i.target.value;if(e&&ul[e]){const t=ul[e];Ot=JSON.parse(JSON.stringify(t.config)),Wn=JSON.parse(JSON.stringify(t.seed)),document.getElementById("configInput").value="",document.getElementById("seedInput").value="",Et(`Preset "${e}" loaded`,"ready"),ns()}else e||(Ot=null,Wn=null,document.getElementById("simStatus").style.display="none",ns())});document.getElementById("configInput").addEventListener("change",async i=>{if(i.target.files[0])try{const e=await i.target.files[0].text();Ot=JSON.parse(e),document.getElementById("presetSelect").value="",Et("Config loaded","ready"),ns()}catch(e){Et(`Config error: ${e.message}`,"error"),Ot=null}});document.getElementById("seedInput").addEventListener("change",async i=>{if(i.target.files[0])try{const e=await i.target.files[0].text();Wn=JSON.parse(e),document.getElementById("presetSelect").value="",Et("Seed loaded","ready"),ns()}catch(e){Et(`Seed error: ${e.message}`,"error"),Wn=null}});document.getElementById("backendSelect").addEventListener("change",i=>{ln=i.target.value});document.getElementById("initBtn").addEventListener("click",async()=>{if(!(!Ot||!Wn)){Et("Initializing...","loading"),document.getElementById("initBtn").disabled=!0;try{const i=await Jl(),e=JSON.stringify(Ot),t=JSON.stringify(Wn);if(!Ot.depth||Ot.depth<=1)throw new Error("Configuration must be 3D (depth > 1)");Ce={width:Ot.width,height:Ot.height,depth:Ot.depth},ln==="gpu"&&(await Hm()||(Et("WebGPU not available, falling back to CPU","loading"),ln="cpu",document.getElementById("backendSelect").value="cpu")),ln==="gpu"?Qe=await new i.WasmGpuPropagator3D(e,t):Qe=new i.WasmPropagator3D(e,t),Ql(Ce.width,Ce.height,Ce.depth);const n=Qe.getChannelData(0);yt(n,Ce.width,Ce.height,Ce.depth),document.getElementById("simPlayBtn").disabled=!1,document.getElementById("stepBtn").disabled=!1,document.getElementById("initBtn").disabled=!1,document.getElementById("batchRecordBtn").disabled=!1,ke=[],wt=0,Xt=!1,oi(),Et(`Ready (${ln.toUpperCase()})`,"ready"),en()}catch(i){console.error("Initialization error:",i),Et(`Error: ${i.message}`,"error"),document.getElementById("initBtn").disabled=!1,Qe=null}}});document.getElementById("simPlayBtn").addEventListener("click",()=>{Qe&&(wn=!wn,document.getElementById("simPlayBtn").textContent=wn?"Pause":"Play",document.getElementById("simPlayBtn").classList.toggle("active",wn))});document.getElementById("stepBtn").addEventListener("click",async()=>{if(!Qe)return;ln==="gpu"?await Qe.step():Qe.step();const i=Qe.getChannelData(0);yt(i,Ce.width,Ce.height,Ce.depth),en()});document.getElementById("stepsSlider").addEventListener("input",i=>{jr=parseInt(i.target.value),document.getElementById("stepsVal").textContent=jr});function oi(){document.getElementById("recordedFrameCount").textContent=ke.length,document.getElementById("recordFrameSlider").max=Math.max(0,ke.length-1),document.getElementById("recordFrameNum").textContent=wt,document.getElementById("recordFrameSlider").value=wt;const i=ke.length>0;document.getElementById("playRecordBtn").disabled=!i||qt,document.getElementById("resetRecordBtn").disabled=!i||qt,document.getElementById("recordFrameSlider").disabled=!i||qt,document.getElementById("exportRecordBtn").disabled=!i||qt,document.getElementById("clearRecordBtn").disabled=!i||qt}document.getElementById("batchFramesSlider").addEventListener("input",i=>{Ti=parseInt(i.target.value),document.getElementById("batchFramesVal").textContent=Ti});document.getElementById("batchStepsSlider").addEventListener("input",i=>{Qr=parseInt(i.target.value),document.getElementById("batchStepsVal").textContent=Qr});async function qm(){if(!Qe||!Ce||qt)return;qt=!0,ji=!1,ke=[],wt=0,document.getElementById("batchRecordBtn").disabled=!0,document.getElementById("cancelBatchBtn").disabled=!1,document.getElementById("cancelBatchBtn").style.display="",document.getElementById("batchProgress").style.display="block",document.getElementById("simPlayBtn").disabled=!0,document.getElementById("stepBtn").disabled=!0,document.getElementById("initBtn").disabled=!0,oi();const i=performance.now();try{const r=await Jl(),s=JSON.stringify(Ot),a=JSON.stringify(Wn);ln==="gpu"?Qe=await new r.WasmGpuPropagator3D(s,a):Qe=new r.WasmPropagator3D(s,a)}catch(r){console.error("Failed to reinitialize propagator:",r),Et(`Error: ${r.message}`,"error"),dl(!1);return}Et(`Generating ${Ti} frames...`,"loading");const e=Qe.getChannelData(0);ke.push(new Float32Array(e));const t=10;for(let r=0;r<Ti&&!ji;){const s=Math.min(t,Ti-r);for(let o=0;o<s&&!ji;o++){ln==="gpu"?await Qe.run(BigInt(Qr)):Qe.run(BigInt(Qr));const c=Qe.getChannelData(0);ke.push(new Float32Array(c)),r++}const a=Math.round(r/Ti*100);document.getElementById("batchProgressVal").textContent=a,document.getElementById("batchProgressBar").style.width=`${a}%`,await new Promise(o=>setTimeout(o,0))}const n=((performance.now()-i)/1e3).toFixed(1);Et(ji?`Cancelled after ${ke.length} frames (${n}s)`:`Generated ${ke.length} frames in ${n}s`,"ready"),dl(!0)}function dl(i){qt=!1,document.getElementById("batchRecordBtn").disabled=!1,document.getElementById("cancelBatchBtn").disabled=!0,document.getElementById("cancelBatchBtn").style.display="none",document.getElementById("batchProgress").style.display="none",document.getElementById("simPlayBtn").disabled=!1,document.getElementById("stepBtn").disabled=!1,document.getElementById("initBtn").disabled=!1,i&&ke.length>0&&(wt=0,yt(ke[0],Ce.width,Ce.height,Ce.depth)),oi(),en()}document.getElementById("batchRecordBtn").addEventListener("click",()=>{qm()});document.getElementById("cancelBatchBtn").addEventListener("click",()=>{ji=!0});async function Ym(i=!0){if(ke.length===0||!Ce)return;const{width:e,height:t,depth:n}=Ce,r=1,s=ke.length,a=e*t*n,o=48,c=a*4,l=s*c,u=s*16,d=o+l+u;Et(`Exporting ${s} frames...`,"loading");const f=new ArrayBuffer(d),m=new DataView(f),_=new Uint8Array(f);_[0]=70,_[1]=76,_[2]=87,_[3]=65;let x=4;m.setUint16(x,1,!0),x+=2,m.setUint16(x,0,!0),x+=2,m.setUint32(x,e,!0),x+=4,m.setUint32(x,t,!0),x+=4,m.setUint32(x,n,!0),x+=4,m.setUint32(x,r,!0),x+=4,m.setUint32(x,s,!0),x+=4,m.setUint32(x,0,!0),x+=4,m.setFloat32(x,Ot?.dt||.1,!0);const p=o,h=[];for(let M=0;M<s;M++){const D=p+M*c;h.push(D);const V=new Float32Array(f,D,a),B=Math.min(ke[M].length,a);for(let W=0;W<B;W++)V[W]=ke[M][W]}const b=p+l;for(let M=0;M<s;M++){const D=b+M*16;m.setBigUint64(D,BigInt(h[M]),!0),m.setBigUint64(D+8,BigInt(c),!0)}let y=f,T="flwa";if(i&&typeof CompressionStream<"u")try{const D=new Blob([f]).stream().pipeThrough(new CompressionStream("gzip"));y=await(await new Response(D).blob()).arrayBuffer(),T="flwa.gz";const B=((1-y.byteLength/d)*100).toFixed(1);console.log(`Compressed: ${d} -> ${y.byteLength} bytes (${B}% reduction)`)}catch(M){console.warn("Compression failed, exporting uncompressed:",M)}const A=new Blob([y],{type:"application/octet-stream"}),w=URL.createObjectURL(A),C=document.createElement("a");C.href=w;const F=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),S=(y.byteLength/1024/1024).toFixed(1);C.download=`recording-${e}x${t}x${n}-${s}f-${F}.${T}`,document.body.appendChild(C),C.click(),document.body.removeChild(C),URL.revokeObjectURL(w),Et(`Exported ${s} frames (${S} MB)`,"ready")}document.getElementById("exportRecordBtn").addEventListener("click",()=>{Ym()});document.getElementById("clearRecordBtn").addEventListener("click",()=>{ke=[],wt=0,Xt=!1,document.getElementById("playRecordBtn").textContent="Play",document.getElementById("playRecordBtn").classList.remove("active"),oi(),Qe&&Et(`Ready (${ln.toUpperCase()})`,"ready")});document.getElementById("playRecordBtn").addEventListener("click",()=>{ke.length!==0&&(Xt=!Xt,document.getElementById("playRecordBtn").textContent=Xt?"Pause":"Play",document.getElementById("playRecordBtn").classList.toggle("active",Xt),Xt&&wn&&(wn=!1,document.getElementById("simPlayBtn").textContent="Play",document.getElementById("simPlayBtn").classList.remove("active")))});document.getElementById("resetRecordBtn").addEventListener("click",()=>{wt=0,ke.length>0&&(yt(ke[0],Ce.width,Ce.height,Ce.depth),oi(),en())});document.getElementById("recordFrameSlider").addEventListener("input",i=>{wt=parseInt(i.target.value),ke.length>0&&wt<ke.length&&(yt(ke[wt],Ce.width,Ce.height,Ce.depth),oi(),en())});document.getElementById("playbackSpeedSlider").addEventListener("input",i=>{Jr=parseInt(i.target.value),document.getElementById("playbackSpeedVal").textContent=Jr});document.getElementById("opacitySlider").addEventListener("input",i=>{if(es=parseFloat(i.target.value),document.getElementById("opacityVal").textContent=es.toFixed(2),zt==="file"&&Ve)yt(Ve.frames[Yt],Ve.width,Ve.height,Ve.depth);else if(zt==="live"&&!qt&&Xt&&ke.length>0)yt(ke[wt],Ce.width,Ce.height,Ce.depth);else if(zt==="live"&&!qt&&Qe){const e=Qe.getChannelData(0);yt(e,Ce.width,Ce.height,Ce.depth)}});document.getElementById("threshSlider").addEventListener("input",i=>{if(Ga=parseFloat(i.target.value),document.getElementById("threshVal").textContent=Ga.toFixed(2),zt==="file"&&Ve)yt(Ve.frames[Yt],Ve.width,Ve.height,Ve.depth);else if(zt==="live"&&!qt&&Xt&&ke.length>0)yt(ke[wt],Ce.width,Ce.height,Ce.depth);else if(zt==="live"&&!qt&&Qe){const e=Qe.getChannelData(0);yt(e,Ce.width,Ce.height,Ce.depth)}});document.body.addEventListener("dragover",i=>i.preventDefault());document.body.addEventListener("drop",i=>{i.preventDefault();const e=i.dataTransfer.files[0];e&&(e.name.endsWith(".flwa")||e.name.endsWith(".flwa.gz")||e.name.endsWith(".gz")?(document.querySelector('[data-mode="file"]').click(),ec(e)):e.name.endsWith(".json")&&(document.querySelector('[data-mode="live"]').click(),e.name.includes("seed")?(document.getElementById("seedInput").files=i.dataTransfer.files,document.getElementById("seedInput").dispatchEvent(new Event("change"))):(document.getElementById("configInput").files=i.dataTransfer.files,document.getElementById("configInput").dispatchEvent(new Event("change")))))});let Br=0,fl=0;const $m=100;async function tc(i){if(requestAnimationFrame(tc),zt==="file"&&bi&&Ve&&i-Br>$m&&(Yt=(Yt+1)%Ve.frameCount,yt(Ve.frames[Yt],Ve.width,Ve.height,Ve.depth),en(),Br=i),zt==="live"&&wn&&Qe&&!Xt&&!qt&&i-Br>50){try{ln==="gpu"?await Qe.run(BigInt(jr)):Qe.run(BigInt(jr));const t=Qe.getChannelData(0);yt(t,Ce.width,Ce.height,Ce.depth),en()}catch(t){console.error("Simulation error:",t),wn=!1,document.getElementById("simPlayBtn").textContent="Play",document.getElementById("simPlayBtn").classList.remove("active"),Et(`Error: ${t.message}`,"error")}Br=i}const e=1e3/Jr;zt==="live"&&Xt&&ke.length>0&&i-fl>e&&(wt=(wt+1)%ke.length,yt(ke[wt],Ce.width,Ce.height,Ce.depth),oi(),en(),fl=i),ts.update(),Bi.render(ii,Ui)}window.addEventListener("resize",()=>{Ui.aspect=window.innerWidth/window.innerHeight,Ui.updateProjectionMatrix(),Bi.setSize(window.innerWidth,window.innerHeight)});tc(0);
