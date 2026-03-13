import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetalhe, usePokemonEvolucao } from '../hooks/usePokemon';
import '../App.css';

const statCores = {
  hp: '#5AAE44',
  attack: '#E25822',
  defense: '#4A90D9',
  'special-attack': '#D44078',
  'special-defense': '#7B5EA7',
  speed: '#F0C030'
};

export function DetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const { data: pokemon,  isLoading: loadPoke  } = usePokemonDetalhe(name);
  const { data: evolucao, isLoading: loadEvo   } = usePokemonEvolucao(name);

  if (loadPoke) return <p className="loading">Carregando...</p>;
  if (!pokemon) return <p className="loading">Pokémon não encontrado.</p>;

  const imagem =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <div>
      <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h1>
      </header>

      <div className="modal" style={{ margin: '32px auto', position: 'static' }}>
        <img src={imagem} alt={pokemon.name} className="sprite" />
        <div className="num-detalhe">#{String(pokemon.id).padStart(3, '0')}</div>
        <h2>{pokemon.name}</h2>

        <div className="tipos" style={{ justifyContent: 'center', marginBottom: 12 }}>
          {pokemon.types.map(t => (
            <span key={t.type.name} className={`tipo ${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>

        <div className="info-grid">
          <div className="info-box">
            <span>Altura</span>
            <strong>{(pokemon.height / 10).toFixed(1)} m</strong>
          </div>
          <div className="info-box">
            <span>Peso</span>
            <strong>{(pokemon.weight / 10).toFixed(1)} kg</strong>
          </div>
        </div>

        <div className="secao-titulo">Habilidades</div>
        <p style={{ fontSize: 13, textTransform: 'capitalize' }}>
          {pokemon.abilities.map(a => a.ability.name).join(', ')}
        </p>

        <div className="secao-titulo">Status base</div>
        {pokemon.stats.map(s => (
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

        {/* cadeia de evolução */}
        <div className="secao-titulo">Evolução</div>
        {loadEvo ? (
          <p style={{ fontSize: 13, color: '#aaa' }}>Carregando evolução...</p>
        ) : evolucao && evolucao.length > 1 ? (
          <div className="evo-chain">
            {evolucao.map((evo, i) => (
              <div key={evo.name} className="evo-chain-inner">
                <div
                  className={`evo-card ${evo.name === name ? 'evo-atual' : ''}`}
                  onClick={() => evo.name !== name && navigate(`/pokemon/${evo.name}`)}
                >
                  <img src={evo.image} alt={evo.name} />
                  <span>{evo.name}</span>
                </div>
                {i < evolucao.length - 1 && (
                  <span className="evo-seta">→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#aaa' }}>Este Pokémon não evolui.</p>
        )}
      </div>
    </div>
  );
}