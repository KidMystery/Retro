import React from 'react';
import { PriceCandle } from '../types';

/**
 * Council Candles (9/13): SNES OHLC chart for the Trade Desk.
 * Completed market days only — the forming day is deliberately hidden (no lookahead).
 * Green body = up day, red body = down day, wicks = realized intraday extremes.
 * Candles flagged with a market event (rug-pull, squeeze) get a gold marker + label.
 */
export const CandleChart: React.FC<{ history: PriceCandle[]; bars?: number; height?: number }> = ({
  history,
  bars = 30,
  height = 150,
}) => {
  const data = history.slice(-bars);
  if (data.length < 2) {
    return (
      <div className="text-[11px] text-slate-500 font-mono py-6 text-center">
        The tape is young — rest a day at the shrine to print candles.
      </div>
    );
  }
  const W = 520;
  const H = height;
  const padL = 6, padR = 46, padT = 10, padB = 22;
  const hi = Math.max(...data.map(c => c.h));
  const lo = Math.min(...data.map(c => c.l));
  const span = Math.max(0.01, hi - lo);
  const y = (v: number) => padT + (1 - (v - lo) / span) * (H - padT - padB);
  const cw = (W - padL - padR) / data.length;

  const last = data[data.length - 1];
  const gridLines = 3;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block" style={{ imageRendering: 'pixelated' }}>
      {/* grid + price scale (SNES gold, faint) */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const v = lo + (span * i) / gridLines;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yy} y2={yy} stroke="rgba(212,175,55,0.14)" strokeWidth="1" />
            <text x={W - padR + 4} y={yy + 3} fontSize="8" fill="#8a6440" fontFamily="monospace">
              {v.toFixed(1)}
            </text>
          </g>
        );
      })}
      {data.map((c, i) => {
        const x = padL + i * cw + cw / 2;
        const up = c.c >= c.o;
        const bodyTop = y(Math.max(c.o, c.c));
        const bodyBot = y(Math.min(c.o, c.c));
        const bodyH = Math.max(1, bodyBot - bodyTop);
        const col = up ? '#22c55e' : '#ef4444';
        const ev = c.event;
        return (
          <g key={i}>
            {/* wicks */}
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1" />
            {/* body */}
            <rect x={x - Math.max(1.5, cw * 0.28)} y={bodyTop}
                  width={Math.max(3, cw * 0.56)} height={bodyH}
                  fill={up ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)'}
                  stroke={col} strokeWidth="1" />
            {/* event marker */}
            {ev && (
              <>
                <rect x={x - 2} y={H - padB + 4} width="4" height="4" fill="#d4af37" />
                {i === data.length - 1 && (
                  <text x={Math.min(W - 120, x + 6)} y={H - padB + 10} fontSize="7"
                        fill="#d4af37" fontFamily="monospace">
                    {ev.slice(0, 18)}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
      {/* last price line */}
      <line x1={padL} x2={W - padR} y1={y(last.c)} y2={y(last.c)}
            stroke="rgba(245,166,35,0.5)" strokeWidth="1" strokeDasharray="3 2" />
      <text x={W - padR + 4} y={y(last.c) + 3} fontSize="8" fill="#f5a623" fontFamily="monospace">
        {last.c.toFixed(1)}
      </text>
    </svg>
  );
};
