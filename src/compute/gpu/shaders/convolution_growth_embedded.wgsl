// Convolution and growth shader with embedded parameters
// Performs direct 2D convolution and applies growth function using per-cell parameters

struct ConvParams {
    width: u32,
    height: u32,
    kernel_radius: u32,
    _pad: u32,
}

@group(0) @binding(0) var<uniform> params: ConvParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
// Per-cell embedded parameters (5 values per cell: mu, sigma, weight, beta_a, n)
@group(0) @binding(4) var<storage, read> cell_params: array<f32>;

// Parameter offsets in the packed array
const PARAM_MU: u32 = 0u;
const PARAM_SIGMA: u32 = 1u;
const PARAM_WEIGHT: u32 = 2u;
const PARAMS_PER_CELL: u32 = 5u;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;

    if (x >= params.width || y >= params.height) {
        return;
    }

    let w = params.width;
    let h = params.height;
    let r = i32(params.kernel_radius);
    let kernel_size = 2 * r + 1;
    let idx = y * w + x;

    // Direct convolution with periodic boundary
    var sum: f32 = 0.0;
    for (var ky: i32 = -r; ky <= r; ky++) {
        for (var kx: i32 = -r; kx <= r; kx++) {
            // Wrap source coordinates (periodic boundary)
            let sx = u32((i32(x) + kx + i32(w)) % i32(w));
            let sy = u32((i32(y) + ky + i32(h)) % i32(h));

            // Kernel index
            let ki = u32((ky + r) * kernel_size + (kx + r));

            sum += input[sy * w + sx] * kernel[ki];
        }
    }

    // Get per-cell parameters
    let param_base = idx * PARAMS_PER_CELL;
    let mu = cell_params[param_base + PARAM_MU];
    let sigma = cell_params[param_base + PARAM_SIGMA];
    let weight = cell_params[param_base + PARAM_WEIGHT];

    // Growth function: G(u; mu, sigma) = 2*exp(-(u-mu)^2 / (2*sigma^2)) - 1
    // Range: [-1, 1]
    let diff = sum - mu;
    let sigma_sq_2 = 2.0 * sigma * sigma;
    let g = 2.0 * exp(-diff * diff / sigma_sq_2) - 1.0;

    // Accumulate weighted growth to output (affinity buffer)
    output[idx] += weight * g;
}
