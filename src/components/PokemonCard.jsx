export function PokemonCard({ pokemon: p, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="num">#{String(p.id).padStart(3, '0')}</div>
      <img src={p.sprites.front_default} alt={p.name} loading="lazy" />
      <h3>{p.name}</h3>
      <div className="tipos">
        {p.types.map(t => (
          <span key={t.type.name} className={`tipo ${t.type.name}`}>
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}