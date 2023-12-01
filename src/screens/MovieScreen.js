import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {styles, theme} from '../theme';
import {LinearGradient} from 'react-native-linear-gradient';
import ProgressiveImage from 'rn-progressive-image';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from '../api/MovieDb';
import {addEventListener, fetch} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

var {width, height} = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : ' mt-3';
export default function MovieScreen() {
  const {params: item} = useRoute();
  const navigation = useNavigation();
  const [isFavorite, toggleFavorite] = useState(false);
  const [cast, setCast] = useState([1, 2, 3, 4, 5]);
  const [similarMovies, setSimilarMovies] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [isError, setIsError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log('tipe jaringan', state.type);
      console.log('status koneksi', isConnected);
      // if (isConnected && movie === undefined) {
      getMovieDetails(item.id);
      getMoviCredits(item.id);
      getSimilarMovies(item.id);
      // cek data di lokal dan simpan ke server
      // kalau proses simpan berhasil, maka hapus data yg di local
      // }
    });
    loadFavouriteData();
    // console.log('itemid: ', item.id);
    // getMovieDetails(item.id);
    // getMoviCredits(item.id);
    // getSimilarMovies(item.id);
    return () => unsubscribe;
  }, [item]);

  const getMovieDetails = async id => {
    setLoading(true);
    setIsError(false);
    const data = await fetchMovieDetails(id);
    // console.log('got movie details: ', data);
    if (data && !data?.error) {
      setMovie(data);
    } else {
      data?.code === 'ERR_NETWORK' ? setIsError(true) : setIsError(false);
    }
    setLoading(false);
  };

  const getMoviCredits = async id => {
    const data = await fetchMovieCredits(id);
    // console.log('got movie casts: ', data);
    if (data && data.cast) setCast(data.cast);
    // setLoading(false);
  };

  const getSimilarMovies = async id => {
    const data = await fetchSimilarMovies(id);
    // console.log('got similar movie', data);
    if (data && data.results) setSimilarMovies(data.results);
    // setLoading(false);
  };

  const loadFavouriteData = async () => {
    try {
      // Ambil data dari penyimpanan lokal (AsyncStorage)
      console.log('ambil data favorite dari storage');
      const favData = await AsyncStorage.getItem('myFav');
      if (favData !== null) {
        // console.log('Data retrieved from local storage:', favData);
        // cek id movie
        const movies = JSON.parse(favData);
        console.log('movie favorite list', movies);
        // setFavoriteMovies(movies);
        if (Array.isArray(movies)) {
          const isMovieFav = movies.filter(
            movieItem => movieItem.id === item.id,
          );
          toggleFavorite(isMovieFav.length > 0 ? true : false);
          console.log('is Movie favourite', isMovieFav);
        }
      }
    } catch (error) {
      console.error('Error retrieving local data:', error);
    }
  };

  const handleFavourite = async () => {
    toggleFavorite(!isFavorite);
    const existingFav = await AsyncStorage.getItem('myFav');
    console.log('existing favourite', existingFav);
    const thisMovie = {id: item.id, title: item.title};
    // jika favorite gabung data film dengan data sebelumnya
    // jika unfavorite filter film untuk menghilangkan film terpilih
    const newFavoriteMovies = existingFav
      ? !isFavorite
        ? [...JSON.parse(existingFav), thisMovie]
        : JSON.parse(existingFav).filter(movieItem => movieItem.id !== item.id)
      : [thisMovie];

    console.log('set favorite movies', newFavoriteMovies);
    // Menyimpan daftar film favorit ke local storage
    saveFavoriteMovies(newFavoriteMovies);
  };

  const saveFavoriteMovies = async movies => {
    try {
      await AsyncStorage.setItem('myFav', JSON.stringify(movies));
    } catch (error) {
      console.error('Error saving favorite movies:', error);
    }
  };

  return (
    <View className="flex-1 bg-neutral-800">
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          contentContainerStyle={{paddingBottom: 20}}
          className="flex-1 bg-neutral-900">
          {/* back button dan poster */}
          <View className="w-full">
            <SafeAreaView
              className={
                'absolute z-20 w-full flex-row justify-between items-center px-4' +
                topMargin
              }>
              <TouchableOpacity
                style={styles.background}
                className="rounded-xl p-1"
                onPress={() => navigation.goBack()}>
                <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFavourite()}>
                <HeartIcon
                  size={35}
                  color={isFavorite ? theme.background : 'white'}
                />
              </TouchableOpacity>
            </SafeAreaView>
            <View>
              <ProgressiveImage
                // source={require('../../assets/images/moviePoster1.jpeg')}
                source={
                  isError
                    ? require('../../assets/images/fallbackMoviePoster.jpeg')
                    : {
                        uri:
                          image500(movie?.poster_path) || fallbackMoviePoster,
                      }
                }
                style={{
                  width,
                  height: height * 0.55,
                }}
              />
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(23, 23, 23, 0.8)',
                  'rgba(23, 23, 23, 1)',
                ]}
                style={{width, height: height * 0.4}}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                className="absolute bottom-0"
              />
            </View>
          </View>
          {/* detil film */}
          {isError ? (
            <Text className="text-white text-center text-3xl font-bold tracking-wider m-1">
              Periksa jaringan internet Anda
            </Text>
          ) : (
            <>
              <View style={{marginTop: -(height * 0.09)}} className="space-y-3">
                {/* title */}
                <Text className="text-white text-center text-3xl font-bold tracking-wider">
                  {movie?.title}
                </Text>
                {/* status, release, runtime */}
                <Text className="text-neutral-400 text-center text-base font-semibold">
                  {movie?.status} • {movie?.release_date?.split('-')[0]} •{' '}
                  {movie?.runtime} min
                </Text>
                {/* genre */}
                <View className="flex-row justify-center mx-4 space-x-2">
                  {movie?.genres?.map((genre, index) => {
                    let showDot = index + 1 !== movie.genres.length;
                    return (
                      <Text
                        key={'genre-' + index}
                        className="text-neutral-400 text-center text-base font-semibold">
                        {genre?.name} {showDot ? '•' : null}
                      </Text>
                    );
                  })}
                </View>
                {/* deskripsi */}
                <Text className="text-neutral-400 mx-4 tracking-wide">
                  {movie?.overview}
                </Text>
              </View>
              {/* Pemeran */}
              {cast.length > 0 && (
                <Cast navigation={navigation} cast={cast.slice(0, 8)} />
              )}
              {similarMovies.length > 0 && (
                <MovieList
                  title="Film Serupa"
                  hideSeeAll={true}
                  data={similarMovies.slice(0, 10)}
                />
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
