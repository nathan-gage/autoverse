#!/usr/bin/env python3
"""
Extract a specific section from the Rust Performance Book reference.

Usage:
    python3 extract_section.py <section_name>
    
Examples:
    python3 extract_section.py "Heap Allocations"
    python3 extract_section.py "Build Configuration"
    python3 extract_section.py "Parallelism"
    
Available sections:
    - Introduction
    - Benchmarking
    - Build Configuration
    - Linting
    - Profiling
    - Inlining
    - Hashing
    - Heap Allocations
    - Type Sizes
    - Standard Library Types
    - Iterators
    - Bounds Checks
    - I/O
    - Logging and Debugging
    - Wrapper Types
    - Machine Code
    - Parallelism
    - General Tips
    - Compile Times
"""

import sys
import re
from pathlib import Path


def extract_section(content: str, section_name: str) -> str | None:
    """Extract a section from the markdown content by heading name."""
    # Normalize section name for matching
    section_pattern = re.escape(section_name)
    
    # Match ## Section Name pattern
    pattern = rf'^## {section_pattern}\s*$'
    
    lines = content.split('\n')
    start_idx = None
    end_idx = None
    
    for i, line in enumerate(lines):
        if re.match(pattern, line, re.IGNORECASE):
            start_idx = i
        elif start_idx is not None and line.startswith('## ') and i > start_idx:
            end_idx = i
            break
    
    if start_idx is None:
        return None
    
    if end_idx is None:
        end_idx = len(lines)
    
    return '\n'.join(lines[start_idx:end_idx]).strip()


def list_sections(content: str) -> list[str]:
    """List all available sections in the document."""
    sections = []
    for line in content.split('\n'):
        if line.startswith('## ') and not line.startswith('## Table of Contents'):
            section_name = line[3:].strip()
            sections.append(section_name)
    return sections


def main():
    script_dir = Path(__file__).parent
    perf_book_path = script_dir.parent / 'assets' / 'perf-book.md'
    
    if not perf_book_path.exists():
        print(f"Error: {perf_book_path} not found", file=sys.stderr)
        sys.exit(1)
    
    content = perf_book_path.read_text()
    
    if len(sys.argv) < 2:
        print("Usage: python3 extract_section.py <section_name>")
        print("\nAvailable sections:")
        for section in list_sections(content):
            print(f"  - {section}")
        sys.exit(0)
    
    section_name = ' '.join(sys.argv[1:])
    
    if section_name.lower() == '--list':
        for section in list_sections(content):
            print(section)
        sys.exit(0)
    
    result = extract_section(content, section_name)
    
    if result is None:
        print(f"Error: Section '{section_name}' not found", file=sys.stderr)
        print("\nAvailable sections:", file=sys.stderr)
        for section in list_sections(content):
            print(f"  - {section}", file=sys.stderr)
        sys.exit(1)
    
    print(result)


if __name__ == '__main__':
    main()
