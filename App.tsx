import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaListaProdutos, { produtosIniciais, type Produto } from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

export type RootStackParamList = {
  ListaProdutos: undefined;
  DetalheProduto: { produtoId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// O catálogo deixa de ser um array fixo e vira estado aqui em App.tsx,
// porque é o ancestral comum entre TelaListaProdutos (cadastra) e
// TelaDetalheProduto (só lê) — "lifting state up". Sem isso, um produto
// cadastrado na lista nunca apareceria se o usuário abrisse o detalhe dele.
export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);

  function adicionarProduto(produto: Produto) {
    setProdutos((atual) => [...atual, produto]);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListaProdutos">
          <Stack.Screen name="ListaProdutos">
            {(props) => (
              <TelaListaProdutos {...props} produtos={produtos} onAdicionarProduto={adicionarProduto} />
            )}
          </Stack.Screen>
          <Stack.Screen name="DetalheProduto">
            {(props) => <TelaDetalheProduto {...props} produtos={produtos} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
