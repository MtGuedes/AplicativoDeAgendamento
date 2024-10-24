import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, Platform, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';

export default function User() {
  const [name, setName] = useState('');
  const [service, setService] = useState('Pé'); // Valor padrão
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed" || event.nativeEvent.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed" || event.nativeEvent.type === "dismissed") {
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

    const appointment = {
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
      }

      appointments.push(appointment);

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(appointments));
      Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
      setName(''); // Limpar o campo após salvar
      setFilteredAppointments([]); // Limpar resultados de busca
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

        // Filtrar agendamentos com base no nome
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
    <View style={styles.container}>
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
      <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Hora</Text>
      <Button title="Selecionar Hora" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Salvar Agendamento" onPress={handleSave} />
      </View>

      {/* Campo de busca */}
      <TextInput
        style={styles.input}
        placeholder="Buscar Agendamento"
        value={searchName}
        onChangeText={setSearchName}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {/* Lista de agendamentos filtrados */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text>{`Nome: ${item.name}`}</Text>
            <Text>{`Serviço: ${item.service}`}</Text>
            <Text>{`Data: ${item.date}`}</Text>
            <Text>{`Hora: ${item.time}`}</Text>
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
    marginTop: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  appointmentItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
});
