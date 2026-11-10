import { DadosProduto, Pagina, Produto } from '../modelos/produto';
import { chamar } from './cliente';

export const PRODUTOS_POR_PAGINA = 10;

export function listarProdutos(pagina: number, termo: string) {
  const consulta = `page=${pagina}&size=${PRODUTOS_POR_PAGINA}&filtro=${encodeURIComponent(termo)}`;
  return chamar<Pagina<Produto>>(`/produtos/filtro?${consulta}`);
}

export const buscarProduto = (id: string) => chamar<Produto>(`/produtos/${id}`);

export const criarProduto = (dados: DadosProduto) =>
  chamar<Produto>('/produtos', { metodo: 'POST', corpo: dados });

export const atualizarProduto = (id: string, dados: DadosProduto) =>
  chamar<Produto>(`/produtos/${id}`, { metodo: 'PUT', corpo: dados });

export const excluirProduto = (id: string) => chamar<void>(`/produtos/${id}`, { metodo: 'DELETE' });
