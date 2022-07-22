import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, ScrollView, Box } from 'native-base';
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText,
} from 'phosphor-react-native';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  user_created?: {
    uid: string;
    email: string;
  };
  user_closed?: {
    uid: string;
    email: string;
  };
  closed: string;
};

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  const { colors } = useTheme();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        'Solicitação',
        'Informe a solução para encerrar a solicitação.'
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        user_closed: {
          uid: firebase.auth().currentUser.uid,
          email: firebase.auth().currentUser.email,
        },
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação.');
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          solution,
          status,
          user_created,
          created_at,
          user_closed,
          closed_at,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          solution,
          status,
          user_created,
          when: dateFormat(created_at),
          user_closed,
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio: ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when} por ${
            firebase.auth().currentUser.email == order.user_created.email
              ? 'você'
              : order.user_created.email
          }`}
        />
        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={
            order.closed &&
            `Encerrado em ${order.closed} por ${
              firebase.auth().currentUser.email == order.user_closed.email
                ? 'você'
                : order.user_created.email
            }`
          }
        >
          {order.status === 'open' && (
            <Input
              placeholder="Descrição da solução"
              h={24}
              multiline
              textAlignVertical="top"
              bgColor="gray.600"
              onChangeText={setSolution}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === 'open' ? (
        <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      ) : (
        <Button title="Solicitação finalizada" m={5} isDisabled />
      )}
    </VStack>
  );
}
