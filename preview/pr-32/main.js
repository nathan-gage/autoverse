class X{canvas;simulation;callbacks;mode="view";selection=null;isSelecting=!1;isDrawing=!1;isDragging=!1;draggedCreature=null;ghostPreview=null;brushSize=3;brushIntensity=0.5;constructor(q,K,Q,Z={}){this.canvas=q,this.simulation=K,this.callbacks=Z,this.setupEventListeners(),this.setupDragDrop()}setMode(q){switch(this.mode=q,this.selection=null,this.isSelecting=!1,this.isDrawing=!1,q){case"select":this.canvas.style.cursor="crosshair";break;case"draw":this.canvas.style.cursor="cell";break;case"erase":this.canvas.style.cursor="not-allowed";break;default:this.canvas.style.cursor="default"}this.callbacks.onModeChange?.(q)}getMode(){return this.mode}getSelection(){return this.selection}clearSelection(){this.selection=null,this.callbacks.onSelectionChange?.(null)}setBrushSize(q){this.brushSize=Math.max(1,Math.min(20,q))}setBrushIntensity(q){this.brushIntensity=Math.max(0,Math.min(1,q))}getGhostPreview(){return this.ghostPreview}startDragFromLibrary(q,K){this.isDragging=!0,this.draggedCreature={preset:q,offsetX:q.region.width/2,offsetY:q.region.height/2};let Q=this.getSimCoords(K);this.ghostPreview={region:q.region,x:Q.x-this.draggedCreature.offsetX,y:Q.y-this.draggedCreature.offsetY}}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseLeave.bind(this)),document.addEventListener("keydown",this.handleKeyDown.bind(this))}setupDragDrop(){this.canvas.addEventListener("dragover",(q)=>{if(q.preventDefault(),q.dataTransfer.dropEffect="copy",this.draggedCreature){let K=this.getSimCoords(q);this.ghostPreview={region:this.draggedCreature.preset.region,x:K.x-this.draggedCreature.offsetX,y:K.y-this.draggedCreature.offsetY}}}),this.canvas.addEventListener("drop",(q)=>{if(q.preventDefault(),this.draggedCreature){let K=this.getSimCoords(q),Q=Math.floor(K.x-this.draggedCreature.offsetX),Z=Math.floor(K.y-this.draggedCreature.offsetY);this.callbacks.onDrop?.(this.draggedCreature.preset,Q,Z),this.draggedCreature=null,this.ghostPreview=null,this.isDragging=!1}}),this.canvas.addEventListener("dragleave",()=>{this.ghostPreview=null})}handleMouseDown(q){let K=this.getSimCoords(q);switch(this.mode){case"select":this.isSelecting=!0,this.selection={startX:K.x,startY:K.y,endX:K.x,endY:K.y},this.callbacks.onSelectionChange?.(this.selection);break;case"draw":this.isDrawing=!0,this.callbacks.onDraw?.(K.x,K.y);break;case"erase":this.isDrawing=!0,this.callbacks.onErase?.(K.x,K.y);break}}handleMouseMove(q){let K=this.getSimCoords(q);if(this.isSelecting&&this.selection)this.selection.endX=K.x,this.selection.endY=K.y,this.callbacks.onSelectionChange?.(this.selection);if(this.isDrawing){if(this.mode==="draw")this.callbacks.onDraw?.(K.x,K.y);else if(this.mode==="erase")this.callbacks.onErase?.(K.x,K.y)}if(this.isDragging&&this.draggedCreature)this.ghostPreview={region:this.draggedCreature.preset.region,x:K.x-this.draggedCreature.offsetX,y:K.y-this.draggedCreature.offsetY}}handleMouseUp(q){if(this.isSelecting&&this.selection){let K={startX:Math.min(this.selection.startX,this.selection.endX),startY:Math.min(this.selection.startY,this.selection.endY),endX:Math.max(this.selection.startX,this.selection.endX),endY:Math.max(this.selection.startY,this.selection.endY)};if(K.endX>K.startX&&K.endY>K.startY)this.selection=K,this.callbacks.onSelectionComplete?.(K);else this.selection=null;this.callbacks.onSelectionChange?.(this.selection)}this.isSelecting=!1,this.isDrawing=!1}handleMouseLeave(q){if(this.isSelecting)this.isSelecting=!1,this.selection=null,this.callbacks.onSelectionChange?.(null);this.isDrawing=!1,this.ghostPreview=null}handleKeyDown(q){let K=q.target;if(K.tagName==="INPUT"||K.tagName==="TEXTAREA")return;if(q.key==="v"||q.key==="Escape")this.setMode("view");else if(q.key==="s")this.setMode("select");else if(q.key==="d")this.setMode("draw");else if(q.key==="e")this.setMode("erase");if(q.key==="[")this.setBrushSize(this.brushSize-1),this.callbacks.onBrushSizeChange?.(this.brushSize);else if(q.key==="]")this.setBrushSize(this.brushSize+1),this.callbacks.onBrushSizeChange?.(this.brushSize)}getSimCoords(q){let K=this.canvas.getBoundingClientRect(),Q=q.clientX-K.left,Z=q.clientY-K.top,$=this.simulation.getWidth(),O=this.simulation.getHeight();return{x:Math.floor(Q/K.width*$),y:Math.floor(Z/K.height*O)}}getBrushSize(){return this.brushSize}getBrushIntensity(){return this.brushIntensity}}class Y{presets=new Map;listeners=new Set;constructor(){this.loadFromStorage()}generateId(){return`preset-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}createThumbnail(q,K=64){let Q=document.createElement("canvas");Q.width=K,Q.height=K;let Z=Q.getContext("2d"),$=Z.createImageData(q.width,q.height),O=q.channels[0];for(let U=0;U<O.length;U++){let J=Math.max(0,Math.min(1,O[U])),L=Math.floor(J*255);$.data[U*4+0]=L,$.data[U*4+1]=L,$.data[U*4+2]=L,$.data[U*4+3]=255}let A=document.createElement("canvas");A.width=q.width,A.height=q.height,A.getContext("2d").putImageData($,0,0),Z.imageSmoothingEnabled=!0,Z.fillStyle="#1a1a1a",Z.fillRect(0,0,K,K);let G=Math.min(K/q.width,K/q.height),V=q.width*G,R=q.height*G,N=(K-V)/2,F=(K-R)/2;return Z.drawImage(A,N,F,V,R),Q.toDataURL("image/png")}savePreset(q,K,Q){let Z={id:this.generateId(),name:q,description:Q,thumbnail:this.createThumbnail(K),region:K,createdAt:Date.now()};return this.presets.set(Z.id,Z),this.persistToStorage(),this.notifyListeners(),Z}getPreset(q){return this.presets.get(q)}getAllPresets(){return Array.from(this.presets.values()).sort((q,K)=>K.createdAt-q.createdAt)}deletePreset(q){let K=this.presets.delete(q);if(K)this.persistToStorage(),this.notifyListeners();return K}renamePreset(q,K){let Q=this.presets.get(q);if(Q)return Q.name=K,this.persistToStorage(),this.notifyListeners(),!0;return!1}updateDescription(q,K){let Q=this.presets.get(q);if(Q)return Q.description=K,this.persistToStorage(),this.notifyListeners(),!0;return!1}exportPresets(q){let K=q?q.map((Q)=>this.presets.get(Q)).filter(Boolean):this.getAllPresets();return JSON.stringify(K,null,2)}importPresets(q){try{let K=JSON.parse(q),Q=0;for(let Z of K){let $={...Z,id:this.generateId(),createdAt:Date.now()};this.presets.set($.id,$),Q++}return this.persistToStorage(),this.notifyListeners(),Q}catch{throw Error("Invalid preset JSON format")}}subscribe(q){return this.listeners.add(q),()=>this.listeners.delete(q)}notifyListeners(){let q=this.getAllPresets();for(let K of this.listeners)K(q)}persistToStorage(){try{let q=JSON.stringify(Array.from(this.presets.entries()));localStorage.setItem("flow-lenia-presets",q)}catch(q){console.warn("Failed to persist presets to storage:",q)}}loadFromStorage(){try{let q=localStorage.getItem("flow-lenia-presets");if(q){let K=JSON.parse(q);this.presets=new Map(K)}}catch(q){console.warn("Failed to load presets from storage:",q),this.presets=new Map}}clearAll(){this.presets.clear(),this.persistToStorage(),this.notifyListeners()}}var H=[{name:"Glider",description:"A simple glider that moves across the grid",seed:{pattern:{type:"GaussianBlob",center:[0.5,0.5],radius:0.1,amplitude:1,channel:0}}},{name:"Ring",description:"A ring pattern that expands",seed:{pattern:{type:"Ring",center:[0.5,0.5],inner_radius:0.05,outer_radius:0.1,amplitude:1,channel:0}}},{name:"Dual Blobs",description:"Two interacting blobs",seed:{pattern:{type:"MultiBlob",blobs:[{center:[0.35,0.5],radius:0.08,amplitude:1,channel:0},{center:[0.65,0.5],radius:0.08,amplitude:1,channel:0}]}}},{name:"Random Noise",description:"Random initial conditions",seed:{pattern:{type:"Noise",seed:42,amplitude:0.5,channel:0}}},{name:"Multi-Species",description:"Two species with different parameters",embeddingEnabled:!0,seed:{pattern:{type:"MultiBlob",blobs:[{center:[0.25,0.5],radius:0.08,amplitude:1,channel:0},{center:[0.75,0.5],radius:0.08,amplitude:1,channel:0}]}},species:[{name:"Species A",params:{mu:0.15,sigma:0.015,weight:1,beta_a:1,n:2},initial_region:[0.25,0.5,0.08]},{name:"Species B",params:{mu:0.2,sigma:0.02,weight:1.2,beta_a:0.8,n:3},initial_region:[0.75,0.5,0.08]}]},{name:"Three Species",description:"Three species in triangular arrangement",embeddingEnabled:!0,seed:{pattern:{type:"MultiBlob",blobs:[{center:[0.5,0.25],radius:0.06,amplitude:1,channel:0},{center:[0.3,0.7],radius:0.06,amplitude:1,channel:0},{center:[0.7,0.7],radius:0.06,amplitude:1,channel:0}]}},species:[{name:"Fast",params:{mu:0.12,sigma:0.012,weight:1,beta_a:0.8,n:2},initial_region:[0.5,0.25,0.06]},{name:"Medium",params:{mu:0.15,sigma:0.015,weight:1,beta_a:1,n:2.5},initial_region:[0.3,0.7,0.06]},{name:"Slow",params:{mu:0.2,sigma:0.02,weight:1.2,beta_a:1.2,n:3},initial_region:[0.7,0.7,0.06]}]}];class I{canvas;ctx;offscreenCanvas;offscreenCtx;settings;grayscaleMap;thermalMap;viridisMap;constructor(q,K){this.canvas=q;let Q=q.getContext("2d");if(!Q)throw Error("Failed to get 2D context");this.ctx=Q,this.offscreenCanvas=document.createElement("canvas");let Z=this.offscreenCanvas.getContext("2d");if(!Z)throw Error("Failed to get offscreen 2D context");this.offscreenCtx=Z,this.settings=K,this.grayscaleMap=this.buildGrayscaleMap(),this.thermalMap=this.buildThermalMap(),this.viridisMap=this.buildViridisMap()}updateSettings(q){this.settings={...this.settings,...q}}render(q,K,Q,Z){let{width:$,height:O,channels:A}=q;if(this.offscreenCanvas.width!==$||this.offscreenCanvas.height!==O)this.offscreenCanvas.width=$,this.offscreenCanvas.height=O;let _=this.getColorMap(),G=this.offscreenCtx.createImageData($,O),V=Z&&this.settings.visualizationMode!=="mass",R=V?Z:A[0],{min:N,max:F}=V?this.getParamFieldRange(this.settings.visualizationMode):{min:0,max:1};for(let U=0;U<R.length;U++){let J=R[U],L=F>N?(J-N)/(F-N):0,M=Math.max(0,Math.min(1,L)),T=Math.floor(M*255)*4;G.data[U*4+0]=_[T+0],G.data[U*4+1]=_[T+1],G.data[U*4+2]=_[T+2],G.data[U*4+3]=255}if(this.offscreenCtx.putImageData(G,0,0),this.ctx.imageSmoothingEnabled=!1,this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.offscreenCanvas,0,0,$,O,0,0,this.canvas.width,this.canvas.height),this.settings.showGrid)this.drawGrid($,O);if(Q)this.drawGhostPreview(Q,$,O);if(K&&this.settings.showSelection)this.drawSelection(K,$,O)}drawGrid(q,K){let Q=this.canvas.width/q,Z=this.canvas.height/K;if(this.ctx.strokeStyle="rgba(255, 255, 255, 0.1)",this.ctx.lineWidth=1,Q>=4&&Z>=4){this.ctx.beginPath();for(let $=0;$<=q;$++){let O=$*Q;this.ctx.moveTo(O,0),this.ctx.lineTo(O,this.canvas.height)}for(let $=0;$<=K;$++){let O=$*Z;this.ctx.moveTo(0,O),this.ctx.lineTo(this.canvas.width,O)}this.ctx.stroke()}}drawSelection(q,K,Q){let Z=this.canvas.width/K,$=this.canvas.height/Q,O=Math.min(q.startX,q.endX)*Z,A=Math.min(q.startY,q.endY)*$,_=Math.abs(q.endX-q.startX)*Z,G=Math.abs(q.endY-q.startY)*$;this.ctx.fillStyle="rgba(79, 195, 247, 0.2)",this.ctx.fillRect(O,A,_,G),this.ctx.strokeStyle="#4fc3f7",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(O,A,_,G),this.ctx.setLineDash([]);let V=Math.abs(q.endX-q.startX),R=Math.abs(q.endY-q.startY);if(V>0&&R>0)this.ctx.fillStyle="#4fc3f7",this.ctx.font="12px monospace",this.ctx.fillText(`${V} x ${R}`,O+4,A-4)}drawGhostPreview(q,K,Q){let Z=this.canvas.width/K,$=this.canvas.height/Q,{region:O,x:A,y:_}=q,G=document.createElement("canvas");G.width=O.width,G.height=O.height;let V=G.getContext("2d"),R=V.createImageData(O.width,O.height),N=this.getColorMap();for(let F=0;F<O.channels[0].length;F++){let U=Math.max(0,Math.min(1,O.channels[0][F])),J=Math.floor(U*255)*4;R.data[F*4+0]=N[J+0],R.data[F*4+1]=N[J+1],R.data[F*4+2]=N[J+2],R.data[F*4+3]=U>0.01?180:0}V.putImageData(R,0,0),this.ctx.globalAlpha=0.7,this.ctx.drawImage(G,0,0,O.width,O.height,A*Z,_*$,O.width*Z,O.height*$),this.ctx.globalAlpha=1,this.ctx.strokeStyle="#4fc3f7",this.ctx.lineWidth=2,this.ctx.setLineDash([3,3]),this.ctx.strokeRect(A*Z,_*$,O.width*Z,O.height*$),this.ctx.setLineDash([])}canvasToSim(q,K,Q,Z){let $=this.canvas.getBoundingClientRect(),O=Q/this.canvas.width,A=Z/this.canvas.height;return{x:Math.floor((q-$.left)*O),y:Math.floor((K-$.top)*A)}}getColorMap(){switch(this.settings.colorScheme){case"thermal":return this.thermalMap;case"viridis":return this.viridisMap;default:return this.grayscaleMap}}getParamFieldRange(q){switch(q){case"mu":return{min:0,max:0.5};case"sigma":return{min:0,max:0.1};case"weight":return{min:0,max:3};case"beta_a":return{min:0,max:3};case"n":return{min:0,max:5};default:return{min:0,max:1}}}buildGrayscaleMap(){let q=new Uint8ClampedArray(1024);for(let K=0;K<256;K++)q[K*4+0]=K,q[K*4+1]=K,q[K*4+2]=K,q[K*4+3]=255;return q}buildThermalMap(){let q=new Uint8ClampedArray(1024);for(let K=0;K<256;K++){let Q=K/255,Z,$,O;if(Q<0.2){let A=Q/0.2;Z=0,$=0,O=Math.floor(A*128)}else if(Q<0.4){let A=(Q-0.2)/0.2;Z=0,$=Math.floor(A*255),O=128+Math.floor(A*127)}else if(Q<0.6){let A=(Q-0.4)/0.2;Z=Math.floor(A*255),$=255,O=255-Math.floor(A*255)}else if(Q<0.8){let A=(Q-0.6)/0.2;Z=255,$=255-Math.floor(A*255),O=0}else{let A=(Q-0.8)/0.2;Z=255,$=Math.floor(A*255),O=Math.floor(A*255)}q[K*4+0]=Z,q[K*4+1]=$,q[K*4+2]=O,q[K*4+3]=255}return q}buildViridisMap(){let q=[[68,1,84],[72,35,116],[64,67,135],[52,94,141],[41,120,142],[32,144,140],[34,167,132],[68,190,112],[121,209,81],[189,222,38],[253,231,36]],K=new Uint8ClampedArray(1024);for(let Q=0;Q<256;Q++){let $=Q/255*(q.length-1),O=Math.floor($),A=Math.min(O+1,q.length-1),_=$-O;K[Q*4+0]=Math.floor(q[O][0]+_*(q[A][0]-q[O][0])),K[Q*4+1]=Math.floor(q[O][1]+_*(q[A][1]-q[O][1])),K[Q*4+2]=Math.floor(q[O][2]+_*(q[A][2]-q[O][2])),K[Q*4+3]=255}return K}getCanvas(){return this.canvas}}class D{propagator=null;config;currentSeed;isInitialized=!1;wasmModule=null;currentBackend="cpu";gpuAvailable=!1;embeddedMode=!1;species=[];constructor(q,K){this.config=q,this.currentSeed=K,this.embeddedMode=q.embedding?.enabled??!1}async initialize(q="cpu"){try{let K=new URL("./pkg/flow_lenia.js",import.meta.url).href;this.wasmModule=await import(K),await this.wasmModule.default(),this.gpuAvailable=await this.checkWebGPU();let Q=q==="gpu"&&this.gpuAvailable?"gpu":"cpu";await this.createPropagator(Q),this.isInitialized=!0}catch(K){throw Error(`Failed to initialize WASM: ${K}`)}}async checkWebGPU(){if(typeof navigator>"u"||!("gpu"in navigator))return!1;try{return await navigator.gpu.requestAdapter()!==null}catch{return!1}}async createPropagator(q){if(!this.wasmModule)throw Error("WASM module not loaded");let K=JSON.stringify(this.config),Q=JSON.stringify(this.currentSeed);if(this.embeddedMode){if(this.species.length>0){let Z=JSON.stringify(this.species);this.propagator=this.wasmModule.WasmEmbeddedPropagator.newWithSpecies(K,Q,Z)}else this.propagator=new this.wasmModule.WasmEmbeddedPropagator(K,Q);this.currentBackend="cpu"}else if(q==="gpu"&&this.gpuAvailable)this.propagator=await new this.wasmModule.WasmGpuPropagator(K,Q),this.currentBackend="gpu";else this.propagator=new this.wasmModule.WasmPropagator(K,Q),this.currentBackend="cpu"}async switchBackend(q){if(!this.isInitialized)throw Error("Simulation not initialized");if(q==="gpu"&&!this.gpuAvailable)return!1;if(q===this.currentBackend)return!0;return await this.createPropagator(q),!0}isGpuAvailable(){return this.gpuAvailable}getBackend(){return this.currentBackend}async step(){if(this.ensureInitialized(),this.currentBackend==="gpu")await this.propagator.step();else this.propagator.step()}async run(q){if(this.ensureInitialized(),this.currentBackend==="gpu")await this.propagator.run(BigInt(q));else this.propagator.run(BigInt(q))}getState(){return this.ensureInitialized(),this.propagator.getState()}reset(q){if(this.ensureInitialized(),q)this.currentSeed=q;this.propagator.reset(JSON.stringify(this.currentSeed))}totalMass(){return this.ensureInitialized(),this.propagator.totalMass()}getTime(){return this.ensureInitialized(),this.propagator.getTime()}getStep(){return this.ensureInitialized(),this.propagator.getStep()}getWidth(){return this.config.width}getHeight(){return this.config.height}getConfig(){return{...this.config}}extractRegion(q,K,Q,Z){this.ensureInitialized();let $=this.getState(),O=[];for(let A=0;A<$.channels.length;A++){let _=[];for(let G=0;G<Z;G++)for(let V=0;V<Q;V++){let R=(q+V)%$.width,F=(K+G)%$.height*$.width+R;_.push($.channels[A][F])}O.push(_)}return{width:Q,height:Z,channels:O,sourceX:q,sourceY:K}}placeRegion(q,K,Q){this.ensureInitialized();let Z=this.getState(),$=new Map;for(let _=0;_<Z.channels.length;_++)for(let G=0;G<Z.height;G++)for(let V=0;V<Z.width;V++){let R=G*Z.width+V,N=Z.channels[_][R];if(N>0.001)$.set(`${V},${G},${_}`,N)}for(let _=0;_<q.channels.length;_++)for(let G=0;G<q.height;G++)for(let V=0;V<q.width;V++){let R=(K+V)%this.config.width,N=(Q+G)%this.config.height,F=G*q.width+V,U=q.channels[_][F];if(U>0.001)$.set(`${R},${N},${_}`,U)}let O=[];for(let[_,G]of $){let[V,R,N]=_.split(",").map(Number);O.push([V,R,N,G])}let A={pattern:{type:"Custom",values:O}};this.reset(A)}drawAt(q,K,Q,Z,$=0){this.ensureInitialized();let O=this.getState(),A=[];for(let G=0;G<O.channels.length;G++)for(let V=0;V<O.height;V++)for(let R=0;R<O.width;R++){let N=V*O.width+R,F=O.channels[G][N];if(G===$){let U=R-q,J=V-K,L=Math.sqrt(U*U+J*J);if(L<=Q){let M=1-L/Q;F=Math.min(1,F+Z*M*M)}}if(F>0.001)A.push([R,V,G,F])}let _={pattern:{type:"Custom",values:A}};this.reset(_)}eraseAt(q,K,Q,Z=0){this.ensureInitialized();let $=this.getState(),O=[];for(let _=0;_<$.channels.length;_++)for(let G=0;G<$.height;G++)for(let V=0;V<$.width;V++){let R=G*$.width+V,N=$.channels[_][R];if(_===Z){let F=V-q,U=G-K,J=Math.sqrt(F*F+U*U);if(J<=Q){let L=1-J/Q;N=Math.max(0,N*(1-L*L))}}if(N>0.001)O.push([V,G,_,N])}let A={pattern:{type:"Custom",values:O}};this.reset(A)}ensureInitialized(){if(!this.isInitialized||!this.propagator)throw Error("Simulation not initialized. Call initialize() first.")}isEmbeddedMode(){return this.embeddedMode}async setEmbeddedMode(q){if(this.embeddedMode===q)return;if(this.embeddedMode=q,this.config={...this.config,embedding:{enabled:q,mixing_temperature:this.config.embedding?.mixing_temperature??1,linear_mixing:this.config.embedding?.linear_mixing??!1}},this.isInitialized)await this.createPropagator(this.currentBackend)}setSpecies(q){this.species=q}getSpecies(){return[...this.species]}addSpecies(q){this.species.push(q)}removeSpecies(q){if(q>=0&&q<this.species.length)this.species.splice(q,1)}updateSpecies(q,K){if(q>=0&&q<this.species.length)this.species[q]=K}async resetWithSpecies(q){if(this.ensureInitialized(),q)this.currentSeed=q;if(this.embeddedMode&&this.species.length>0){let K=JSON.stringify(this.currentSeed),Q=JSON.stringify(this.species);this.propagator.resetWithSpecies(K,Q)}else this.propagator.reset(JSON.stringify(this.currentSeed))}getParamField(q,K=0){if(!this.embeddedMode||q==="mass")return null;this.ensureInitialized();try{return this.propagator.getParamField(q,K)}catch{return null}}getEmbeddedState(){if(!this.embeddedMode)return null;this.ensureInitialized();try{return this.propagator.getStateWithParams()}catch{return null}}updateEmbeddingConfig(q){this.config={...this.config,embedding:{enabled:this.embeddedMode,mixing_temperature:q.mixing_temperature??this.config.embedding?.mixing_temperature??1,linear_mixing:q.linear_mixing??this.config.embedding?.linear_mixing??!1}}}getEmbeddingConfig(){return{enabled:this.embeddedMode,mixing_temperature:this.config.embedding?.mixing_temperature??1,linear_mixing:this.config.embedding?.linear_mixing??!1}}}function E(q){return q.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}class B{container;callbacks;isPlaying=!1;stepsPerFrame=1;hasSelection=!1;speciesCount=0;currentSpecies=[];constructor(q,K){this.container=q,this.callbacks=K,this.buildUI()}buildUI(){this.container.innerHTML=`
      <div class="viewer-layout">
        <aside class="sidebar left-sidebar">
          <div class="panel">
            <h3>Playback</h3>
            <div class="button-group">
              <button id="playBtn" class="btn btn-primary" title="Play (Space)">
                <span class="icon">▶</span> Play
              </button>
              <button id="pauseBtn" class="btn" disabled title="Pause (Space)">
                <span class="icon">⏸</span> Pause
              </button>
            </div>
            <div class="button-group">
              <button id="stepBtn" class="btn" title="Step (.)">
                <span class="icon">⏭</span> Step
              </button>
              <button id="resetBtn" class="btn" title="Reset (R)">
                <span class="icon">↺</span> Reset
              </button>
            </div>
            <div class="speed-control">
              <label>Speed: <span id="speedValue">1</span> steps/frame</label>
              <div class="button-group">
                <button id="slowDownBtn" class="btn btn-sm">−</button>
                <button id="speedUpBtn" class="btn btn-sm">+</button>
              </div>
            </div>
          </div>

          <div class="panel">
            <h3>Tools</h3>
            <div class="tool-buttons">
              <button id="viewModeBtn" class="btn tool-btn active" title="View Mode (V)">
                <span class="icon">\uD83D\uDC41</span> View
              </button>
              <button id="selectModeBtn" class="btn tool-btn" title="Select Mode (S)">
                <span class="icon">⬚</span> Select
              </button>
              <button id="drawModeBtn" class="btn tool-btn" title="Draw Mode (D)">
                <span class="icon">✎</span> Draw
              </button>
              <button id="eraseModeBtn" class="btn tool-btn" title="Erase Mode (E)">
                <span class="icon">⌫</span> Erase
              </button>
            </div>
            <div id="brushSettings" class="brush-settings hidden">
              <label>Brush Size: <span id="brushSizeValue">3</span></label>
              <input type="range" id="brushSizeSlider" min="1" max="20" value="3">
              <label>Intensity: <span id="brushIntensityValue">50</span>%</label>
              <input type="range" id="brushIntensitySlider" min="0" max="100" value="50">
            </div>
          </div>

          <div class="panel">
            <h3>Display</h3>
            <div class="setting-row">
              <label>Color Scheme</label>
              <select id="colorScheme">
                <option value="grayscale">Grayscale</option>
                <option value="thermal">Thermal</option>
                <option value="viridis">Viridis</option>
              </select>
            </div>
            <div class="setting-row">
              <label>Visualization</label>
              <select id="visualizationMode">
                <option value="mass">Mass (Default)</option>
                <option value="mu" disabled>Mu - Growth Center</option>
                <option value="sigma" disabled>Sigma - Growth Width</option>
                <option value="weight" disabled>Weight</option>
                <option value="beta_a" disabled>Beta_a - Critical Mass</option>
                <option value="n" disabled>n - Power Param</option>
              </select>
            </div>
            <div class="setting-row">
              <label>
                <input type="checkbox" id="showGrid"> Show Grid
              </label>
            </div>
          </div>

          <div class="panel" id="embeddingPanel">
            <h3>Parameter Embedding</h3>
            <div class="setting-row">
              <label>
                <input type="checkbox" id="embeddingEnabled"> Enable Multi-Species
              </label>
            </div>
            <div id="embeddingSettings" class="embedding-settings hidden">
              <div class="setting-row">
                <label>Mixing Strategy</label>
                <select id="mixingStrategy">
                  <option value="softmax">Softmax (Default)</option>
                  <option value="linear">Linear</option>
                </select>
              </div>
              <div class="setting-row" id="temperatureRow">
                <label>Temperature: <span id="temperatureValue">1.0</span></label>
                <input type="range" id="temperatureSlider" min="0.1" max="5.0" step="0.1" value="1.0">
              </div>
            </div>
          </div>
        </aside>

        <main class="canvas-container">
          <canvas id="simulationCanvas" width="512" height="512"></canvas>
          <div class="stats-bar">
            <span>Step: <strong id="stepCount">0</strong></span>
            <span>Time: <strong id="simTime">0.00</strong></span>
            <span>Mass: <strong id="totalMass">0.00</strong></span>
            <span>FPS: <strong id="fpsDisplay">0</strong></span>
            <div class="backend-toggle">
              <span class="backend-label cpu active" id="cpuLabel">CPU</span>
              <label class="toggle-switch">
                <input type="checkbox" id="backendToggle" disabled>
                <span class="toggle-slider"></span>
              </label>
              <span class="backend-label gpu" id="gpuLabel">GPU</span>
            </div>
          </div>
        </main>

        <aside class="sidebar right-sidebar">
          <div class="panel hidden" id="speciesPanel">
            <h3>Species Configuration</h3>
            <div id="speciesList" class="species-list">
              <!-- Species items will be rendered here -->
            </div>
            <button id="addSpeciesBtn" class="btn btn-primary btn-sm">+ Add Species</button>
          </div>

          <div class="panel">
            <h3>Selection</h3>
            <div id="selectionInfo" class="selection-info">
              <p class="muted">Use Select tool to capture regions</p>
            </div>
            <div id="saveSelectionForm" class="save-form hidden">
              <input type="text" id="presetName" placeholder="Preset name..." maxlength="30">
              <button id="savePresetBtn" class="btn btn-primary" disabled>Save as Preset</button>
            </div>
          </div>

          <div class="panel">
            <h3>Presets</h3>
            <div class="preset-actions">
              <button id="importPresetsBtn" class="btn btn-sm">Import</button>
              <button id="exportPresetsBtn" class="btn btn-sm">Export</button>
            </div>
            <div id="presetLibrary" class="preset-library">
              <!-- Presets will be rendered here -->
            </div>
            <input type="file" id="importFileInput" accept=".json" hidden>
          </div>

          <div class="panel">
            <h3>Built-in Patterns</h3>
            <div id="builtinPatterns" class="builtin-patterns">
              <!-- Built-in patterns will be rendered here -->
            </div>
          </div>
        </aside>
      </div>
    `,this.setupEventListeners(),this.renderBuiltinPatterns()}setupEventListeners(){let q=this.get("playBtn"),K=this.get("pauseBtn"),Q=this.get("stepBtn"),Z=this.get("resetBtn"),$=this.get("speedUpBtn"),O=this.get("slowDownBtn");q.addEventListener("click",()=>{this.callbacks.onPlay(),this.setPlaying(!0)}),K.addEventListener("click",()=>{this.callbacks.onPause(),this.setPlaying(!1)}),Q.addEventListener("click",()=>this.callbacks.onStep()),Z.addEventListener("click",()=>this.callbacks.onReset()),$.addEventListener("click",()=>{this.stepsPerFrame=Math.min(this.stepsPerFrame*2,64),this.updateSpeedDisplay(),this.callbacks.onSpeedChange(this.stepsPerFrame)}),O.addEventListener("click",()=>{this.stepsPerFrame=Math.max(Math.floor(this.stepsPerFrame/2),1),this.updateSpeedDisplay(),this.callbacks.onSpeedChange(this.stepsPerFrame)});let A=this.get("viewModeBtn"),_=this.get("selectModeBtn"),G=this.get("drawModeBtn"),V=this.get("eraseModeBtn");A.addEventListener("click",()=>this.setMode("view")),_.addEventListener("click",()=>this.setMode("select")),G.addEventListener("click",()=>this.setMode("draw")),V.addEventListener("click",()=>this.setMode("erase"));let R=this.get("brushSizeSlider"),N=this.get("brushIntensitySlider");R.addEventListener("input",()=>{let j=parseInt(R.value,10);this.get("brushSizeValue").textContent=j.toString(),this.callbacks.onBrushSizeChange(j)}),N.addEventListener("input",()=>{let j=parseInt(N.value,10);this.get("brushIntensityValue").textContent=j.toString(),this.callbacks.onBrushIntensityChange(j/100)});let F=this.get("colorScheme"),U=this.get("showGrid");F.addEventListener("change",()=>{this.callbacks.onSettingsChange({colorScheme:F.value})}),U.addEventListener("change",()=>{this.callbacks.onSettingsChange({showGrid:U.checked})});let J=this.get("presetName"),L=this.get("savePresetBtn");J.addEventListener("input",()=>{L.disabled=!J.value.trim()||!this.hasSelection}),L.addEventListener("click",()=>{let j=J.value.trim();if(j)this.callbacks.onSaveSelection(j),J.value="",L.disabled=!0});let M=this.get("importPresetsBtn"),T=this.get("exportPresetsBtn"),W=this.get("importFileInput");M.addEventListener("click",()=>W.click()),W.addEventListener("change",()=>{let j=W.files?.[0];if(j){let P=new FileReader;P.onload=()=>{this.callbacks.onImportPresets(P.result)},P.readAsText(j),W.value=""}}),T.addEventListener("click",()=>this.callbacks.onExportPresets());let C=this.get("backendToggle");C.addEventListener("change",()=>{let j=C.checked?"gpu":"cpu";this.callbacks.onBackendChange(j)});let S=this.get("visualizationMode");S.addEventListener("change",()=>{this.callbacks.onVisualizationModeChange(S.value)});let k=this.get("embeddingEnabled"),y=this.get("embeddingSettings"),z=this.get("mixingStrategy"),f=this.get("temperatureSlider"),u=this.get("temperatureRow"),v=this.get("speciesPanel");k.addEventListener("change",()=>{let j=k.checked;y.classList.toggle("hidden",!j),v.classList.toggle("hidden",!j),this.updateVisualizationModeOptions(j),this.callbacks.onEmbeddingToggle(j)}),z.addEventListener("change",()=>{let j=z.value==="linear";u.classList.toggle("hidden",j),this.callbacks.onEmbeddingConfigChange({linear_mixing:j})}),f.addEventListener("input",()=>{let j=parseFloat(f.value);this.get("temperatureValue").textContent=j.toFixed(1),this.callbacks.onEmbeddingConfigChange({mixing_temperature:j})}),this.get("addSpeciesBtn").addEventListener("click",()=>{let j={name:`Species ${this.speciesCount+1}`,params:{mu:0.15,sigma:0.015,weight:1,beta_a:1,n:2},initial_region:[0.5,0.5,0.1]};this.speciesCount++,this.callbacks.onSpeciesAdd(j)}),document.addEventListener("keydown",(j)=>{if(j.target.tagName==="INPUT")return;if(j.key===" ")if(j.preventDefault(),this.isPlaying)this.callbacks.onPause(),this.setPlaying(!1);else this.callbacks.onPlay(),this.setPlaying(!0);else if(j.key===".")this.callbacks.onStep();else if(j.key==="r"||j.key==="R")this.callbacks.onReset()})}renderBuiltinPatterns(){let q=this.get("builtinPatterns");q.innerHTML=H.map((K)=>`
      <div class="builtin-pattern" data-name="${K.name}">
        <span class="pattern-name">${K.name}${K.embeddingEnabled?" ★":""}</span>
        <span class="pattern-desc">${K.description}</span>
      </div>
    `).join(""),q.querySelectorAll(".builtin-pattern").forEach((K)=>{K.addEventListener("click",()=>{let Q=K.getAttribute("data-name"),Z=H.find(($)=>$.name===Q);if(Z)this.callbacks.onBuiltinPresetSelect(Z)})})}updateModeDisplay(q){let K={view:this.get("viewModeBtn"),select:this.get("selectModeBtn"),draw:this.get("drawModeBtn"),erase:this.get("eraseModeBtn")};for(let[Z,$]of Object.entries(K))$.classList.toggle("active",Z===q);this.get("brushSettings").classList.toggle("hidden",q!=="draw"&&q!=="erase")}setMode(q){this.updateModeDisplay(q),this.callbacks.onModeChange(q)}setPlaying(q){this.isPlaying=q;let K=this.get("playBtn"),Q=this.get("pauseBtn");K.disabled=q,Q.disabled=!q}updateStats(q,K,Q,Z){this.get("stepCount").textContent=q.toString(),this.get("simTime").textContent=K.toFixed(2),this.get("totalMass").textContent=Q.toFixed(2),this.get("fpsDisplay").textContent=Z.toString()}updateSelection(q,K,Q){this.hasSelection=q;let Z=this.get("selectionInfo"),$=this.get("saveSelectionForm"),O=this.get("savePresetBtn"),A=this.get("presetName");if(q&&K&&Q)Z.innerHTML=`<p>Selection: <strong>${K} x ${Q}</strong> cells</p>`,$.classList.remove("hidden"),O.disabled=!A.value.trim();else Z.innerHTML='<p class="muted">Use Select tool to capture regions</p>',$.classList.add("hidden")}renderPresets(q){let K=this.get("presetLibrary");if(q.length===0){K.innerHTML='<p class="muted">No saved presets</p>';return}K.innerHTML=q.map((Q)=>`
      <div class="preset-item" data-id="${E(Q.id)}" draggable="true">
        <img src="${E(Q.thumbnail)}" alt="${E(Q.name)}" class="preset-thumbnail">
        <div class="preset-info">
          <span class="preset-name">${E(Q.name)}</span>
          <span class="preset-size">${Q.region.width}x${Q.region.height}</span>
        </div>
        <button class="btn btn-sm btn-danger delete-preset" title="Delete">×</button>
      </div>
    `).join(""),K.querySelectorAll(".preset-item").forEach((Q)=>{let Z=Q.getAttribute("data-id"),$=q.find((O)=>O.id===Z);Q.addEventListener("click",(O)=>{if(!O.target.classList.contains("delete-preset"))this.callbacks.onPresetSelect($)}),Q.addEventListener("dragstart",(O)=>{this.callbacks.onPresetDragStart($,O)}),Q.querySelector(".delete-preset")?.addEventListener("click",(O)=>{if(O.stopPropagation(),confirm(`Delete preset "${$.name}"?`))this.callbacks.onPresetDelete(Z)})})}updateSpeedDisplay(){this.get("speedValue").textContent=this.stepsPerFrame.toString()}get(q){let K=document.getElementById(q);if(!K)throw Error(`Element #${q} not found`);return K}getCanvas(){return this.get("simulationCanvas")}setGpuAvailable(q){let K=this.get("backendToggle"),Q=this.get("gpuLabel");K.disabled=!q,Q.classList.toggle("unavailable",!q),Q.title=q?"GPU backend":"GPU not available"}updateBackend(q){let K=this.get("backendToggle"),Q=this.get("cpuLabel"),Z=this.get("gpuLabel");K.checked=q==="gpu",Q.classList.toggle("active",q==="cpu"),Z.classList.toggle("active",q==="gpu")}updateBrushSize(q){let K=this.get("brushSizeSlider"),Q=this.get("brushSizeValue");K.value=q.toString(),Q.textContent=q.toString()}updateVisualizationModeOptions(q){let K=this.get("visualizationMode");if(K.querySelectorAll("option").forEach((Z)=>{if(Z.value!=="mass")Z.disabled=!q}),!q&&K.value!=="mass")K.value="mass",this.callbacks.onVisualizationModeChange("mass")}renderSpecies(q){this.currentSpecies=q,this.speciesCount=q.length;let K=this.get("speciesList");if(q.length===0){K.innerHTML='<p class="muted">No species defined</p>';return}K.innerHTML=q.map((Q,Z)=>`
			<div class="species-item" data-index="${Z}">
				<div class="species-header">
					<input type="text" class="species-name" value="${E(Q.name)}" maxlength="20">
					<button class="btn btn-sm btn-danger delete-species" title="Delete">x</button>
				</div>
				<div class="species-params">
					<div class="param-row">
						<label>mu</label>
						<input type="number" class="param-input param-mu" step="0.01" min="0" max="1" value="${Q.params.mu}">
					</div>
					<div class="param-row">
						<label>sigma</label>
						<input type="number" class="param-input param-sigma" step="0.001" min="0" max="0.1" value="${Q.params.sigma}">
					</div>
					<div class="param-row">
						<label>weight</label>
						<input type="number" class="param-input param-weight" step="0.1" min="0" max="10" value="${Q.params.weight}">
					</div>
					<div class="param-row">
						<label>beta_a</label>
						<input type="number" class="param-input param-beta-a" step="0.1" min="0" max="10" value="${Q.params.beta_a}">
					</div>
					<div class="param-row">
						<label>n</label>
						<input type="number" class="param-input param-n" step="0.1" min="0" max="10" value="${Q.params.n}">
					</div>
				</div>
				<div class="species-region">
					<details>
						<summary>Initial Region</summary>
						<div class="region-params">
							<div class="param-row">
								<label>Center X</label>
								<input type="number" class="region-cx" step="0.05" min="0" max="1" value="${Q.initial_region?.[0]??0.5}">
							</div>
							<div class="param-row">
								<label>Center Y</label>
								<input type="number" class="region-cy" step="0.05" min="0" max="1" value="${Q.initial_region?.[1]??0.5}">
							</div>
							<div class="param-row">
								<label>Radius</label>
								<input type="number" class="region-radius" step="0.01" min="0" max="0.5" value="${Q.initial_region?.[2]??0.1}">
							</div>
						</div>
					</details>
				</div>
			</div>
		`).join(""),K.querySelectorAll(".species-item").forEach((Q)=>{let Z=parseInt(Q.getAttribute("data-index"),10);Q.querySelector(".delete-species")?.addEventListener("click",()=>{this.callbacks.onSpeciesDelete(Z)}),Q.querySelector(".species-name")?.addEventListener("change",($)=>{let O=$.target.value;this.updateSpeciesFromUI(Z)}),Q.querySelectorAll(".param-input, .region-cx, .region-cy, .region-radius").forEach(($)=>{$.addEventListener("change",()=>{this.updateSpeciesFromUI(Z)})})})}updateSpeciesFromUI(q){let K=this.get("speciesList").querySelector(`.species-item[data-index="${q}"]`);if(!K)return;let Q=K.querySelector(".species-name").value,Z=parseFloat(K.querySelector(".param-mu").value),$=parseFloat(K.querySelector(".param-sigma").value),O=parseFloat(K.querySelector(".param-weight").value),A=parseFloat(K.querySelector(".param-beta-a").value),_=parseFloat(K.querySelector(".param-n").value),G=parseFloat(K.querySelector(".region-cx").value),V=parseFloat(K.querySelector(".region-cy").value),R=parseFloat(K.querySelector(".region-radius").value),N={name:Q,params:{mu:Z,sigma:$,weight:O,beta_a:A,n:_},initial_region:[G,V,R]};this.callbacks.onSpeciesUpdate(q,N)}setEmbeddingEnabled(q){let K=this.get("embeddingEnabled"),Q=this.get("embeddingSettings"),Z=this.get("speciesPanel");K.checked=q,Q.classList.toggle("hidden",!q),Z.classList.toggle("hidden",!q),this.updateVisualizationModeOptions(q)}setVisualizationMode(q){let K=this.get("visualizationMode");K.value=q}}var b={width:128,height:128,channels:1,dt:0.1,kernel_radius:13,kernels:[{radius:1,rings:[{amplitude:1,distance:0.5,width:0.15}],weight:1,mu:0.15,sigma:0.015,source_channel:0,target_channel:0}],flow:{beta_a:1,n:2,distribution_size:1}},x={pattern:{type:"GaussianBlob",center:[0.5,0.5],radius:0.1,amplitude:1,channel:0}};class w{simulation;renderer;interaction;presetManager;ui;settings={colorScheme:"grayscale",showGrid:!1,showSelection:!0,brushSize:3,brushIntensity:0.5,backend:"cpu",visualizationMode:"mass"};isPlaying=!1;stepsPerFrame=1;animationFrameId=null;frameCount=0;fpsUpdateTime=0;currentFps=0;constructor(){this.simulation=new D(b,x),this.presetManager=new Y}async initialize(){let q=document.getElementById("app");if(!q)throw Error("App container not found");q.innerHTML='<div class="loading">Loading WebAssembly module...</div>';try{await this.simulation.initialize(),this.ui=new B(q,{onPlay:()=>this.play(),onPause:()=>this.pause(),onStep:()=>this.step(),onReset:(Q)=>this.reset(Q),onSpeedChange:(Q)=>{this.stepsPerFrame=Q},onModeChange:(Q)=>this.setMode(Q),onSettingsChange:(Q)=>this.updateSettings(Q),onSaveSelection:(Q)=>this.saveSelection(Q),onPresetSelect:(Q)=>this.selectPreset(Q),onPresetDelete:(Q)=>this.deletePreset(Q),onPresetDragStart:(Q,Z)=>this.startPresetDrag(Q,Z),onExportPresets:()=>this.exportPresets(),onImportPresets:(Q)=>this.importPresets(Q),onBrushSizeChange:(Q)=>{this.settings.brushSize=Q,this.interaction.setBrushSize(Q)},onBrushIntensityChange:(Q)=>{this.settings.brushIntensity=Q,this.interaction.setBrushIntensity(Q)},onBackendChange:(Q)=>this.switchBackend(Q),onEmbeddingToggle:(Q)=>this.toggleEmbedding(Q),onEmbeddingConfigChange:(Q)=>this.updateEmbeddingConfig(Q),onSpeciesAdd:(Q)=>this.addSpecies(Q),onSpeciesUpdate:(Q,Z)=>this.updateSpecies(Q,Z),onSpeciesDelete:(Q)=>this.deleteSpecies(Q),onVisualizationModeChange:(Q)=>this.setVisualizationMode(Q),onBuiltinPresetSelect:(Q)=>this.resetWithBuiltinPreset(Q)});let K=this.ui.getCanvas();this.renderer=new I(K,this.settings),this.interaction=new X(K,this.simulation,this.renderer,{onSelectionChange:(Q)=>{if(Q){let Z=Math.abs(Q.endX-Q.startX),$=Math.abs(Q.endY-Q.startY);this.ui.updateSelection(Z>0&&$>0,Z,$)}else this.ui.updateSelection(!1);this.render()},onSelectionComplete:(Q)=>{},onDrop:(Q,Z,$)=>{this.simulation.placeRegion(Q.region,Z,$),this.render()},onDraw:(Q,Z)=>{this.simulation.drawAt(Q,Z,this.settings.brushSize,this.settings.brushIntensity),this.render()},onErase:(Q,Z)=>{this.simulation.eraseAt(Q,Z,this.settings.brushSize),this.render()},onModeChange:(Q)=>{this.ui.updateModeDisplay(Q)},onBrushSizeChange:(Q)=>{this.settings.brushSize=Q,this.ui.updateBrushSize(Q)}}),this.presetManager.subscribe((Q)=>{this.ui.renderPresets(Q)}),this.ui.setGpuAvailable(this.simulation.isGpuAvailable()),this.ui.updateBackend(this.simulation.getBackend()),this.settings.backend=this.simulation.getBackend(),this.ui.renderPresets(this.presetManager.getAllPresets()),this.render(),this.updateStats(),console.log("Flow Lenia Viewer initialized successfully")}catch(K){throw q.innerHTML=`
        <div class="error">
          <h2>Initialization Error</h2>
          <p>${K}</p>
          <p>Make sure WASM is built: <code>wasm-pack build --target web --release</code></p>
        </div>
      `,K}}play(){if(this.isPlaying)return;this.isPlaying=!0,this.fpsUpdateTime=performance.now(),this.frameCount=0,this.animate(this.fpsUpdateTime)}pause(){if(this.isPlaying=!1,this.animationFrameId!==null)cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null}async step(){await this.simulation.step(),this.render(),this.updateStats()}reset(q){this.simulation.reset(q),this.render(),this.updateStats()}async animate(q){if(!this.isPlaying)return;if(await this.simulation.run(this.stepsPerFrame),this.render(),this.updateStats(),this.frameCount++,q-this.fpsUpdateTime>=1000)this.currentFps=this.frameCount,this.frameCount=0,this.fpsUpdateTime=q;this.animationFrameId=requestAnimationFrame((K)=>this.animate(K))}render(){let q=this.simulation.getState(),K=this.interaction.getSelection(),Q=this.interaction.getGhostPreview(),Z=null;if(this.simulation.isEmbeddedMode()&&this.settings.visualizationMode!=="mass")Z=this.simulation.getParamField(this.settings.visualizationMode);this.renderer.render(q,K,Q,Z)}updateStats(){this.ui.updateStats(this.simulation.getStep(),this.simulation.getTime(),this.simulation.totalMass(),this.currentFps)}setMode(q){if(this.interaction.setMode(q),q!=="select")this.interaction.clearSelection(),this.ui.updateSelection(!1)}updateSettings(q){this.settings={...this.settings,...q},this.renderer.updateSettings(q),this.render()}async switchBackend(q){if(await this.simulation.switchBackend(q))this.settings.backend=q,this.ui.updateBackend(q),console.log(`Switched to ${q.toUpperCase()} backend`);else this.ui.updateBackend(this.simulation.getBackend()),console.warn(`Failed to switch to ${q} backend`)}saveSelection(q){let K=this.interaction.getSelection();if(!K)return;let Q=Math.min(K.startX,K.endX),Z=Math.min(K.startY,K.endY),$=Math.abs(K.endX-K.startX),O=Math.abs(K.endY-K.startY);if($<=0||O<=0)return;let A=this.simulation.extractRegion(Q,Z,$,O);this.presetManager.savePreset(q,A),this.interaction.clearSelection(),this.ui.updateSelection(!1)}selectPreset(q){let K=Math.floor((this.simulation.getWidth()-q.region.width)/2),Q=Math.floor((this.simulation.getHeight()-q.region.height)/2);this.simulation.placeRegion(q.region,K,Q),this.render()}deletePreset(q){this.presetManager.deletePreset(q)}startPresetDrag(q,K){K.dataTransfer.effectAllowed="copy",K.dataTransfer.setData("text/plain",q.id),this.interaction.startDragFromLibrary(q,K)}exportPresets(){let q=this.presetManager.exportPresets(),K=new Blob([q],{type:"application/json"}),Q=URL.createObjectURL(K),Z=document.createElement("a");Z.href=Q,Z.download="flow-lenia-presets.json",Z.click(),URL.revokeObjectURL(Q)}importPresets(q){try{let K=this.presetManager.importPresets(q);alert(`Imported ${K} preset(s)`)}catch(K){alert(`Failed to import presets: ${K}`)}}async toggleEmbedding(q){if(await this.simulation.setEmbeddedMode(q),!q&&this.settings.visualizationMode!=="mass")this.settings.visualizationMode="mass",this.renderer.updateSettings({visualizationMode:"mass"});this.ui.renderSpecies(this.simulation.getSpecies()),this.render()}updateEmbeddingConfig(q){this.simulation.updateEmbeddingConfig(q)}addSpecies(q){this.simulation.addSpecies(q),this.ui.renderSpecies(this.simulation.getSpecies())}updateSpecies(q,K){this.simulation.updateSpecies(q,K)}deleteSpecies(q){this.simulation.removeSpecies(q),this.ui.renderSpecies(this.simulation.getSpecies())}setVisualizationMode(q){this.settings.visualizationMode=q,this.renderer.updateSettings({visualizationMode:q}),this.render()}async resetWithBuiltinPreset(q){if(q.embeddingEnabled&&q.species)await this.simulation.setEmbeddedMode(!0),this.ui.setEmbeddingEnabled(!0),this.simulation.setSpecies(q.species),this.ui.renderSpecies(q.species),await this.simulation.resetWithSpecies(q.seed);else await this.simulation.setEmbeddedMode(!1),this.ui.setEmbeddingEnabled(!1),this.ui.renderSpecies([]),this.simulation.reset(q.seed);this.render(),this.updateStats()}}var h=new w;h.initialize().catch(console.error);

//# debugId=E638F0D7F40C737564756E2164756E21
