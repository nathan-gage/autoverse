// Flow field computation shader with embedded parameters
// Computes flow field using per-cell beta_a and n parameters

struct FlowParams {
    width: u32,
    height: u32,
    _pad0: u32,
    _pad1: u32,
}

@group(0) @binding(0) var<uniform> params: FlowParams;
@group(0) @binding(1) var<storage, read> grad_u_x: array<f32>;
@group(0) @binding(2) var<storage, read> grad_u_y: array<f32>;
@group(0) @binding(3) var<storage, read> grad_a_x: array<f32>;
@group(0) @binding(4) var<storage, read> grad_a_y: array<f32>;
@group(0) @binding(5) var<storage, read> mass_sum: array<f32>;
@group(0) @binding(6) var<storage, read_write> flow_x: array<f32>;
@group(0) @binding(7) var<storage, read_write> flow_y: array<f32>;
// Per-cell embedded parameters
@group(0) @binding(8) var<storage, read> cell_params: array<f32>;

// Parameter offsets
const PARAM_BETA_A: u32 = 3u;
const PARAM_N: u32 = 4u;
const PARAMS_PER_CELL: u32 = 5u;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;

    if (x >= params.width || y >= params.height) {
        return;
    }

    let idx = y * params.width + x;

    // Get per-cell flow parameters
    let param_base = idx * PARAMS_PER_CELL;
    let beta_a = cell_params[param_base + PARAM_BETA_A];
    let n = cell_params[param_base + PARAM_N];

    // Compute alpha: transition factor based on local mass
    // alpha = clamp((mass / beta_a)^n, 0, 1)
    let mass_ratio = mass_sum[idx] / beta_a;
    let alpha = clamp(pow(mass_ratio, n), 0.0, 1.0);

    // Flow field: F = (1-alpha) * grad_U - alpha * grad_A
    flow_x[idx] = (1.0 - alpha) * grad_u_x[idx] - alpha * grad_a_x[idx];
    flow_y[idx] = (1.0 - alpha) * grad_u_y[idx] - alpha * grad_a_y[idx];
}
