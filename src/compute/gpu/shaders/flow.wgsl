// Flow field computation shader
// Computes flow field by blending affinity and mass gradients based on local mass

struct FlowParams {
    width: u32,
    height: u32,
    beta_a: f32,
    n: f32,
}

@group(0) @binding(0) var<uniform> params: FlowParams;
@group(0) @binding(1) var<storage, read> grad_u_x: array<f32>;
@group(0) @binding(2) var<storage, read> grad_u_y: array<f32>;
@group(0) @binding(3) var<storage, read> grad_a_x: array<f32>;
@group(0) @binding(4) var<storage, read> grad_a_y: array<f32>;
@group(0) @binding(5) var<storage, read> mass_sum: array<f32>;
@group(0) @binding(6) var<storage, read_write> flow_x: array<f32>;
@group(0) @binding(7) var<storage, read_write> flow_y: array<f32>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;

    if (x >= params.width || y >= params.height) {
        return;
    }

    let idx = y * params.width + x;

    // Compute alpha: transition factor based on local mass
    // alpha = clamp((mass / beta_a)^n, 0, 1)
    // When mass is low (alpha near 0): follow affinity gradient (concentration)
    // When mass is high (alpha near 1): follow mass gradient (diffusion)
    let mass_ratio = mass_sum[idx] / params.beta_a;
    let alpha = clamp(pow(mass_ratio, params.n), 0.0, 1.0);

    // Flow field: F = (1-alpha) * grad_U - alpha * grad_A
    // grad_U = affinity gradient (where to go based on growth potential)
    // grad_A = mass gradient (where mass is distributed)
    flow_x[idx] = (1.0 - alpha) * grad_u_x[idx] - alpha * grad_a_x[idx];
    flow_y[idx] = (1.0 - alpha) * grad_u_y[idx] - alpha * grad_a_y[idx];
}
