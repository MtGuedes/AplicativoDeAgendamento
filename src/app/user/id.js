import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, Platform, FlatList, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications'; // Importando expo-notifications
import NavigationBar from '../NavigationBar'; // Importa a barra de navegação

export default function User() {
  const [name, setName] = useState('');
  const [service, setService] = useState('Pé');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Função para solicitar permissões de notificação
  const registerForPushNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Erro', 'Você precisa permitir notificações para usar este recurso.');
      }
    }
  };

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSave = async () => {
    if (!name || !service || !date || !time) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());

    const appointmentKey = combinedDateTime.toISOString(); // Chave única combinando data e hora

    const appointment = {
      key: appointmentKey, // Usar key como a chave primária
      name,
      service,
      date: combinedDateTime.toLocaleDateString(),
      time: combinedDateTime.toLocaleTimeString(),
    };

    try {
      const fileUri = FileSystem.documentDirectory + 'agendamentos.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      let appointments = [];
      if (fileInfo.exists) {
        const fileData = await FileSystem.readAsStringAsync(fileUri);
        appointments = JSON.parse(fileData);
        
        // Verificar se o agendamento já existe
        const existingAppointment = appointments.find(appointment => appointment.key === appointmentKey);
        if (existingAppointment) {
          Alert.alert('Erro', 'Já existe um agendamento para esta data e hora.');
          return;
        }
      }

      appointments.push(appointment);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(appointments));

      // Agendar a notificação para 10 minutos antes do agendamento
      const notificationTime = new Date(combinedDateTime);
      notificationTime.setMinutes(notificationTime.getMinutes() - 10);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete de Agendamento",
          body: `Faltam 10 minutos para atender ${name}.`,
          sound: null,
        },
        trigger: notificationTime,
      });

      Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
      setName('');
      setFilteredAppointments([]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar agendamento.');
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!searchName) {
      Alert.alert('Erro', 'Por favor, digite um nome para buscar.');
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + 'agendamentos.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        const fileData = await FileSystem.readAsStringAsync(fileUri);
        const appointments = JSON.parse(fileData);
        const filtered = appointments.filter(appointment => appointment.name.toLowerCase().includes(searchName.toLowerCase()));
        setFilteredAppointments(filtered);
      } else {
        Alert.alert('Erro', 'Nenhum agendamento encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao ler os agendamentos.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Formulário de Agendamento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Serviço</Text>
      <Picker
        selectedValue={service}
        style={styles.picker}
        onValueChange={(itemValue) => setService(itemValue)}
      >
        <Picker.Item label="Pé" value="Pé" />
        <Picker.Item label="Mão" value="Mão" />
        <Picker.Item label="Pé e Mão" value="Pé e Mão" />
      </Picker>

      <Text style={styles.label}>Data</Text>
      <Button title="Selecionar Data" color="#FF69B4" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Hora</Text>
      <Button title="Selecionar Hora" color="#FF69B4" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Salvar Agendamento" color="#FF69B4" onPress={handleSave} />
      </View>

      {/* Adicionando a barra de navegação no rodapé */}
      <NavigationBar />

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc', // Cor de fundo mais clara
    padding: 20,
    paddingBottom: 10, // Espaçamento inferior para a barra de navegação
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 70,
    textAlign: 'center',
    color: '#FF69B4', // Cor do texto do título
    fontWeight: 'bold', // Texto em negrito
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FF69B4', // Borda rosa
    borderRadius: 5,
    backgroundColor: '#fff', // Fundo do campo de entrada
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
    marginTop: 30,
    color: '#FF69B4', // Cor do texto do rótulo
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF69B4', // Borda rosa
    borderRadius: 5, // Arredondar os cantos do Picker
  },
  buttonContainer: {
    marginVertical: 50,
    marginTop: 50,
  },
  appointmentItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF69B4', // Borda rosa
    borderRadius: 5,
    marginBottom: 10,
  },
});
