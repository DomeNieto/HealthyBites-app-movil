import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useCallback } from 'react';
import asyncStorageService from '../../services/async-storage-service';
import { router } from 'expo-router';

const LogoutScreen = () => {
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          {
            text: 'Cancelar',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: async () => {
              await asyncStorageService.deleteTokenUser("user-token");
              await asyncStorageService.deleteTokenUser("user-email");
              router.replace('/login');
            },
            style: 'destructive',
          },
        ]
      );
    }, [navigation])
  );

  return null;
}

export default LogoutScreen;