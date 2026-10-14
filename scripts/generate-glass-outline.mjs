import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../public/ethevex-clean.svg", import.meta.url);
const destination = new URL("../components/home/glass-logo/logo-outline.wgsl", import.meta.url);

// Flatten the approved SVG's curves to <0.05 SVG units (less than 0.1px
// at the largest display size). This preserves the traced outline, including
// its small curves, rather than replacing it with a hand-drawn approximation.
export function outlineFromSvg(svg) {
  const path = svg.match(/\bd="([^"]+)"/)?.[1];
  if (!path) throw new Error("The approved SVG has no path");
  const tokens = path.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g);
  const contours = [];
  let cursor = [0, 0];
  let points = [];
  let command = "";
  let i = 0;
  const number = () => {
    const value = Number(tokens[i++]);
    if (!Number.isFinite(value)) throw new Error("Invalid SVG coordinate");
    return value;
  };
  const midpoint = (a, b) => a.map((v, axis) => (v + b[axis]) / 2);
  const distanceToLine = (p, a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    return Math.abs(dx * (a[1] - p[1]) - (a[0] - p[0]) * dy) / (Math.hypot(dx, dy) || 1);
  };
  const curve = (a, b, c, d, depth = 0) => {
    if (depth >= 16 || Math.max(distanceToLine(b, a, d), distanceToLine(c, a, d)) <= 0.05) {
      points.push(d);
      return;
    }
    const ab = midpoint(a, b), bc = midpoint(b, c), cd = midpoint(c, d);
    const abc = midpoint(ab, bc), bcd = midpoint(bc, cd), mid = midpoint(abc, bcd);
    curve(a, ab, abc, mid, depth + 1);
    curve(mid, bcd, cd, d, depth + 1);
  };
  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const point = () => [number() + (relative ? cursor[0] : 0), number() + (relative ? cursor[1] : 0)];
    switch (command.toUpperCase()) {
      case "M":
        cursor = point();
        points = [cursor];
        contours.push(points);
        command = relative ? "l" : "L";
        break;
      case "L": cursor = point(); points.push(cursor); break;
      case "H": cursor = [number() + (relative ? cursor[0] : 0), cursor[1]]; points.push(cursor); break;
      case "V": cursor = [cursor[0], number() + (relative ? cursor[1] : 0)]; points.push(cursor); break;
      case "C": {
        const b = point(), c = point(), d = point();
        curve(cursor, b, c, d);
        cursor = d;
        break;
      }
      case "Z": cursor = points[0]; command = ""; break;
      default: throw new Error(`Unsupported SVG command: ${command}`);
    }
  }
  return contours;
}

export function shaderForOutline(contours) {
  const normalized = ([x, y]) => [(x - 511.75) / 547.5, (y - 511.25) / 547.5];
  const edges = contours.flatMap((points) => points.map((p, i) => [p, points[(i + 1) % points.length]]))
    .filter(([a, b]) => Math.hypot(a[0] - b[0], a[1] - b[1]) > 0.0001)
    .map(([a, b]) => [...normalized(a), ...normalized(b)]);
  const values = edges.map((edge) => `  vec4f(${edge.map((v) => v.toFixed(8)).join(", ")})`).join(",\n");
  return `// Generated from public/ethevex-clean.svg. Do not edit by hand.
// Regenerate: node scripts/generate-glass-outline.mjs
const EDGES = array<vec4f, ${edges.length}>(
${values}
);

// Signed distance and outward normal. Negative distance is inside a blade.
export fn logo_field(p: vec2f) -> vec3f {
  var distance_squared = 100.0;
  var nearest = vec2f(0.0);
  var inside = false;
  for (var i = 0u; i < ${edges.length}u; i++) {
    let a = EDGES[i].xy;
    let b = EDGES[i].zw;
    let edge = b - a;
    let offset = p - a;
    let delta = offset - edge * clamp(dot(offset, edge) / dot(edge, edge), 0.0, 1.0);
    let candidate = dot(delta, delta);
    if (candidate < distance_squared) {
      distance_squared = candidate;
      nearest = delta;
    }
    if ((a.y > p.y) != (b.y > p.y)) {
      if (p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) {
        inside = !inside;
      }
    }
  }
  let distance = sqrt(distance_squared);
  let sign = select(1.0, -1.0, inside);
  return vec3f(distance * sign, nearest / max(distance, 0.000001) * sign);
}
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const contours = outlineFromSvg(await readFile(source, "utf8"));
  await writeFile(destination, shaderForOutline(contours));
  console.log(`Generated ${contours.length} blades from the approved SVG.`);
}
