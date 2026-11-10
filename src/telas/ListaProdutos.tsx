import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { ErroDeApi, mensagemParaTela } from '../api/cliente';
import { excluirProduto, listarProdutos } from '../api/produtos';
import CartaoProduto from '../componentes/CartaoProduto';
import EstadoDeTela from '../componentes/EstadoDeTela';
import { useAtraso } from '../hooks/useAtraso';
import { useFavoritos } from '../hooks/useFavoritos';
import { usePaginacao } from '../hooks/usePaginacao';
import { Produto } from '../modelos/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;

const chaveDoProduto = (p: Produto) => p.produtoId;

export default function ListaProdutos({ navigation, route }: Props) {
  const [digitado, setDigitado] = useState('');
  const termo = useAtraso(digitado.trim());
  const favoritos = useFavoritos();

  const buscarPagina = useCallback((numero: number) => listarProdutos(numero, termo), [termo]);
  const lista = usePaginacao(buscarPagina, chaveDoProduto);

  // Outra tela (cadastro/edição) pede para recarregar mudando esse número.
  const pedidoDeRecarga = route.params?.recarregar;
  useEffect(() => {
    if (pedidoDeRecarga) lista.recarregar();
  }, [pedidoDeRecarga]);

  function pedirConfirmacao(produto: Produto) {
    Alert.alert('Excluir produto', `Excluir "${produto.nome}"? Não dá para desfazer.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(produto) },
    ]);
  }

  async function excluir(produto: Produto) {
    try {
      await excluirProduto(produto.produtoId);
    } catch (e) {
      Alert.alert('Não foi possível excluir', mensagemParaTela(e));
      if (!(e instanceof ErroDeApi && e.status === 404)) return; // 404: já não existe, só atualizar a lista
    }
    lista.recarregar();
  }

  const rodape = lista.carregandoMais ? (
    <ActivityIndicator style={estilos.rodape} color="#3b4a8a" />
  ) : lista.erroMais ? (
    <TouchableOpacity style={estilos.rodape} onPress={lista.tentarCarregarMais}>
      <Text style={estilos.erro}>{lista.erroMais}</Text>
      <Text style={estilos.tentar}>Toque para tentar de novo</Text>
    </TouchableOpacity>
  ) : null;

  function conteudoDaLista() {
    if (lista.carregando && lista.itens.length === 0) return <EstadoDeTela carregando />;
    if (lista.erro) {
      return <EstadoDeTela mensagem={lista.erro} textoBotao="Tentar novamente" aoToque={lista.recarregar} />;
    }
    return (
      <FlatList
        data={lista.itens}
        keyExtractor={chaveDoProduto}
        onEndReached={lista.carregarMais}
        onEndReachedThreshold={0.5}
        refreshing={lista.carregando}
        onRefresh={lista.recarregar}
        ListFooterComponent={rodape}
        ListEmptyComponent={
          <EstadoDeTela tipo="aviso" mensagem={termo ? 'Nenhum produto combina com essa busca.' : 'Nenhum produto cadastrado ainda.'} />
        }
        contentContainerStyle={lista.itens.length === 0 ? estilos.vazia : undefined}
        renderItem={({ item }) => (
          <CartaoProduto
            produto={item}
            favorito={favoritos.ids.includes(item.produtoId)}
            aoAbrir={() => navigation.navigate('DetalheProduto', { produtoId: item.produtoId })}
            aoEditar={() => navigation.navigate('FormProduto', { produtoId: item.produtoId })}
            aoExcluir={() => pedirConfirmacao(item)}
            aoFavoritar={() => favoritos.alternar(item.produtoId)}
          />
        )}
      />
    );
  }

  return (
    <SafeAreaView style={estilos.area} edges={['bottom', 'left', 'right']}>
      <View style={estilos.topo}>
        <TextInput style={estilos.busca} placeholder="Buscar produtos..." value={digitado} onChangeText={setDigitado} />
        <TouchableOpacity style={estilos.novo} onPress={() => navigation.navigate('FormProduto')}>
          <Text style={estilos.novoTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      {conteudoDaLista()}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' },
  topo: { flexDirection: 'row', gap: 8, padding: 12 },
  busca: { flex: 1, borderWidth: 1, borderColor: '#ccd', borderRadius: 10, paddingHorizontal: 12, minHeight: 44 },
  novo: { backgroundColor: '#3b4a8a', borderRadius: 10, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' },
  novoTexto: { color: '#fff', fontWeight: '700' },
  rodape: { padding: 16, alignItems: 'center', minHeight: 44 },
  erro: { color: '#b3261e', textAlign: 'center' },
  tentar: { color: '#3b4a8a', fontWeight: '600', marginTop: 4 },
  vazia: { flexGrow: 1 },
});
