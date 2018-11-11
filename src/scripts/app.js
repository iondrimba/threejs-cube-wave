import 'styles/index.scss';

export default class App {
  init() {
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
    this.waveLength = 150;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(-19.19, 23.52, -18.76);

    this.addRenderer();

    document.body.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.addAmbientLight();

    this.addSpotLight();

    this.addFloor();

    this.addBoxes(this.scene);

    this.addGUIControls();

    this.animate();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  addGUIControls() {
    this.gui = new dat.GUI();
    this.gui.add(this, 'amplitude', -10, .2);
    this.gui.add(this, 'velocity', 0, .5);
    this.gui.add(this, 'waveLength', 100, 500);
    this.controller = this.gui.add(this, 'gridSize', 24, 50);

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
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        this.scene.remove(this.boxes[i][j]);
      }
    }

    this.boxes = [];
  }

  addBoxes(scene) {
    const size = 1;
    const height = 5;
    const geometry = new THREE.BoxBufferGeometry(size, height, size);
    const material = new THREE.MeshPhysicalMaterial({
      color: this.boxColor,
      emissive: 0x0,
      roughness: .5,
      metalness: .1,
      reflectivity: .5
    });

    for (let i = 0; i < this.col; i++) {
      this.boxes[i] = [];

      for (let j = 0; j < this.row; j++) {
        const box = this.getBox(geometry, material);

        box.position.y = height * .5;
        box.scale.set(1, 0.001, 1);

        this.boxes[i][j] = box;

        box.position.set(i - this.gridSize * .5, 0, j - this.gridSize * .5);

        scene.add(box);
      }
    }
  }

  drawWave() {
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        const distance = this.distance(j, i, this.row * .5, this.col * .5);

        const offset = this.map(distance, 0, this.waveLength, -100, 100);

        const angle = this.angle + offset;

        this.boxes[i][j].scale.y = this.map(Math.sin(angle), -1, -this.amplitude, 0.001, 1);
      }
    }

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

    this.floor.position.y = 0;
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  getBox(geometry, material) {
    const box = new THREE.Mesh(geometry, material);

    box.castShadow = true;
    box.receiveShadow = true;
    box.position.y = 2.5;

    const pivot = new THREE.Object3D();

    pivot.add(box);

    return pivot;
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
    this.drawWave();

    this.controls.update();

    this.renderer.render(this.scene, this.camera);

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
