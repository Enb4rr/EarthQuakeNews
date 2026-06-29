import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { XYZ, Article } from '../types';
import { NEWS_API_KEY } from '@env';

const API_KEY = NEWS_API_KEY;
const CATEGORIES = ['general', 'technology', 'sports', 'health'];
const SHAKE_THRESHOLD = 1.5;
const SHAKE_COOLDOWN = 1000;

export default function HomeScreen() {

  // News
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('us');
  const [category, setCategory] = useState('general');
  // Shake
  const lastShakeTime = useRef(0);
  const [hasShaken, setHasShaken] = useState(false);

  // Fetch news whenever country or category changes
  useEffect(() => {
    fetchNews();
  }, [country, category]);

  // Set up shake to refresh
  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sA = Accelerometer.addListener(accelerometerData => {
      handleShake({ value: accelerometerData });
    });
    return () => sA.remove();
  }, []);

  // Handle shake detection
  const handleShake = ({ value }: { value: XYZ }) => {
    const totalForce = Math.sqrt(value.x * value.x + value.y * value.y + value.z * value.z);
    const now = Date.now();
    if (totalForce > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_COOLDOWN) {
      lastShakeTime.current = now;
      if (!hasShaken) setHasShaken(true); // first shake ever
      fetchNews();
    }
};

  // Handle news fetch
  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`);
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      } else {
        setError('No articles found.');
      }
    } catch (err) {
      setError('Failed to fetch news.');
    }
    setLoading(false);
  };

  // Handles news rendering
  const renderArticle = ({ item }: { item: Article }) => (
    <View style={styles.card}>
      <Text style={styles.source}>{item.source?.name}</Text>
      <Text style={styles.headline}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
    </View>
);

  return (
    <View style={styles.container}>

      <View style={styles.filters}>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={styles.filterBtn}
            onPress={() => setCategory(category)}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!hasShaken ? (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>Shake your phone to load the news</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderArticle}
        />
      )}

      <Text style={styles.hint}>Shake to refresh</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  filterBtn: {  
    padding: 8,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  source: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#444'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10
  },
  hint: {
    textAlign: 'center',
    color: 'gray',
    padding: 10
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  promptText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'gray',
    padding: 20
  },
});