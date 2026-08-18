import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { pontosMock, Ponto } from './pontos';

function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>{ponto.endereco}</Text>
    </TouchableOpacity>
  );
}

function TelaListaPontos({ navigation }: any) {
  return (
    <View style={styles.container}>
      <FlatList
        data={pontosMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
          />
        )}
      />
    </View>
  );
}

export default TelaListaPontos;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#1B3A5C' },
  endereco: { fontSize: 14, color: '#555', marginTop: 4 },
});
