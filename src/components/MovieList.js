import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {styles} from '../theme';
import {useNavigation} from '@react-navigation/native';
import {image185} from '../api/MovieDb';
var {width, height} = Dimensions.get('window');

export default function MovieList({title, data, hideSeeAll}) {
  let movieName = 'Equalizer 3';
  const navigation = useNavigation();
  return (
    <View className="mb-8 space-y-4">
      {/* title */}
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              Semua
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* list film */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 15}}>
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push('Movie', item)}>
              <View className="space-y-1 mr-4">
                <Image
                  // source={require('../../assets/images/moviePoster2.jpeg')}
                  source={{uri: image185(item.poster_path)}}
                  className="rounded-3xl"
                  style={{
                    width: width * 0.33,
                    height: height * 0.22,
                  }}
                />
                <Text className="text-neutral-300 ml-1 text-center">
                  {item?.title?.length > 14
                    ? item.title.slice(0, 14) + '...'
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
