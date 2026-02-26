import { useState, useEffect, useRef, useCallback } from "react";

const DISK_DATA = {
  name: "/",
  size: 46.7,
  unit: "GB",
  items: 566623,
  modified: "Today",
  children: [
    {
      name: "home", size: 16.3, unit: "GB", items: 215044, modified: "Today",
      children: [
        { name: "projects", size: 8.1, unit: "GB", items: 42310, modified: "Today", children: [
          { name: "models", size: 4.2, unit: "GB", items: 128, modified: "Today", children: [] },
          { name: "datasets", size: 2.8, unit: "GB", items: 5041, modified: "2 days", children: [] },
          { name: "scripts", size: 1.1, unit: "GB", items: 37141, modified: "Today", children: [] },
        ]},
        { name: "documents", size: 3.4, unit: "GB", items: 82110, modified: "Today", children: [] },
        { name: "media", size: 2.9, unit: "GB", items: 84900, modified: "3 days", children: [] },
        { name: "cache", size: 1.9, unit: "GB", items: 5724, modified: "Today", children: [] },
      ]
    },
    {
      name: "usr", size: 14.4, unit: "GB", items: 282849, modified: "1 day",
      children: [
        { name: "lib", size: 8.6, unit: "GB", items: 73686, modified: "1 day", children: [
          { name: "firmware", size: 1.2, unit: "GB", items: 512, modified: "1 day", children: [] },
          { name: "drivers", size: 0.9, unit: "GB", items: 2104, modified: "1 day", children: [] },
          { name: "x86_64-linux-gnu", size: 4.8, unit: "GB", items: 58210, modified: "1 day", children: [] },
          { name: "python3", size: 1.7, unit: "GB", items: 12860, modified: "1 day", children: [] },
        ]},
        { name: "local", size: 2.6, unit: "GB", items: 604, modified: "8 days", children: [
          { name: "lib", size: 2.6, unit: "GB", items: 21, modified: "8 days", children: [] },
        ]},
        { name: "share", size: 1.7, unit: "GB", items: 100214, modified: "1 day", children: [] },
        { name: "include", size: 0.48, unit: "GB", items: 43122, modified: "1 day", children: [] },
        { name: "bin", size: 0.38, unit: "GB", items: 1665, modified: "1 day", children: [] },
        { name: "src", size: 0.33, unit: "GB", items: 59909, modified: "4 days", children: [] },
      ]
    },
    { name: "swapfile", size: 8.6, unit: "GB", items: 0, modified: "4 months", children: [] },
    {
      name: "var", size: 5.1, unit: "GB", items: 18650, modified: "Today",
      children: [
        { name: "log", size: 2.1, unit: "GB", items: 312, modified: "Today", children: [] },
        { name: "cache", size: 1.8, unit: "GB", items: 14200, modified: "Today", children: [] },
        { name: "lib", size: 1.2, unit: "GB", items: 4138, modified: "Today", children: [] },
      ]
    },
    { name: "opt", size: 2.1, unit: "GB", items: 47624, modified: "26 days", children: [] },
    { name: "boot", size: 0.21, unit: "GB", items: 303, modified: "Today", children: [] },
    { name: "etc", size: 0.016, unit: "GB", items: 2103, modified: "Today", children: [] },
    { name: "tmp", size: 0.00012, unit: "GB", items: 25, modified: "Today", children: [] },
    { name: "snap", size: 0.00006, unit: "GB", items: 15, modified: "Today", children: [] },
  ]
};

const PALETTE = [
  "#FF6B6B","#FF8E53","#FFC75F","#F9F871","#85E89D","#40C9FF","#8B5CF6","#F472B6",
  "#34D399","#60A5FA","#FB923C","#A78BFA","#2DD4BF","#F87171","#FBBF24","#818CF8"
];

function formatSize(gb) {
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  if (gb * 1024 >= 1) return `${(gb * 1024).toFixed(0)} MB`;
  return `${(gb * 1024 * 1024).toFixed(0)} KB`;
}

function formatItems(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M items`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K items`;
  return `${n} items`;
}

function assignColors(node, palette, idx = { val: 0 }) {
  node.color = palette[idx.val % palette.length];
  idx.val++;
  if (node.children) node.children.forEach(c => assignColors(c, palette, idx));
  return node;
}

function buildTreemap(node, x, y, w, h, depth = 0) {
  const rects = [{ ...node, x, y, w, h, depth }];
  if (!node.children || node.children.length === 0 || w < 4 || h < 4) return rects;
  const sorted = [...node.children].sort((a, b) => b.size - a.size);
  const totalSize = sorted.reduce((s, c) => s + c.size, 0);
  if (totalSize === 0) return rects;
  const pad = depth === 0 ? 2 : 1;
  let cx = x + pad, cy = y + pad;
  const cw = w - pad * 2, ch = h - pad * 2;
  // Squarified treemap
  let remaining = sorted.slice();
  let rx = cx, ry = cy, rw = cw, rh = ch;
  while (remaining.length > 0) {
    const isH = rw >= rh;
    let row = [], rowSize = 0, rowLen = isH ? rw : rh;
    let bestWorst = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      row.push(remaining[i]);
      rowSize += remaining[i].size;
      const frac = rowSize / totalSize;
      const rowW = isH ? rw : rw * (rowSize / (totalSize - 0));
      const rowH = isH ? rh * frac : rh;
      const dim1 = isH ? rw * frac : rh * frac;
      const dim2 = isH ? rh : rw;
      let worst = 0;
      let rowTot = rowSize;
      for (const ri of row) {
        const riFrac = ri.size / rowTot;
        const riW = isH ? dim1 : dim2 * riFrac;
        const riH = isH ? dim2 * riFrac : dim1;
        const ar = Math.max(riW / Math.max(riH, 0.01), riH / Math.max(riW, 0.01));
        worst = Math.max(worst, ar);
      }
      if (worst > bestWorst) { row.pop(); break; }
      bestWorst = worst;
    }
    remaining = remaining.slice(row.length);
    const rowFrac = row.reduce((s, c) => s + c.size, 0) / totalSize;
    const rowDim = (isH ? rw : rh) * rowFrac;
    let pos = isH ? ry : rx;
    for (const child of row) {
      const frac2 = child.size / row.reduce((s, c) => s + c.size, 0);
      const cW = isH ? rowDim : (rw - rowDim) < 0 ? rw * frac2 : rw * (1 - rowFrac) < 0.1 ? rw * frac2 : (isH ? rowDim : rw * rowFrac) * frac2;
      const cH = isH ? rh * frac2 : rowDim;
      if (isH) {
        const childW = rowDim;
        const childH = rh * frac2;
        rects.push(...buildTreemap(child, rx, pos, childW, childH, depth + 1));
        pos += childH;
      } else {
        const childW = rw * frac2;
        const childH = rowDim;
        rects.push(...buildTreemap(child, pos, ry, childW, childH, depth + 1));
        pos += childW;
      }
    }
    if (isH) { rx += rowDim; rw -= rowDim; }
    else { ry += rowDim; rh -= rowDim; }
    if (rw < 2 || rh < 2) break;
  }
  return rects;
}

function TreemapView({ data, onSelect, selected }) {
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 600, h: 400 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(height, 200) });
    });
    if (svgRef.current) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  const rects = buildTreemap(data, 0, 0, dims.w, dims.h);

  return (
    <svg ref={svgRef} width="100%" height="100%" style={{ display: "block" }}>
      {rects.map((rect, i) => {
        const isSelected = selected?.name === rect.name;
        const isHovered = hovered?.name === rect.name;
        return (
          <g key={i}>
            <rect
              x={rect.x + 0.5} y={rect.y + 0.5}
              width={Math.max(rect.w - 1, 0)} height={Math.max(rect.h - 1, 0)}
              fill={rect.color}
              fillOpacity={rect.depth === 0 ? 0 : isHovered || isSelected ? 1 : 0.82}
              stroke={isSelected ? "#fff" : isHovered ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.25)"}
              strokeWidth={isSelected ? 2 : 1}
              rx={rect.depth <= 1 ? 4 : 2}
              style={{ cursor: "pointer", transition: "fill-opacity 0.15s" }}
              onMouseEnter={() => setHovered(rect)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(rect)}
            />
            {rect.w > 50 && rect.h > 20 && rect.depth > 0 && (
              <text
                x={rect.x + rect.w / 2} y={rect.y + rect.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.92)" fontSize={Math.min(rect.w / 6, rect.h / 3, 13)}
                fontFamily="'Space Mono', monospace" fontWeight="600"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {rect.name.length > 10 && rect.w < 80 ? rect.name.slice(0, 7) + "…" : rect.name}
              </text>
            )}
            {rect.w > 70 && rect.h > 36 && rect.depth > 0 && (
              <text
                x={rect.x + rect.w / 2} y={rect.y + rect.h / 2 + Math.min(rect.w / 6, rect.h / 3, 13) + 3}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.65)" fontSize={Math.min(rect.w / 8, rect.h / 4, 10)}
                fontFamily="'Space Mono', monospace"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {formatSize(rect.size)}
              </text>
            )}
          </g>
        );
      })}
      {hovered && hovered.depth > 0 && (
        <g>
          <rect x={8} y={8} width={200} height={72} rx={8}
            fill="rgba(10,10,20,0.88)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={20} y={30} fill="#fff" fontSize={13} fontFamily="'Space Mono', monospace" fontWeight="700">{hovered.name}</text>
          <text x={20} y={48} fill={hovered.color} fontSize={12} fontFamily="'Space Mono', monospace">{formatSize(hovered.size)}</text>
          <text x={20} y={65} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="'Space Mono', monospace">{formatItems(hovered.items)} · {hovered.modified}</text>
        </g>
      )}
    </svg>
  );
}

function RingsView({ data, onSelect, selected }) {
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 500, h: 400 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(height, 200) });
    });
    if (svgRef.current) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  const cx = dims.w / 2, cy = dims.h / 2;
  const maxR = Math.min(cx, cy) - 10;
  const innerR = maxR * 0.22;
  const ringW = (maxR - innerR) / 3;

  function buildArcs(node, startAngle, endAngle, depth) {
    const arcs = [];
    if (depth > 3) return arcs;
    const angle = endAngle - startAngle;
    if (angle < 0.02) return arcs;
    const r1 = innerR + (depth - 1) * ringW;
    const r2 = r1 + ringW - 2;
    if (depth > 0) {
      arcs.push({ node, startAngle, endAngle, r1, r2, depth });
    }
    if (node.children && node.children.length > 0) {
      const sorted = [...node.children].sort((a, b) => b.size - a.size);
      const total = sorted.reduce((s, c) => s + c.size, 0);
      if (total > 0) {
        let cur = startAngle;
        for (const child of sorted) {
          const childAngle = (child.size / total) * angle;
          arcs.push(...buildArcs(child, cur, cur + childAngle, depth + 1));
          cur += childAngle;
        }
      }
    }
    return arcs;
  }

  const arcs = buildArcs(data, -Math.PI / 2, 3 * Math.PI / 2, 0);

  function arcPath(r1, r2, a1, a2) {
    const x1 = cx + r1 * Math.cos(a1), y1 = cy + r1 * Math.sin(a1);
    const x2 = cx + r2 * Math.cos(a1), y2 = cy + r2 * Math.sin(a1);
    const x3 = cx + r2 * Math.cos(a2), y3 = cy + r2 * Math.sin(a2);
    const x4 = cx + r1 * Math.cos(a2), y4 = cy + r1 * Math.sin(a2);
    const large = (a2 - a1) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${large} 0 ${x1} ${y1} Z`;
  }

  const display = hovered || selected;

  return (
    <svg ref={svgRef} width="100%" height="100%" style={{ display: "block" }}>
      {arcs.map((arc, i) => {
        const isH = hovered?.node.name === arc.node.name;
        const isSel = selected?.name === arc.node.name;
        return (
          <path key={i}
            d={arcPath(arc.r1, arc.r2, arc.startAngle, arc.endAngle)}
            fill={arc.node.color}
            fillOpacity={isH || isSel ? 1 : 0.78}
            stroke={isH || isSel ? "#fff" : "rgba(10,10,20,0.6)"}
            strokeWidth={isH || isSel ? 1.5 : 0.5}
            style={{ cursor: "pointer", transition: "fill-opacity 0.12s" }}
            onMouseEnter={() => setHovered(arc)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(arc.node)}
          />
        );
      })}
      {/* Center circle */}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="rgba(15,15,25,0.9)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#fff" fontSize={22} fontFamily="'Space Mono', monospace" fontWeight="700">
        {display ? formatSize(display.size || display.node?.size) : formatSize(data.size)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={11} fontFamily="'Space Mono', monospace">
        {display ? (display.name || display.node?.name) : data.name}
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9} fontFamily="'Space Mono', monospace">
        {display ? formatItems(display.items || display.node?.items || 0) : formatItems(data.items)}
      </text>
    </svg>
  );
}

export default function DiskAnalyzer() {
  const [root] = useState(() => assignColors(JSON.parse(JSON.stringify(DISK_DATA)), PALETTE));
  const [view, setView] = useState("treemap");
  const [selected, setSelected] = useState(null);
  const [path, setPath] = useState([]);
  const [scanAnim, setScanAnim] = useState(true);
  const [scanPct, setScanPct] = useState(0);

  useEffect(() => {
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 8 + 2;
      setScanPct(Math.min(pct, 100));
      if (pct >= 100) { clearInterval(iv); setTimeout(() => setScanAnim(false), 400); }
    }, 60);
    return () => clearInterval(iv);
  }, []);

  const handleSelect = (node) => {
    if (!node) return;
    const n = node.node || node;
    setSelected(n);
    if (n.name !== root.name) {
      setPath(prev => {
        const idx = prev.findIndex(p => p.name === n.name);
        if (idx >= 0) return prev.slice(0, idx + 1);
        return [...prev, n];
      });
    }
  };

  const totalUsed = root.size;
  const totalDisk = 64;
  const usedPct = ((totalUsed / totalDisk) * 100).toFixed(1);

  const topItems = root.children ? [...root.children].sort((a, b) => b.size - a.size).slice(0, 6) : [];

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0d1020 50%, #0a0f1a 100%)",
      fontFamily: "'Space Mono', monospace", color: "#e0e0f0", display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Animated grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(64,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(64,100,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Scan overlay */}
      {scanAnim && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50, background: "rgba(8,8,20,0.97)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transition: "opacity 0.4s", opacity: scanPct >= 100 ? 0 : 1
        }}>
          <div style={{ fontSize: 11, color: "#40C9FF", letterSpacing: 6, marginBottom: 24, textTransform: "uppercase" }}>Scanning Filesystem</div>
          <div style={{ width: 320, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${scanPct}%`, background: "linear-gradient(90deg, #40C9FF, #8B5CF6)", transition: "width 0.1s", borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{scanPct.toFixed(0)}%</div>
          <div style={{ marginTop: 8, fontSize: 9, color: "rgba(64,201,255,0.4)", fontFamily: "monospace" }}>
            /usr/lib/x86_64-linux-gnu/dri/radeonsi_dri.so
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#40C9FF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>DISK ANALYZER</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 3 }}>FILESYSTEM INTELLIGENCE</div>
          </div>
        </div>

        {/* Usage bar */}
        <div style={{ flex: 1, maxWidth: 300, margin: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>
            <span>USED {formatSize(totalUsed)}</span>
            <span>{usedPct}% of {totalDisk} GB</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${usedPct}%`,
              background: parseFloat(usedPct) > 80 ? "linear-gradient(90deg,#FF6B6B,#FF8E53)" : "linear-gradient(90deg,#40C9FF,#8B5CF6)",
              borderRadius: 3, transition: "width 1s ease"
            }} />
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4, textAlign: "right" }}>
            {formatSize(totalDisk - totalUsed)} free
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3, gap: 2 }}>
          {[["treemap", "⊞ Treemap"], ["rings", "◎ Rings"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: 1, fontWeight: 700,
              background: view === v ? "linear-gradient(135deg,#40C9FF22,#8B5CF622)" : "transparent",
              color: view === v ? "#40C9FF" : "rgba(255,255,255,0.35)",
              borderBottom: view === v ? "1px solid #40C9FF44" : "1px solid transparent",
              transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 10 }}>
        
        {/* Sidebar */}
        <div style={{
          width: 260, borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)", display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Path breadcrumb */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
            <span style={{ color: "#40C9FF", cursor: "pointer" }} onClick={() => { setSelected(null); setPath([]); }}>/</span>
            {path.map((p, i) => (
              <span key={i}>
                <span style={{ color: "rgba(255,255,255,0.2)" }}> / </span>
                <span style={{ color: i === path.length - 1 ? "#fff" : "#40C9FF", cursor: "pointer" }}
                  onClick={() => { setSelected(p); setPath(prev => prev.slice(0, i + 1)); }}>{p.name}</span>
              </span>
            ))}
          </div>

          {/* Folder list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {root.children?.sort((a, b) => b.size - a.size).map((child, i) => {
              const pct = (child.size / root.size * 100).toFixed(1);
              const isSel = selected?.name === child.name;
              return (
                <div key={i} onClick={() => handleSelect(child)}
                  style={{
                    padding: "8px 14px", cursor: "pointer",
                    background: isSel ? "rgba(64,201,255,0.08)" : "transparent",
                    borderLeft: isSel ? "2px solid #40C9FF" : "2px solid transparent",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: child.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : "rgba(255,255,255,0.7)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{child.name}</span>
                    <span style={{ fontSize: 10, color: child.color, fontWeight: 700 }}>{formatSize(child.size)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: child.color, opacity: 0.7, borderRadius: 1 }} />
                    </div>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", width: 36, textAlign: "right" }}>{pct}%</span>
                  </div>
                  {child.items > 0 && (
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>{formatItems(child.items)} · {child.modified}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected info panel */}
          {selected && (
            <div style={{
              margin: 10, padding: 12, borderRadius: 10,
              background: "rgba(64,201,255,0.07)", border: "1px solid rgba(64,201,255,0.15)"
            }}>
              <div style={{ fontSize: 9, color: "rgba(64,201,255,0.6)", letterSpacing: 3, marginBottom: 6 }}>SELECTED</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: selected.color }}>{formatSize(selected.size)}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                {selected.items > 0 ? formatItems(selected.items) : "No items"} · Modified {selected.modified}
              </div>
              {selected.children?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{selected.children.length} subdirectories</div>
              )}
              <button onClick={() => { setSelected(null); setPath([]); }}
                style={{ marginTop: 10, width: "100%", padding: "5px 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 9, cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: 2 }}>
                ✕ CLEAR
              </button>
            </div>
          )}
        </div>

        {/* Main viz */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Toolbar */}
          <div style={{
            padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 12, fontSize: 9, color: "rgba(255,255,255,0.25)"
          }}>
            <span>◈ {root.name} — {formatSize(root.size)} — {root.items?.toLocaleString()} items</span>
            <div style={{ flex: 1 }} />
            <span style={{ color: "rgba(255,255,255,0.15)" }}>Click to select · Hover to inspect</span>
          </div>

          {/* Visualization */}
          <div style={{ flex: 1, padding: 12, overflow: "hidden" }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: 12, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 0 40px rgba(64,201,255,0.04)"
            }}>
              {view === "treemap"
                ? <TreemapView data={root} onSelect={handleSelect} selected={selected} />
                : <RingsView data={root} onSelect={handleSelect} selected={selected} />
              }
            </div>
          </div>

          {/* Bottom stats */}
          <div style={{
            padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", gap: 24, fontSize: 9, color: "rgba(255,255,255,0.3)"
          }}>
            {[
              ["Total Size", formatSize(root.size)],
              ["Total Files", (root.items || 0).toLocaleString()],
              ["Directories", root.children?.length || 0],
              ["Free Space", formatSize(totalDisk - totalUsed)],
              ["Usage", `${usedPct}%`],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ color: "rgba(255,255,255,0.18)", marginBottom: 2, letterSpacing: 2 }}>{label}</div>
                <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
