// 3D Sobel gradient computation shader
// Computes spatial gradients using 3x3x3 Sobel operator with periodic boundaries

struct Params {
    width: u32,
    height: u32,
    depth: u32,
    _pad: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> grad_x: array<f32>;
@group(0) @binding(3) var<storage, read_write> grad_y: array<f32>;
@group(0) @binding(4) var<storage, read_write> grad_z: array<f32>;

// Sample input at wrapped coordinates
fn sample(x: u32, y: u32, z: u32) -> f32 {
    let w = params.width;
    let h = params.height;
    let d = params.depth;
    let idx = z * h * w + y * w + x;
    return input[idx];
}

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

    // Periodic boundary wrapping
    let xm = (x + w - 1u) % w;
    let xp = (x + 1u) % w;
    let ym = (y + h - 1u) % h;
    let yp = (y + 1u) % h;
    let zm = (z + d - 1u) % d;
    let zp = (z + 1u) % d;

    // 3D Sobel kernels for gradient computation
    // Using separable 3D Sobel: each kernel is product of 1D kernels
    // Gx: diff along x, smooth along y and z: [1,0,-1] x [1,2,1] x [1,2,1]
    // Gy: diff along y, smooth along x and z: [1,2,1] x [1,0,-1] x [1,2,1]
    // Gz: diff along z, smooth along x and y: [1,2,1] x [1,2,1] x [1,0,-1]

    // Sample all 27 neighbors
    // Layer zm (z-1)
    let v_mmm = sample(xm, ym, zm);
    let v_0mm = sample(x,  ym, zm);
    let v_pmm = sample(xp, ym, zm);
    let v_m0m = sample(xm, y,  zm);
    let v_00m = sample(x,  y,  zm);
    let v_p0m = sample(xp, y,  zm);
    let v_mpm = sample(xm, yp, zm);
    let v_0pm = sample(x,  yp, zm);
    let v_ppm = sample(xp, yp, zm);

    // Layer z (z)
    let v_mm0 = sample(xm, ym, z);
    let v_0m0 = sample(x,  ym, z);
    let v_pm0 = sample(xp, ym, z);
    let v_m00 = sample(xm, y,  z);
    // v_000 = center, not needed for gradient
    let v_p00 = sample(xp, y,  z);
    let v_mp0 = sample(xm, yp, z);
    let v_0p0 = sample(x,  yp, z);
    let v_pp0 = sample(xp, yp, z);

    // Layer zp (z+1)
    let v_mmp = sample(xm, ym, zp);
    let v_0mp = sample(x,  ym, zp);
    let v_pmp = sample(xp, ym, zp);
    let v_m0p = sample(xm, y,  zp);
    let v_00p = sample(x,  y,  zp);
    let v_p0p = sample(xp, y,  zp);
    let v_mpp = sample(xm, yp, zp);
    let v_0pp = sample(x,  yp, zp);
    let v_ppp = sample(xp, yp, zp);

    // Compute Gx: derivative along x, smooth along y and z
    // Weights: (-1,0,1) along x, (1,2,1) along y, (1,2,1) along z
    // Total normalization: 1/32 (since sum of absolute weights = 32)
    var gx: f32 = 0.0;
    // z-1 layer (weight 1)
    gx += 1.0 * (1.0 * (-v_mmm + v_pmm) + 2.0 * (-v_m0m + v_p0m) + 1.0 * (-v_mpm + v_ppm));
    // z layer (weight 2)
    gx += 2.0 * (1.0 * (-v_mm0 + v_pm0) + 2.0 * (-v_m00 + v_p00) + 1.0 * (-v_mp0 + v_pp0));
    // z+1 layer (weight 1)
    gx += 1.0 * (1.0 * (-v_mmp + v_pmp) + 2.0 * (-v_m0p + v_p0p) + 1.0 * (-v_mpp + v_ppp));
    gx *= 1.0 / 32.0;

    // Compute Gy: derivative along y, smooth along x and z
    var gy: f32 = 0.0;
    // z-1 layer (weight 1)
    gy += 1.0 * (1.0 * (-v_mmm + v_mpm) + 2.0 * (-v_0mm + v_0pm) + 1.0 * (-v_pmm + v_ppm));
    // z layer (weight 2)
    gy += 2.0 * (1.0 * (-v_mm0 + v_mp0) + 2.0 * (-v_0m0 + v_0p0) + 1.0 * (-v_pm0 + v_pp0));
    // z+1 layer (weight 1)
    gy += 1.0 * (1.0 * (-v_mmp + v_mpp) + 2.0 * (-v_0mp + v_0pp) + 1.0 * (-v_pmp + v_ppp));
    gy *= 1.0 / 32.0;

    // Compute Gz: derivative along z, smooth along x and y
    var gz: f32 = 0.0;
    // Negative z side (weight -1 total for each smoothed cell)
    gz += -1.0 * (1.0 * v_mmm + 2.0 * v_0mm + 1.0 * v_pmm);
    gz += -2.0 * (1.0 * v_m0m + 2.0 * v_00m + 1.0 * v_p0m);
    gz += -1.0 * (1.0 * v_mpm + 2.0 * v_0pm + 1.0 * v_ppm);
    // Positive z side (weight +1)
    gz += 1.0 * (1.0 * v_mmp + 2.0 * v_0mp + 1.0 * v_pmp);
    gz += 2.0 * (1.0 * v_m0p + 2.0 * v_00p + 1.0 * v_p0p);
    gz += 1.0 * (1.0 * v_mpp + 2.0 * v_0pp + 1.0 * v_ppp);
    gz *= 1.0 / 32.0;

    let idx = z * h * w + y * w + x;
    grad_x[idx] = gx;
    grad_y[idx] = gy;
    grad_z[idx] = gz;
}
