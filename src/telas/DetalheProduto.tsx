import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../App';
import EstadoDeTela from '../componentes/EstadoDeTela';
import { useProduto } from '../hooks/useProduto';
import { formatarPreco } from '../util/formatacao';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;

export default function DetalheProduto({ navigation, route }: Props) {
  const { produtoId } = route.params;
  const { produto, carregando, erro, recarregar } = useProduto(produtoId);

  if (carregando) return <EstadoDeTela carregando />;
  if (erro || !produto) {
    return <EstadoDeTela mensagem={erro || 'Produto não encontrado.'} textoBotao="Tentar novamente" aoToque={recarregar} />;
  }

  return (
    <View style={estilos.tela}>
      {produto.categoria ? <Text style={estilos.categoria}>{produto.categoria.toUpperCase()}</Text> : null}
      <Text style={estilos.nome}>{produto.nome}</Text>
      <Text style={estilos.preco}>{formatarPreco(produto.preco)}</Text>
      <Text style={estilos.estoque}>{produto.quantidade} unidades em estoque</Text>
      <Text style={estilos.descricao}>{produto.descricao || 'Sem descrição.'}</Text>

      <TouchableOpacity style={estilos.botao} onPress={() => navigation.navigate('FormProduto', { produtoId })}>
        <Text style={estilos.botaoTexto}>Editar produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 20, backgroundColor: '#fff', gap: 6 },
  categoria: { fontSize: 12, letterSpacing: 1, color: '#8a8fb0', fontWeight: '700' },
  nome: { fontSize: 22, fontWeight: '800', color: '#1f2347' },
  preco: { fontSize: 20, fontWeight: '700', color: '#1b7a3d', marginTop: 4 },
  estoque: { fontSize: 14, color: '#555' },
  descricao: { fontSize: 15, lineHeight: 22, color: '#555', marginTop: 12 },
  botao: { marginTop: 24, backgroundColor: '#3b4a8a', borderRadius: 10, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
