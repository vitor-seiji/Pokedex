import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonCard } from '../components/PokemonCard';
import { usePokemonLista, geracoes } from '../hooks/usePokemon';

const tipos = [
  'Fire','Water','Grass','Electric','Poison','Psychic',
  'Normal','Flying','Bug','Rock','Ground','Ice',
  'Ghost','Dragon','Fighting','Steel','Dark','Fairy'
];

export function HomePage() {
  const [busca, setBusca]               = useState('');
  const [tiposSelecionados, setTipos]   = useState([]);
  const [gensSelecionadas, setGens]     = useState([]);
  const [sidebarAberta, setSidebar]     = useState(false);
  const navigate                        = useNavigate();

  const { data, isLoading, isError } = usePokemonLista(gensSelecionadas);

  const filtrados = (data || []).filter(p => {
  const matchBusca = p.name.includes(busca.toLowerCase().trim()) ||
                     String(p.id).includes(busca.trim());

  let matchTipo;
  if (tiposSelecionados.length === 0) {
    matchTipo = true;
  } else if (tiposSelecionados.length === 1) {
    // um tipo: mostra todos que têm aquele tipo
    matchTipo = p.types.some(t =>
      tiposSelecionados.includes(
        t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
      )
    );
  } else {
    // múltiplos tipos: mostra só quem tem TODOS os tipos selecionados
    matchTipo = tiposSelecionados.every(tipo =>
      p.types.some(t =>
        t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1) === tipo
      )
    );
  }

  return matchBusca && matchTipo;
});

  function toggleGen(i) {
    if (i === 0) { setGens([]); return; }
    setGens(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  }

  function toggleTipo(t) {
    setTipos(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  const todasSelecionada = gensSelecionadas.length === 0;

  return (
    <div className="page">
      <aside className={`sidebar ${sidebarAberta ? 'aberta' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setSidebar(!sidebarAberta)}>
          {sidebarAberta ? '✕' : '›'}
        </button>

        <div className="sidebar-conteudo">
          <div className="sidebar-secao">
            <div className="sidebar-titulo">Geração</div>
            <button
              className={`sidebar-btn ${todasSelecionada ? 'ativo' : ''}`}
              onClick={() => toggleGen(0)}
            >
              Todas
            </button>
            {geracoes.slice(1).map((g, i) => {
              const idx  = i + 1;
              const ativo = gensSelecionadas.includes(idx);
              return (
                <button
                  key={idx}
                  className={`sidebar-btn ${ativo ? 'ativo' : ''}`}
                  onClick={() => toggleGen(idx)}
                >
                  {ativo ? '✓ ' : ''}{g.label}
                </button>
              );
            })}
          </div>

          <div className="sidebar-secao">
            <div className="sidebar-titulo">Tipo</div>
            <button
              className={`sidebar-btn ${tiposSelecionados.length === 0 ? 'ativo' : ''}`}
              onClick={() => setTipos([])}
            >
              Todos
            </button>
            {tipos.map(t => {
              const ativo = tiposSelecionados.includes(t);
              return (
                <button
                  key={t}
                  className={`sidebar-btn ${ativo ? 'ativo' : ''}`}
                  onClick={() => toggleTipo(t)}
                >
                  <span className={`tipo-dot ${t.toLowerCase()}`} />
                  {ativo ? '✓ ' : ''}{t}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className={`main-content ${sidebarAberta ? 'recuado' : ''}`}>
        <header className="header">
          <h1>Pokédex</h1>
          <input
            className="search"
            type="text"
            placeholder="Buscar por nome ou número..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </header>

        {(gensSelecionadas.length > 0 || tiposSelecionados.length > 0) && (
          <div className="filtros-ativos">
            {gensSelecionadas.map(i => (
              <span key={i} className="filtro-ativo-badge" onClick={() => toggleGen(i)}>
                {geracoes[i].label} ✕
              </span>
            ))}
            {tiposSelecionados.map(t => (
              <span key={t} className="filtro-ativo-badge" onClick={() => toggleTipo(t)}>
                <span className={`tipo-dot ${t.toLowerCase()}`} />
                {t} ✕
              </span>
            ))}
            <span
              className="filtro-ativo-badge limpar"
              onClick={() => { setGens([]); setTipos([]); }}
            >
              Limpar tudo
            </span>
          </div>
        )}

        {isLoading ? (
          <p className="loading">Carregando...</p>
        ) : isError ? (
          <p className="loading">Erro ao carregar. Tente novamente.</p>
        ) : filtrados.length === 0 ? (
          <p className="loading">Nenhum Pokémon encontrado.</p>
        ) : (
          <div className="grid">
            {filtrados.map(p => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onClick={() => navigate(`/pokemon/${p.name.toLowerCase()}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}