import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaPontos">
        <Stack.Screen name="ListaPontos" component={TelaListaPontos} options={{ title: 'Pontos' }} />
        <Stack.Screen name="DetalhePonto" component={TelaDetalhePonto} options={{ title: 'Detalhe do Ponto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
