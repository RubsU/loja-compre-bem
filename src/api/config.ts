import { Platform } from 'react-native';

// No emulador Android o "localhost" é o próprio emulador; o computador é 10.0.2.2.
// Em celular físico, troque pelo IP do computador na rede (ex.: http://192.168.0.10:8080).
const HOST = Platform.select({ android: 'http://10.0.2.2:8080', default: 'http://localhost:8080' });

export const URL_BASE = `${HOST}/api/v1`;
export const TEMPO_LIMITE_MS = 8000;
