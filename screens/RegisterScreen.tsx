import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

export default function RegisterScreen() {

  // Navigation
  const navigation = useNavigation();
  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle registration
  const handleRegister = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigation.navigate('Main');
    } catch (err) {
      setError('Registration failed. Try a stronger password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EarthQuakeNews</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
  },
  error: {
    color: '#ff5252',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
});