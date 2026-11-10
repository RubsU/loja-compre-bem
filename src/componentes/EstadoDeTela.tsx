import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  carregando?: boolean;
  mensagem?: string;
  tipo?: 'erro' | 'aviso';
  textoBotao?: string;
  aoToque?: () => void;
};

/** Ocupa a tela inteira com um indicador de carregamento ou com uma mensagem (e botão opcional). */
export default function EstadoDeTela({ carregando, mensagem, tipo = 'erro', textoBotao, aoToque }: Props) {
  return (
    <View style={estilos.centro}>
      {carregando ? <ActivityIndicator size="large" color="#3b4a8a" /> : null}
      {mensagem ? <Text style={[estilos.texto, tipo === 'erro' && estilos.textoErro]}>{mensagem}</Text> : null}
      {textoBotao && aoToque ? (
        <TouchableOpacity style={estilos.botao} onPress={aoToque}>
          <Text style={estilos.botaoTexto}>{textoBotao}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, backgroundColor: '#fff' },
  texto: { fontSize: 15, color: '#555', textAlign: 'center' },
  textoErro: { color: '#b3261e' },
  botao: { backgroundColor: '#3b4a8a', borderRadius: 10, paddingHorizontal: 20, minHeight: 44, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});
