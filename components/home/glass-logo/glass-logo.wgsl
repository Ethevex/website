import { logo_field } from "./logo-outline.wgsl";
import { GLASS_IOR, glass_fresnel, glass_incident, glass_normal, studio_light } from "./glass-optics.wgsl";

struct Scene {
  resolution: vec2f,
  pointer: vec2f,
  dark: f32,
}
@group(0) @binding(0) var<uniform> scene: Scene;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Canvas is 1.2 by 1.04 logo-width units, with a quiet safety margin.
  let scale = min(scene.resolution.x / 1.2, scene.resolution.y / 1.04);
  let p = (uv - 0.5) * scene.resolution / scale;
  let field = logo_field(p);
  let aa = 0.7 / scale;
  let coverage = 1.0 - smoothstep(-aa, aa, field.x);
  if (coverage <= 0.0) { return vec4f(0.0); }

  let n = glass_normal(field);
  let incident = glass_incident(scene.pointer);
  let inside_ray = refract(incident, n, 1.0 / GLASS_IOR);
  let thickness = 0.18;
  let travel = thickness / max(-inside_ray.z, 0.1);
  let exit_point = vec3f(p, 0.0) + inside_ray * travel;
  let exit_field = logo_field(exit_point.xy);
  let rear_normal = -glass_normal(exit_field);
  var exit_ray = refract(inside_ray, -rear_normal, GLASS_IOR);
  let total_internal_reflection = dot(exit_ray, exit_ray) < 0.001;
  if (total_internal_reflection) { exit_ray = reflect(inside_ray, rear_normal); }

  let reflected = studio_light(vec3f(p, 0.0), reflect(incident, n), scene.pointer);
  let transmitted = studio_light(exit_point, exit_ray, scene.pointer);
  let fresnel = glass_fresnel(dot(-incident, n));
  let edge = 1.0 - smoothstep(0.0, 0.038, -field.x);
  let rear_edge = 1.0 - smoothstep(0.0, 0.018, abs(exit_field.x));
  let rim = exp(-pow((-field.x - 0.0025) / 0.0016, 2.0));
  let inner_rim = exp(-pow((-field.x - 0.023) / 0.0018, 2.0));
  let key_direction = normalize(vec3f(vec2f(-0.8, -1.2) + scene.pointer * 0.6 - p, 1.7));
  let specular = pow(max(dot(reflect(incident, n), key_direction), 0.0), 18.0);
  let edge_light = clamp(reflected * 0.5 + specular * 1.3, 0.0, 1.0);
  // Absorption and the rear bevel give a thick, layered neutral glass body.
  let optical = mix(transmitted * exp(-travel * 0.6), reflected, fresnel);
  let light_glass = clamp(0.965 - optical * 0.25 - edge * 0.27 - rear_edge * 0.07 + edge_light * edge * 0.35 + rim * 0.15 - inner_rim * 0.09, 0.5, 1.0);
  let dark_glass = clamp(0.012 + optical * 0.35 + edge * (0.10 + edge_light * 0.65) + rear_edge * 0.045 + rim * (0.32 + edge_light * 0.3) + inner_rim * 0.07, 0.0, 0.9);
  let luminance = mix(light_glass, dark_glass, scene.dark);
  // Premultiplied transparent output leaves the page itself pure white/black.
  return vec4f(vec3f(luminance) * coverage, coverage);
}
