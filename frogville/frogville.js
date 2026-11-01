import * as THREE from "three";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = Math.min(innerWidth, innerHeight) < 700;
const canvas = document.getElementById("bayou");
document.body.classList.add("entering");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
const scene = new THREE.Scene();
const dusk = new THREE.Color("#3b2a4a"), night = new THREE.Color("#0b1622");
scene.background = dusk.clone();
scene.fog = new THREE.Fog(dusk.clone(), 18, 70);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

const hemi = new THREE.HemisphereLight("#ffd9a8", "#16301f", 1.1);
scene.add(hemi);
const moon = new THREE.DirectionalLight("#cfe3ff", 0.9);
moon.position.set(-10, 20, 5);
scene.add(moon);

const M = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
const rnd = (a, b) => a + Math.random() * (b - a);
const LEN = 110;

/* water */
const seg = small ? 40 : 80;
const waterGeo = new THREE.PlaneGeometry(60, LEN + 40, seg, seg * 2);
waterGeo.rotateX(-Math.PI / 2);
const water = new THREE.Mesh(waterGeo, new THREE.MeshPhongMaterial({ color: "#1f4a3a", specular: "#9fe8c8", shininess: 60, flatShading: true }));
water.position.z = -LEN / 2 + 10;
scene.add(water);
const wpos = waterGeo.attributes.position;
const base = Float32Array.from(wpos.array);

/* banks */
for (const s of [-1, 1]) {
  const bank = new THREE.Mesh(new THREE.BoxGeometry(30, 1, LEN + 40), M("#2f4a22"));
  bank.position.set(s * 26, 0.2, -LEN / 2 + 10);
  scene.add(bank);
}

/* cypress trees */
const trunkMat = M("#4a3424"), leafMat = M("#24412a"), mossMat = M("#55704a", { side: THREE.DoubleSide });
function cypress(x, z, h) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.9, h, 7), trunkMat);
  trunk.position.y = h / 2; g.add(trunk);
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(2.4 - i * 0.6, 3, 7), leafMat);
    c.position.y = h + i * 1.4 - 0.5; g.add(c);
    const moss = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 1.2), mossMat);
    moss.position.set(rnd(-1.5, 1.5), h + i * 1.4 - 2, rnd(-1, 1)); g.add(moss);
  }
  g.position.set(x, 0, z);
  scene.add(g);
}
for (let z = 6; z > -LEN; z -= small ? 7 : 4.5) {
  cypress(rnd(-16, -9), z + rnd(-2, 2), rnd(4, 8));
  cypress(rnd(9, 16), z + rnd(-2, 2), rnd(4, 8));
}

/* lily pads */
const padMat = M("#4f9a3a", { side: THREE.DoubleSide }), flowerMat = M("#ff8fb8");
const pads = [];
function pad(x, z, r = rnd(0.6, 1.1)) {
  const p = new THREE.Mesh(new THREE.CircleGeometry(r, 16, 0.3, Math.PI * 1.8), padMat);
  p.rotation.x = -Math.PI / 2; p.rotation.z = rnd(0, 6);
  p.position.set(x, 0.12, z);
  scene.add(p); pads.push(p);
  if (Math.random() < 0.25) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 6), flowerMat);
    f.position.set(x + 0.2, 0.3, z); scene.add(f);
  }
  return p;
}
for (let i = 0; i < (small ? 40 : 80); i++) pad(rnd(-8, 8), rnd(-LEN, 6));

/* frogs */
const frogMat = M("#6ccf3c"), bellyMat = M("#e8f2a0"), eyeMat = M("#ffffff"), pupilMat = M("#111111"), hatMat = M("#fc1826");
function frog(scale = 1, hat = false) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 10), frogMat);
  body.scale.set(1, 0.7, 1.15); body.position.y = 0.35; g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), bellyMat);
  belly.scale.set(0.9, 0.55, 0.6); belly.position.set(0, 0.28, 0.32); g.add(belly);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), eyeMat);
    eye.position.set(s * 0.24, 0.72, 0.28); g.add(eye);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), pupilMat);
    pu.position.set(s * 0.25, 0.74, 0.43); g.add(pu);
    const leg = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), frogMat);
    leg.scale.set(1, 0.5, 1.6); leg.position.set(s * 0.45, 0.15, -0.1); g.add(leg);
  }
  if (hat) {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16), hatMat);
    brim.position.y = 0.9; g.add(brim);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 12), hatMat);
    top.position.y = 1.05; g.add(top);
  }
  g.scale.setScalar(scale);
  scene.add(g);
  return g;
}
const hoppers = [];
for (let i = 0; i < (small ? 7 : 14); i++) {
  const f = frog(rnd(0.8, 1.2), Math.random() < 0.3);
  hoppers.push({ f, x: rnd(-6, 6), z: rnd(-LEN + 10, 2), phase: rnd(0, 6), dir: rnd(0, Math.PI * 2), speed: rnd(0.6, 1.2) });
}

/* Lily Pad Porch Stage (left, z -28) */
const wood = M("#7a4a2a"), woodDark = M("#3c2216");
const stage = new THREE.Group();
const deck = new THREE.Mesh(new THREE.BoxGeometry(9, 0.8, 5), wood); deck.position.y = 0.6; stage.add(deck);
const back = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 0.3), woodDark); back.position.set(0, 3, -2.4); stage.add(back);
for (const s of [-1, 1]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 0.3), woodDark); post.position.set(s * 4.3, 3, 2.2); stage.add(post); }
const roof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 2.2, 4), M("#8b2a1e")); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.6; roof.position.y = 6.3; stage.add(roof);
const bulbs = [];
for (let i = 0; i < 12; i++) {
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffd36b" }));
  const t = i / 11; b.position.set(-4.3 + t * 8.6, 5 - Math.sin(t * Math.PI) * 0.6, 2.25); stage.add(b); bulbs.push(b);
}
/* banjo frog */
const picker = frog(1.4, true); picker.position.set(0, 1, 0.5); stage.add(picker);
const banjo = new THREE.Group();
const head = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 18), M("#f6efe4")); head.rotation.x = Math.PI / 2; banjo.add(head);
const rim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 6, 18), M("#c9a24a")); banjo.add(rim);
const neck = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.05), woodDark); neck.position.set(0, 0.75, 0); banjo.add(neck);
banjo.rotation.z = -0.9; banjo.position.set(0.15, 0.45, 0.6); picker.add(banjo);
const spot = new THREE.PointLight("#ffcc77", 30, 14); spot.position.set(0, 5, 3); stage.add(spot);
stage.position.set(-7, 0, -28); stage.rotation.y = 0.5;
scene.add(stage);
/* music notes */
const noteMat = new THREE.MeshBasicMaterial({ color: "#fcd11a" });
const notes = [];
for (let i = 0; i < 6; i++) {
  const n = new THREE.Group();
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), noteMat); dot.scale.y = 0.75; n.add(dot);
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.04), noteMat); stem.position.set(0.14, 0.3, 0); n.add(stem);
  scene.add(n); notes.push({ n, t: i / 6 });
}

/* Boil Shack Bar (right, z -52) */
const shack = new THREE.Group();
const box = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 4), M("#9a6a3c")); box.position.y = 2; shack.add(box);
const sroof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 2, 4), M("#c8102e")); sroof.rotation.y = Math.PI / 4; sroof.position.y = 4.8; shack.add(sroof);
const counter = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.1, 1), woodDark); counter.position.set(0, 0.8, 2.3); shack.add(counter);
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1, 14), M("#333333")); pot.position.set(-4, 0.9, 1.5); shack.add(pot);
const steam = [];
for (let i = 0; i < 5; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.35 })); shack.add(s); steam.push({ s, t: i / 5 }); }
const lantern = new THREE.PointLight("#ff9a3c", 25, 12); lantern.position.set(0, 3, 4); shack.add(lantern);
shack.position.set(8, 0, -52); shack.rotation.y = -0.5;
scene.add(shack);

/* Swamp Games (left, z -76): pennants and a lily pad race lane */
const flagCols = ["#fc1826", "#fcd11a", "#6ccf3c", "#f6efe4"];
for (let i = 0; i < 14; i++) {
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 3), M(flagCols[i % 4]));
  fl.rotation.z = Math.PI; fl.position.set(-12 + i * 1.1, 4.2 - Math.sin((i / 13) * Math.PI) * 0.8, -76); scene.add(fl);
}
for (const s of [-1, 1]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5), woodDark); pole.position.set(s === -1 ? -12.5 : 2.8, 2.3, -76); scene.add(pole); }
const racers = [];
for (let l = 0; l < 3; l++) {
  for (let i = 0; i < 6; i++) pad(-9 + i * 1.8, -73 - l * 2.2, 0.7);
  const r = frog(0.9, l === 0); racers.push({ r, lane: l }); }

/* fireflies */
const FN = small ? 120 : 260;
const fpos = new Float32Array(FN * 3), fph = new Float32Array(FN);
for (let i = 0; i < FN; i++) { fpos[i * 3] = rnd(-16, 16); fpos[i * 3 + 1] = rnd(0.5, 7); fpos[i * 3 + 2] = rnd(-LEN, 8); fph[i] = rnd(0, 6.28); }
const fgeo = new THREE.BufferGeometry();
fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
fgeo.setAttribute("phase", new THREE.BufferAttribute(fph, 1));
const fmat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uTime: { value: 0 }, uNight: { value: 0 }, uScale: { value: renderer.getPixelRatio() } },
  vertexShader: `attribute float phase; uniform float uTime; uniform float uScale; varying float vA;
    void main(){ vec3 p=position; p.x+=sin(uTime*0.6+phase)*0.6; p.y+=sin(uTime*0.9+phase*2.0)*0.4;
    vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
    vA=0.35+0.65*max(0.0,sin(uTime*2.0+phase*3.0)); gl_PointSize=uScale*90.0/-mv.z; }`,
  fragmentShader: `uniform float uNight; varying float vA;
    void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d)*vA*(0.3+0.7*uNight);
    gl_FragColor=vec4(1.0,0.9,0.35,a); }`
});
scene.add(new THREE.Points(fgeo, fmat));

/* moon */
const moonBall = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 14), new THREE.MeshBasicMaterial({ color: "#fff3cf", fog: false }));
moonBall.position.set(18, 28, -120); scene.add(moonBall);

/* camera path: weave toward each feature */
const stops = [
  { z: 10, x: 0, y: 3.2, lx: 0, lz: -10 },
  { z: -16, x: -2, y: 3, lx: -7, lz: -28 },
  { z: -40, x: 3, y: 3, lx: 8, lz: -52 },
  { z: -64, x: -2, y: 3.4, lx: -5, lz: -75 },
  { z: -84, x: 4, y: 5, lx: -4, lz: -74 },
  { z: -90, x: 2, y: 7.5, lx: -3, lz: -72 }
];
let target = 0, prog = 0;
function onScroll() { const max = document.documentElement.scrollHeight - innerHeight; target = max > 0 ? scrollY / max : 0; if (reduce) { prog = target; frame(performance.now()); } }
addEventListener("scroll", onScroll, { passive: true });
function lerp(a, b, t) { return a + (b - a) * t; }
function camAt(p) {
  const f = p * (stops.length - 1), i = Math.min(Math.floor(f), stops.length - 2), t = f - i;
  const s = t * t * (3 - 2 * t), a = stops[i], b = stops[i + 1];
  camera.position.set(lerp(a.x, b.x, s), lerp(a.y, b.y, s), lerp(a.z, b.z, s));
  camera.lookAt(lerp(a.lx, b.lx, s), 1.2, lerp(a.lz, b.lz, s));
}

function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < 0.8 ? 70 : 55; camera.updateProjectionMatrix(); if (reduce) frame(performance.now()); }
addEventListener("resize", resize);

const tmpC = new THREE.Color();
function frame(now) {
  const t = reduce ? 2 : now / 1000;
  prog += (target - prog) * (reduce ? 1 : 0.08);
  camAt(prog);
  const n = Math.min(1, prog * 1.6);
  tmpC.copy(dusk).lerp(night, n); scene.background.copy(tmpC); scene.fog.color.copy(tmpC);
  hemi.intensity = lerp(1.1, 0.45, n); fmat.uniforms.uNight.value = n; fmat.uniforms.uTime.value = t;
  if (!reduce) {
    for (let i = 0; i < wpos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      wpos.array[i * 3 + 1] = Math.sin(x * 0.6 + t * 1.2) * 0.08 + Math.cos(z * 0.5 + t) * 0.08;
    }
    wpos.needsUpdate = true;
    waterGeo.computeVertexNormals();
  }
  for (const h of hoppers) {
    const c = ((t * h.speed + h.phase) % 2) / 2;
    if (!reduce && c < 0.4) { const k = c / 0.4; h.x += Math.sin(h.dir) * 0.04; h.z += Math.cos(h.dir) * 0.04; h.f.position.y = 0.15 + Math.sin(k * Math.PI) * 1.1; }
    else h.f.position.y = 0.15;
    if (Math.abs(h.x) > 8 || h.z > 4 || h.z < -LEN + 6) h.dir += Math.PI;
    h.f.position.x = h.x; h.f.position.z = h.z; h.f.rotation.y = h.dir;
  }
  picker.rotation.z = Math.sin(t * 4) * 0.08;
  picker.position.y = 1 + Math.abs(Math.sin(t * 4)) * 0.12;
  bulbs.forEach((b, i) => b.material.color.setHSL(0.12, 1, 0.55 + 0.2 * Math.sin(t * 3 + i)));
  const sp = new THREE.Vector3(); picker.getWorldPosition(sp);
  for (const o of notes) { const k = (t * 0.25 + o.t) % 1; o.n.position.set(sp.x + Math.sin(k * 9 + o.t * 10) * 1.2, sp.y + 1.5 + k * 4, sp.z + 1); o.n.scale.setScalar(Math.sin(k * Math.PI)); }
  for (const o of steam) { const k = (t * 0.3 + o.t) % 1; o.s.position.set(-4 + Math.sin(k * 6) * 0.3, 1.5 + k * 3, 1.5); o.s.scale.setScalar(0.5 + k); o.s.material.opacity = 0.35 * (1 - k); }
  for (const r of racers) {
    const k = ((t * (0.18 + r.lane * 0.03)) % 1);
    const hop = (k * 6) % 1;
    r.r.position.set(-9 + k * 9, 0.15 + Math.sin(hop * Math.PI) * 0.9, -73 - r.lane * 2.2);
    r.r.rotation.y = Math.PI / 2;
  }
  renderer.render(scene, camera);
}

function loop(now) { frame(now); requestAnimationFrame(loop); }
resize(); onScroll();
if (reduce) frame(0); else requestAnimationFrame(loop);

/* reveal cards */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.35 });
document.querySelectorAll(".card").forEach((c) => io.observe(c));
window.__fvReady = true;
