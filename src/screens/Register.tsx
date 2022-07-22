import { useState } from 'react';
import { VStack, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const toast = useToast();

  function handleNewOrder() {
    if (!patrimony || !description) {
      return toast.show({
        placement: 'top',
        render: () => {
          return <Toast title="Preencha todos os campos." variant="error" />;
        },
      });
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        user_created: {
          uid: firebase.auth().currentUser.uid,
          email: firebase.auth().currentUser.email,
        },
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast
                title="Solicitação cadastrada com sucesso."
                variant="success"
              />
            );
          },
        });
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast
                title="Não foi possível registrar o pedido. Tente novamente mais tarde."
                variant="error"
              />
            );
          },
        });
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação" />
      <Input
        placeholder="Número do patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={4}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Button
        title="Cadastrar"
        mt={6}
        isLoading={isLoading}
        onPress={handleNewOrder}
      />
    </VStack>
  );
}
