import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import NavigationBar from './NavigationBar'; // Importa a barra de navegação

const Busca = () => {
  const [searchName, setSearchName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Função para buscar os agendamentos ao carregar o componente
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'agendamentos.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        const fileData = await FileSystem.readAsStringAsync(fileUri);
        const loadedAppointments = JSON.parse(fileData);
        setAppointments(loadedAppointments);
        setFilteredAppointments(loadedAppointments); // Mostrar todos inicialmente
      } else {
        Alert.alert('Erro', 'Nenhum agendamento encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar os agendamentos.');
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (!searchName) {
      Alert.alert('Erro', 'Por favor, digite um nome para buscar.');
      return;
    }

    const filtered = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(searchName.toLowerCase())
    );

    setFilteredAppointments(filtered);
  };

  const handleDelete = async (name, date, time) => {
    const updatedAppointments = filteredAppointments.filter(
      appointment => !(appointment.name === name && appointment.date === date && appointment.time === time)
    );

    // Salvar o novo array no arquivo
    const fileUri = FileSystem.documentDirectory + 'agendamentos.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedAppointments));

    // Atualizar estados
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    Alert.alert('Sucesso', 'Agendamento excluído com sucesso!');
  };

  const renderItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>Nome: {item.name}</Text>
      <Text style={styles.appointmentText}>Serviço: {item.service}</Text>
      <Text style={styles.appointmentText}>Data: {item.date}</Text>
      <Text style={styles.appointmentText}>Hora: {item.time}</Text>
      <Button
        title="Excluir"
        onPress={() =>
          Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este agendamento?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Excluir', onPress: () => handleDelete(item.name, item.date, item.time) },
            ]
          )
        }
        color="#FF69B4" // Cor do botão de exclusão
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do cliente"
        value={searchName}
        onChangeText={setSearchName}
      />
      <Button title="Buscar" onPress={handleSearch} color="#FF69B4" /> 

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.name + item.date + item.time}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderColor: '#FF69B4', // Cor da borda do campo de texto
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 100,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  appointmentItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#FF69B4', // Cor da borda do item
    borderRadius: 8,
    marginTop: 50,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 40, // Espaço para a barra de navegação
  },
});

export default Busca;
