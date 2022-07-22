import {
  Box,
  Circle,
  HStack,
  Text,
  useTheme,
  VStack,
  Pressable,
  IPressableProps,
} from 'native-base';

import {
  ClockAfternoon,
  Hourglass,
  CircleWavyCheck,
  DesktopTower,
  ClipboardText,
  CheckCircle,
  User,
} from 'phosphor-react-native';

export type OrderProps = {
  id: string;
  patrimony: string;
  description: string;
  solution?: string;
  status: 'open' | 'closed';
  user_created?: {
    uid: string;
    email: string;
  };
  when: string;
  user_closed?: {
    uid: string;
    email: string;
  };
  closed?: string;
};

type Props = IPressableProps & {
  data: OrderProps;
};

export function Order({ data, ...rest }: Props) {
  const { colors } = useTheme();

  const statusColor =
    data.status === 'open' ? colors.secondary[700] : colors.green[300];

  return (
    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        <Box h="full" w={2} bg={statusColor} />
        <VStack flex={1} my={5} ml={5}>
          <HStack alignItems="center">
            <DesktopTower size={16} color={colors.white} />
            <Text color="white" fontSize="md" ml={2} fontWeight="bold">
              Patrimônio: {data.patrimony}
            </Text>
          </HStack>
          <HStack mt={2} alignItems="center">
            <ClipboardText size={15} color={colors.gray[300]} />
            <Text color="gray.200" ml={2}>
              {data.description.length >= 25
                ? `${data.description.slice(0, 25)}...`
                : data.description}
            </Text>
          </HStack>
          {data.status === 'closed' && (
            <HStack mt={2} alignItems="center">
              <CircleWavyCheck size={15} color={colors.gray[300]} />
              <Text color="gray.200" ml={2}>
                {data.solution.length >= 25
                  ? `${data.solution.slice(0, 25)}...`
                  : data.solution}
              </Text>
            </HStack>
          )}
          <HStack
            alignItems="center"
            borderTopWidth={1}
            borderTopColor="gray.400"
            mt={3}
            mr={8}
            pt={3}
          >
            <User size={15} color={colors.gray[300]} />
            <Text color="gray.200" fontSize="xs" ml={1}>
              {data.user_created.email}
            </Text>
          </HStack>
          <HStack alignItems="center" mt={2} mr={8}>
            <ClockAfternoon size={15} color={colors.gray[300]} />
            <Text color="gray.200" fontSize="xs" ml={1}>
              {data.when}
            </Text>
          </HStack>
          {data.status === 'closed' && (
            <HStack
              alignItems="center"
              borderTopWidth={1}
              borderTopColor="gray.400"
              mt={3}
              mr={8}
              pt={3}
            >
              <User size={15} color={colors.gray[300]} />
              <Text color="gray.200" fontSize="xs" ml={1}>
                {data.user_closed.email}
              </Text>
            </HStack>
          )}
          {data.status === 'closed' && (
            <HStack alignItems="center" mt={2} mr={8}>
              <CheckCircle size={15} color={colors.gray[300]} />
              <Text color="gray.200" fontSize="xs" ml={1}>
                {data.closed}
              </Text>
            </HStack>
          )}
        </VStack>
        <Circle bg="gray.500" h={12} w={12} mr={5}>
          {data.status === 'closed' ? (
            <CircleWavyCheck size={24} color={statusColor} />
          ) : (
            <Hourglass size={24} color={statusColor} />
          )}
        </Circle>
      </HStack>
    </Pressable>
  );
}
