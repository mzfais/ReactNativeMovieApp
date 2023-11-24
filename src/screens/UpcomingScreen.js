import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {fetchUpcomingMovies} from '../api/MovieDb';
import MovieGrid from '../components/MovieGrid';
import {theme} from '../theme';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function UpcomingScreen() {
  const [upcoming, setUpcoming] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getUpcomingMovies();
  }, []);

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) {
      setUpcoming(data.results);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      {/* Header */}
      <View className="p-4 flex-row items-center">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeftIcon size={30} strokeWidth={2} color={theme.text} />
        </TouchableOpacity>
        <Text className="text-white text-xl ml-4">Akan Tayang</Text>
      </View>

      {/* Movie Grid */}
      <MovieGrid data={upcoming} />
    </SafeAreaView>
  );
}
