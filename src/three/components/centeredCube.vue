<template>
  <div class="container" ref="container" />
</template>

<script lang="ts" setup>

import { ref, onMounted } from "vue";
import * as THREE from 'three'
import {
  EventDispatcher,
  Clock,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  AmbientLight,
  GridHelper,
  Raycaster,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
} from 'three'
import CameraControls from 'camera-controls'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
CameraControls.install({ THREE })


const CameraParams = {
  fov: 75,
  near: 0.1,
  far: 1000
}

type CameraParamsType = {
  dollySpeed: number,
  truckSpeed: number,
  azimuthRotateSpeed: number,
  maxAzimuthAngle: number,
  minAzimuthAngle: number,
  polarRotateSpeed: number,
  maxPolarAngle: number,
  minPolarAngle: number,
  maxDistance: number,
  minDistance: number
}
const FirstCameraParams: CameraParamsType = {
  dollySpeed: -1e-10,
  truckSpeed: 10,
  azimuthRotateSpeed: -0.2,
  maxAzimuthAngle: Infinity,
  minAzimuthAngle: -Infinity,
  polarRotateSpeed: -0.2,
  maxPolarAngle: Math.PI/2,
  minPolarAngle: Math.PI/4,
  maxDistance: Infinity,
  minDistance: 0
}
const ThirdCameraParams: CameraParamsType = {
  dollySpeed: 1.0,
  truckSpeed: 0.0,
  azimuthRotateSpeed: 0.5,
  maxAzimuthAngle: Infinity,
  minAzimuthAngle: -Infinity,
  polarRotateSpeed: 0.5,
  maxPolarAngle: Math.PI/2,
  minPolarAngle: Math.PI/18,
  maxDistance: 1100,
  minDistance: 0
}

type CameraAnchorType = {
  x: number,
  y: number,
  z: number,
  dolly: number
}
const FirstCameraAnchor: CameraAnchorType = {
  x: 0,
  y: 2,
  z: 5,
  dolly: 1
}
const ThirdCameraAnchor: CameraAnchorType = {
  x: 0,
  y: 2,
  z: 5,
  dolly: 1
}

class RXH extends EventDispatcher {
  private containerElement: HTMLElement
  private renderer: WebGLRenderer

  private clock = new Clock()
  private camera: PerspectiveCamera | OrthographicCamera
  private cameraControls: CameraControls

  private raycaster: Raycaster

  private scene: Scene
  private modelList: Array<THREE.Object3D> = []
  private dragControls: DragControls

  private FPS: number = 60
  private timeS: number = 0
  private isFirstPerson: boolean = false

  constructor(containerElement: HTMLElement | string) {
    super()

    this.containerElement = containerElement instanceof HTMLElement ? containerElement : document.querySelector(containerElement) || document.body
    this.renderer = new WebGLRenderer();
    this.initRenderer()

    const { fov, near, far } = CameraParams
    const { offsetWidth, offsetHeight } = this.containerElement
    this.camera = new PerspectiveCamera(fov, offsetWidth / offsetHeight, near, far);
    const { x, y, z } = this.isFirstPerson ? FirstCameraAnchor : ThirdCameraAnchor
    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0, 0)

    this.cameraControls = new CameraControls(this.camera, this.renderer.domElement)
    this.changeCamera()

    this.raycaster = new Raycaster();
    this.raycaster.far = 200

    this.scene = new Scene()

    this.dragControls = new DragControls(this.modelList, this.camera, this.renderer.domElement)
    this.initDragEvent()
  }


  private initRenderer() {
    const { offsetWidth, offsetHeight } = this.containerElement
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.containerElement.appendChild(this.renderer.domElement);
  }

  changeCamera(isFirstPerson = this.isFirstPerson, cameraParams: Partial<CameraParamsType> = {}) {
    Object.assign(this.cameraControls, isFirstPerson ? FirstCameraParams : ThirdCameraParams, cameraParams)
    const { x, y, z } = isFirstPerson ? FirstCameraAnchor : ThirdCameraAnchor
    this.cameraControls.moveTo(x, y, z, true)
    this.isFirstPerson = isFirstPerson
  }

  initDragEvent() {
    const diff = new THREE.Vector3(0, 0, 0)
    this.dragControls.addEventListener('dragstart', (event) => {
      this.cameraControls.enabled = false
      diff.copy(this.camera.position.clone().sub(event.object.position))
    })
    this.dragControls.addEventListener('drag', () => {
      this.update(true)
    })
    this.dragControls.addEventListener('dragend', (event) => {
      const cutePosion = event.object.position

      const cameraPotion = cutePosion.clone().add(diff)
      this.cameraControls.moveTo(cameraPotion.x, cameraPotion.y, cameraPotion.z, true)
      this.cameraControls.setLookAt(cameraPotion.x, cameraPotion.y, cameraPotion.z, cutePosion.x, cutePosion.y, cutePosion.z, true)
      this.cameraControls.enabled = true
      this.update(true)
    })
  }

  creatAmbientLight(name = "", color = 0xffffff, intensity = 1) {
    const light = new AmbientLight(color, intensity)
    light.name = name
    this.scene.add(light)
  }

  createCute() {
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, 0)
    this.modelList.push(mesh)
    this.scene.add(mesh);
  }

  addGridHelper(size = 20, divisions = 10) {
    const gridHelper = new GridHelper(size, divisions);
    this.scene.add(gridHelper);
  }


  run() {
    this.update();
  }

  update(isForce = false) {
    if (!this.renderer) return
    const delta = this.clock.getDelta();
    this.timeS += delta
    const updated = this.cameraControls.update(delta);
    if (isForce || (updated && this.timeS > (1 / this.FPS))) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.timeS = 0
    }
    requestAnimationFrame(() => this.update());
  }

  destroy() {
    this.scene.traverse((child) => this.scene.remove(child))
    this.scene.clear()
    this.renderer.forceContextLoss()
    this.renderer.dispose()
    this.modelList.length = 0
  }
}


const container = ref<HTMLElement>()
let rxh: RXH | undefined = undefined
onMounted(() => {
  rxh = new RXH(container.value || '');
  rxh.creatAmbientLight()
  rxh.createCute()
  rxh.addGridHelper()
  rxh.run()
})

</script>

<style scoped>
.container {
  width: 600px;
  height: 400px;
}
</style>
