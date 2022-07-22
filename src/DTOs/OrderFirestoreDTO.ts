import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type User = {
  uid: string;
  email: string;
};

export type OrderFirestoreDTO = {
  patrimony: string;
  description: string;
  status: 'open' | 'closed';
  solution?: string;
  user_created?: User;
  created_at: FirebaseFirestoreTypes.Timestamp;
  user_closed?: User;
  closed_at?: FirebaseFirestoreTypes.Timestamp;
};
