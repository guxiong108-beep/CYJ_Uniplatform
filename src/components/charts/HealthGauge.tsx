export function HealthGauge({ value, label = "健康评分" }: { value: number; label?: string }) {
  const angle = -90 + (value / 100) * 180;
  const tone = value < 60 ? "#ff5a70" : value < 80 ? "#ffb020" : "#2adf9f";

  return (
    <div className="gauge" aria-label={`${label}${value}分`}>
      <div className="gauge-arc" />
      <div className="gauge-needle" style={{ transform: `rotate(${angle}deg)`, background: tone }} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
