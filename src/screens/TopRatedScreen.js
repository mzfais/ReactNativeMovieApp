import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchTopRatedMovies} from '../api/MovieDb';

export default function TopRatedScreen() {
  const [movies, setmovies] = useState([]);

  useEffect(() => {
    getTopRatedMovies();
  }, []);

  const getTopRatedMovies = async () => {
    // ambil data dari api
    const data = await fetchTopRatedMovies();
    if (data && data.results) setmovies(data.results);
    console.log(data.results);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>TopRatedScreen</Text>
    </View>
  );
}
