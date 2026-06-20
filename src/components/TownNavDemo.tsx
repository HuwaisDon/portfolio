 import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import BuildingModal from "./BuildingModal";
import "./BuildingModal.css";


// ---- Site sections / buildings - STREET LAYOUT ----
// Buildings arranged on both sides of a main street
const SECTIONS = [
  { id: "about", label: "About Us", color: 0xe94560, pos: [-12, 0, -12] },     // Left side
  { id: "projects", label: "Projects", color: 0x4ecdc4, pos: [-12, 0, 0] },   // Left side
  { id: "work", label: "Work", color: 0xffd166, pos: [-12, 0, 12] },          // Left side
  { id: "contact", label: "Contact", color: 0x9b5de5, pos: [12, 0, -12] },    // Right side
  { id: "lab", label: "Lab", color: 0x06d6a0, pos: [12, 0, 12] },             // Right side
];

export default function TownNavDemo() {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<any>({});
  const [active, setActive] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");
  const [coords, setCoords] = useState({ x: 0, z: 16 });
  const [showModal, setShowModal] = useState(false);

  // ---------- THREE.JS SETUP (once) ----------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 25, 60);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    const camOffset = new THREE.Vector3(0, 15, 18);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lights
    const hemi = new THREE.HemisphereLight(0x9bb4ff, 0x16213e, 0.65);
    scene.add(hemi);

    const moon = new THREE.DirectionalLight(0xcfd8ff, 1.1);
    moon.position.set(-10, 18, 8);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -25;
    moon.shadow.camera.right = 25;
    moon.shadow.camera.top = 25;
    moon.shadow.camera.bottom = -25;
    moon.shadow.bias = -0.0015;
    scene.add(moon);

    const fill = new THREE.PointLight(0xe94560, 0.5, 40);
    fill.position.set(0, 6, 10);
    scene.add(fill);

    // Ground - Street layout (rectangle instead of circle)
    const groundGeo = new THREE.PlaneGeometry(35, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f1520,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Street center line (decorative)
    const centerLineGeo = new THREE.PlaneGeometry(0.3, 40);
    const centerLineMat = new THREE.MeshBasicMaterial({
      color: 0xffe9a8,
      transparent: true,
      opacity: 0.15,
    });
    const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = 0.02;
    scene.add(centerLine);

    // Larger grid for street
    const grid = new THREE.GridHelper(50, 50, 0x2a2a4a, 0x222240);
    grid.position.y = 0.01;
    scene.add(grid);

    // ---- Street/road assets (optional) ----
    // These are added as decorative scenery; if the asset fails to load, the scene still renders.
    const streetGroup = new THREE.Group();
    scene.add(streetGroup);
    const gltfLoader = new GLTFLoader();

    // Road base (FBX isn't handled by GLTFLoader; we keep procedural ground already present)
    // If you add a .glb/.gltf version of the road, we can load it here.

    // Road and street-light sources are provided as archives/FBX.
    // GLTFLoader cannot load the provided zip/FBX directly, so we keep the existing procedural road/streetscape.

    // If you export/add a direct .glb/.gltf for the road and street lights, we can load it here.


    // Street lights (lamp posts)
    gltfLoader.load(
      '/models/road_street_light/source/StreetLight/StreetLight.gltf',
      (gltf: any) => {

        const original = gltf.scene;


        // Compute bounds once so we can scale/position consistently.
        const box = new THREE.Box3().setFromObject(original);
        const size = box.getSize(new THREE.Vector3());

        // const maxDim = Math.max(size.x, size.y, size.z) || 1;


        // Heuristic: scale model so its height is ~6 units.
        const targetHeight = 6;
        const scale = targetHeight / size.y;

        function setupLampInstance(inst: THREE.Object3D) {
          inst.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
              const meshChild = child as THREE.Mesh;
              meshChild.castShadow = true;
              meshChild.receiveShadow = true;

              // Some exported lamps have emissive maps; boost emissive a bit for visibility.
              const mat: any = meshChild.material as any;
              if (mat?.emissive) {
                mat.emissiveIntensity = Math.max(
                  1,
                  mat.emissiveIntensity ?? 1
                );
              }
            }
          });
        }

        // Place lamps along both sidewalks at x = +/- 12.
        const zs: number[] = [];
        const zStart = -15;
        const zEnd = 15;
        const count = 6;
        for (let i = 0; i < count; i++) {
          zs.push(zStart + (i * (zEnd - zStart)) / (count - 1));
        }

        const sidewalkX = [-12, 12];

        sidewalkX.forEach((x) => {
          zs.forEach((z) => {
            const inst = original.clone(true);
            inst.scale.setScalar(scale);

            // Move so its bottom sits at y=0.
            const instBox = new THREE.Box3().setFromObject(inst);
            const bottomY = instBox.min.y;
            inst.position.set(x, -bottomY, z);

            // Fix orientation: right-side lamps need to face inward.
            if (x > 0) {
              inst.rotation.y = Math.PI;
            }

            setupLampInstance(inst);

            // Optional: add a small point light at lamp head for stronger visibility.
            const headLight = new THREE.PointLight(0xfff2cc, 2.2, 18);
            headLight.position.set(x, 4.8, z);
            streetGroup.add(headLight);

            streetGroup.add(inst);
          });
        });


        streetGroup.add(new THREE.AxesHelper(0.01));
      },

      undefined,
      () => {

        // ignore if zip wrapper can't be parsed by loader
      }
    );


    // ---- Build sidewalk paths on both sides of street ----
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      roughness: 0.85,
      metalness: 0,
    });

    // Left sidewalk
    const leftSidewalkGeo = new THREE.PlaneGeometry(3, 40);
    const leftSidewalk = new THREE.Mesh(leftSidewalkGeo, pathMat);
    leftSidewalk.rotation.x = -Math.PI / 2;
    leftSidewalk.position.set(-12, 0.015, 0);
    leftSidewalk.receiveShadow = true;
    scene.add(leftSidewalk);

    // Right sidewalk
    const rightSidewalkGeo = new THREE.PlaneGeometry(3, 40);
    const rightSidewalk = new THREE.Mesh(rightSidewalkGeo, pathMat);
    rightSidewalk.rotation.x = -Math.PI / 2;
    rightSidewalk.position.set(12, 0.015, 0);
    rightSidewalk.receiveShadow = true;
    scene.add(rightSidewalk);

    // ---- Buildings ----
    const buildingMeshes: Record<string, any> = {};
    const nameplateSprites: Record<string, any> = {};

    function makeNameplateTexture(text: string, color: number) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();
      
      ctx.clearRect(0, 0, 512, 128);
      // plate background
      ctx.fillStyle = "rgba(15,15,25,0.92)";
      roundRect(ctx, 8, 28, 496, 72, 14);
      ctx.fill();
      ctx.strokeStyle = `#${color.toString(16).padStart(6, "0")}`;
      ctx.lineWidth = 4;
      roundRect(ctx, 8, 28, 496, 72, 14);
      ctx.stroke();
      ctx.fillStyle = "#f5f5f0";
      ctx.font = "700 40px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 256, 66);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    let torso: THREE.Mesh;
    let head: THREE.Mesh;
    let beacon: THREE.Mesh;
    let charGroup: THREE.Group;

    SECTIONS.forEach((s) => {
      const group = new THREE.Group();
      const [bx, , bz] = s.pos;
      const angleToCenter = Math.atan2(-bz, -bx);

let door: THREE.Mesh = new THREE.Mesh();
      let doorMat: THREE.MeshStandardMaterial;
      let buildingHeight = 4.0;
      let buildingDepth = 3.5;

      // Base materials for buildings
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f0,
        roughness: 0.72,
        metalness: 0.02,
      });





      // Initialize the door material
      doorMat = new THREE.MeshStandardMaterial({
        color: s.color,
        emissive: s.color,
        emissiveIntensity: 0.15,
        roughness: 0.35,
      });
      


      // Design of each specific building
      if (s.id === "about") {
        // About Us: Load real farm house GLB model
        buildingHeight = 4.0;
        buildingDepth = 3.2;

        // Invisible door mesh for arrival glow system compatibility
        door = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 1.8, 0.06),
          doorMat
        );
        door.position.set(0, 0.95, 1.54);
        door.visible = false;
        group.add(door);

        // Load the GLB model
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          '/models/farm_house.glb',
          (gltf) => {
            const model = gltf.scene;

            // Enable shadows on all child meshes
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            // Compute bounding box to auto-scale to fit nicely
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 5.0;
            const scale = targetSize / maxDim;
            model.scale.setScalar(scale);

            // Recompute bounding box after scaling and position at ground level
            const scaledBox = new THREE.Box3().setFromObject(model);
            const scaledSize = scaledBox.getSize(new THREE.Vector3());
            model.position.set(0, -scaledBox.min.y, 0);

            // Make the door visible mesh match model approximate depth
            door.position.set(0, 0.95, scaledSize.z / 2 + 0.1);
            door.visible = false;

            group.add(model);
          },
          undefined,
          (error) => {
            console.error('Error loading farm_house.glb:', error);
            // Fallback: render a simple box if model fails
            const fallback = new THREE.Mesh(
              new THREE.BoxGeometry(3.2, 4.0, 3.0),
              wallMat
            );
            fallback.position.y = 2.0;
            fallback.castShadow = true;
            fallback.receiveShadow = true;
            group.add(fallback);
          }
        );

      } else if (s.id === "projects" || s.id === "work" || s.id === "contact" || s.id === "lab") {
        const modelForSection: Record<string, string> = {
          projects: '/models/warehouse_building.glb',
          work: '/models/large_low_poly_building.glb',
          contact: '/models/obj.glb',
          lab: '/models/obj.glb',
        };

        const sectionModelUrl = modelForSection[s.id];
        const gltfLoader = new GLTFLoader();

        // default placeholders until the model loads
        buildingHeight = 4.5;
        buildingDepth = 3.5;

        // Invisible door mesh for arrival glow system compatibility
        door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.06), doorMat);
        door.position.set(0, 0.95, 1.54);
        door.visible = false;
        group.add(door);

        gltfLoader.load(
          sectionModelUrl,
          (gltf) => {
            const model = gltf.scene;

            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            // Fit model roughly into the original building footprint
            const targetSize = s.id === 'work' ? 6.0 : 5.0;
            const scale = targetSize / maxDim;
            model.scale.setScalar(scale);

            const scaledBox = new THREE.Box3().setFromObject(model);
            const scaledSize = scaledBox.getSize(new THREE.Vector3());

            // place on ground
            model.position.set(0, -scaledBox.min.y, 0);

            // Use model depth to position door glow "trigger" near the front
            const depth = scaledSize.z;
            buildingHeight = scaledSize.y;
            buildingDepth = scaledSize.z;

            door.position.set(0, Math.max(0.9, buildingHeight * 0.22), depth / 2 + 0.1);
            door.visible = false;

            group.add(model);
          },
          undefined,
          (error) => {
            console.error(`Error loading model for section ${s.id}:`, error);

            // Fallback: keep simple box so nav still works
            const fallback = new THREE.Mesh(
              new THREE.BoxGeometry(3.2, 4.0, 3.0),
              wallMat
            );
            fallback.position.y = 2.0;
            fallback.castShadow = true;
            fallback.receiveShadow = true;
            group.add(fallback);
          }
        );

      }

      // ---- Nameplate sprite above door ----
      const tex = makeNameplateTexture(s.label, s.color);
      const spriteMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.8, 0.7, 1);
      sprite.position.set(0, buildingHeight + 1.2, buildingDepth / 2 + 0.4);
      group.add(sprite);
      nameplateSprites[s.id] = sprite;


      // Position the group and rotate it so the front faces the street
      group.position.set(bx, 0, bz);
      group.rotation.y = -angleToCenter + Math.PI / 2;
      scene.add(group);
      buildingMeshes[s.id] = { group, door, doorMat, baseEmissive: 0.15 };
    });

    // ---- Add Trees ----
    const treePositions = [
      [-12, -6],
      [-12, 6],
      [12, 0],
      [-16, -12],
      [-16, 0],
      [-16, 12],
      [16, -12],
      [16, 12],
      [-5, -18],
      [5, -18],
      [-5, 18],
      [5, 18],
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.9, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x244f2b,
      roughness: 0.8,
    });

    treePositions.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      
      // Trunk
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.45;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);
      
      // Foliage cones
      const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.1, 5), foliageMat);
      foliage1.position.y = 1.2;
      foliage1.castShadow = true;
      treeGroup.add(foliage1);

      const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 5), foliageMat);
      foliage2.position.y = 1.75;
      foliage2.castShadow = true;
      treeGroup.add(foliage2);

      treeGroup.position.set(tx, 0, tz);
      scene.add(treeGroup);
    });

    // ---- Character: simple box + sphere head, low-poly explorer ----
    charGroup = new THREE.Group();
    const bodyMat2 = new THREE.MeshStandardMaterial({
      color: 0xe94560,
      roughness: 0.5,
    });
    torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.6, 0.35),
      bodyMat2
    );
    torso.position.y = 0.62;
    torso.castShadow = true;
    charGroup.add(torso);

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffe0c2,
      roughness: 0.6,
    });
    head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), headMat);
    head.position.y = 1.25;
    head.castShadow = true;
    charGroup.add(head);

    // little beacon ring under feet
    const beaconGeo = new THREE.RingGeometry(0.42, 0.5, 24);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xe94560,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.rotation.x = -Math.PI / 2;
    beacon.position.y = 0.03;
    charGroup.add(beacon);

    charGroup.position.set(0, 0, 16);
    scene.add(charGroup);

    // Footstep dust particles
    const dustGeo = new THREE.BufferGeometry();
    const DUST_COUNT = 40;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustLife = new Float32Array(DUST_COUNT).fill(0);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3 + 1] = -10;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe94560,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    let dustCursor = 0;

    // ---------- Path planning: Street layout navigation ----------
    function buildPathTo(targetId: string) {
      const target = SECTIONS.find((s) => s.id === targetId);
      if (!target) return [];
      
      const [bx, , bz] = target.pos;
      
      // Buildings face inward toward the street
      // Approach from the street side
      const approachDist = 3.5;
      const doorWorld = new THREE.Vector3(
        bx + (bx < 0 ? approachDist : -approachDist),
        0,
        bz
      );

      return [doorWorld];
    }

    // ---------- Animation state ----------
    const anim = {
      waypoints: [] as THREE.Vector3[],
      currentTarget: null as string | null,
      moving: false,
      speed: 4.2,
      arrivedId: null as string | null,
      bobT: 0,
    };

    // WASD movement state (overrides nav walking while pressed)
    const keyState = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keyState.w = true;
      if (e.key === 's' || e.key === 'S') keyState.s = true;
      if (e.key === 'a' || e.key === 'A') keyState.a = true;
      if (e.key === 'd' || e.key === 'D') keyState.d = true;

      // stop nav-based walking when user takes control
      if (keyState.w || keyState.a || keyState.s || keyState.d) {
        anim.moving = false;
        anim.waypoints = [];
        anim.arrivedId = null;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keyState.w = false;
      if (e.key === 's' || e.key === 'S') keyState.s = false;
      if (e.key === 'a' || e.key === 'A') keyState.a = false;
      if (e.key === 'd' || e.key === 'D') keyState.d = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    stateRef.current.anim = anim;
    stateRef.current.scene = scene;
    stateRef.current.charGroup = charGroup;
    stateRef.current.buildingMeshes = buildingMeshes;
    stateRef.current.camera = camera;
    stateRef.current.camOffset = camOffset;

    stateRef.current.walkTo = (id: string) => {
      anim.waypoints = buildPathTo(id);
      anim.moving = true;
      anim.arrivedId = id;
      Object.values(buildingMeshes).forEach((b: any) => {
        b.doorMat.emissiveIntensity = b.baseEmissive;
      });
    };

    const clock = new THREE.Clock();

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const anim = stateRef.current.anim;

      // Rotate Projects floating artifact
      const projArtifact = stateRef.current.projectsArtifact;
      if (projArtifact) {
        projArtifact.rotation.x += dt * 0.8;
        projArtifact.rotation.y += dt * 1.2;
      }

      if (anim.moving && anim.waypoints.length > 0) {
        const target = anim.waypoints[0];
        const dir = new THREE.Vector3().subVectors(target, charGroup.position);
        dir.y = 0;
        const dist = dir.length();

        if (dist < 0.08) {
          anim.waypoints.shift();
          if (anim.waypoints.length === 0) {
            anim.moving = false;
            const id = anim.arrivedId;
            const b = buildingMeshes[id];
            if (b) {
              b.doorMat.emissiveIntensity = 0.9;
            }
            window.dispatchEvent(new CustomEvent("town-arrived", { detail: id }));
          }
        } else {
          dir.normalize();
          const step = Math.min(anim.speed * dt, dist);
          charGroup.position.addScaledVector(dir, step);

          const targetAngle = Math.atan2(dir.x, dir.z);
          let da = targetAngle - charGroup.rotation.y;
          da = Math.atan2(Math.sin(da), Math.cos(da));
          charGroup.rotation.y += da * Math.min(1, 10 * dt);

          anim.bobT += dt * 10;
          torso.position.y = 0.62 + Math.sin(anim.bobT) * 0.04;
          head.position.y = 1.25 + Math.sin(anim.bobT) * 0.04;

          // emit dust
          if (Math.random() < 0.6) {
            const idx = dustCursor % DUST_COUNT;
            dustPositions[idx * 3] = charGroup.position.x + (Math.random() - 0.5) * 0.2;
            dustPositions[idx * 3 + 1] = 0.05;
            dustPositions[idx * 3 + 2] = charGroup.position.z + (Math.random() - 0.5) * 0.2;
            dustLife[idx] = 1;
            dustCursor++;
          }

          window.dispatchEvent(
            new CustomEvent("town-coords", {
              detail: { x: charGroup.position.x, z: charGroup.position.z },
            })
          );
        }
      } else {
        anim.bobT *= 0.9;
        torso.position.y = THREE.MathUtils.lerp(torso.position.y, 0.62, 0.1);
        head.position.y = THREE.MathUtils.lerp(head.position.y, 1.25, 0.1);
      }

      // fade dust
      for (let i = 0; i < DUST_COUNT; i++) {
        if (dustLife[i] > 0) {
          dustLife[i] -= dt * 1.5;
          dustPositions[i * 3 + 1] = 0.05 + (1 - dustLife[i]) * 0.3;
          if (dustLife[i] <= 0) dustPositions[i * 3 + 1] = -10;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // beacon pulse
      beacon.scale.setScalar(1 + Math.sin(anim.bobT * 0.5 + performance.now() * 0.003) * 0.1);

      // camera follow (smooth)
      const desired = new THREE.Vector3(
        charGroup.position.x + camOffset.x,
        camOffset.y,
        charGroup.position.z + camOffset.z
      );
      camera.position.lerp(desired, 0.04);
      const lookTarget = new THREE.Vector3(
        charGroup.position.x,
        1,
        charGroup.position.z
      );
      const currentLook = stateRef.current.currentLook || lookTarget.clone();
      currentLook.lerp(lookTarget, 0.06);
      stateRef.current.currentLook = currentLook;
      camera.lookAt(currentLook);

      renderer.render(scene, camera);
      stateRef.current.rafId = requestAnimationFrame(animate);
    }
    animate();

    // resize
    function handleResize() {
      const el = mount;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(stateRef.current.rafId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ---------- React <-> Three.js event bridge ----------
  useEffect(() => {
    function onArrived(e: Event) {
      const customEvent = e as CustomEvent;
      setActive(customEvent.detail);
      setStatus("arrived");
      setShowModal(true);
    }
    function onCoords(e: Event) {
      const customEvent = e as CustomEvent;
      setCoords({ x: customEvent.detail.x, z: customEvent.detail.z });
    }
    window.addEventListener("town-arrived", onArrived);
    window.addEventListener("town-coords", onCoords);
    return () => {
      window.removeEventListener("town-arrived", onArrived);
      window.removeEventListener("town-coords", onCoords);
    };
  }, []);

  const handleNavClick = useCallback((id: string) => {
    setStatus("walking");
    setActive(null);
    if (stateRef.current.walkTo) {
      stateRef.current.walkTo(id);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        minHeight: 560,
        background: "#1a1a2e",
        position: "relative",
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Top bar: site title */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pointerEvents: "none",
        }}
      >
        <div>
          <div
            style={{
              color: "#f5f5f0",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.02em",
            }}
          >
            TOWN<span style={{ color: "#e94560" }}>.NAV</span>
          </div>
          <div
            style={{
              color: "rgba(245,245,240,0.45)",
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              marginTop: 2,
            }}
          >
            3D wayfinding navigation — proof of concept
          </div>
        </div>

        {/* HUD coords */}
        <div
          style={{
            background: "rgba(15,15,25,0.6)",
            border: "1px solid rgba(233,69,96,0.3)",
            borderRadius: 8,
            padding: "8px 12px",
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#9bb4ff",
            backdropFilter: "blur(6px)",
          }}
        >
          <div>x: {coords.x.toFixed(2)}  z: {coords.z.toFixed(2)}</div>
          <div style={{ color: status === "walking" ? "#ffd166" : "#06d6a0" }}>
            status: {status}
            {active ? ` → ${SECTIONS.find((s) => s.id === active)?.label}` : ""}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          padding: "0 16px",
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          const hex = `#${s.color.toString(16).padStart(6, "0")}`;
          return (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: `1.5px solid ${isActive ? hex : "rgba(245,245,240,0.18)"}`,
                background: isActive
                  ? `${hex}22`
                  : "rgba(15,15,25,0.55)",
                color: isActive ? hex : "#f5f5f0",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.01em",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
                transition: "all 0.2s ease",
                boxShadow: isActive ? `0 0 16px ${hex}55` : "none",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = hex;
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.borderColor = "rgba(245,245,240,0.18)";
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <BuildingModal 
        buildingId={active} 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
