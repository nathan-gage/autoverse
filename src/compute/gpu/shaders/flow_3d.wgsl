// 3D Flow field computation shader (single component)
// Computes one component of flow field by blending affinity and mass gradients
// This shader is invoked 3 times (once for X, Y, Z) to stay within buffer limits

struct FlowParams {
    width: u32,
    height: u32,
    depth: u32,
    _pad: u32,
    beta_a: f32,
    n: f32,
    _pad2: f32,
    _pad3: f32,
}

@group(0) @binding(0) var<uniform> params: FlowParams;
@group(0) @binding(1) var<storage, read> grad_u: array<f32>;  // Affinity gradient (one component)
@group(0) @binding(2) var<storage, read> grad_a: array<f32>;  // Mass gradient (one component)
@group(0) @binding(3) var<storage, read> mass_sum: array<f32>;
@group(0) @binding(4) var<storage, read_write> flow: array<f32>;  // Output flow (one component)

@compute @workgroup_size(8, 8, 4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let z = gid.z;

    if (x >= params.width || y >= params.height || z >= params.depth) {
        return;
    }

    let w = params.width;
    let h = params.height;
    let idx = z * h * w + y * w + x;

    // Compute alpha: transition factor based on local mass
    // alpha = clamp((mass / beta_a)^n, 0, 1)
    // When mass is low (alpha near 0): follow affinity gradient (concentration)
    // When mass is high (alpha near 1): follow mass gradient (diffusion)
    let mass_ratio = mass_sum[idx] / params.beta_a;
    let alpha = clamp(pow(mass_ratio, params.n), 0.0, 1.0);

    // Flow component: F_i = (1-alpha) * grad_U_i - alpha * grad_A_i
    flow[idx] = (1.0 - alpha) * grad_u[idx] - alpha * grad_a[idx];
}
