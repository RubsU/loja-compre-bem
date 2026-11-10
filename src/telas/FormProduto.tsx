import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../App';
import { mensagemParaTela } from '../api/cliente';
import { atualizarProduto, criarProduto } from '../api/produtos';
import EstadoDeTela from '../componentes/EstadoDeTela';
import { useProduto } from '../hooks/useProduto';
import { DadosProduto } from '../modelos/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'FormProduto'>;

const VAZIO = { nome: '', preco: '', descricao: '', quantidade: '' };

// Confere os campos digitados e devolve os dados prontos ou o motivo da recusa.
function conferir(campos: typeof VAZIO): { dados: DadosProduto } | { problema: string } {
  const nome = campos.nome.trim();
  const preco = Number(campos.preco.trim().replace(',', '.'));
  const quantidade = campos.quantidade.trim();

  if (!nome) return { problema: 'Digite o nome do produto.' };
  if (!campos.preco.trim() || !Number.isFinite(preco) || preco <= 0) {
    return { problema: 'Digite um preço válido, maior que zero (ex.: 19,90).' };
  }
  if (!/^\d+$/.test(quantidade)) return { problema: 'A quantidade deve ser um número inteiro, de 0 para cima.' };

  return { dados: { nome, preco, descricao: campos.descricao.trim(), quantidade: Number(quantidade) } };
}

export default function FormProduto({ navigation, route }: Props) {
  const produtoId = route.params?.produtoId;
  const { produto, carregando, erro: erroDeCarga, recarregar } = useProduto(produtoId);

  const [campos, setCampos] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [problema, setProblema] = useState('');

  // Na edição, preenche os campos quando o produto chega da API.
  useEffect(() => {
    if (produto) {
      setCampos({
        nome: produto.nome,
        preco: String(produto.preco),
        descricao: produto.descricao ?? '',
        quantidade: String(produto.quantidade),
      });
    }
  }, [produto]);

  const trocar = (campo: keyof typeof VAZIO) => (valor: string) => setCampos((c) => ({ ...c, [campo]: valor }));

  async function salvar() {
    const resultado = conferir(campos);
    if ('problema' in resultado) return setProblema(resultado.problema);

    setProblema('');
    setSalvando(true);
    try {
      if (produtoId) await atualizarProduto(produtoId, resultado.dados);
      else await criarProduto(resultado.dados);
      navigation.navigate('ListaProdutos', { recarregar: Date.now() });
    } catch (e) {
      setProblema(mensagemParaTela(e));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <EstadoDeTela carregando />;
  if (erroDeCarga) return <EstadoDeTela mensagem={erroDeCarga} textoBotao="Tentar novamente" aoToque={recarregar} />;

  return (
    <KeyboardAvoidingView style={estilos.area} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={estilos.form} keyboardShouldPersistTaps="handled">
        <TextInput style={estilos.campo} placeholder="Nome do produto" value={campos.nome} onChangeText={trocar('nome')} />
        <TextInput style={estilos.campo} placeholder="Preço (ex.: 19,90)" value={campos.preco} onChangeText={trocar('preco')} keyboardType="decimal-pad" />
        <TextInput style={[estilos.campo, estilos.descricao]} placeholder="Descrição" value={campos.descricao} onChangeText={trocar('descricao')} multiline />
        <TextInput style={estilos.campo} placeholder="Quantidade em estoque" value={campos.quantidade} onChangeText={trocar('quantidade')} keyboardType="number-pad" />

        {problema ? <Text style={estilos.problema}>{problema}</Text> : null}

        <TouchableOpacity style={[estilos.botao, salvando && estilos.desativado]} onPress={salvar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.botaoTexto}>{produtoId ? 'Salvar alterações' : 'Cadastrar produto'}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 16, gap: 10 },
  campo: { borderWidth: 1, borderColor: '#ccd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, minHeight: 44 },
  descricao: { minHeight: 90, textAlignVertical: 'top' },
  problema: { color: '#b3261e', textAlign: 'center' },
  botao: { backgroundColor: '#3b4a8a', borderRadius: 10, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  desativado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
