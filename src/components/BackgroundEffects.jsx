import React, { useEffect, useRef } from 'react';
import { AIraBot } from './UIPrimitives.jsx';

const NET_SIDE = [[40, 70], [72, 140], [34, 212], [88, 282], [48, 352], [440, 80], [408, 150], [446, 222], [392, 292], [432, 360]];
const NET_ANCHOR = [[160, 62], [146, 104], [170, 150], [320, 62], [334, 104], [310, 150]];
const NET_EDGES = (() => {
  const e = [];
  NET_SIDE.forEach((n, i) => {
    const right = i >= 5,
      base = right ? 3 : 0,
      k = i % 5;
    e.push([n, NET_ANCHOR[base + Math.min(2, Math.floor(k / 2))]]);
    if (k < 4) e.push([n, NET_SIDE[i + 1]]);
    if (k === 1 || k === 3) e.push([n, NET_ANCHOR[base + (k === 1 ? 0 : 2)]]);
  });
  return e;
})();
const BRAIN_PATH = "M240 30 C205 18 165 30 152 60 C132 68 126 96 138 112 C128 132 140 158 164 164 C176 186 210 192 240 180 C270 192 304 186 316 164 C340 158 352 132 342 112 C354 96 348 68 328 60 C315 30 275 18 240 30 Z";
const BRAIN_GYRI = ["M240 36 V176", "M170 70 q20 -10 36 4", "M158 110 q24 8 44 -6", "M176 146 q18 -12 40 0", "M310 70 q-20 -10 -36 4", "M322 110 q-24 8 -44 -6", "M304 146 q-18 -12 -40 0"];
const PARTICLES = Array.from({
  length: 24
}, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: 20 + i * 53 % 78,
  size: 2 + i % 3,
  dur: 7 + i % 5 * 1.6,
  delay: -(i * 1.3 % 9),
  tone: i % 6 === 0 ? "g" : i % 3 === 0 ? "c" : ""
}));
function Particles() {
  return React.createElement("div", {
    className: "particles",
    "aria-hidden": "true"
  }, PARTICLES.map((p, i) => React.createElement("i", {
    key: i,
    className: p.tone,
    style: {
      left: p.left + "%",
      top: p.top + "%",
      width: p.size,
      height: p.size,
      animationDuration: p.dur + "s",
      animationDelay: p.delay + "s"
    }
  })));
}
function HoloStage({
  mood = "cheer"
}) {
  return React.createElement("div", {
    className: "holo-stage"
  }, React.createElement("svg", {
    className: "net",
    viewBox: "0 0 480 440",
    "aria-hidden": "true"
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "holoStroke",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#00E5FF"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#9B87F5"
  })), React.createElement("radialGradient", {
    id: "holoFill",
    cx: "50%",
    cy: "45%",
    r: "60%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#57CCF2",
    stopOpacity: ".28"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#9B87F5",
    stopOpacity: "0"
  })), React.createElement("linearGradient", {
    id: "scanGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#00E5FF",
    stopOpacity: "0"
  }), React.createElement("stop", {
    offset: ".5",
    stopColor: "#00E5FF",
    stopOpacity: ".55"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#00E5FF",
    stopOpacity: "0"
  })), React.createElement("clipPath", {
    id: "brainClip"
  }, React.createElement("path", {
    d: BRAIN_PATH
  }))), NET_EDGES.map(([a, b], i) => React.createElement("line", {
    key: "e" + i,
    className: "edge",
    x1: a[0],
    y1: a[1],
    x2: b[0],
    y2: b[1]
  })), NET_EDGES.filter((_, i) => i % 2 === 0).map(([a, b], i) => React.createElement("line", {
    key: "p" + i,
    className: "pulse",
    x1: a[0],
    y1: a[1],
    x2: b[0],
    y2: b[1],
    style: {
      animationDelay: -(i * 0.45) + "s"
    }
  })), React.createElement("g", {
    className: "spin"
  }, React.createElement("ellipse", {
    className: "orbit",
    cx: "240",
    cy: "105",
    rx: "168",
    ry: "44",
    transform: "rotate(-12 240 105)"
  }), React.createElement("ellipse", {
    className: "orbit",
    cx: "240",
    cy: "105",
    rx: "130",
    ry: "96",
    transform: "rotate(18 240 105)"
  })), React.createElement("g", {
    className: "glow-brain"
  }, React.createElement("path", {
    d: BRAIN_PATH,
    fill: "url(#holoFill)",
    className: "brain"
  }), BRAIN_GYRI.map((d, i) => React.createElement("path", {
    key: i,
    d: d,
    className: "gyri"
  }))), React.createElement("g", {
    clipPath: "url(#brainClip)"
  }, React.createElement("rect", {
    className: "scan",
    x: "120",
    y: "95",
    width: "240",
    height: "22",
    fill: "url(#scanGrad)"
  })), NET_SIDE.map(([x, y], i) => React.createElement("circle", {
    key: "n" + i,
    className: "node" + (i % 2 ? " l" : ""),
    cx: x,
    cy: y,
    r: i % 3 === 0 ? 5 : 3.5
  })), NET_ANCHOR.map(([x, y], i) => React.createElement("circle", {
    key: "a" + i,
    className: "node",
    cx: x,
    cy: y,
    r: "3"
  }))), React.createElement("div", {
    className: "bot-wrap"
  }, React.createElement(AIraBot, {
    mood: mood
  })));
}


export {
  NET_SIDE,
  NET_ANCHOR,
  NET_EDGES,
  BRAIN_PATH,
  BRAIN_GYRI,
  PARTICLES,
  Particles,
  HoloStage
};
