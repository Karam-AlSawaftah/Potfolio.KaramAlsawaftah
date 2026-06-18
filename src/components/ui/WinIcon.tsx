interface WinIconProps {
  row: number;
  col: number;
  size?: number;
  className?: string;
}

// Sprite sheet is 736×704 with 32×32 icons (23 cols × 22 rows)
export default function WinIcon({ row, col, size = 32, className }: WinIconProps) {
  const scale = size / 32;
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/icons/winicons32.png)",
        backgroundPosition: `-${col * 32 * scale}px -${row * 32 * scale}px`,
        backgroundSize: `${736 * scale}px ${704 * scale}px`,
        imageRendering: "pixelated",
        flexShrink: 0,
      }}
    />
  );
}
