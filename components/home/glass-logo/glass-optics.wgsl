// One index of refraction for all channels: neutral optical glass, no dispersion.
export const GLASS_IOR: f32 = 1.8;

export fn glass_fresnel(facing: f32) -> f32 {
  let f0 = pow((GLASS_IOR - 1.0) / (GLASS_IOR + 1.0), 2.0);
  return f0 + (1.0 - f0) * pow(1.0 - clamp(facing, 0.0, 1.0), 5.0);
}

// Shift the optical viewing ray, not the silhouette or camera projection.
// This moves the refracted studio image through the full glass thickness.
export fn glass_incident(pointer: vec2f) -> vec3f {
  return normalize(vec3f(-clamp(pointer, vec2f(-1.0), vec2f(1.0)) * 0.38, -1.0));
}

export fn glass_normal(field: vec3f) -> vec3f {
  // The bevel goes inward, leaving the source silhouette and sharp corners intact.
  let slope = 4.5 * pow(1.0 - smoothstep(0.0, 0.05, -field.x), 1.2);
  return normalize(vec3f(field.yz * slope, 1.0));
}

// Monochrome studio cards. Evaluating from the ray's exit point gives the
// transparent volume something to refract even against a plain page background.
export fn studio_light(origin: vec3f, direction: vec3f, pointer: vec2f) -> f32 {
  let projected = origin.xy + direction.xy * (2.5 / max(abs(direction.z), 0.24));
  let key_center = vec2f(-0.24, -0.3) + pointer * vec2f(0.4, 0.3);
  let key_offset = (projected - key_center) / vec2f(0.65, 0.32);
  let key = exp(-dot(key_offset, key_offset) * 1.6);
  let strip_offset = (projected - vec2f(0.58, 0.12) - pointer * 0.15) / vec2f(0.065, 0.95);
  let strip = exp(-dot(strip_offset, strip_offset) * 1.5);
  let fill_offset = (projected - vec2f(-0.55, 0.45)) / vec2f(0.3, 0.6);
  let fill = exp(-dot(fill_offset, fill_offset) * 1.7);
  // A long softbox gives the flat faces a broad, diagonal reflection.
  let ribbon_axis = projected.y + projected.x * 0.48 - pointer.y * 0.14;
  let ribbon = exp(-pow((ribbon_axis + 0.10) / 0.045, 2.0));
  return clamp(0.12 + key * 0.5 + strip * 0.7 + fill * 0.22 + ribbon * 0.65, 0.0, 1.0);
}
