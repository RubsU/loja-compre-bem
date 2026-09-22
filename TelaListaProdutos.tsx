import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Produto = {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  imagem: number;
};

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 'R$ 349,90',
    descricao: 'Cadeira ergonômica estofada, ideal para home office. Estrutura reforçada e altura regulável.',
    imagem: require('./assets/produto-cadeira.png'),
  },
  {
    id: 2,
    nome: 'Mesa Escritório Slim',
    preco: 'R$ 459,00',
    descricao: 'Mesa compacta com acabamento em MDF, ideal para espaços pequenos.',
    imagem: require('./assets/produto-mesa.png'),
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 'R$ 89,90',
    descricao: 'Luminária com 3 níveis de intensidade e braço flexível.',
    imagem: require('./assets/produto-luminaria.png'),
  },
];

const CHAVE_ULTIMA_BUSCA = '@compre_bem:ultima_busca';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'> & {
  produtos: Produto[];
  onAdicionarProduto: (produto: Produto) => void;
};

function TelaListaProdutos({ navigation, produtos, onAdicionarProduto }: Props) {
  // Responsividade (Aula 13): 2 colunas num aparelho largo (tablet, ou
  // celular deitado), 1 coluna no celular comum. useWindowDimensions()
  // atualiza sozinho se o aparelho girar.
  const { width } = useWindowDimensions();
  const numColunas = width >= 600 ? 2 : 1;

  // Busca por nome, com persistência da Aula 16 (exercício da loja):
  // carrega a última busca salva ao montar a tela, e salva a cada mudança.
  const [busca, setBusca] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_ULTIMA_BUSCA).then((salvo) => {
      if (salvo) setBusca(salvo);
    });
  }, []);

  function atualizarBusca(texto: string) {
    setBusca(texto);
    AsyncStorage.setItem(CHAVE_ULTIMA_BUSCA, texto);
  }

  const produtosFiltrados = useMemo(
    () => produtos.filter((item) => item.nome.toLowerCase().includes(busca.toLowerCase())),
    [produtos, busca]
  );

  // Cadastro de produto (Aula 11): campos controlados, validação só ao
  // confirmar, nunca a cada tecla digitada.
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const inputPrecoRef = useRef<TextInput>(null);

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    const precoNumerico = Number(preco.trim().replace(',', '.'));
    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro('O preço precisa ser um número maior que zero (ex.: 89,90).');
      return;
    }
    onAdicionarProduto({
      id: Date.now(),
      nome,
      preco: `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`,
      descricao: 'Produto cadastrado pela equipe da loja.',
      imagem: require('./assets/produto-suporte.png'),
    });
    setNome('');
    setPreco('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.cadastro}>
          <TextInput
            placeholder="Nome do novo produto"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => inputPrecoRef.current?.focus()}
          />
          <TextInput
            ref={inputPrecoRef}
            placeholder="Preço (ex.: 89,90)"
            value={preco}
            onChangeText={setPreco}
            style={styles.input}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={validarESalvar}
          />
          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
          <TouchableOpacity style={styles.botaoCadastrar} onPress={validarESalvar}>
            <Text style={styles.botaoCadastrarTexto}>Cadastrar produto</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Buscar produto..."
          value={busca}
          onChangeText={atualizarBusca}
          style={styles.busca}
        />

        <FlatList
          key={numColunas}
          data={produtosFiltrados}
          numColumns={numColunas}
          columnWrapperStyle={numColunas > 1 ? styles.linha : undefined}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
            >
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.preco}>{item.preco}</Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1 },
  cadastro: { margin: 16, marginBottom: 0, gap: 8 },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  erro: { color: '#C62828' },
  // minHeight:44 atende o critério 2.5.5 (Target Size) da WCAG 2.1 (Aula 13).
  botaoCadastrar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoCadastrarTexto: { color: '#FFFFFF', fontWeight: '600' },
  busca: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  linha: { justifyContent: 'space-between', paddingHorizontal: 16 },
  item: { flex: 1, padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  nome: { fontSize: 16, fontWeight: '600' },
  preco: { fontSize: 14, color: '#2E7D32' },
});

export default TelaListaProdutos;
