export function PhoneVisual({ accent, label }: { accent: string; label: string }) {
  return (
    <div className="phone-stage" aria-hidden="true">
      <div className="phone-shadow" style={{ background: accent }} />
      <div className="phone-frame">
        <div className="phone-screen" style={{ background: `radial-gradient(circle at 70% 10%, ${accent}cc, transparent 34%), linear-gradient(145deg, #101014 8%, ${accent}55 52%, #08090c 100%)` }}>
          <span className="phone-island" />
          <span className="phone-glow" />
        </div>
      </div>
      <span className="sr-only">Abstract product silhouette for {label}</span>
    </div>
  );
}
