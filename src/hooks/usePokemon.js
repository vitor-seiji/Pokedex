import { useQuery } from '@tanstack/react-query';

export const geracoes = [
  { label: 'Todas', offset: 0,   limit: 1025 },
  { label: 'Gen 1', offset: 0,   limit: 151  },
  { label: 'Gen 2', offset: 151, limit: 100  },
  { label: 'Gen 3', offset: 251, limit: 135  },
  { label: 'Gen 4', offset: 386, limit: 107  },
  { label: 'Gen 5', offset: 493, limit: 156  },
  { label: 'Gen 6', offset: 649, limit: 72   },
  { label: 'Gen 7', offset: 721, limit: 88   },
  { label: 'Gen 8', offset: 809, limit: 96   },
  { label: 'Gen 9', offset: 905, limit: 120  },
];

async function fetchLista(offset, limit) {
  const res   = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  const lista = await res.json();
  const dados = await Promise.all(
    lista.results.map(p => fetch(p.url).then(r => r.json()))
  );
  return dados.sort((a, b) => a.id - b.id);
}

async function fetchDetalhe(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return res.json();
}

async function fetchEvolucao(name) {
  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`
  );
  const species    = await speciesRes.json();
  const cadeiaRes  = await fetch(species.evolution_chain.url);
  const cadeiaData = await cadeiaRes.json();

  const lista = [];
  let atual   = cadeiaData.chain;

  while (atual) {
    const nomePokemon = atual.species.name;
    const pokeRes     = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`
    );
    const pokeData = await pokeRes.json();
    lista.push({
      name:  nomePokemon,
      id:    pokeData.id,
      image: pokeData.sprites.other['official-artwork'].front_default ||
             pokeData.sprites.front_default,
    });
    atual = atual.evolves_to[0] || null;
  }

  return lista;
}

// busca todas as gens selecionadas em uma única query
async function fetchMultiplasGens(indices) {
  const promises = indices.map(i =>
    fetchLista(geracoes[i].offset, geracoes[i].limit)
  );
  const resultados = await Promise.all(promises);
  const todos = resultados.flat();
  // remove duplicatas e ordena
  const unicos = [...new Map(todos.map(p => [p.id, p])).values()];
  return unicos.sort((a, b) => a.id - b.id);
}

export function usePokemonLista(indicesSelecionados) {
  // se nenhuma selecionada, usa "Todas" (índice 0)
  const indices = indicesSelecionados.length > 0 ? indicesSelecionados : [0];

  return useQuery({
    queryKey:  ['pokemon-lista', ...indices.sort()],
    queryFn:   () => fetchMultiplasGens(indices),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePokemonDetalhe(name) {
  return useQuery({
    queryKey:  ['pokemon', name],
    queryFn:   () => fetchDetalhe(name),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePokemonEvolucao(name) {
  return useQuery({
    queryKey:  ['evolucao', name],
    queryFn:   () => fetchEvolucao(name),
    staleTime: 1000 * 60 * 10,
  });
}