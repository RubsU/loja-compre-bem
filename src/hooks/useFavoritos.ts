import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const CHAVE = '@compre-bem:favoritos';

export function useFavoritos() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((salvo) => salvo && setIds(JSON.parse(salvo)))
      .catch(() => {}); // sem favoritos salvos a lista continua funcionando
  }, []);

  function alternar(id: string) {
    setIds((atuais) => {
      const novos = atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id];
      AsyncStorage.setItem(CHAVE, JSON.stringify(novos)).catch(() => {});
      return novos;
    });
  }

  return { ids, alternar };
}
