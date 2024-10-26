import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const userData = `${username},${password}\n`; // Formato: username,password
    const fileUri = `${FileSystem.documentDirectory}usuarios.txt`;

    try {
      // Verifica se o arquivo já existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (!fileInfo.exists) {
        // Se o arquivo não existir, cria um novo arquivo com os dados do usuário
        await FileSystem.writeAsStringAsync(fileUri, userData, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } else {
        // Se o arquivo já existir, lê o conteúdo atual
        const existingContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        // Adiciona o novo conteúdo ao existente
        const newContent = existingContent + userData;
        await FileSystem.writeAsStringAsync(fileUri, newContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
      setUsername(''); // Limpar os campos
      setPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o usuário.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
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
      <Button title="Cadastrar" color="#FF69B4" onPress={handleRegister} />
      <Link href="/" style={styles.link}>Voltar para Login</Link>
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
