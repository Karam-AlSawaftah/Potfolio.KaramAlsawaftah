/* ============================================================
   3D BACKGROUND — interactive floating rubber duckies (Three.js)
   - soft wandering float
   - duck-vs-duck collisions
   - the cursor pushes ducks around
   - ducks bounce off the edges of the visible window
   - scrolling drags the flock with inertia
   Purely decorative: sits behind the page, never blocks clicks.
   ============================================================ */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";


const DUCK_MODEL = "public/models/bobby.gltf";

const CONFIG = {
  duckCount: 24,
  depth: [-8, 1], // z range (camera sits at z = 14)
  swim: 0.5, // wandering force strength
  buoyancy: 0.35, // gentle bobbing force
  damping: 0.55, // velocity lost per second (water drag)
  restitution: 0.8, // bounciness of collisions
  mouseRadius: 3.4, // world-space reach of the cursor push
  mouseForce: 30,
  textForce: 3, // strength of the push away from text/content areas (soft — ducks still drift across sometimes)
  textMargin: 46, // px halo around each content rect where the push applies
  scrollForce: 0.012, // how hard scrolling drags the flock
  maxSpeed: 7,
  spin: 0.5, // ambient tumbling torque
  spinDamping: 0.35,
  maxSpin: 3,
  parallax: 0.4, // camera sway following the mouse
};

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}
if (!webglAvailable()) throw new Error("WebGL unavailable — skipping 3D background");

// With "reduce motion" enabled we don't freeze the scene — we run a much
// calmer version of it: slow drift, gentle forces, no camera parallax.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) {
  CONFIG.swim *= 0.4;
  CONFIG.buoyancy *= 0.5;
  CONFIG.mouseForce *= 0.5;
  CONFIG.scrollForce *= 0.5;
  CONFIG.maxSpeed = 2;
  CONFIG.spin *= 0.4;
  CONFIG.maxSpin = 1;
  CONFIG.parallax = 0;
}

/* ---------- stage ---------- */

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0c0d11, 14, 30);

const CAM_Z = 14;
// guard against a zero-sized viewport at load (hidden tab/pane) — an
// Infinity aspect here poisons every physics position with NaN
const safeAspect = () => (innerHeight > 0 && innerWidth > 0 ? innerWidth / innerHeight : 16 / 9);
const camera = new THREE.PerspectiveCamera(50, safeAspect(), 0.1, 60);
camera.position.set(0, 0, CAM_Z);

// Two stacked canvases sharing one scene + camera: the back one sits behind
// the page (z-index -1), the front one above the frosted panels (z-index 40).
// Three.js layers decide which ducks each canvas draws — that's what lets some
// ducks float in front of the content while the rest stay behind it.
function makeLayer(id, zIndex) {
  const c = document.createElement("div");
  c.id = id;
  c.setAttribute("aria-hidden", "true");
  c.style.zIndex = zIndex;
  document.body.prepend(c);
  const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  r.setClearColor(0x000000, 0); // transparent — page glows show through
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.setSize(innerWidth, innerHeight);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  c.appendChild(r.domElement);
  return r;
}
const BACK_LAYER = 0;
const FRONT_LAYER = 1;
const backRenderer = makeLayer("bg3d-back", "-1");
const frontRenderer = makeLayer("bg3d-front", "40");

/* image-based environment lighting so PBR/metallic materials in the
   model read correctly (a metalness-1 material is black without this) */
const pmrem = new THREE.PMREMGenerator(backRenderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

/* near-neutral lights — let the model's own texture colors show,
   with just a hint of the site's warm/red mood.
   enableAll() so they light ducks on both the back and front layers. */
const ambient = new THREE.AmbientLight(0xfff6e0, 0.35);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(6, 8, 10);
scene.add(key);
const rim = new THREE.DirectionalLight(0xd84433, 0.5);
rim.position.set(-8, -4, -6);
scene.add(rim);
[ambient, key, rim].forEach((l) => l.layers.enableAll());

/* ---------- the duck ---------- */

// Load the real duck model, normalized so its bounding sphere has radius 1
// (that keeps the physics radii below correct). Falls back to a primitive
// duck if the GLB can't load.
let duckTemplate = null;
try {
  const loader = new GLTFLoader();

  const gltf = await loader.loadAsync(DUCK_MODEL);
  const model = gltf.scene;

  // Ensure all texture maps use the proper color space
  model.traverse((obj) => {
    if (!obj.isMesh) return;

    obj.material = obj.material.clone();

    if (obj.material.map) {
      obj.material.map.colorSpace = THREE.SRGBColorSpace;
    }

    obj.material.needsUpdate = true;
  });

  const sphere = new THREE.Box3()
    .setFromObject(model)
    .getBoundingSphere(new THREE.Sphere());

  const s = 1 / sphere.radius;

  model.scale.setScalar(s);
  model.position.copy(sphere.center).multiplyScalar(-s);

  duckTemplate = model;
} catch (err) {
  console.warn("Duck model failed to load — using primitive ducks instead", err);
}

function makeDuck() {
  if (duckTemplate) {
    const duck = new THREE.Group();
    duck.add(duckTemplate.clone(true));
    return duck;
  }
  return makePrimitiveDuck();
}

const YELLOW = new THREE.MeshStandardMaterial({ color: 0xf7d566, roughness: 0.35 });
const RED = new THREE.MeshStandardMaterial({ color: 0xd84433, roughness: 0.4 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x14151b, roughness: 0.3 });

function makePrimitiveDuck() {
  const duck = new THREE.Group();

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 18), YELLOW);
  body.scale.set(1.1, 0.8, 1.25);
  duck.add(body);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 12), YELLOW);
  tail.position.set(0, 0.22, -0.85);
  tail.rotation.x = -2.2; // flick up and back
  duck.add(tail);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), YELLOW);
  head.position.set(0, 0.78, 0.42);
  duck.add(head);

  const beak = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), RED);
  beak.position.set(0, 0.72, 0.82);
  beak.scale.set(1.2, 0.5, 1.4);
  duck.add(beak);

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), DARK);
    eye.position.set(0.18 * side, 0.9, 0.73);
    duck.add(eye);

    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), YELLOW);
    wing.position.set(0.62 * side, 0.05, -0.1);
    wing.scale.set(0.45, 0.6, 1);
    wing.rotation.z = 0.35 * side;
    duck.add(wing);
  }

  return duck;
}

/* ---------- spawn the flock (no initial overlaps) ---------- */

const rand = (min, max) => min + Math.random() * (max - min);
const ducks = [];

// visible half-extents of the window at a given depth
const fovRad = (camera.fov * Math.PI) / 180;
function boundsAt(z) {
  const halfH = Math.tan(fovRad / 2) * (CAM_Z - z);
  return { halfW: halfH * safeAspect(), halfH };
}

for (let i = 0; i < CONFIG.duckCount; i++) {
  const duck = makeDuck();
  const scale = rand(0.45, 1.05);
  duck.scale.setScalar(scale);

  const radius = 1.0 * scale; // rough bounding sphere of the duck

  // rejection-sample a spawn spot that doesn't overlap the others
  for (let tries = 0; tries < 40; tries++) {
    const z = rand(CONFIG.depth[0], CONFIG.depth[1]);
    const b = boundsAt(z);
    duck.position.set(
      rand(-b.halfW + radius, b.halfW - radius),
      rand(-b.halfH + radius, b.halfH - radius),
      z
    );
    if (ducks.every((o) => duck.position.distanceTo(o.position) > radius + o.userData.radius + 0.3)) break;
  }

  // spawn in a completely random orientation — ducks tumble freely
  duck.rotation.set(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));
  duck.userData = {
    vel: new THREE.Vector3(rand(-0.5, 0.5), rand(-0.3, 0.3), rand(-0.2, 0.2)),
    angVel: new THREE.Vector3(rand(-0.7, 0.7), rand(-0.7, 0.7), rand(-0.7, 0.7)),
    radius,
    mass: scale * scale * scale,
    phase: rand(0, Math.PI * 2),
    bobSpeed: rand(0.6, 1.2),
    wanderSeed: rand(0, 100),
  };

  // The ducks nearest the camera render on the front canvas (above the
  // frosted panels); the rest stay on the back canvas behind the page.
  const onFront = duck.position.z > -1.5;
  duck.traverse((o) => o.layers.set(onFront ? FRONT_LAYER : BACK_LAYER));

  ducks.push(duck);
  scene.add(duck);
}

/* ---------- input: cursor + scroll ---------- */

const mouseNDC = new THREE.Vector2(10, 10); // offscreen until first move
const raycaster = new THREE.Raycaster();
let mouseActive = false;

addEventListener("pointermove", (e) => {
  mouseNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  mouseActive = true;
});
addEventListener("pointerleave", () => (mouseActive = false));

// scrolling drags the flock: content moves up -> ducks get pushed up too
let lastScrollY = scrollY;
let scrollImpulse = 0;
addEventListener("scroll", () => {
  scrollImpulse += (scrollY - lastScrollY) * CONFIG.scrollForce;
  lastScrollY = scrollY;
});

addEventListener("resize", () => {
  camera.aspect = safeAspect();
  camera.updateProjectionMatrix();
  backRenderer.setSize(innerWidth, innerHeight);
  frontRenderer.setSize(innerWidth, innerHeight);
});

/* ---------- text / content avoidance ----------
   Keep the ducks off the readable areas of the page. We project each duck to
   screen pixels and push it out of any content rectangle — the same idea as
   the cursor push, but done in 2D screen space against the DOM layout. */
const AVOID_SELECTOR = [
  ".hero-inner", ".about-text", ".section-head", ".group-head",
  ".project-card", ".xp-item", ".edu-item", ".skill-group",
  ".lang-item", ".contact-card",
].join(",");
const avoidNodes = [...document.querySelectorAll(AVOID_SELECTOR)];
let avoidRects = [];
function refreshAvoidRects() {
  avoidRects = avoidNodes.map((n) => n.getBoundingClientRect());
}

const _proj = new THREE.Vector3();
function avoidText(duck, dt) {
  const d = duck.userData;
  _proj.copy(duck.position).project(camera); // world -> normalized device coords
  const sx = (_proj.x * 0.5 + 0.5) * innerWidth;
  const sy = (-_proj.y * 0.5 + 0.5) * innerHeight;
  const m = CONFIG.textMargin;

  for (const r of avoidRects) {
    // closest point on the rect to the duck's screen position
    const cx = Math.max(r.left, Math.min(sx, r.right));
    const cy = Math.max(r.top, Math.min(sy, r.bottom));
    const dx = sx - cx;
    const dy = sy - cy;
    const dist = Math.hypot(dx, dy); // 0 when the duck is over the rect
    if (dist >= m) continue;

    let nx, ny;
    if (dist < 0.5) {
      // over the rect — shove out the nearest edge
      const l = sx - r.left, rr = r.right - sx, t = sy - r.top, b = r.bottom - sy;
      if (Math.min(l, rr) < Math.min(t, b)) { nx = l < rr ? -1 : 1; ny = 0; }
      else { nx = 0; ny = t < b ? -1 : 1; }
    } else {
      nx = dx / dist;
      ny = dy / dist;
    }
    const falloff = 1 - dist / m;
    const f = CONFIG.textForce * falloff * falloff * dt;
    d.vel.x += nx * f; // screen +x        -> world +x
    d.vel.y += -ny * f; // screen +y (down) -> world -y
  }
}

/* ---------- physics ---------- */

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();
const closest = new THREE.Vector3();
const _spinQ = new THREE.Quaternion();

function applyForces(duck, t, dt) {
  const d = duck.userData;

  // soft wandering (per-duck pseudo-noise) + gentle buoyant bob
  tmp.set(
    Math.sin(t * 0.31 + d.wanderSeed) + Math.sin(t * 0.13 + d.wanderSeed * 2.7),
    Math.sin(t * 0.27 + d.wanderSeed * 1.3) * 0.6,
    Math.sin(t * 0.17 + d.wanderSeed * 0.7) * 0.5
  );
  d.vel.addScaledVector(tmp, CONFIG.swim * dt);
  d.vel.y += Math.sin(t * d.bobSpeed + d.phase) * CONFIG.buoyancy * dt;

  // lazy ambient tumble + rotational drag
  tmp.set(
    Math.sin(t * 0.21 + d.wanderSeed * 1.9),
    Math.sin(t * 0.16 + d.wanderSeed * 0.6),
    Math.sin(t * 0.11 + d.wanderSeed * 2.2)
  );
  d.angVel.addScaledVector(tmp, CONFIG.spin * dt);
  d.angVel.multiplyScalar(Math.max(0, 1 - CONFIG.spinDamping * dt));
  if (d.angVel.length() > CONFIG.maxSpin) d.angVel.setLength(CONFIG.maxSpin);

  // cursor push: distance from the mouse ray, at any depth
  if (mouseActive) {
    raycaster.setFromCamera(mouseNDC, camera);
    closest.copy(duck.position).sub(raycaster.ray.origin);
    const along = closest.dot(raycaster.ray.direction);
    closest.copy(raycaster.ray.direction).multiplyScalar(along).add(raycaster.ray.origin);
    tmp.copy(duck.position).sub(closest); // from ray toward duck
    const dist = tmp.length();
    if (dist < CONFIG.mouseRadius) {
      // dead-center hit has no sideways direction — push it deeper instead
      if (dist < 0.05) tmp.set(rand(-0.3, 0.3), rand(-0.3, 0.3), -1);
      const falloff = 1 - dist / CONFIG.mouseRadius;
      d.vel.addScaledVector(tmp.normalize(), CONFIG.mouseForce * falloff * falloff * dt);
      // the shove also sends the duck tumbling
      tmp2.crossVectors(tmp, raycaster.ray.direction);
      d.angVel.addScaledVector(tmp2, CONFIG.mouseForce * falloff * dt * 0.35);
    }
  }

  // scroll drag
  d.vel.y += scrollImpulse;

  // steer away from text / content areas
  avoidText(duck, dt);

  // water drag + speed cap
  d.vel.multiplyScalar(Math.max(0, 1 - CONFIG.damping * dt));
  if (d.vel.length() > CONFIG.maxSpeed) d.vel.setLength(CONFIG.maxSpeed);
}

function collideDucks() {
  for (let i = 0; i < ducks.length; i++) {
    for (let j = i + 1; j < ducks.length; j++) {
      const a = ducks[i], b = ducks[j];
      const ua = a.userData, ub = b.userData;
      tmp.copy(b.position).sub(a.position);
      const dist = tmp.length();
      const minDist = ua.radius + ub.radius;
      // NaN-proof guard: any weird distance must skip, never fall through
      if (!(dist < minDist) || !(dist > 0.0001)) continue;

      const n = tmp.divideScalar(dist); // collision normal a -> b
      const overlap = minDist - dist;
      const totalMass = ua.mass + ub.mass;

      // separate them proportionally to mass
      a.position.addScaledVector(n, (-overlap * ub.mass) / totalMass);
      b.position.addScaledVector(n, (overlap * ua.mass) / totalMass);

      // elastic impulse along the normal
      const relVel = ub.vel.dot(n) - ua.vel.dot(n);
      if (relVel < 0) {
        const impulse = (-(1 + CONFIG.restitution) * relVel) / totalMass;
        ua.vel.addScaledVector(n, -impulse * ub.mass);
        ub.vel.addScaledVector(n, impulse * ua.mass);

        // glancing hits spin both ducks (torque from tangential slip)
        tmp2.copy(ub.vel).sub(ua.vel).cross(n);
        ua.angVel.addScaledVector(tmp2, impulse * ub.mass * 0.4);
        ub.angVel.addScaledVector(tmp2, -impulse * ua.mass * 0.4);
      }
    }
  }
}

function collideWalls(duck) {
  const d = duck.userData;
  const r = d.radius;

  // self-heal: if anything ever corrupts a duck, respawn it in-bounds
  if (!Number.isFinite(duck.position.x + duck.position.y + duck.position.z)) {
    const bb = boundsAt(-4);
    duck.position.set(rand(-bb.halfW + r, bb.halfW - r), rand(-bb.halfH + r, bb.halfH - r), -4);
    d.vel.set(0, 0, 0);
    d.angVel.set(rand(-0.5, 0.5), rand(-0.5, 0.5), rand(-0.5, 0.5));
  }

  const b = boundsAt(duck.position.z);

  if (duck.position.x > b.halfW - r) {
    duck.position.x = b.halfW - r;
    d.vel.x = -Math.abs(d.vel.x) * CONFIG.restitution;
  } else if (duck.position.x < -b.halfW + r) {
    duck.position.x = -b.halfW + r;
    d.vel.x = Math.abs(d.vel.x) * CONFIG.restitution;
  }

  if (duck.position.y > b.halfH - r) {
    duck.position.y = b.halfH - r;
    d.vel.y = -Math.abs(d.vel.y) * CONFIG.restitution;
  } else if (duck.position.y < -b.halfH + r) {
    duck.position.y = -b.halfH + r;
    d.vel.y = Math.abs(d.vel.y) * CONFIG.restitution;
  }

  if (duck.position.z > CONFIG.depth[1]) {
    duck.position.z = CONFIG.depth[1];
    d.vel.z = -Math.abs(d.vel.z) * CONFIG.restitution;
  } else if (duck.position.z < CONFIG.depth[0]) {
    duck.position.z = CONFIG.depth[0];
    d.vel.z = Math.abs(d.vel.z) * CONFIG.restitution;
  }
}

/* ---------- animation loop ---------- */

const clock = new THREE.Clock();

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05); // clamp: no physics explosions after tab-switch
  const t = clock.getElapsedTime();

  refreshAvoidRects(); // current viewport-relative rects (they move as you scroll)

  for (const duck of ducks) {
    applyForces(duck, t, dt);
    duck.position.addScaledVector(duck.userData.vel, dt);
  }

  collideDucks();

  for (const duck of ducks) {
    collideWalls(duck);

    // free tumbling: integrate angular velocity (quaternion, no gimbal lock)
    const d = duck.userData;
    const w = d.angVel.length();
    if (w > 0.0001) {
      _spinQ.setFromAxisAngle(tmp.copy(d.angVel).divideScalar(w), w * dt);
      duck.quaternion.premultiply(_spinQ);
    }
  }

  scrollImpulse *= 0.6; // impulse fades quickly after the scroll stops

  // soft camera parallax toward the mouse
  camera.position.x += (mouseNDC.x * CONFIG.parallax - camera.position.x) * 0.03;
  camera.position.y += (mouseNDC.y * CONFIG.parallax - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);

  // draw each layer to its own canvas: back ducks behind the page, front
  // ducks above the frosted panels
  camera.layers.set(BACK_LAYER);
  backRenderer.render(scene, camera);
  camera.layers.set(FRONT_LAYER);
  frontRenderer.render(scene, camera);

  requestAnimationFrame(tick);
}

// Draw one frame immediately so the ducks are on screen from the start,
// then hand over to the animation loop.
refreshAvoidRects();
camera.layers.set(BACK_LAYER);
backRenderer.render(scene, camera);
camera.layers.set(FRONT_LAYER);
frontRenderer.render(scene, camera);
tick();

// debug handle (harmless in production)
window.__bg3d = { scene, camera, backRenderer, frontRenderer, ducks, CONFIG };
