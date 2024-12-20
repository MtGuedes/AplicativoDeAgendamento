import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}usuarios.txt`;

    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const users = fileContent.split('\n').filter(line => line.trim() !== '');

      const userExists = users.some(line => {
        const [fileUsername, filePassword] = line.split(',');
        return fileUsername === username && filePassword === password;
      });

      if (userExists) {
        // Redirecionar para a tela de usuário
        router.push('/user/id');
      } else {
        Alert.alert('Erro', 'Usuário ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível ler o arquivo de usuários.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" color="#FF69B4" onPress={handleLogin} />
      <Link href="/Cadastro" style={styles.link}>Cadastrar</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc', // Cor de fundo mais clara
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FF69B4', // Cor do texto do título
    fontWeight: 'bold', // Texto em negrito
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF69B4', // Borda rosa
    borderRadius: 5,
    backgroundColor: '#fff', // Fundo do campo de entrada
  },
  link: {
    marginTop: 20,
    color: '#FF69B4', // Cor do link
  },
});
