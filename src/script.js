import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import anime from "animejs/lib/anime.es.js";
import scrollmonitor from "scrollmonitor";
import { scrollIntoView } from "scroll-js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let model = null;

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Loaders
 */

gsap.registerPlugin(ScrollTrigger);

const loadingBarElement = document.querySelector(".loading-bar");
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });

      document.querySelector(".container-fluid").classList.add("d-block");

      // Update loadingBarElement
      loadingBarElement.classList.add("ended");
      loadingBarElement.style.transform = "";
    }, 500);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

const gltfLoader = new GLTFLoader(loadingManager);
// var SPECTOR = require("spectorjs");

// var spector = new SPECTOR.Spector();
// spector.displayUI();

/**
 * Model
 */
const material = new THREE.MeshLambertMaterial({
  color: 0xe759ca,
  // flatShading: false,
});
gltfLoader.load("brain.glb", (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === "brain");
  bakedMesh.material = material;
  // bakedMesh.flatShading = false;
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, -0.6, 0);
  gltf.scene.rotateY(Math.PI);
  model = gltf.scene;
  scene.add(model);
});

/**
 * Anime js
 */

let startup = 0;

// Frontal Lobe
var frontalLobe = {};
frontalLobe.opacityIn = [0, 1];
frontalLobe.scaleIn = 3;
frontalLobe.scaleOut = [0.2, 1];
frontalLobe.durationIn = 800;
frontalLobe.durationOut = 600;
frontalLobe.delay = 500;

anime.set("#frontal-lobe", {
  translateX: "-50%",
  translateY: "-50%",
});

const flElement = document.getElementById("fl-elements");
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeCircles = flElement.appendChild(div);
  animeCircles.classList.add("anime-circle");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeTriangles = flElement.appendChild(div);
  animeTriangles.classList.add("anime-triangle");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeStars = flElement.appendChild(div);
  animeStars.classList.add("anime-star");
}

let circles = document.querySelectorAll(".anime-circle");
let triangles = document.querySelectorAll(".anime-triangle");
let stars = document.querySelectorAll(".anime-star");

var fl1 = document.getElementById("frontal-lobe");

var elementWatcher = scrollmonitor.create(fl1);

elementWatcher.enterViewport(function () {
  if (startup > 3) {
    const fLobe = document.querySelector(".frontal-lobe");
    scrollIntoView(fLobe, { behavior: "smooth" });
  }
  anime
    .timeline()
    .add({
      targets: "#frontal-lobe",
      opacity: 0,
      scale: frontalLobe.scaleIn,
      duration: frontalLobe.durationOut,
      easing: "easeInExpo",
      delay: frontalLobe.delay,
    })
    .add({
      targets: "#frontal-lobe",
      opacity: frontalLobe.opacityIn,
      scale: frontalLobe.scaleOut,
      duration: frontalLobe.durationIn,
      delay: frontalLobe.delay,
    });
  anime({
    targets: [circles, triangles, stars],
    opacity: [0, 1],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
  if (model != null) {
    gsap.to(model.position, {
      duration: 1,
      x: 3,
      y: -0.6,
      z: 0,
      ease: "easeIn",
    });
    gsap.to(pointLight.position, {
      duration: 1,
      x: 3,
      y: 0,
      z: 3,
      ease: "easeIn",
    });
    console.log(model.rotation.y);
    gsap.to(model.rotation, {
      duration: 1,
      y: 0,
      ease: "easeIn",
    });
  }
  console.log(startup);
  startup += 1;
});
elementWatcher.exitViewport(function () {
  anime.timeline().add({
    targets: "#frontal-lobe",
    opacity: 0,
    scale: frontalLobe.scaleIn,
    duration: frontalLobe.durationOut,
    easing: "easeInExpo",
  });
  anime({
    targets: [circles, triangles, stars],
    opacity: [1, 0],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
});

// Occipital Lobe
anime.set("#occipital-lobe", {
  translateX: "-10%",
  translateY: "-50%",
});

const olElement = document.getElementById("ol-elements");
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeHeart = olElement.appendChild(div);
  animeHeart.classList.add("anime-heart");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeCrescent = olElement.appendChild(div);
  animeCrescent.classList.add("anime-crescent");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeShape = olElement.appendChild(div);
  animeShape.classList.add("anime-shape");
}

let hearts = document.querySelectorAll(".anime-heart");
let crescents = document.querySelectorAll(".anime-crescent");
let shapes = document.querySelectorAll(".anime-shape");

const occipitalLobe = document.querySelector("#occipital-lobe");

var elementWatcherOc = scrollmonitor.create(occipitalLobe);

var textWrapperOc = document.querySelectorAll(".oc");
for (let oc of textWrapperOc) {
  oc.innerHTML = oc.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );
}
elementWatcherOc.enterViewport(function () {
  if (startup > 3) {
    const oLobe = document.querySelector(".occipital-lobe");
    // oLobe.scroll({ top: oLobe.scrollHeight, behavior: "smooth" });
    scrollIntoView(oLobe, { behavior: "smooth" });
  }
  anime.timeline().add({
    targets: occipitalLobe,
    translateX: "-10%",
    opacity: 1,
    duration: 2000,
  });
  anime.timeline().add({
    targets: ".oc .letter",
    scale: [4, 1],
    opacity: [0, 1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 55 * i,
  });
  anime({
    targets: [hearts, crescents, shapes],
    opacity: [0, 1],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
  if (model != null) {
    gsap.to(model.position, {
      duration: 1,
      x: -3,
      y: -0.6,
      z: 0,
      ease: "easeIn",
    });
    gsap.to(pointLight.position, {
      duration: 1,
      x: -3,
      y: 0,
      z: 3,
      ease: "easeIn",
    });
    gsap.to(model.rotation, {
      duration: 1,
      y: Math.PI,
      ease: "easeIn",
    });
  }
  console.log(startup);
  startup += 1;
});
elementWatcherOc.exitViewport(function () {
  anime.timeline().add({
    targets: occipitalLobe,
    translateX: "-200%",
    opacity: 0,
    duration: 2000,
  });
  anime({
    targets: [hearts, crescents, shapes],
    opacity: [1, 0],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
});

// Parietal Lobe
anime.set("#parietal-lobe", {
  translateX: "-50%",
  translateY: "-50%",
});

const plElements = document.getElementById("pl-elements");
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeDragon = plElements.appendChild(div);
  animeDragon.classList.add("anime-dragon");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeShuriken = plElements.appendChild(div);
  animeShuriken.classList.add("anime-shuriken");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeLightning = plElements.appendChild(div);
  animeLightning.classList.add("anime-lightning");
}

let dragons = document.querySelectorAll(".anime-dragon");
let shurikens = document.querySelectorAll(".anime-shuriken");
let lightnings = document.querySelectorAll(".anime-lightning");

// Wrap every letter in a span
var textWrapperPt = document.querySelector(".pt");
textWrapperPt.innerHTML = textWrapperPt.textContent.replace(
  /\S/g,
  "<div class='letter' style='display: inline-block;'>$&</div>"
);

const parietalLobe = document.querySelector("#parietal-lobe");

var elementWatcherPt = scrollmonitor.create(parietalLobe);

elementWatcherPt.enterViewport(function () {
  if (startup > 3) {
    const pLobe = document.querySelector(".parietal-lobe");
    scrollIntoView(pLobe, { behavior: "smooth" });
  }
  anime.timeline().add({
    targets: parietalLobe,
    opacity: 1,
    duration: 2000,
  });
  anime.timeline().add({
    targets: ".pt .letter",
    rotateY: [-90, 0],
    duration: 2900,
    delay: (el, i) => 140 * i,
  });
  anime({
    targets: [dragons, shurikens, lightnings],
    opacity: [0, 1],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
  console.log("enter parietal lobe");
  console.log(startup);
  startup += 1;
});
elementWatcherPt.exitViewport(function () {
  anime.timeline().add({
    targets: parietalLobe,
    opacity: 0,
    duration: 2000,
  });
  anime({
    targets: [dragons, shurikens, lightnings],
    opacity: [1, 0],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-80, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 80) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
});

// Temporal Lobe
anime.set("#temporal-lobe", {
  translateX: "-10%",
  translateY: "-50%",
});

const tlElements = document.getElementById("tl-elements");
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animePacman = tlElements.appendChild(div);
  animePacman.classList.add("anime-pacman");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeButterfly = tlElements.appendChild(div);
  animeButterfly.classList.add("anime-butterfly");
}
for (let i = 0; i < 51; i++) {
  let div = document.createElement("div");
  let animeLeaf = tlElements.appendChild(div);
  animeLeaf.classList.add("anime-clover-leaf");
}

let pacmen = document.querySelectorAll(".anime-pacman");
let butterflies = document.querySelectorAll(".anime-butterfly");
let leaves = document.querySelectorAll(".anime-clover-leaf");

// Wrap every letter in a span
var textWrapperTl = document.querySelector(".tp");
textWrapperTl.innerHTML = textWrapperTl.textContent.replace(
  /\S/g,
  "<div class='letter' style='display: inline-block;'>$&</div>"
);

const temporalLobe = document.querySelector("#temporal-lobe");
var elementWatcherTl = scrollmonitor.create(temporalLobe);

elementWatcherTl.enterViewport(function () {
  if (startup > 3) {
    const tLobe = document.querySelector(".temporal-lobe");
    scrollIntoView(tLobe, { behavior: "smooth" });
  }
  anime.timeline().add({
    targets: temporalLobe,
    opacity: 1,
    duration: 2000,
  });
  anime.timeline({ loop: true }).add({
    targets: ".tp .letter",
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: (el, i) => 95 * (i + 1),
  });
  anime({
    targets: [pacmen, butterflies, leaves],
    opacity: [0, 1],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-50, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 40) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
  console.log(startup);
  startup += 1;
});
elementWatcherTl.exitViewport(function () {
  anime.timeline().add({
    targets: temporalLobe,
    opacity: 0,
    duration: 2000,
  });
  anime({
    targets: [pacmen, butterflies, leaves],
    opacity: [1, 0],
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let luminosity = 70;
      let hslValue = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
      return hslValue;
    },
    // borderRadius: () => {
    //   return anime.random(25, 50);
    // },
    translateX: () => {
      return anime.random(-50, 80) + "vw";
    },
    translateY: () => {
      return anime.random(-80, 40) + "vh";
    },
    rotate: () => {
      return anime.random(0, 360);
    },
    scale: () => {
      return anime.random(0.45, 1.75);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    // direction: "alternate",
    easing: "easeOutExpo",
    // loop: true,
    delay: 1000,
  });
});

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.04;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

// Point light
const pointLight = new THREE.PointLight(0xe759ca, 1, 10);
pointLight.position.set(0, 0, 3);
scene.add(pointLight);

gui.add(pointLight, "intensity").min(0.2).max(10).step(0.001);
gui.add(pointLight.position, "x").min(0).max(10).step(0.001);
gui.add(pointLight.position, "y").min(0).max(10).step(0.001);
gui.add(pointLight.position, "z").min(0).max(10).step(0.001);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);
// Directional light
const directionalLight = new THREE.DirectionalLight(0xe759ca, 0.4);
directionalLight.position.set(1, 6, 0);
scene.add(directionalLight);
gui.add(directionalLight, "intensity").min(0.2).max(10).step(0.001);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

/**
 * Object Tracking
 */

// loadingManager.onLoad(() => {
// });
// frontlLobe.addEventListener("dblclick", () => {
//   // gsap.to(model.position, {
//   //   duration: 1,
//   //   x: 0,
//   //   y: -0.6,
//   //   z: 0,
//   //   ease: "easeIn",
//   // });
//   gsap.to(model.rotation, {
//     duration: 1,
//     x: model.rotation.x + 2 * Math.PI,
//     ease: "easeIn",
//   });
//   // randomAnimation.pause();
//   // gsap.to(pointLight.position, {
//   //   duration: 1,
//   //   x: 0,
//   //   y: 0,
//   //   z: 3,
//   //   ease: "easeIn",
//   // });
//   // model.position.set(1, -0.6, 0);
// });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.left = (-sizes.width / sizes.height) * 2;
  camera.right = (sizes.width / sizes.height) * 2;
  camera.top = 2;
  camera.bottom = -2;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -2 * aspectRatio,
  2 * aspectRatio,
  2,
  -2,
  -100,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
