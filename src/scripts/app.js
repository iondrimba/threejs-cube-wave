import 'styles/index.scss';

export default class App {
  init() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.querySelector('.stats').appendChild(this.stats.domElement);

    this.backgroundColor = 0xed1a21;
    this.ambientLightColor = 0xffffff;
    this.spotLightColor = 0xffffff;
    this.boxColor = 0x1a63ed;
    this.angle = 0;
    this.gridSize = 30;
    this.col = this.gridSize
    this.row = this.gridSize;
    this.velocity = .1;
    this.boxes = [];

    this.amplitude = -1;
    this.frequency = 0;
    this.waveLength = 242;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(-100, 100, -100);

    this.addRenderer();

    document.body.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.addAmbientLight();

    this.addDirectionalLight();

    this.addFloor();

    this.addBoxes(this.scene);

    this.addGUIControls();

    this.animate();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  addDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(0, 1, 0);

    this.directionalLight.shadow.camera.far = 1000;
    this.directionalLight.shadow.camera.near = -100;

    this.directionalLight.shadow.camera.left = -40;
    this.directionalLight.shadow.camera.right = 40;
    this.directionalLight.shadow.camera.top = 20;
    this.directionalLight.shadow.camera.bottom = -20;
    this.directionalLight.shadow.camera.zoom = 1;
    this.directionalLight.shadow.camera.needsUpdate = true;

    const targetObject = new THREE.Object3D();
    targetObject.position.set(-50, -82, 40);
    this.directionalLight.target = targetObject;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);
  }

  addGUIControls() {
    this.gui = new dat.GUI();
    this.gui.add(this, 'amplitude', -10, .2);
    this.gui.add(this, 'velocity', 0, .5);
    this.gui.add(this, 'waveLength', 100, 500);
    this.controller = this.gui.add(this, 'gridSize', 24, 150);

    this.controller.onFinishChange((value) => {
      this.gridSize = Math.floor(value);

      this.clearScene();

      this.col = this.gridSize
      this.row = this.gridSize;

      this.addBoxes(this.scene);
    });
  }

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight(this.ambientLightColor, .5);
    this.scene.add(light);
  }

  addSpotLight() {
    this.spotLight = new THREE.SpotLight(this.spotLightColor);
    this.spotLight.position.set(100, 250, 150);
    this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);
  }

  clearScene() {
    this.scene.remove(this.mesh);

    this.boxes = [];
  }

  addBoxes(scene) {
    const size = 1;
    const height = 5;
    const material = new THREE.MeshLambertMaterial({
      color: this.boxColor,
    });

    const geometry = new THREE.BoxBufferGeometry(size, height, size);
    geometry.translate( 0, 2.5, 0 );
    this.mesh = this.getBox(geometry, material, this.row * this.col);
    this.scene.add(this.mesh);

    let ii = 0;

    for (let i = 0; i < this.col; i++) {
      this.boxes[i] = [];

      for (let j = 0; j < this.row; j++) {
        const pivot = new THREE.Object3D();
        this.boxes[i][j] = pivot;

        pivot.scale.set(1, 0.001, 1);
        pivot.position.set(i - this.gridSize * .5, height * .5, j - this.gridSize * .5);

        pivot.updateMatrix();
        this.mesh.setMatrixAt(ii++, pivot.matrix);
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  drawWave() {
    let ii= 0;

    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        const distance = this.distance(j, i, this.row * .5, this.col * .5);

        const offset = this.map(distance, 0, this.waveLength, -100, 100);
        const angle = this.angle + offset;
        this.boxes[i][j].scale.y = this.map(Math.sin(angle), -1, -this.amplitude, 0.001, 1);

        this.boxes[i][j].updateMatrix();
        this.mesh.setMatrixAt(ii++, this.boxes[i][j].matrix);
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;

    this.angle -= this.velocity;
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
  }

  map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
  }

  addFloor() {
    const planeGeometry = new THREE.PlaneBufferGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: .35 });

    this.floor = new THREE.Mesh(planeGeometry, planeMaterial);

    planeGeometry.rotateX(- Math.PI / 2);

    this.floor.position.y = 2;
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  getBox(geometry, material, count) {
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  addGrid() {
    const size = this.col;
    const divisions = size;
    const gridHelper = new THREE.GridHelper(size, divisions);

    gridHelper.position.set(0, 0, 0);
    gridHelper.material.opacity = 0;
    gridHelper.material.transparent = true;

    this.scene.add(gridHelper);
  }

  animate() {
    this.stats.begin();

    this.drawWave();

    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    this.stats.end();

    requestAnimationFrame(this.animate.bind(this));
  }

  onResize() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    this.camera.aspect = ww / wh;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(ww, wh);
  }
}
