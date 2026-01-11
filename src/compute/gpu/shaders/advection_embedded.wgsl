// Mass and parameter advection shader (gather-based approach)
// Each thread computes incoming mass and mixes parameters from all sources
// Uses softmax weighting for stochastic parameter mixing

struct AdvectParams {
    width: u32,
    height: u32,
    dt: f32,
    distribution_size: f32,
    mixing_temperature: f32,
    use_linear_mixing: u32,  // 0 = softmax, 1 = linear
    _pad0: u32,
    _pad1: u32,
}

@group(0) @binding(0) var<uniform> params: AdvectParams;
@group(0) @binding(1) var<storage, read> current: array<f32>;
@group(0) @binding(2) var<storage, read> flow_x: array<f32>;
@group(0) @binding(3) var<storage, read> flow_y: array<f32>;
@group(0) @binding(4) var<storage, read> current_params: array<f32>;
@group(0) @binding(5) var<storage, read_write> next: array<f32>;
@group(0) @binding(6) var<storage, read_write> next_params: array<f32>;

const PARAMS_PER_CELL: u32 = 5u;
const MAX_SOURCES: u32 = 64u;  // Maximum sources to track for mixing

// Compute overlap area between a distribution square and a cell
fn compute_overlap(
    dest_x: f32, dest_y: f32,
    s: f32,
    cell_x: i32, cell_y: i32
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
    let idx = y * w + x;

    let search_radius = i32(ceil(abs(params.dt) * 10.0 + s + 1.0));

    // Track contributions for parameter mixing
    var source_masses: array<f32, 64>;
    var source_param_indices: array<u32, 64>;
    var num_sources: u32 = 0u;
    var total_incoming_mass: f32 = 0.0;
    var max_mass: f32 = 0.0;

    // Gather mass and track sources
    for (var dy: i32 = -search_radius; dy <= search_radius; dy++) {
        for (var dx: i32 = -search_radius; dx <= search_radius; dx++) {
            let src_x = wrap(cell_x + dx, w);
            let src_y = wrap(cell_y + dy, h);
            let src_idx = src_y * w + src_x;

            let mass = current[src_idx];
            if (abs(mass) < 1e-10) {
                continue;
            }

            let dest_x = f32(cell_x + dx) + params.dt * flow_x[src_idx];
            let dest_y = f32(cell_y + dy) + params.dt * flow_y[src_idx];

            let overlap = compute_overlap(dest_x, dest_y, s, cell_x, cell_y);
            if (overlap > 0.0) {
                let fraction = overlap / total_area;
                let contribution = mass * fraction;
                total_incoming_mass += contribution;

                if (num_sources < MAX_SOURCES) {
                    source_masses[num_sources] = contribution;
                    source_param_indices[num_sources] = src_idx;
                    max_mass = max(max_mass, contribution);
                    num_sources += 1u;
                }
            }
        }
    }

    // Store mass result
    next[idx] = total_incoming_mass;

    // Mix parameters from all sources
    let param_base = idx * PARAMS_PER_CELL;

    if (num_sources == 0u || total_incoming_mass < 1e-10) {
        // No sources - copy current parameters (or use defaults)
        for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
            next_params[param_base + p] = current_params[param_base + p];
        }
    } else if (num_sources == 1u) {
        // Single source - copy its parameters directly
        let src_param_base = source_param_indices[0u] * PARAMS_PER_CELL;
        for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
            next_params[param_base + p] = current_params[src_param_base + p];
        }
    } else {
        // Multiple sources - mix parameters
        if (params.use_linear_mixing == 1u) {
            // Linear mixing (mass-weighted average)
            var mixed: array<f32, 5>;
            for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                mixed[p] = 0.0;
            }

            for (var i: u32 = 0u; i < num_sources; i++) {
                let w_i = source_masses[i] / total_incoming_mass;
                let src_param_base = source_param_indices[i] * PARAMS_PER_CELL;

                for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                    mixed[p] += current_params[src_param_base + p] * w_i;
                }
            }

            for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                next_params[param_base + p] = mixed[p];
            }
        } else {
            // Softmax mixing
            var softmax_sum: f32 = 0.0;
            var softmax_weights: array<f32, 64>;

            for (var i: u32 = 0u; i < num_sources; i++) {
                let w_i = exp((source_masses[i] - max_mass) / params.mixing_temperature);
                softmax_weights[i] = w_i;
                softmax_sum += w_i;
            }

            var mixed: array<f32, 5>;
            for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                mixed[p] = 0.0;
            }

            for (var i: u32 = 0u; i < num_sources; i++) {
                let w_i = softmax_weights[i] / softmax_sum;
                let src_param_base = source_param_indices[i] * PARAMS_PER_CELL;

                for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                    mixed[p] += current_params[src_param_base + p] * w_i;
                }
            }

            for (var p: u32 = 0u; p < PARAMS_PER_CELL; p++) {
                next_params[param_base + p] = mixed[p];
            }
        }
    }
}
