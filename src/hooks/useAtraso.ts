import { useEffect, useState } from 'react';

/** Devolve `valor` só depois de ele ficar parado por `ms` (evita uma requisição por tecla digitada). */
export function useAtraso<T>(valor: T, ms = 400): T {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setAtrasado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return atrasado;
}
