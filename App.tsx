import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DetalheProduto from './src/telas/DetalheProduto';
import FormProduto from './src/telas/FormProduto';
import ListaProdutos from './src/telas/ListaProdutos';

export type RootStackParamList = {
  // `recarregar` recebe um número novo sempre que a lista precisa buscar tudo de novo.
  ListaProdutos: { recarregar?: number } | undefined;
  DetalheProduto: { produtoId: string };
  // Sem produtoId a tela cadastra; com produtoId ela edita.
  FormProduto: { produtoId?: string } | undefined;
};

const Pilha = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Pilha.Navigator initialRouteName="ListaProdutos">
          <Pilha.Screen name="ListaProdutos" component={ListaProdutos} options={{ title: 'Compre Bem' }} />
          <Pilha.Screen name="DetalheProduto" component={DetalheProduto} options={{ title: 'Detalhes' }} />
          <Pilha.Screen
            name="FormProduto"
            component={FormProduto}
            options={({ route }) => ({ title: route.params?.produtoId ? 'Editar produto' : 'Novo produto' })}
          />
        </Pilha.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
