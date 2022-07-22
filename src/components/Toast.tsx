import { HStack, Text, useTheme, useToast } from 'native-base';
import { IconProps } from 'phosphor-react-native';
import { Check, X } from 'phosphor-react-native';

type Props = {
  title: string;
  icon?: React.ElementType<IconProps>;
  variant: 'success' | 'error';
};

export function Toast({ title, icon: Icon, variant = 'success' }: Props) {
  const { colors } = useTheme();

  return (
    <HStack
      alignItems="center"
      bg={variant === 'success' ? 'success.500' : 'error.600'}
      p={3}
      rounded="sm"
    >
      {variant === 'success' ? (
        <Check color={colors.white} />
      ) : (
        <X color={colors.white} />
      )}
      <Text color="white" pl="2">
        {title}
      </Text>
    </HStack>
  );
}
