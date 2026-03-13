const statCores = {
  hp: '#5AAE44',
  attack: '#E25822',
  defense: '#4A90D9',
  'special-attack': '#D44078',
  'special-defense': '#7B5EA7',
  speed: '#F0C030'
};

export function Modal({ pokemon: p, onFechar }) {
  const imagem =
    p.sprites.other['official-artwork'].front_default ||
    p.sprites.front_default;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="fechar" onClick={onFechar}>✕</button>
        <img src={imagem} alt={p.name} className="sprite" />
        <div className="num-detalhe">#{String(p.id).padStart(3, '0')}</div>
        <h2>{p.name}</h2>
        <div className="tipos" style={{ justifyContent: 'center', marginBottom: 12 }}>
          {p.types.map(t => (
            <span key={t.type.name} className={`tipo ${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="info-grid">
          <div className="info-box">
            <span>Altura</span>
            <strong>{(p.height / 10).toFixed(1)} m</strong>
          </div>
          <div className="info-box">
            <span>Peso</span>
            <strong>{(p.weight / 10).toFixed(1)} kg</strong>
          </div>
        </div>
        <div className="secao-titulo">Habilidades</div>
        <p style={{ fontSize: 13, textTransform: 'capitalize' }}>
          {p.abilities.map(a => a.ability.name).join(', ')}
        </p>
        <div className="secao-titulo">Status base</div>
        {p.stats.map(s => (
          <div key={s.stat.name} className="stat-row">
            <span className="stat-nome">{s.stat.name}</span>
            <div className="stat-barra-bg">
              <div
                className="stat-barra"
                style={{
                  width: `${Math.min(s.base_stat, 150) / 150 * 100}%`,
                  background: statCores[s.stat.name] || '#888'
                }}
              />
            </div>
            <span className="stat-val">{s.base_stat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}