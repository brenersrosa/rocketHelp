import { NativeBaseProvider, StatusBar } from 'native-base';
import { ToastProvider } from 'react-native-toast-notifications';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { THEME } from './src/styles/theme';

import { Routes } from './src/routes';

import { Loading } from './src/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      {/* <ToastProvider> */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Routes /> : <Loading />}
      {/* </ToastProvider> */}
    </NativeBaseProvider>
  );
}
