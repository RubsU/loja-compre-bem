export type Produto = {
  produtoId: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoria?: string;
  imagem?: string;
};

// O que a API espera receber ao cadastrar ou editar.
export type DadosProduto = Omit<Produto, 'produtoId'>;

// Resposta paginada do Spring (serialization-mode=via_dto).
export type Pagina<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
