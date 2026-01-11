// Mass advection shader (gather-based approach)
// Each thread computes how much mass flows INTO its cell from neighbors
// This avoids the need for atomic operations

struct AdvectParams {
    width: u32,
    height: u32,
    dt: f32,
    distribution_size: f32,
}

@group(0) @binding(0) var<uniform> params: AdvectParams;
@group(0) @binding(1) var<storage, read> current: array<f32>;
@group(0) @binding(2) var<storage, read> flow_x: array<f32>;
@group(0) @binding(3) var<storage, read> flow_y: array<f32>;
@group(0) @binding(4) var<storage, read_write> next: array<f32>;

// Compute overlap area between a distribution square and a cell
fn compute_overlap(
    dest_x: f32, dest_y: f32,  // Destination center
    s: f32,                      // Distribution half-size
    cell_x: i32, cell_y: i32     // Cell coordinates
) -> f32 {
    let dist_x_min = dest_x - s;
    let dist_x_max = dest_x + s;
    let dist_y_min = dest_y - s;
    let dist_y_max = dest_y + s;

    let cell_x_min = f32(cell_x);
    let cell_x_max = f32(cell_x + 1);
    let cell_y_min = f32(cell_y);
    let cell_y_max = f32(cell_y + 1);

    let overlap_x = max(0.0, min(cell_x_max, dist_x_max) - max(cell_x_min, dist_x_min));
    let overlap_y = max(0.0, min(cell_y_max, dist_y_max) - max(cell_y_min, dist_y_min));

    return overlap_x * overlap_y;
}

// Wrap coordinate to periodic boundary
fn wrap(coord: i32, size: u32) -> u32 {
    let s = i32(size);
    return u32(((coord % s) + s) % s);
}

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;

    if (x >= params.width || y >= params.height) {
        return;
    }

    let w = params.width;
    let h = params.height;
    let s = params.distribution_size;
    let total_area = 4.0 * s * s;
    let cell_x = i32(x);
    let cell_y = i32(y);

    // Search radius: how far to look for source cells that might contribute here
    // A source at (sx, sy) with flow (fx, fy) lands at (sx + dt*fx, sy + dt*fy)
    // For it to reach cell (x, y), we need |dest - cell| < s + 1
    // So we need to check sources within some radius
    let search_radius = i32(ceil(abs(params.dt) * 10.0 + s + 1.0));  // Conservative estimate

    var incoming_mass: f32 = 0.0;

    // Check all potential source cells
    for (var dy: i32 = -search_radius; dy <= search_radius; dy++) {
        for (var dx: i32 = -search_radius; dx <= search_radius; dx++) {
            // Source cell coordinates (wrapped)
            let src_x = wrap(cell_x + dx, w);
            let src_y = wrap(cell_y + dy, h);
            let src_idx = src_y * w + src_x;

            let mass = current[src_idx];
            if (abs(mass) < 1e-10) {
                continue;
            }

            // Where does this source's mass flow to?
            let dest_x = f32(cell_x + dx) + params.dt * flow_x[src_idx];
            let dest_y = f32(cell_y + dy) + params.dt * flow_y[src_idx];

            // How much of that mass lands in our cell?
            let overlap = compute_overlap(dest_x, dest_y, s, cell_x, cell_y);
            if (overlap > 0.0) {
                let fraction = overlap / total_area;
                incoming_mass += mass * fraction;
            }
        }
    }

    let idx = y * w + x;
    next[idx] = incoming_mass;
}
