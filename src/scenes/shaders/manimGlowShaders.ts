import * as THREE from 'three';

export const MANIM_COLORS = {
  blue: 0x58c4dd,
  green: 0x83c167,
  red: 0xfc6255,
  yellow: 0xf7d147,
  purple: 0xb189df,
  teal: 0x5cd0b3,
  white: 0xeceff4,
  grid: 0x1e293b
} as const;

export const MANIM_HEX = {
  blue: '#58C4DD',
  green: '#83C167',
  red: '#FC6255',
  yellow: '#F7D147',
  purple: '#B189DF',
  teal: '#5CD0B3',
  white: '#ECEFF4',
  muted: '#6C7A89'
} as const;

/**
 * Custom GLSL ShaderMaterial for 3Blue1Brown glowing tubes, wave strings, and energy conduits
 */
export function createManimGlowTubeMaterial(colorHex: number, flowMode: number = 0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uTime: { value: 0 },
      uFlowMode: { value: flowMode },
      uIntensity: { value: 1.15 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uFlowMode;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float rim = abs(dot(normal, viewDir));
        float core = pow(rim, 0.55) * 0.75 + 0.35;
        float pulse = 1.0;
        if (uFlowMode > 0.5) {
          pulse = 0.72 + 0.38 * sin(vUv.x * 24.0 - uTime * 5.0);
        }
        vec3 finalColor = uColor * core * pulse * uIntensity;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: false
  });
}

/**
 * Creates a reusable 3D Manim-style Vector Arrow (shaft cylinder + cone tip)
 */
export interface ManimArrow3D {
  group: THREE.Group;
  shaft: THREE.Mesh;
  head: THREE.Mesh;
  setVector: (origin: THREE.Vector3, dir: THREE.Vector3, length: number) => void;
  setVisible: (v: boolean) => void;
}

export function createManimVectorArrow(colorHex: number, radius: number = 0.032): ManimArrow3D {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: colorHex });

  const shaftGeo = new THREE.CylinderGeometry(radius, radius, 1, 12);
  shaftGeo.translate(0, 0.5, 0);
  const shaft = new THREE.Mesh(shaftGeo, mat);

  const headGeo = new THREE.ConeGeometry(radius * 2.6, radius * 6.5, 14);
  headGeo.translate(0, radius * 3.25, 0);
  const head = new THREE.Mesh(headGeo, mat);

  group.add(shaft, head);

  const upVec = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion();

  return {
    group,
    shaft,
    head,
    setVector(origin: THREE.Vector3, dir: THREE.Vector3, length: number) {
      if (length < 0.02) {
        group.visible = false;
        return;
      }
      group.visible = true;
      group.position.copy(origin);
      const normDir = dir.clone().normalize();
      quat.setFromUnitVectors(upVec, normDir);
      group.quaternion.copy(quat);

      const headLen = Math.min(length * 0.35, radius * 6.5);
      const shaftLen = Math.max(0.001, length - headLen);
      shaft.scale.set(1, shaftLen, 1);
      head.position.set(0, shaftLen, 0);
    },
    setVisible(v: boolean) {
      group.visible = v;
    }
  };
}

/**
 * Generates a 3D helical spring curve between two 3D points
 */
export function buildHelicalSpringPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  coils: number = 10,
  radius: number = 0.14,
  samples: number = 84
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const diff = new THREE.Vector3().subVectors(end, start);
  const len = diff.length();
  const dir = len > 1e-5 ? diff.clone().divideScalar(len) : new THREE.Vector3(1, 0, 0);

  // Orthonormal basis perpendicular to dir
  const arbitrary = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(dir, arbitrary).normalize();
  const v = new THREE.Vector3().crossVectors(dir, u).normalize();

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const base = new THREE.Vector3().lerpVectors(start, end, t);
    // Taper ends smoothly into straight leads
    const env = Math.sin(Math.PI * t);
    const taper = Math.min(1, env * 4.5);
    const angle = t * coils * Math.PI * 2;
    base.addScaledVector(u, Math.cos(angle) * radius * taper);
    base.addScaledVector(v, Math.sin(angle) * radius * taper);
    pts.push(base);
  }
  return pts;
}

