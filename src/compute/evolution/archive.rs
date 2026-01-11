//! Pattern archive for storing and exporting discovered patterns.

use std::collections::HashMap;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

use crate::schema::{CandidateSnapshot, Seed, SimulationConfig};

/// Archive for storing discovered patterns.
#[derive(Debug, Default)]
pub struct PatternArchive {
    /// Stored patterns indexed by ID.
    patterns: HashMap<u64, ArchivedPattern>,
    /// Output directory for saving patterns.
    output_dir: Option<PathBuf>,
    /// Maximum archive size.
    max_size: usize,
}

/// An archived pattern with metadata.
#[derive(Debug, Clone)]
pub struct ArchivedPattern {
    /// The candidate snapshot.
    pub snapshot: CandidateSnapshot,
    /// Tags for categorization.
    pub tags: Vec<String>,
    /// User notes.
    pub notes: Option<String>,
    /// File path if saved.
    pub saved_path: Option<PathBuf>,
}

impl PatternArchive {
    /// Create a new archive.
    pub fn new(max_size: usize) -> Self {
        Self {
            patterns: HashMap::new(),
            output_dir: None,
            max_size,
        }
    }

    /// Set output directory for saving patterns.
    pub fn with_output_dir<P: AsRef<Path>>(mut self, dir: P) -> io::Result<Self> {
        let path = dir.as_ref().to_path_buf();
        fs::create_dir_all(&path)?;
        self.output_dir = Some(path);
        Ok(self)
    }

    /// Add a pattern to the archive.
    pub fn add(&mut self, snapshot: CandidateSnapshot, tags: Vec<String>) -> Option<u64> {
        // Check if already exists
        if self.patterns.contains_key(&snapshot.id) {
            return None;
        }

        // Check capacity
        if self.patterns.len() >= self.max_size {
            // Remove lowest fitness pattern
            if let Some((&id, _)) = self.patterns.iter().min_by(|a, b| {
                a.1.snapshot
                    .fitness
                    .partial_cmp(&b.1.snapshot.fitness)
                    .unwrap()
            }) {
                // Only remove if new pattern is better
                if snapshot.fitness <= self.patterns[&id].snapshot.fitness {
                    return None;
                }
                self.patterns.remove(&id);
            }
        }

        let id = snapshot.id;
        self.patterns.insert(
            id,
            ArchivedPattern {
                snapshot,
                tags,
                notes: None,
                saved_path: None,
            },
        );

        Some(id)
    }

    /// Get a pattern by ID.
    pub fn get(&self, id: u64) -> Option<&ArchivedPattern> {
        self.patterns.get(&id)
    }

    /// Get all patterns.
    pub fn all(&self) -> impl Iterator<Item = &ArchivedPattern> {
        self.patterns.values()
    }

    /// Get patterns by tag.
    pub fn by_tag(&self, tag: &str) -> impl Iterator<Item = &ArchivedPattern> {
        self.patterns
            .values()
            .filter(move |p| p.tags.iter().any(|t| t == tag))
    }

    /// Get top N patterns by fitness.
    pub fn top_n(&self, n: usize) -> Vec<&ArchivedPattern> {
        let mut patterns: Vec<_> = self.patterns.values().collect();
        patterns.sort_by(|a, b| b.snapshot.fitness.partial_cmp(&a.snapshot.fitness).unwrap());
        patterns.into_iter().take(n).collect()
    }

    /// Save a pattern to disk.
    pub fn save_pattern(&mut self, id: u64) -> io::Result<PathBuf> {
        let output_dir = self
            .output_dir
            .as_ref()
            .ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "No output directory set"))?;

        let pattern = self
            .patterns
            .get_mut(&id)
            .ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "Pattern not found"))?;

        // Generate filename
        let filename = format!(
            "pattern_{}_gen{}_fit{:.3}.json",
            id, pattern.snapshot.generation, pattern.snapshot.fitness
        );
        let path = output_dir.join(&filename);

        // Create export structure
        let export = PatternExport {
            config: pattern.snapshot.config.clone(),
            seed: pattern.snapshot.seed.clone(),
            metadata: PatternMetadata {
                id,
                fitness: pattern.snapshot.fitness,
                generation: pattern.snapshot.generation,
                tags: pattern.tags.clone(),
                behavior: BehaviorSummary::from(&pattern.snapshot.behavior),
            },
        };

        // Write to file
        let json = serde_json::to_string_pretty(&export)?;
        fs::write(&path, json)?;

        pattern.saved_path = Some(path.clone());
        Ok(path)
    }

    /// Save all patterns to disk.
    pub fn save_all(&mut self) -> io::Result<Vec<PathBuf>> {
        let ids: Vec<u64> = self.patterns.keys().copied().collect();
        let mut paths = Vec::new();

        for id in ids {
            paths.push(self.save_pattern(id)?);
        }

        Ok(paths)
    }

    /// Load patterns from a directory.
    pub fn load_from_dir<P: AsRef<Path>>(dir: P) -> io::Result<Self> {
        let dir = dir.as_ref();
        let mut archive = Self::new(1000);
        archive.output_dir = Some(dir.to_path_buf());

        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.extension().is_some_and(|e| e == "json")
                && let Ok(export) = load_pattern_export(&path)
            {
                // Reconstruct snapshot (simplified)
                let snapshot = CandidateSnapshot {
                    id: export.metadata.id,
                    fitness: export.metadata.fitness,
                    metric_scores: Vec::new(),
                    genome: crate::schema::Genome::from_config(&export.config, Some(&export.seed)),
                    config: export.config,
                    seed: export.seed,
                    generation: export.metadata.generation,
                    parents: Vec::new(),
                    behavior: crate::schema::BehaviorStats::default(),
                };

                archive.patterns.insert(
                    export.metadata.id,
                    ArchivedPattern {
                        snapshot,
                        tags: export.metadata.tags,
                        notes: None,
                        saved_path: Some(path),
                    },
                );
            }
        }

        Ok(archive)
    }

    /// Get archive size.
    pub fn len(&self) -> usize {
        self.patterns.len()
    }

    /// Check if archive is empty.
    pub fn is_empty(&self) -> bool {
        self.patterns.is_empty()
    }

    /// Clear the archive.
    pub fn clear(&mut self) {
        self.patterns.clear();
    }

    /// Add notes to a pattern.
    pub fn add_notes(&mut self, id: u64, notes: String) -> bool {
        if let Some(pattern) = self.patterns.get_mut(&id) {
            pattern.notes = Some(notes);
            true
        } else {
            false
        }
    }

    /// Add tags to a pattern.
    pub fn add_tags(&mut self, id: u64, tags: Vec<String>) -> bool {
        if let Some(pattern) = self.patterns.get_mut(&id) {
            pattern.tags.extend(tags);
            true
        } else {
            false
        }
    }
}

/// Exported pattern format.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PatternExport {
    /// Simulation configuration.
    pub config: SimulationConfig,
    /// Initial seed pattern.
    pub seed: Seed,
    /// Pattern metadata.
    pub metadata: PatternMetadata,
}

/// Pattern metadata for export.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PatternMetadata {
    /// Unique ID.
    pub id: u64,
    /// Fitness score.
    pub fitness: f32,
    /// Generation discovered.
    pub generation: usize,
    /// Tags.
    pub tags: Vec<String>,
    /// Behavior summary.
    pub behavior: BehaviorSummary,
}

/// Summarized behavior for export.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct BehaviorSummary {
    pub final_mass: f32,
    pub initial_mass: f32,
    pub total_displacement: f32,
    pub final_radius: f32,
    pub active_cells: usize,
    pub max_activation: f32,
}

impl From<&crate::schema::BehaviorStats> for BehaviorSummary {
    fn from(stats: &crate::schema::BehaviorStats) -> Self {
        Self {
            final_mass: stats.final_mass,
            initial_mass: stats.initial_mass,
            total_displacement: stats.total_displacement,
            final_radius: stats.final_radius,
            active_cells: stats.active_cells,
            max_activation: stats.max_activation,
        }
    }
}

/// Load a pattern export from file.
fn load_pattern_export<P: AsRef<Path>>(path: P) -> io::Result<PatternExport> {
    let content = fs::read_to_string(path)?;
    serde_json::from_str(&content).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

/// Auto-categorize a pattern based on behavior.
pub fn auto_categorize(snapshot: &CandidateSnapshot) -> Vec<String> {
    let mut tags = Vec::new();

    // Check for glider
    if snapshot.behavior.total_displacement > 5.0
        && snapshot.behavior.final_radius < 20.0
        && snapshot.behavior.final_mass > 0.5 * snapshot.behavior.initial_mass
    {
        tags.push("glider".to_string());
    }

    // Check for stable pattern
    if snapshot.behavior.total_displacement < 1.0
        && snapshot.behavior.final_mass > 0.8 * snapshot.behavior.initial_mass
        && snapshot.behavior.final_radius < 30.0
    {
        tags.push("stable".to_string());
    }

    // Check for diffuser
    if snapshot.behavior.final_radius > 50.0 {
        tags.push("diffuser".to_string());
    }

    // Check for high fitness
    if snapshot.fitness > 0.5 {
        tags.push("high-fitness".to_string());
    }

    // Check for compact
    if snapshot.behavior.final_radius < 10.0 && snapshot.behavior.active_cells > 10 {
        tags.push("compact".to_string());
    }

    tags
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{BehaviorStats, CandidateSnapshot, Genome, Seed, SimulationConfig};

    fn test_snapshot(id: u64, fitness: f32) -> CandidateSnapshot {
        CandidateSnapshot {
            id,
            fitness,
            metric_scores: Vec::new(),
            genome: Genome::from_config(&SimulationConfig::default(), None),
            config: SimulationConfig::default(),
            seed: Seed::default(),
            generation: 0,
            parents: Vec::new(),
            behavior: BehaviorStats::default(),
        }
    }

    #[test]
    fn test_archive_add() {
        let mut archive = PatternArchive::new(10);

        let id1 = archive.add(test_snapshot(1, 0.5), vec!["test".to_string()]);
        assert_eq!(id1, Some(1));

        let id2 = archive.add(test_snapshot(2, 0.7), vec![]);
        assert_eq!(id2, Some(2));

        assert_eq!(archive.len(), 2);
    }

    #[test]
    fn test_archive_capacity() {
        let mut archive = PatternArchive::new(2);

        archive.add(test_snapshot(1, 0.3), vec![]);
        archive.add(test_snapshot(2, 0.5), vec![]);

        // Adding higher fitness should evict lowest
        archive.add(test_snapshot(3, 0.7), vec![]);
        assert_eq!(archive.len(), 2);
        assert!(archive.get(1).is_none()); // Lowest fitness evicted
        assert!(archive.get(3).is_some());
    }

    #[test]
    fn test_top_n() {
        let mut archive = PatternArchive::new(10);

        archive.add(test_snapshot(1, 0.3), vec![]);
        archive.add(test_snapshot(2, 0.7), vec![]);
        archive.add(test_snapshot(3, 0.5), vec![]);

        let top2 = archive.top_n(2);
        assert_eq!(top2.len(), 2);
        assert_eq!(top2[0].snapshot.id, 2);
        assert_eq!(top2[1].snapshot.id, 3);
    }

    #[test]
    fn test_by_tag() {
        let mut archive = PatternArchive::new(10);

        archive.add(test_snapshot(1, 0.5), vec!["glider".to_string()]);
        archive.add(test_snapshot(2, 0.5), vec!["stable".to_string()]);
        archive.add(test_snapshot(3, 0.5), vec!["glider".to_string()]);

        let gliders: Vec<_> = archive.by_tag("glider").collect();
        assert_eq!(gliders.len(), 2);
    }
}
