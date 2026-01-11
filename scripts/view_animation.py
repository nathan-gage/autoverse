#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "numpy",
#     "plotly",
#     "dash",
# ]
# ///
"""
Flow Lenia Animation Viewer

View .flwa animation files in an interactive browser-based player.

Usage:
    ./scripts/view_animation.py animation.flwa
    uv run scripts/view_animation.py animation.flwa
"""

import struct
import sys
from pathlib import Path
from typing import NamedTuple

import dash
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from dash import dcc, html
from dash.dependencies import Input, Output


class AnimationHeader(NamedTuple):
    """FLWA file header."""

    width: int
    height: int
    depth: int
    channels: int
    frame_count: int
    dt: float
    compression: int
    delta_encoding: bool


class FrameIndex(NamedTuple):
    """Frame index entry."""

    offset: int
    size: int


def read_header(f) -> AnimationHeader:
    """Read FLWA header from file."""
    magic = f.read(4)
    if magic != b"FLWA":
        raise ValueError(f"Invalid magic bytes: {magic}")

    version = struct.unpack("<H", f.read(2))[0]
    if version != 1:
        raise ValueError(f"Unsupported version: {version}")

    flags = struct.unpack("<H", f.read(2))[0]
    compression = flags & 0x0F
    delta_encoding = bool(flags & (1 << 4))

    width = struct.unpack("<I", f.read(4))[0]
    height = struct.unpack("<I", f.read(4))[0]
    depth = struct.unpack("<I", f.read(4))[0]
    channels = struct.unpack("<I", f.read(4))[0]
    frame_count = struct.unpack("<Q", f.read(8))[0]
    dt = struct.unpack("<f", f.read(4))[0]

    # Skip reserved bytes
    f.read(16)

    return AnimationHeader(
        width=width,
        height=height,
        depth=depth,
        channels=channels,
        frame_count=frame_count,
        dt=dt,
        compression=compression,
        delta_encoding=delta_encoding,
    )


def read_frame_indices(f, header: AnimationHeader) -> list[FrameIndex]:
    """Read frame index table from file."""
    # Seek to end to find index table
    f.seek(0, 2)  # End of file
    file_len = f.tell()
    index_start = file_len - header.frame_count * 16

    f.seek(index_start)

    indices = []
    for _ in range(header.frame_count):
        offset = struct.unpack("<Q", f.read(8))[0]
        size = struct.unpack("<Q", f.read(8))[0]
        indices.append(FrameIndex(offset=offset, size=size))

    return indices


def read_frame(
    f, header: AnimationHeader, index: FrameIndex
) -> np.ndarray:
    """Read a single frame from file."""
    f.seek(index.offset)
    data = f.read(index.size)

    if header.compression != 0:
        raise ValueError("Compression not supported in viewer (yet)")

    # Decode float32 data
    grid_size = header.width * header.height * header.depth
    frame_data = np.zeros((header.channels, header.depth, header.height, header.width), dtype=np.float32)

    for c in range(header.channels):
        start = c * grid_size * 4
        end = start + grid_size * 4
        channel_data = np.frombuffer(data[start:end], dtype=np.float32)
        frame_data[c] = channel_data.reshape((header.depth, header.height, header.width))

    return frame_data


def create_2d_figure(frame: np.ndarray, channel: int = 0) -> go.Figure:
    """Create a 2D heatmap figure for the given frame and channel."""
    # For 2D, just show the middle slice (or first if depth=1)
    z_slice = frame.shape[1] // 2
    data = frame[channel, z_slice, :, :]

    fig = go.Figure(data=go.Heatmap(
        z=data,
        colorscale="Viridis",
        zmin=0,
        zmax=1,
    ))

    fig.update_layout(
        title=f"Channel {channel}",
        xaxis_title="X",
        yaxis_title="Y",
        yaxis=dict(scaleanchor="x"),
        margin=dict(l=50, r=50, t=50, b=50),
    )

    return fig


def create_3d_figure(frame: np.ndarray, channel: int = 0, threshold: float = 0.1) -> go.Figure:
    """Create a 3D volume figure for the given frame and channel with opacity."""
    data = frame[channel]
    depth, height, width = data.shape

    # Downsample for performance if grid is large
    max_size = 32
    step = max(1, max(depth, height, width) // max_size)
    if step > 1:
        data = data[::step, ::step, ::step]
        depth, height, width = data.shape

    # Create coordinates
    x, y, z = np.meshgrid(
        np.arange(width),
        np.arange(height),
        np.arange(depth),
        indexing="xy",
    )

    # Create volume with opacity based on value
    fig = go.Figure(data=go.Volume(
        x=x.flatten(),
        y=y.flatten(),
        z=z.flatten(),
        value=data.flatten(),
        isomin=0.01,
        isomax=1.0,
        opacity=0.15,
        opacityscale=[
            [0, 0],
            [0.05, 0],
            [0.1, 0.3],
            [0.3, 0.6],
            [1.0, 1.0],
        ],
        surface_count=10,  # Fewer surfaces = faster
        colorscale="Viridis",
        caps=dict(x_show=False, y_show=False, z_show=False),
    ))

    fig.update_layout(
        scene=dict(
            xaxis_title="X",
            yaxis_title="Y",
            zaxis_title="Z",
            aspectmode="data",
        ),
        margin=dict(l=0, r=0, t=30, b=0),
    )

    return fig


def main():
    if len(sys.argv) < 2:
        print("Usage: view_animation.py <animation.flwa>")
        sys.exit(1)

    animation_path = Path(sys.argv[1])
    if not animation_path.exists():
        print(f"File not found: {animation_path}")
        sys.exit(1)

    # Read animation data
    print(f"Loading {animation_path}...")
    with open(animation_path, "rb") as f:
        header = read_header(f)
        indices = read_frame_indices(f, header)

        print(f"  Grid: {header.width}x{header.height}x{header.depth}")
        print(f"  Channels: {header.channels}")
        print(f"  Frames: {header.frame_count}")
        print(f"  dt: {header.dt}")

        # Preload all frames
        print("Loading frames...")
        frames = [read_frame(f, header, idx) for idx in indices]

    is_3d = header.depth > 1
    print(f"Loaded {len(frames)} frames. Starting viewer...")

    # Create Dash app
    app = dash.Dash(__name__)

    app.layout = html.Div([
        html.H1("Flow Lenia Animation Viewer"),
        html.Div([
            html.Label("Frame:"),
            dcc.Slider(
                id="frame-slider",
                min=0,
                max=len(frames) - 1,
                step=1,
                value=0,
                marks={i: str(i) for i in range(0, len(frames), max(1, len(frames) // 10))},
            ),
        ], style={"margin": "20px"}),
        html.Div([
            html.Label("Channel:"),
            dcc.Dropdown(
                id="channel-dropdown",
                options=[{"label": f"Channel {i}", "value": i} for i in range(header.channels)],
                value=0,
            ),
        ], style={"width": "200px", "margin": "20px"}),
        html.Div([
            html.Button("Play", id="play-button", n_clicks=0),
            dcc.Interval(id="interval", interval=100, disabled=True),
        ], style={"margin": "20px"}),
        dcc.Graph(id="animation-graph", style={"height": "70vh"}),
        html.Div(id="frame-info"),
    ])

    @app.callback(
        Output("animation-graph", "figure"),
        Output("frame-info", "children"),
        Input("frame-slider", "value"),
        Input("channel-dropdown", "value"),
    )
    def update_figure(frame_idx, channel):
        frame = frames[frame_idx]
        time = frame_idx * header.dt

        if is_3d:
            fig = create_3d_figure(frame, channel)
        else:
            fig = create_2d_figure(frame, channel)

        total_mass = np.sum(frame)
        info = f"Frame {frame_idx}/{len(frames)-1} | Time: {time:.3f}s | Mass: {total_mass:.4f}"

        return fig, info

    @app.callback(
        Output("interval", "disabled"),
        Output("play-button", "children"),
        Input("play-button", "n_clicks"),
    )
    def toggle_play(n_clicks):
        if n_clicks % 2 == 1:
            return False, "Pause"
        return True, "Play"

    @app.callback(
        Output("frame-slider", "value"),
        Input("interval", "n_intervals"),
        Input("frame-slider", "value"),
    )
    def advance_frame(n_intervals, current_frame):
        ctx = dash.callback_context
        if ctx.triggered and ctx.triggered[0]["prop_id"] == "interval.n_intervals":
            return (current_frame + 1) % len(frames)
        return current_frame

    print("\nOpening viewer at http://127.0.0.1:8050")
    app.run(debug=False)


if __name__ == "__main__":
    main()
