import { useCallback, useEffect, useState } from 'react';
import { mensagemParaTela } from '../api/cliente';
import { buscarProduto } from '../api/produtos';
import { Produto } from '../modelos/produto';

/** Carrega um produto pelo id. Sem id (tela de cadastro) não faz nada e `carregando` fica falso. */
export function useProduto(id?: string) {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(Boolean(id));
  const [erro, setErro] = useState('');

  const carregar = useCallback(() => {
    if (!id) return;
    setCarregando(true);
    setErro('');
    buscarProduto(id)
      .then(setProduto)
      .catch((e) => setErro(mensagemParaTela(e)))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(carregar, [carregar]);

  return { produto, carregando, erro, recarregar: carregar };
}
