import { useCallback, useEffect, useRef, useState } from 'react';
import { mensagemParaTela } from '../api/cliente';
import { Pagina } from '../modelos/produto';

/**
 * Cuida de tudo da rolagem infinita: primeira página, páginas seguintes, erros de cada etapa
 * e descarte de respostas antigas (quando a busca muda no meio de uma requisição).
 * `buscarPagina` precisa ser estável (useCallback): quando ela muda, a lista recomeça do zero.
 */
export function usePaginacao<T>(
  buscarPagina: (numero: number) => Promise<Pagina<T>>,
  chaveDoItem: (item: T) => string,
) {
  const [itens, setItens] = useState<T[]>([]);
  const [proxima, setProxima] = useState(0);
  const [terminou, setTerminou] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');

  const geracao = useRef(0); // sobe a cada recarga; resposta de geração antiga é ignorada
  const ocupado = useRef(false);

  const recarregar = useCallback(() => {
    const minha = ++geracao.current;
    ocupado.current = true;
    setCarregando(true);
    setErro('');
    setErroMais('');

    buscarPagina(0)
      .then((pagina) => {
        if (minha !== geracao.current) return;
        setItens(pagina.content);
        setProxima(1);
        setTerminou(pagina.page.number + 1 >= pagina.page.totalPages);
      })
      .catch((e) => {
        if (minha === geracao.current) setErro(mensagemParaTela(e));
      })
      .finally(() => {
        if (minha !== geracao.current) return;
        ocupado.current = false;
        setCarregando(false);
      });
  }, [buscarPagina]);

  useEffect(recarregar, [recarregar]);

  const carregarMais = useCallback(
    async (forcar = false) => {
      if (ocupado.current || terminou || erro || (erroMais && !forcar)) return;

      const minha = geracao.current;
      ocupado.current = true;
      setErroMais('');
      setCarregandoMais(true);
      try {
        const pagina = await buscarPagina(proxima);
        if (minha !== geracao.current) return;
        setItens((atuais) => {
          const existentes = new Set(atuais.map(chaveDoItem));
          return [...atuais, ...pagina.content.filter((i) => !existentes.has(chaveDoItem(i)))];
        });
        setProxima(proxima + 1);
        setTerminou(pagina.page.number + 1 >= pagina.page.totalPages);
      } catch (e) {
        if (minha === geracao.current) setErroMais(mensagemParaTela(e));
      } finally {
        if (minha === geracao.current) {
          ocupado.current = false;
          setCarregandoMais(false);
        }
      }
    },
    [buscarPagina, chaveDoItem, proxima, terminou, erro, erroMais],
  );

  return {
    itens,
    carregando,
    carregandoMais,
    erro,
    erroMais,
    recarregar,
    carregarMais: () => carregarMais(false),
    tentarCarregarMais: () => carregarMais(true),
  };
}
