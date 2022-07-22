import { useState } from 'react';
import { Heading, Icon, VStack, useTheme, useToast } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Toast } from '../components/Toast';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();
  const toast = useToast();

  function handleSignIn() {
    if (!email || !password) {
      return toast.show({
        placement: 'top',
        render: () => {
          return <Toast title="Informe e-mail e senha." variant="error" />;
        },
      });
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/wrong-password'
        ) {
          return toast.show({
            placement: 'top',
            render: () => {
              return (
                <Toast title="E-mail ou senha inválidos." variant="error" />
              );
            },
          });
        }

        if (error.code === 'auth/user-not-found') {
          return toast.show({
            placement: 'top',
            render: () => {
              return <Toast title="Usuário não cadastrado." variant="error" />;
            },
          });
        }

        return toast.show({
          placement: 'top',
          render: () => {
            return <Toast title="Não foi possível acessar." variant="error" />;
          },
        });
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        value={email}
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        type="password"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Entrar"
        onPress={handleSignIn}
        isLoading={isLoading}
        w="full"
      />
    </VStack>
  );
}
