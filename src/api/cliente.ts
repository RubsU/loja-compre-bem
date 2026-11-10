import { TEMPO_LIMITE_MS, URL_BASE } from './config';

/** Erro cuja mensagem já está pronta para ser mostrada à pessoa. */
export class ErroDeApi extends Error {
  constructor(mensagem: string, public readonly status?: number) {
    super(mensagem);
    this.name = 'ErroDeApi';
  }
}

export function mensagemParaTela(erro: unknown): string {
  return erro instanceof ErroDeApi ? erro.message : 'Algo inesperado aconteceu. Tente novamente.';
}

const SEM_CONEXAO = 'Não consegui falar com o servidor. Confira sua conexão e tente de novo.';

function textoPorStatus(status: number, doServidor?: string): string {
  if (status >= 500) return 'O servidor está com problemas no momento. Tente de novo em instantes.';
  if (status === 404) return doServidor ?? 'Esse produto não existe mais.';
  if (status === 400) return doServidor ?? 'Alguns dados estão inválidos. Revise e tente de novo.';
  return doServidor ?? 'Não foi possível concluir a operação.';
}

async function mensagemEnviadaPelaApi(resposta: Response): Promise<string | undefined> {
  try {
    const corpo = JSON.parse(await resposta.text());
    return corpo.mensagem ?? corpo.detail;
  } catch {
    return undefined; // corpo vazio ou não-JSON
  }
}

export async function chamar<T>(caminho: string, opcoes: { metodo?: string; corpo?: unknown } = {}): Promise<T> {
  const { metodo = 'GET', corpo } = opcoes;
  const cancelador = new AbortController();
  const relogio = setTimeout(() => cancelador.abort(), TEMPO_LIMITE_MS);

  let resposta: Response;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      signal: cancelador.signal,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDeApi(SEM_CONEXAO); // API fora do ar, sem rede ou tempo esgotado
  } finally {
    clearTimeout(relogio);
  }

  if (!resposta.ok) {
    throw new ErroDeApi(textoPorStatus(resposta.status, await mensagemEnviadaPelaApi(resposta)), resposta.status);
  }

  const texto = await resposta.text(); // DELETE devolve 204, sem corpo
  return (texto ? JSON.parse(texto) : undefined) as T;
}
