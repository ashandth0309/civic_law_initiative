interface Props {
  num: string;
  sub: string;
  title: string;
}

export default function SectionHeader({ num, sub, title }: Props) {
  return (
    <div className="flex items-baseline gap-6 mb-10 flex-wrap">
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(3rem, 7vw, 5rem)',
          lineHeight: 1,
          color: 'var(--accent)',
          flexShrink: 0,
        }}
      >
        {num}
      </span>
      <div>
        <span
          className="block mb-1"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.52rem',
            letterSpacing: '0.2em',
            color: 'var(--red)',
            textTransform: 'uppercase',
          }}
        >
          {sub}
        </span>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            color: 'var(--ink)',
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
