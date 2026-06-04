import type { CSSProperties } from 'react'
import { JOKER_SPRITES, CELL_W, CELL_H, ATLAS_COLS } from '../data/jokerSprites'

const ATLAS = `${import.meta.env.BASE_URL}jokers/Jokers.png`

function layer(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    width: w,
    height: h,
    backgroundImage: `url(${ATLAS})`,
    backgroundSize: `${ATLAS_COLS * w}px auto`,
    backgroundPosition: `${-x * w}px ${-y * h}px`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
  }
}

/** Renders a Balatro joker sprite from the atlas. `size` = width in px. */
export function JokerSprite({ id, size = 64 }: { id: string; size?: number }) {
  const p = JOKER_SPRITES[id]
  const h = Math.round((size * CELL_H) / CELL_W)
  if (!p) {
    return <div className="jsprite jsprite-missing" style={{ width: size, height: h }} aria-hidden />
  }
  return (
    <div className="jsprite" style={{ width: size, height: h, position: 'relative' }} aria-hidden>
      <div style={layer(p.x, p.y, size, h)} />
      {p.sx !== undefined && p.sy !== undefined && <div style={layer(p.sx, p.sy, size, h)} />}
    </div>
  )
}
