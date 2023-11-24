import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ProgressiveImage from 'rn-progressive-image';
import {image185, fallbackMoviePoster} from '../api/MovieDb';
import {theme} from '../theme';

var {height, width} = Dimensions.get('window');

const MovieGrid = ({data}) => {
  const navigation = useNavigation();
  const [visibleData, setVisibleData] = useState([]);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMoreData();
  });

  const loadMoreData = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const startIndex = visibleData.length;
    const endIndex = startIndex + itemsPerPage;
    const newData = data.slice(startIndex, endIndex);

    setTimeout(() => {
      setVisibleData([...visibleData, ...newData]);
      setLoading(false);
    }, 1000);
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.push('Movie', item)}
      className="p-2 ml-1"
      style={{width: '48%'}}>
      <View>
        <ProgressiveImage
          source={{uri: image185(item.poster_path) || fallbackMoviePoster}}
          className="rounded-3xl"
          style={{
            width: '100%',
            height: height * 0.32,
            resizeMode: 'contain',
          }}
        />
        <Text className="text-neutral-300 mt-2 text-center">
          {item?.title?.length > 14
            ? item.title.slice(0, 14) + '...'
            : item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={visibleData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.8}
      ListFooterComponent={
        loading && <ActivityIndicator size="small" color={theme.background} />
      }
    />
  );
};

export default MovieGrid;
