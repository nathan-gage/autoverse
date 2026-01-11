//! Growth function for Flow Lenia.
//!
//! The growth function determines how the automaton reacts to local neighborhood density.

/// Compute growth function: G(u; mu, sigma) = 2 * exp(-(u - mu)^2 / (2*sigma^2)) - 1
///
/// Output range: [-1, 1]
/// - Returns 1.0 when u == mu (optimal activation)
/// - Returns -1.0 when u is far from mu
#[inline]
pub fn growth(u: f32, mu: f32, sigma: f32) -> f32 {
    let diff = u - mu;
    let sigma_sq_2 = 2.0 * sigma * sigma;
    2.0 * (-diff * diff / sigma_sq_2).exp() - 1.0
}

/// Vectorized growth function applied to entire grid.
/// Modifies values in-place.
pub fn growth_grid_inplace(grid: &mut [f32], mu: f32, sigma: f32) {
    let sigma_sq_2 = 2.0 * sigma * sigma;
    let inv_sigma_sq_2 = 1.0 / sigma_sq_2;

    for v in grid.iter_mut() {
        let diff = *v - mu;
        *v = 2.0 * (-diff * diff * inv_sigma_sq_2).exp() - 1.0;
    }
}

/// Vectorized growth function returning new grid.
pub fn growth_grid(grid: &[f32], mu: f32, sigma: f32) -> Vec<f32> {
    let sigma_sq_2 = 2.0 * sigma * sigma;
    let inv_sigma_sq_2 = 1.0 / sigma_sq_2;

    grid.iter()
        .map(|&v| {
            let diff = v - mu;
            2.0 * (-diff * diff * inv_sigma_sq_2).exp() - 1.0
        })
        .collect()
}

/// Apply growth function and weight, accumulating into target buffer.
#[inline]
pub fn growth_accumulate(
    convolution: &[f32],
    target: &mut [f32],
    weight: f32,
    mu: f32,
    sigma: f32,
) {
    let sigma_sq_2 = 2.0 * sigma * sigma;
    let inv_sigma_sq_2 = 1.0 / sigma_sq_2;

    for (t, &c) in target.iter_mut().zip(convolution.iter()) {
        let diff = c - mu;
        let g = 2.0 * (-diff * diff * inv_sigma_sq_2).exp() - 1.0;
        *t += weight * g;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_growth_peak() {
        let mu = 0.15;
        let sigma = 0.015;

        // At mu, growth should be 1.0
        let g = growth(mu, mu, sigma);
        assert!((g - 1.0).abs() < 1e-6);
    }

    #[test]
    fn test_growth_far() {
        let mu = 0.15;
        let sigma = 0.015;

        // Far from mu, growth should approach -1.0
        let g = growth(1.0, mu, sigma);
        assert!((g - (-1.0)).abs() < 0.01);
    }

    #[test]
    fn test_growth_symmetric() {
        let mu = 0.5;
        let sigma = 0.1;

        // Growth should be symmetric around mu
        let g1 = growth(mu - 0.1, mu, sigma);
        let g2 = growth(mu + 0.1, mu, sigma);
        assert!((g1 - g2).abs() < 1e-6);
    }

    #[test]
    fn test_growth_grid_matches_scalar() {
        let mu = 0.15;
        let sigma = 0.015;
        let grid: Vec<f32> = (0..100).map(|i| i as f32 * 0.01).collect();

        let result = growth_grid(&grid, mu, sigma);

        for (i, (&input, &output)) in grid.iter().zip(result.iter()).enumerate() {
            let expected = growth(input, mu, sigma);
            assert!(
                (output - expected).abs() < 1e-6,
                "Grid growth mismatch at {}: {} vs {}",
                i,
                output,
                expected
            );
        }
    }

    #[test]
    fn test_growth_grid_inplace_matches() {
        let mu = 0.15;
        let sigma = 0.015;
        let grid: Vec<f32> = (0..100).map(|i| i as f32 * 0.01).collect();

        let result_new = growth_grid(&grid, mu, sigma);

        let mut grid_inplace = grid.clone();
        growth_grid_inplace(&mut grid_inplace, mu, sigma);

        for i in 0..grid.len() {
            assert!(
                (result_new[i] - grid_inplace[i]).abs() < 1e-6,
                "Inplace vs new mismatch at {}: {} vs {}",
                i,
                grid_inplace[i],
                result_new[i]
            );
        }
    }

    #[test]
    fn test_growth_accumulate() {
        let mu = 0.15;
        let sigma = 0.015;
        let weight = 0.5;

        let convolution: Vec<f32> = vec![0.1, 0.15, 0.2, 0.3];
        let mut target = vec![1.0; 4];

        growth_accumulate(&convolution, &mut target, weight, mu, sigma);

        for i in 0..4 {
            let g = growth(convolution[i], mu, sigma);
            let expected = 1.0 + weight * g;
            assert!(
                (target[i] - expected).abs() < 1e-6,
                "Accumulate mismatch at {}: {} vs {}",
                i,
                target[i],
                expected
            );
        }
    }

    #[test]
    fn test_growth_output_range() {
        let mu = 0.5;
        let sigma = 0.1;

        // Test a range of inputs and verify output is always in [-1, 1]
        for i in 0..1000 {
            let u = i as f32 * 0.01 - 5.0; // Test from -5 to +5
            let g = growth(u, mu, sigma);
            assert!(
                g >= -1.0 - 1e-6 && g <= 1.0 + 1e-6,
                "Growth output {} out of range [-1, 1] for input {}",
                g,
                u
            );
        }
    }

    #[test]
    fn test_growth_sigma_effect() {
        let mu = 0.5;

        // Larger sigma should give wider response
        let small_sigma = 0.05;
        let large_sigma = 0.2;

        // At distance 0.1 from mu
        let g_small = growth(mu + 0.1, mu, small_sigma);
        let g_large = growth(mu + 0.1, mu, large_sigma);

        // Larger sigma should have higher (less negative) growth at same distance
        assert!(
            g_large > g_small,
            "Larger sigma should give wider response: {} vs {}",
            g_large,
            g_small
        );
    }
}
