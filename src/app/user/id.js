import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function User() {
  const [name, setName] = useState('');
  const [service, setService] = useState('Pé'); // Valor padrão
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Função para tratar mudanças na data
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed" || event.nativeEvent.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // No iOS, o picker permanece visível até ser ocultado manualmente
    setDate(currentDate);
  };

  // Função para tratar mudanças na hora
  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed" || event.nativeEvent.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSave = () => {
    if (!name || !service || !date || !time) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    // Combina a data e a hora para exibir no formato desejado
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());

    // Lógica para salvar os dados
    Alert.alert('Agendamento', `Nome: ${name}\nServiço: ${service}\nData: ${date.toLocaleDateString()}\nHora: ${time.toLocaleTimeString()}`);
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
});