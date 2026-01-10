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
}
