import { StyleSheet, Text, View, Image, StatusBar, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { debounce } from 'lodash';
import { fetchlocation, fetchweatherForecaste } from './Weather';
import { weatherImage } from '../component/Constant';
import { getData, storeData } from '../component/AsyncStorage';


const { height, width } = Dimensions.get('window');




const HomeScreen = () => {
    const [showLocation, setShowLocation] = useState(true)
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearchToggle] = useState(false);
    const [loc, setLocation] = useState([])

    const [searchText, setSearchText] = useState('')

    const [WeatherData, setWeatherData] = useState({});


    const LocationHandler = (item) => {
        console.log('loc', item)

        setLocation([])
        setShowSearchToggle(false)
        setLoading(true)
        fetchweatherForecaste({
            cityName: item.name,
            days: '7',

        }).then((data) => {
            setWeatherData(data)
            setLoading(false)
            console.log("got data: ", data)
            storeData('city', item.name)
        })

    }

    const handleSearch = (value) => {
        if (value.length >= 1) {
            fetchlocation({ cityName: value }).then((data) => {
                setLocation(data)
            })
        }


    }



    const handledebounce = useCallback(debounce(handleSearch, 100), []);


    const { current, location } = WeatherData;

    //when open the app load first data

    useEffect(() => {
        fetchMyweatherData()
    }, [])

    const fetchMyweatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'Gurgaon';
        // if we got the data myCity then we will change the cityName to myCity
        if (myCity) cityName = myCity;

        fetchweatherForecaste({
            cityName,
            days: '7'
        }).then((data) => {
            setWeatherData(data)
            setLoading(false)
        })
    }


    return (
        <ScrollView>
            <View style={styles.mainContainer} >
                <StatusBar backgroundColor={'#083a7f'} />
                <Image source={require('../../Assets/image/background.jpg')} style={styles.imageStyle} />
                {loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 40 }}>Loading...</Text>
                    </View>
                    : (
                        <View style={{ width: '100%', height: '100%', marginTop: '3%' }}>
                            <View style={styles.container2}>
                                <View style={[styles.container2in, { height: showSearch ? '100%' : null }]}>
                                    {showSearch ? <TextInput placeholder='Search city' style={styles.inputStyle} autoCapitalize='none' onChangeText={handledebounce} /> : null}
                                    <TouchableOpacity onPress={() => setShowSearchToggle(!showSearch)} style={[styles.btnStyle, {
                                        backgroundColor: showSearch ? null : '#576574',
                                        padding: showSearch ? null : 10,
                                        top: showSearch ? 9 : 3,
                                        // height: showSearch ? null : '10'


                                    }]}>
                                        <AntDesign name='search1' color={'#b2bec3'} size={35} style={{
                                            paddingRight: showSearch ? 5 : null,
                                            // color: showSearch ? 'red' : '#b2bec3'
                                        }} />
                                    </TouchableOpacity>
                                </View>

                            </View>

                            {loc && showSearch ?
                                (
                                    <View style={styles.locationContainer}>
                                        {loc.map((item, index) => {
                                            let showBorder = index + 1 != loc.length;
                                            let borderClass = showBorder ? 'locationBtnStyle' : ''
                                            return (

                                                <TouchableOpacity style={[styles.locationBtnStyle, { borderClass }]}
                                                    onPress={() => LocationHandler(item)} key={index}>
                                                    <Ionicons name='location-sharp' size={27} color={'#7f8c8d'} />
                                                    <Text style={styles.locationTextStyle}>{item?.name} {item?.country}</Text>
                                                </TouchableOpacity>

                                            )
                                        })}
                                    </View>
                                ) : null
                            }
                            {/* forecast section */}
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, width: '100%', flex: 2 }}>
                                <Text style={{ color: '#c8d6e5', fontSize: 23, }}>{location?.name}
                                    <Text style={{ fontSize: 26, color: 'white' }}>{" " + location?.country}</Text>
                                </Text>

                                <View style={{ width: '100%', height: '35%', marginTop: 20 }}>
                                    <Image source={weatherImage[current?.condition?.text]} resizeMode='contain' style={{ height: '90%', width: '100%', alignSelf: 'center', }} />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: 40, color: 'white', textAlign: 'center' }}>
                                        {current?.temp_c}&#176;
                                    </Text>
                                    <Text style={{ fontSize: 15, color: 'white', marginTop: 20, letterSpacing: 2, textAlign: 'center' }}>
                                        {current?.condition?.text}
                                    </Text>
                                </View>
                                {/* other stats */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: 30 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Feather name='wind' size={30} color={'white'} />
                                        <Text style={{ color: 'white', marginLeft: 5 }}>{current?.wind_kph}Km</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Fontisto name='blood-drop' size={27} color={'white'} />
                                        <Text style={{ color: 'white', marginLeft: 5 }}>{current?.humidity}%</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Feather name='sun' size={30} color={'white'} />
                                        <Text style={{ color: 'white', marginLeft: 5 }}>{WeatherData?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                    </View>

                                </View>

                            </View>
                            {/* forecast for next days */}
                            <View style={{ marginTop: 10, width: '100%', height: '30%', }}>
                                <View style={{ marginBottom: 20 }}>

                                    <Text style={{ color: 'white', marginLeft: 10, letterSpacing: 3 }}>
                                        7 days forcast
                                    </Text>

                                </View>
                                <ScrollView
                                    style={{ marginBottom: 10 }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}

                                // automaticallyAdjustContentInsets={true}

                                >
                                    {WeatherData?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: 'long' };
                                        let dayName = date.toLocaleDateString('en-US', options)
                                        dayName = dayName.split(',')[0]


                                        return (
                                            <View style={{ height: '100%', width: width / 3.5, marginHorizontal: 10 }} key={index}>
                                                <View style={{ height: '90%', width: '100%', borderRadius: 30, backgroundColor: '#535c68', paddingVertical: 10, }} >
                                                    <Image source={weatherImage[item?.day?.condition?.text]} style={{ height: '50%', width: '70%', alignSelf: 'center' }} />

                                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, padding: 10 }}>{dayName}</Text>
                                                    <Text style={{ color: 'white', textAlign: 'center' }}>{item?.day?.avgtemp_c}&#176;</Text>
                                                    {/* <Text style={{ color: 'white', textAlign: 'center', fontSize: 6 }}>{item?.day?.condition?.text}</Text> */}


                                                </View>
                                            </View>
                                        )
                                    })}


                                </ScrollView>
                            </View>

                        </View>
                    )}

            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        // flex: 1,
        height: height,
        width: width
    },
    imageStyle: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    container2: {
        height: '6%',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    container2in: {
        // borderWidth: 1,
        // borderColor: "red",
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        width: '90%',
        // margin: 10,
        borderRadius: 30,
        backgroundColor: '#8395a7',
        zIndex: 20,
        alignSelf: "center",
        // height: '100%'


    },
    inputStyle: {
        width: '87%', height: '100%',
        fontSize: 20,
        color: '#ecf0f1',
        // borderWidth: 0.3,
        paddingLeft: 20


    },
    btnStyle: {
        position: 'absolute',
        right: 6,
        // top: ,
        borderRadius: 40,




    },
    locationContainer: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingRight: 24,
        borderRadius: 20,
        position: 'absolute',
        width: '90%',
        top: '8%',
        zIndex: 20,
        // height: 500/
        elevation: 10

    },
    locationTextStyle: {
        // paddingVertical: 10,
        fontSize: 16,
        marginLeft: 5,
        color: 'black'

    },
    locationBtnStyle: {
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        // borderTopWidth: 1,
        borderColor: '#576574',
        height: 45,
        // justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5






    }
})