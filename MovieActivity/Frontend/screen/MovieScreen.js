
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import styles from '../style/MovieStyle';

const movies = [
  {
    id: '1',
    title: 'Inception',
    year: '2010',
    genre: 'SCI-FI',
    poster: require('../../assets/inception.jpg'),
  },
  {
    id: '2',
    title: 'Star Wars',
    year: '1977',
    genre: 'ADVENTURE',
    poster: require('../../assets/starwars.jpg'),
  },
  {
    id: '3',
    title: 'Back to the Future',
    year: '1985',
    genre: 'ADVENTURE',
    poster: require('../../assets/back-to-future.jpg'),
  },
  {
    id: '4',
    title: 'The Matrix',
    year: '1999',
    genre: 'ACTION',
    poster: require('../../assets/the matrix.jpg'),
  },
  {
    id: '5',
    title: 'Interstellar',
    year: '2014',
    genre: 'SCI-FI',
    poster: require('../../assets/interstellar.jpg'),
  },
];

export default function MovieScreen() {
  const [splash, setSplash] = useState(true);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState('Home');
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(old =>
      old.includes(id)
        ? old.filter(item => item !== id)
        : [...old, id]
    );
  };

  const filtered = movies.filter(movie => {
    const matches = movie.title.toLowerCase().includes(search.toLowerCase());
    const saved = tab !== 'Favorites' || favorites.includes(movie.id);
    return matches && saved;
  });

  if (splash) {
    return (
      <View style={styles.splash}>
        <StatusBar backgroundColor="#101827" barStyle="light-content" />
        <View style={styles.splashIcon}>
          <Ionicons name="film" size={42} color="#D9B77E" />
        </View>
        <Text style={styles.splashTitle}>MOVIEVERSE</Text>
        <Text style={styles.splashSub}>YOUR WORLD OF CINEMA</Text>
      </View>
    );
  }

  const featuredMovie = movies[featured];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#101827" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>WELCOME TO</Text>
            <Text style={styles.logo}>
              Movie<Text style={styles.gold}>Verse.</Text>
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="film-outline" size={24} color="#D9B77E" />
          </View>
        </View>

        {/* INTRO */}
        <Text style={styles.intro}>
          Find your next favourite story.
        </Text>

        {/* FEATURED */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Featured Film</Text>
          <Text style={styles.sectionNumber}>01 / 05</Text>
        </View>

        <View style={styles.featuredCard}>
          <Image
            source={featuredMovie.poster}
            style={styles.featuredPoster}
            resizeMode="cover"
          />

          <View style={styles.featuredInfo}>
            <Text style={styles.featuredLabel}>EDITOR'S PICK</Text>
            <Text style={styles.featuredTitle}>
              {featuredMovie.title}
            </Text>
            <Text style={styles.featuredYear}>
              {featuredMovie.year}  •  {featuredMovie.genre}
            </Text>

            <View style={styles.featuredButtons}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setFeatured((featured + 1) % movies.length)}
              >
                <Text style={styles.nextText}>NEXT FILM</Text>
                <Ionicons name="arrow-forward" size={16} color="#101827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => toggleFavorite(featuredMovie.id)}
              >
                <Ionicons
                  name={favorites.includes(featuredMovie.id) ? 'heart' : 'heart-outline'}
                  size={21}
                  color="#D9B77E"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#D9B77E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your movies..."
            placeholderTextColor="#858D9B"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={19} color="#858D9B" />
            </TouchableOpacity>
          )}
        </View>

        {/* MOVIES */}
        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>
              {tab === 'Favorites' ? 'My Favorites' : 'Explore Movies'}
            </Text>
            <Text style={styles.movieCount}>
              {filtered.length} movies available
            </Text>
          </View>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {filtered.map(movie => (
            <View key={movie.id} style={styles.movieCard}>
              <View style={styles.posterContainer}>
                <Image
                  source={movie.poster}
                  style={styles.poster}
                  resizeMode="cover"
                />

                <TouchableOpacity
                  style={styles.favoriteIcon}
                  onPress={() => toggleFavorite(movie.id)}
                >
                  <Ionicons
                    name={favorites.includes(movie.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={favorites.includes(movie.id) ? '#E87979' : '#FFFFFF'}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.movieTitle} numberOfLines={1}>
                {movie.title}
              </Text>

              <Text style={styles.movieDetails}>
                {movie.year}  •  {movie.genre}
              </Text>
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No movies found.</Text>
        )}

        <Text style={styles.footer}>MOVIEVERSE • MADE FOR FILM LOVERS</Text>

      </ScrollView>

      {/* NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setTab('Home');
            setSearch('');
          }}
        >
          <Ionicons name="home-outline" size={22}
            color={tab === 'Home' ? '#D9B77E' : '#858D9B'} />
          <Text style={[styles.navText, tab === 'Home' && styles.activeNav]}>
            HOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setTab('Explore');
            setSearch('');
          }}
        >
          <Ionicons name="compass-outline" size={22}
            color={tab === 'Explore' ? '#D9B77E' : '#858D9B'} />
          <Text style={[styles.navText, tab === 'Explore' && styles.activeNav]}>
            EXPLORE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setTab('Favorites');
            setSearch('');
          }}
        >
          <Ionicons name="heart-outline" size={22}
            color={tab === 'Favorites' ? '#D9B77E' : '#858D9B'} />
          <Text style={[styles.navText, tab === 'Favorites' && styles.activeNav]}>
            SAVED
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
