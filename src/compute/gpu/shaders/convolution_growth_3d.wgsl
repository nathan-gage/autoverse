// 3D Convolution and growth shader
// Performs direct 3D convolution and applies growth function

struct ConvParams {
    width: u32,
    height: u32,
    depth: u32,
    kernel_radius: u32,
    mu: f32,
    sigma: f32,
    weight: f32,
    _pad: f32,
}

@group(0) @binding(0) var<uniform> params: ConvParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

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
    let d = params.depth;
    let r = i32(params.kernel_radius);
    let kernel_size = 2 * r + 1;

    // Direct 3D convolution with periodic boundary
    var sum: f32 = 0.0;
    for (var kz: i32 = -r; kz <= r; kz++) {
        for (var ky: i32 = -r; ky <= r; ky++) {
            for (var kx: i32 = -r; kx <= r; kx++) {
                // Wrap source coordinates (periodic boundary)
                let sx = u32((i32(x) + kx + i32(w)) % i32(w));
                let sy = u32((i32(y) + ky + i32(h)) % i32(h));
                let sz = u32((i32(z) + kz + i32(d)) % i32(d));

                // Kernel index (3D)
                let ki = u32((kz + r) * kernel_size * kernel_size + (ky + r) * kernel_size + (kx + r));

                // Source index (3D: z * h * w + y * w + x)
                let si = sz * h * w + sy * w + sx;

                sum += input[si] * kernel[ki];
            }
        }
    }

    // Growth function: G(u; mu, sigma) = 2*exp(-(u-mu)^2 / (2*sigma^2)) - 1
    // Range: [-1, 1]
    let diff = sum - params.mu;
    let sigma_sq_2 = 2.0 * params.sigma * params.sigma;
    let g = 2.0 * exp(-diff * diff / sigma_sq_2) - 1.0;

    // Accumulate weighted growth to output (affinity buffer)
    let idx = z * h * w + y * w + x;
    output[idx] += params.weight * g;
}
