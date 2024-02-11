import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [name, setName] = useState(null)
  const [value, setValue] = useState(null)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name ? name : 'world'}!</Text>
      <Text>Digite seu nome:</Text>
      <TextInput value={value} onChange={ e=> {
        setValue(e.target.value)
      }} style={styles.input} ></TextInput>
      <Button title="Clique" onPress={() => {
        setName(value)
        console.log(name)
      }}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    textDecorationLine: 'underline',
    fontSize: 30
  },

  input:{
    width: 120,
    borderColor: '#000',
    borderWidth: 1
  }
});
