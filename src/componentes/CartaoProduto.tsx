import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Produto } from '../modelos/produto';
import { formatarPreco } from '../util/formatacao';

type Props = {
  produto: Produto;
  favorito: boolean;
  aoAbrir: () => void;
  aoEditar: () => void;
  aoExcluir: () => void;
  aoFavoritar: () => void;
};

export default function CartaoProduto({ produto, favorito, aoAbrir, aoEditar, aoExcluir, aoFavoritar }: Props) {
  return (
    <View style={estilos.cartao}>
      <TouchableOpacity style={estilos.info} onPress={aoAbrir}>
        <Text style={estilos.nome} numberOfLines={1}>{produto.nome}</Text>
        <Text style={estilos.detalhe}>
          {formatarPreco(produto.preco)}  ·  {produto.quantidade} em estoque
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.acao} onPress={aoEditar} accessibilityLabel={`Editar ${produto.nome}`}>
        <Text style={estilos.acaoTexto}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.acao} onPress={aoExcluir} accessibilityLabel={`Excluir ${produto.nome}`}>
        <Text style={[estilos.acaoTexto, estilos.excluir]}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.acao} onPress={aoFavoritar} accessibilityLabel="Favoritar">
        <Text style={estilos.coracao}>{favorito ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ececf3' },
  info: { flex: 1, paddingVertical: 14, paddingHorizontal: 16 },
  nome: { fontSize: 16, fontWeight: '700', color: '#1f2347' },
  detalhe: { fontSize: 13, color: '#777', marginTop: 2 },
  acao: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  acaoTexto: { fontSize: 13, fontWeight: '600', color: '#3b4a8a' },
  excluir: { color: '#b3261e' },
  coracao: { fontSize: 22, color: '#b3261e' },
});
