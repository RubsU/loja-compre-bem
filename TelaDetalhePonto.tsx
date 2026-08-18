import { View, Text, StyleSheet } from 'react-native';
import { pontosMock, Ponto } from './pontos';

// DetalhePonto só recebe `ponto` como prop e desenha — não sabe nada sobre navegação.
function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.campo}>Endereço: {ponto.endereco}</Text>
      <Text style={styles.campo}>Dias/horários: {ponto.diasHorarios}</Text>
      <Text style={styles.campo}>{ponto.recebeOuDistribui}</Text>
    </View>
  );
}

function TelaDetalhePonto({ route }: any) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) return null;

  return <DetalhePonto ponto={ponto} />;
}

export default TelaDetalhePonto;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C' },
  campo: { fontSize: 15, marginTop: 12, lineHeight: 22 },
});
