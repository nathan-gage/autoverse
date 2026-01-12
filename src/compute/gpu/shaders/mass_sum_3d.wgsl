// 3D Mass sum computation shader
// Sums mass across all channels at each 3D grid cell

struct Params {
    width: u32,
    height: u32,
    depth: u32,
    num_channels: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> channels: array<f32>;
@group(0) @binding(2) var<storage, read_write> mass_sum: array<f32>;

@compute @workgroup_size(8, 8, 4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let z = gid.z;

    if (x >= params.width || y >= params.height || z >= params.depth) {
        return;
    }

    let grid_size = params.width * params.height * params.depth;
    let cell_idx = z * params.height * params.width + y * params.width + x;

    // Sum across all channels
    var total: f32 = 0.0;
    for (var c: u32 = 0u; c < params.num_channels; c++) {
        total += channels[c * grid_size + cell_idx];
    }

    mass_sum[cell_idx] = total;
}
