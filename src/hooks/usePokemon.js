import { useQuery } from '@tanstack/react-query';

async function fetchLista() {
  const res   = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
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
  // passo 1: busca a species para pegar a URL da cadeia
  const speciesRes  = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  const species     = await speciesRes.json();

  // passo 2: busca a cadeia de evolução
  const cadeiaRes   = await fetch(species.evolution_chain.url);
  const cadeiaData  = await cadeiaRes.json();

  // passo 3: percorre a cadeia e monta um array simples
  const lista = [];
  let atual   = cadeiaData.chain;

  while (atual) {
    const nomePokemon = atual.species.name;
    const pokeRes     = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);
    const pokeData    = await pokeRes.json();

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

export function usePokemonLista() {
  return useQuery({
    queryKey: ['pokemon-lista'],
    queryFn:  fetchLista,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePokemonDetalhe(name) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn:  () => fetchDetalhe(name),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePokemonEvolucao(name) {
  return useQuery({
    queryKey: ['evolucao', name],
    queryFn:  () => fetchEvolucao(name),
    staleTime: 1000 * 60 * 10,
  });
}