import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonCard } from '../components/PokemonCard';
import { usePokemonLista } from '../hooks/usePokemon';

const tipos = [
  'fire','water','grass','electric','poison','psychic',
  'normal','flying','bug','rock','ground','ice',
  'ghost','dragon','fighting','steel','dark','fairy'
];

export function HomePage() {
  const [busca, setBusca]       = useState('');
  const [tipoAtivo, setTipo]    = useState('');
  const navigate                = useNavigate();
  const { data, isLoading, isError } = usePokemonLista();

  if (isLoading) return (
    <div>
      <header className="header"><h1>Pokédex</h1></header>
      <p className="loading">Carregando...</p>
    </div>
  );

  if (isError) return (
    <div>
      <header className="header"><h1>Pokédex</h1></header>
      <p className="loading">Erro ao carregar. Tente novamente.</p>
    </div>
  );

  const filtrados = data.filter(p => {
    const matchBusca = p.name.includes(busca.toLowerCase().trim()) ||
                       String(p.id).includes(busca.trim());
    const matchTipo  = tipoAtivo === '' ||
                       p.types.some(t => t.type.name === tipoAtivo);
    return matchBusca && matchTipo;
  });

  return (
    <div>
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

      <div className="filtros">
        <span
          className={`filtro-btn ${tipoAtivo === '' ? 'ativo' : ''}`}
          onClick={() => setTipo('')}
        >
          todos
        </span>
        {tipos.map(t => (
          <span
            key={t}
            className={`filtro-btn tipo ${t} ${tipoAtivo === t ? 'ativo' : ''}`}
            onClick={() => setTipo(tipoAtivo === t ? '' : t)}
          >
            {t}
          </span>
        ))}
      </div>

      {filtrados.length === 0 ? (
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
  );
}