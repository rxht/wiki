<template>
  <div class="container" ref="container" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CameraControls from "camera-controls";
import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

CameraControls.install({ THREE })

import earth_daymap from "../../assets/earth/2k_earth_daymap.jpg"



const CameraParams = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(0, 120, 120),
  lookAt: new THREE.Vector3(0, 0, 0)
}

const areas = [
  {
    name: "中国",
    position: [116.20, 39.55]
  },
  {
    name: "中非共和国",
    position: [18.35, 4.23]
  },
  {
    name: "智利",
    position: [-70.40, -33.24]
  },
  {
    name: "乍得",
    position: [14.59, 12.10]
  },
  {
    name: "赞比亚",
    position: [28.16, -15.28]
  },
  {
    name: "越南",
    position: [105.55, 21.05]
  },
  {
    name: "约旦",
    position: [35.52, 31.57]
  },
  {
    name: "维尔京群岛",
    position: [-64.37, 18.27]
  },
  {
    name: "英国",
    position: [-0.05, 51.36]
  }
]

class EARCH extends THREE.EventDispatcher {
  private containerElement: HTMLElement
  private renderer: THREE.WebGLRenderer
  private labelRenderer: CSS2DRenderer
  private earth: THREE.Mesh | undefined = undefined
  private clock = new THREE.Clock()
  private camera: THREE.PerspectiveCamera
  private cameraControls: CameraControls
  private raycaster: THREE.Raycaster
  private scene: THREE.Scene
  private FPS: number = 60
  private timeS: number = 0

  private dynamicHide = false

  private labelList: Array<CSS2DObject> = []

  constructor(containerElement: HTMLElement | string) {
    super();

    this.containerElement = containerElement instanceof HTMLElement ? containerElement : document.querySelector(containerElement) || document.body
    const { offsetWidth, offsetHeight } = this.containerElement

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.containerElement.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(offsetWidth, offsetHeight);
    this.labelRenderer.domElement.setAttribute('style', 'position: absolute; top: 0; left: 0; pointer-events:none; events:none;')
    this.labelRenderer.domElement.className = 'label'
    this.containerElement.appendChild(this.labelRenderer.domElement);

    const { fov, near, far, position, lookAt } = CameraParams
    this.camera = new THREE.PerspectiveCamera(fov, offsetWidth / offsetHeight, near, far);
    this.camera.position.copy(position)
    this.camera.lookAt(lookAt)

    this.cameraControls = new CameraControls(this.camera, this.renderer.domElement)
    Object.assign(this.cameraControls, {
      maxDistance: 1000,
      minDistance: 180
    })
    this.cameraControls.moveTo(position.x, position.y, position.z, true)
    this.cameraControls.setTarget(lookAt.x, lookAt.y, lookAt.z, true)

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = far;

    this.scene = new THREE.Scene()

    window.addEventListener('resize', () => this.resize(), false);
  }


  /**
   * @description 环境光
   * @author rxht
   * @date 2024-01-18
   * @param {string} [name=""]
   * @param {number} [color=0xffffff]
   * @param {number} [intensity=1]
   * @memberof EARCH
   */
  creatAmbientLight(name = "", color = 0xffffff, intensity = 2) {
    const light = new THREE.AmbientLight(color, intensity)
    light.name = name
    this.scene.add(light)
  }

  createEarth() {
    const geometry = new THREE.SphereGeometry(100, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(earth_daymap),
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.earth = mesh
    this.scene.add(mesh)
  }


  createAreaPoint(isDynamicHide: boolean) {
    this.dynamicHide = isDynamicHide
    this.labelList.length = 0
    for (let i = 0, length = areas.length; i < length; i++) {
      const name = areas[i].name
      const position = this.createPosition(areas[i].position)						
      this.createText(position, name); // 精灵标签函数						
    }
  }
  // 经纬度转坐标
  createPosition(lnglat: number[]) {
    const spherical = new THREE.Spherical(100)
    const lng = lnglat[0]
    const lat = lnglat[1]
    const theta = (lng + 90) * (Math.PI / 180)
    const phi = (90 - lat) * (Math.PI / 180)
    spherical.phi = phi; // phi是方位面（水平面）内的角度，范围0~360度
    spherical.theta = theta; // theta是俯仰面（竖直面）内的角度，范围0~180度
    const position = new THREE.Vector3()
    position.setFromSpherical(spherical)
    return position
  }

  createText(position: THREE.Vector3, name: string) {
    const laberDiv = document.createElement('div');//创建div容器
    laberDiv.className = 'laber_name';
    laberDiv.textContent = name;
    laberDiv.style.color = 'red'
    laberDiv.style.backgroundColor = 'transparent';
    const pointLabel = new CSS2DObject(laberDiv);   
    pointLabel.position.copy(position)
    this.labelList.push(pointLabel);
    this.earth?.add(pointLabel)
  }

  raycasterCollsionDetect(wavesLabel: CSS2DObject) {
    if (!this.earth) return
    const labelPosition = wavesLabel.position.clone()
    //计算出标签和相机之前的距离(需要看备份一下坐标，不然执行下面转换NDC坐标后，计算会不准)
    const labelDistance = labelPosition.distanceTo(this.camera.position)
    //转换 向量到从世界空间投影到相机的标准化坐标（NDC）
    labelPosition.project(this.camera)

    this.raycaster.setFromCamera(new THREE.Vector2(labelPosition.x, labelPosition.y), this.camera)
    const intersects = this.raycaster.intersectObjects([this.earth])
    if (intersects.length == 0) {
        // 如果标签没有被model遮挡，应该全部显示
        wavesLabel.element.style.display = 'block'
    } else {
        const minDistance = intersects[0].distance
        if (minDistance < labelDistance) {
            wavesLabel.element.style.display = 'none'
        } else {
            wavesLabel.element.style.display = 'block'
        }
    }
  }
  
  selfRenderer() {
    this.dynamicHide && this.labelList.forEach(label => this.raycasterCollsionDetect(label))
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
      this.labelRenderer.render(this.scene, this.camera);
      this.selfRenderer()
      this.timeS = 0
    }
    requestAnimationFrame(() => this.update());
  }

  resize() {
    const { offsetWidth, offsetHeight } = this.containerElement
    this.camera.aspect = offsetWidth / offsetHeight
    this.renderer.setSize(offsetWidth, offsetHeight, true)
    this.labelRenderer.setSize(offsetWidth, offsetHeight);
    this.camera.updateProjectionMatrix()
  }

  destroy() {
    this.scene?.traverse((child) => this.scene.remove(child))
    this.scene.clear()
    this.renderer.forceContextLoss()
    this.renderer.dispose()
  }
}


interface Props {
  isLabel?: boolean
  isDynamicHide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLabel: false,
  isDynamicHide: false
})

const container = ref<HTMLElement>()
let earth: EARCH | undefined = undefined
onMounted(() => {
  console.log("🚀 ~ props ~ props:", props)
  earth = new EARCH(container.value || '');
  earth.creatAmbientLight()
  earth.createEarth()
  props.isLabel && earth.createAreaPoint(props.isDynamicHide)
  earth.run()
})

</script>

<style scoped>
.container {
  position: relative;
  width: 600px;
  height: 400px;
}
</style>
