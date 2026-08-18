export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeOuDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Setor Central',
    endereco: 'Rua 4, nº 210, Setor Central, Goiânia - GO',
    diasHorarios: 'Segunda a sexta, 8h às 17h',
    recebeOuDistribui: 'Recebe doações de mercados parceiros e distribui cestas básicas',
  },
  {
    id: '2',
    nome: 'Ponto Vila Nova',
    endereco: 'Av. Anhanguera, nº 3450, Vila Nova, Goiânia - GO',
    diasHorarios: 'Terça e quinta, 13h às 18h',
    recebeOuDistribui: 'Distribui roupas e agasalhos para famílias cadastradas',
  },
  {
    id: '3',
    nome: 'Ponto Feira do Cerrado',
    endereco: 'Praça da Feira, s/n, Setor Sul, Goiânia - GO',
    diasHorarios: 'Sábados, 6h às 12h',
    recebeOuDistribui: 'Recebe excedente de hortifrúti direto dos feirantes',
  },
  {
    id: '4',
    nome: 'Ponto Jardim América',
    endereco: 'Rua T-30, nº 88, Jardim América, Goiânia - GO',
    diasHorarios: 'Segunda, quarta e sexta, 9h às 15h',
    recebeOuDistribui: 'Distribui cestas básicas e kits de higiene',
  },
  {
    id: '5',
    nome: 'Ponto Campinas',
    endereco: 'Rua 44, nº 512, Campinas, Goiânia - GO',
    diasHorarios: 'Quarta a sábado, 10h às 16h',
    recebeOuDistribui: 'Recebe doações de roupas de famílias da vizinhança',
  },
  {
    id: '6',
    nome: 'Ponto Setor Bueno',
    endereco: 'Av. T-9, nº 1780, Setor Bueno, Goiânia - GO',
    diasHorarios: 'Terça a sábado, 8h às 12h',
    recebeOuDistribui: 'Recebe doações de restaurantes e padarias parceiras',
  },
  {
    id: '7',
    nome: 'Ponto Cidade Jardim',
    endereco: 'Rua C-135, nº 320, Jardim América, Goiânia - GO',
    diasHorarios: 'Sextas, 14h às 19h',
    recebeOuDistribui: 'Distribui alimentos não perecíveis para famílias vulneráveis',
  },
  {
    id: '8',
    nome: 'Ponto Setor Oeste',
    endereco: 'Av. Rio Verde, nº 90, Setor Oeste, Goiânia - GO',
    diasHorarios: 'Segunda e quinta, 8h às 13h',
    recebeOuDistribui: 'Recebe brinquedos e material escolar, distribui para crianças atendidas',
  },
];
