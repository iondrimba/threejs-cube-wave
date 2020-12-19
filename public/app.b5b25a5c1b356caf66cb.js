!function(t){var e={};function i(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=1)}([function(t,e,i){},function(t,e,i){"use strict";i.r(e);i(0);function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}(new(function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,i,a;return e=t,(i=[{key:"init",value:function(){this.stats=new Stats,this.stats.showPanel(0),document.body.querySelector(".stats").appendChild(this.stats.domElement),this.backgroundColor=15538721,this.ambientLightColor=16777215,this.spotLightColor=16777215,this.boxColor=1729517,this.angle=0,this.gridSize=30,this.col=this.gridSize,this.row=this.gridSize,this.velocity=.1,this.boxes=[],this.amplitude=-1,this.frequency=0,this.waveLength=242,this.scene=new THREE.Scene,this.scene.background=new THREE.Color(this.backgroundColor),this.camera=new THREE.PerspectiveCamera(20,window.innerWidth/window.innerHeight,1,1e3),this.camera.position.set(-100,100,-100),this.addRenderer(),document.body.appendChild(this.renderer.domElement),this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement),this.addAmbientLight(),this.addDirectionalLight(),this.addFloor(),this.addBoxes(this.scene),this.addGUIControls(),this.animate(),window.addEventListener("resize",this.onResize.bind(this))}},{key:"addDirectionalLight",value:function(){this.directionalLight=new THREE.DirectionalLight(16777215,1),this.directionalLight.castShadow=!0,this.directionalLight.position.set(0,1,0),this.directionalLight.shadow.camera.far=1e3,this.directionalLight.shadow.camera.near=-100,this.directionalLight.shadow.camera.left=-40,this.directionalLight.shadow.camera.right=40,this.directionalLight.shadow.camera.top=20,this.directionalLight.shadow.camera.bottom=-20,this.directionalLight.shadow.camera.zoom=1,this.directionalLight.shadow.camera.needsUpdate=!0;var t=new THREE.Object3D;t.position.set(-50,-82,40),this.directionalLight.target=t,this.scene.add(this.directionalLight),this.scene.add(this.directionalLight.target)}},{key:"addGUIControls",value:function(){var t=this;this.gui=new dat.GUI,this.gui.add(this,"amplitude",-10,.2),this.gui.add(this,"velocity",0,.5),this.gui.add(this,"waveLength",100,500),this.controller=this.gui.add(this,"gridSize",24,150),this.controller.onFinishChange((function(e){t.gridSize=Math.floor(e),t.clearScene(),t.col=t.gridSize,t.row=t.gridSize,t.addBoxes(t.scene)}))}},{key:"addRenderer",value:function(){this.renderer=new THREE.WebGLRenderer({antialias:!0}),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=THREE.PCFSoftShadowMap,this.renderer.setSize(window.innerWidth,window.innerHeight)}},{key:"addAmbientLight",value:function(){var t=new THREE.AmbientLight(this.ambientLightColor,.5);this.scene.add(t)}},{key:"addSpotLight",value:function(){this.spotLight=new THREE.SpotLight(this.spotLightColor),this.spotLight.position.set(100,250,150),this.spotLight.castShadow=!0,this.scene.add(this.spotLight)}},{key:"clearScene",value:function(){this.scene.remove(this.mesh),this.boxes=[]}},{key:"addBoxes",value:function(t){var e=new THREE.MeshLambertMaterial({color:this.boxColor}),i=new THREE.BoxBufferGeometry(1,5,1);i.translate(0,2.5,0),this.mesh=this.getBox(i,e,this.row*this.col),this.scene.add(this.mesh);for(var n=0,a=0;a<this.col;a++){this.boxes[a]=[];for(var s=0;s<this.row;s++){var r=new THREE.Object3D;this.boxes[a][s]=r,r.scale.set(1,.001,1),r.position.set(a-.5*this.gridSize,2.5,s-.5*this.gridSize),r.updateMatrix(),this.mesh.setMatrixAt(n++,r.matrix)}}this.mesh.instanceMatrix.needsUpdate=!0}},{key:"drawWave",value:function(){for(var t=0,e=0;e<this.col;e++)for(var i=0;i<this.row;i++){var n=this.distance(i,e,.5*this.row,.5*this.col),a=this.map(n,0,this.waveLength,-100,100),s=this.angle+a;this.boxes[e][i].scale.y=this.map(Math.sin(s),-1,-this.amplitude,.001,1),this.boxes[e][i].updateMatrix(),this.mesh.setMatrixAt(t++,this.boxes[e][i].matrix)}this.mesh.instanceMatrix.needsUpdate=!0,this.angle-=this.velocity}},{key:"distance",value:function(t,e,i,n){return Math.sqrt(Math.pow(t-i,2)+Math.pow(e-n,2))}},{key:"map",value:function(t,e,i,n,a){return(t-e)/(i-e)*(a-n)+n}},{key:"addFloor",value:function(){var t=new THREE.PlaneBufferGeometry(500,500),e=new THREE.ShadowMaterial({opacity:.35});this.floor=new THREE.Mesh(t,e),t.rotateX(-Math.PI/2),this.floor.position.y=2,this.floor.receiveShadow=!0,this.scene.add(this.floor)}},{key:"getBox",value:function(t,e,i){var n=new THREE.InstancedMesh(t,e,i);return n.instanceMatrix.setUsage(THREE.DynamicDrawUsage),n.castShadow=!0,n.receiveShadow=!0,n}},{key:"addGrid",value:function(){var t=this.col,e=t,i=new THREE.GridHelper(t,e);i.position.set(0,0,0),i.material.opacity=0,i.material.transparent=!0,this.scene.add(i)}},{key:"animate",value:function(){this.stats.begin(),this.drawWave(),this.controls.update(),this.renderer.render(this.scene,this.camera),this.stats.end(),requestAnimationFrame(this.animate.bind(this))}},{key:"onResize",value:function(){var t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e)}}])&&n(e.prototype,i),a&&n(e,a),t}())).init()}]);