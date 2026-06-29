import React, { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { XYZ } from '../types';

// Settings
const SHAKE_THRESHOLD = 1.5;
const SHAKE_COOLDOWN = 1000;

export default function DebugScreen() {

  // Shake
  const [data, setData] = useState<XYZ>({x: 0, y: 0, z: 0});
  const [shakeDetected, setShakeDetected] = useState(false);
  const lastShakeTime = useRef(0);

  // Accelerometer effect (set up)
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const sA = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      handleShake({value: accelerometerData});
    });

    return () => sA.remove();
  }, []);

  // handle shake detection
  const handleShake = ({value}: {value: XYZ}) => {
    const totalForce = Math.sqrt(value.x * value.x + value.y * value.y + value.z * value.z);
    const now = Date.now();

    if (totalForce > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_COOLDOWN) {
      lastShakeTime.current = now;
      setShakeDetected(true);
      setTimeout(() => setShakeDetected(false), 500);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer Debug</Text>
      <Text style={styles.value}>X: {data.x.toFixed(4)}</Text>
      <Text style={styles.value}>Y: {data.y.toFixed(4)}</Text>
      <Text style={styles.value}>Z: {data.z.toFixed(4)}</Text>
      <Text style={styles.value}>
        Force: {Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2).toFixed(4)}
      </Text>
      <Text style={[styles.shake, { opacity: shakeDetected ? 1 : 0 }]}>
        SHAKE DETECTED!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  value: {
    fontSize: 18,
    marginVertical: 5
  },
  shake: {
    fontSize: 28,
    color: 'tomato',
    marginTop: 20,
    fontWeight: 'bold'
  },
});