import React, {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Text, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchSearchMovies} from '../api/MovieDb';
import MovieGrid from '../components/MovieGrid';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {theme} from '../theme';
import {SafeAreaView} from 'react-native-safe-area-context';

const AllResultsScreen = ({route}) => {
  const navigation = useNavigation();
  const {searchText, results} = route.params;
  const [allResults, setAllResults] = useState([...results]);
  const ios = Platform.OS === 'ios';
  const fetchAdditionalResults = async () => {
    try {
      const nextPage = allResults.length;
      const data = await fetchSearchMovies({
        query: searchText,
        include_adult: 'true',
        language: 'en-US',
        page: nextPage.toString(),
      });

      if (data && data.results) {
        setAllResults([...allResults, ...data.results]);
      }
    } catch (error) {
      console.error('Error fetching additional results:', error);
    }
  };

  useEffect(() => {
    fetchAdditionalResults();
  });

  const handleSearchTextPress = () => {
    navigation.navigate('Search');
  };

  return (
    <SafeAreaView className={`bg-neutral-800 flex-1 ${ios ? 'pt-0' : 'pt-3'}`}>
      {/* Header */}
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-3">
          <ChevronLeftIcon size={24} color={theme.text} />
        </TouchableOpacity>
        <TextInput
          value={searchText}
          placeholder="Cari Film"
          placeholderTextColor="lightgray"
          className="pl-5 flex-1 text-base font-semibold text-white tracking-wider"
          onTouchStart={handleSearchTextPress}
        />
      </View>
      <Text className="text-white font-semibold ml-4 mb-2">
        Results ({allResults.length})
      </Text>

      {/* Movie Grid */}
      <MovieGrid data={allResults} />
    </SafeAreaView>
  );
};

export default AllResultsScreen;
