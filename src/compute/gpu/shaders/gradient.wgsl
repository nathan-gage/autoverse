// Sobel gradient computation shader
// Computes spatial gradients using 3x3 Sobel operator with periodic boundaries

struct Params {
    width: u32,
    height: u32,
    _pad0: u32,
    _pad1: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> grad_x: array<f32>;
@group(0) @binding(3) var<storage, read_write> grad_y: array<f32>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;

    if (x >= params.width || y >= params.height) {
        return;
    }

    let w = params.width;
    let h = params.height;

    // Periodic boundary wrapping
    let xm = (x + w - 1u) % w;
    let xp = (x + 1u) % w;
    let ym = (y + h - 1u) % h;
    let yp = (y + 1u) % h;

    // Sample 3x3 neighborhood
    let tl = input[ym * w + xm];  // top-left
    let tc = input[ym * w + x];   // top-center
    let tr = input[ym * w + xp];  // top-right
    let ml = input[y * w + xm];   // middle-left
    let mr = input[y * w + xp];   // middle-right
    let bl = input[yp * w + xm];  // bottom-left
    let bc = input[yp * w + x];   // bottom-center
    let br = input[yp * w + xp];  // bottom-right

    // Sobel Gx: [-1 0 1; -2 0 2; -1 0 1] * 0.125
    let gx = (-tl + tr - 2.0 * ml + 2.0 * mr - bl + br) * 0.125;

    // Sobel Gy: [-1 -2 -1; 0 0 0; 1 2 1] * 0.125
    let gy = (-tl - 2.0 * tc - tr + bl + 2.0 * bc + br) * 0.125;

    let idx = y * w + x;
    grad_x[idx] = gx;
    grad_y[idx] = gy;
}
