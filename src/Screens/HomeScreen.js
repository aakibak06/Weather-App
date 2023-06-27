import { StyleSheet, Text, View, Image, StatusBar, TextInput, TouchableOpacity, ScrollView, Dimensions, PixelRatio } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { debounce } from 'lodash';
import { fetchlocation, fetchweatherForecaste } from './Weather';
import { weatherImage } from '../component/Constant';
import { getData, storeData } from '../component/AsyncStorage';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

import {
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveScreenFontSize
} from "react-native-responsive-dimensions";
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';
import { enableScreens } from 'react-native-screens';


const windowWidth = Dimensions.get('window').width;
const scale = windowWidth / 375;

// const scale = PixelRatio.getFontScale();




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

        <View style={styles.mainContainer} >
            {/* <ScrollView> */}
            <StatusBar backgroundColor={'#083a7f'} />
            <Image source={require('../../Assets/image/background.jpg')} style={styles.imageStyle} />
            {loading ?
                <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveHeight(100), width: responsiveWidth(100) }}>
                    <Text style={{ fontSize: responsiveFontSize(4) }}>Loading...</Text>
                </View>
                : (

                    <View style={{
                        // marginTop: 10,
                        height: responsiveHeight(100), width: responsiveWidth(100),


                    }}>
                        <ScrollView

                            style={{
                                height: responsiveHeight(100), width: responsiveWidth(100),


                            }}>
                            <View style={{ height: responsiveHeight(10), }}>
                                <View style={[styles.container2in]}>
                                    {showSearch ? <TextInput placeholder='Search city' style={styles.inputStyle} autoCapitalize='none' onChangeText={handledebounce} /> : null}
                                    <TouchableOpacity onPress={() => setShowSearchToggle(!showSearch)} style={[styles.btnStyle, {
                                        backgroundColor: showSearch ? null : '#576574',
                                        padding: showSearch ? null : 10,
                                        marginTop: showSearch ? responsiveHeight(0.4) : 3,
                                        // height: showSearch ? null : '10'
                                        right: showSearch ? -6 : 0


                                    }]}>
                                        <AntDesign name='search1' color={'#b2bec3'} style={{
                                            // paddingRight: showSearch ? 20\ : null,
                                            color: showSearch ? 'white' : '#b2bec3',
                                            fontSize: responsiveFontSize(5)

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
                            <View style={{
                                alignItems: 'center', justifyContent: 'center',
                                height: responsiveHeight(60)
                            }}>
                                <Text style={{ fontSize: responsiveFontSize(3), color: '#dfe6e9' }}>{location?.name}
                                    <Text style={{ fontSize: responsiveFontSize(4), color: 'white' }}>{" " + location?.country}</Text>
                                </Text>

                                <View style={{ width: responsiveWidth(100), height: responsiveHeight(27), marginTop: responsiveHeight(1) }}>
                                    <Image source={weatherImage[current?.condition?.text]} resizeMode='contain' style={{ height: responsiveHeight(15), width: responsiveWidth(100), alignSelf: 'center', }} />
                                </View>
                                <View style={{}}>
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: responsiveFontSize(6) }}>
                                        {Math.round(current?.temp_c)}&#176;
                                    </Text>
                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'white', marginTop: 20, letterSpacing: 2, textAlign: 'center' }}>
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
                            <View style={{
                                marginTop: 10,
                                height: responsiveHeight(27)
                            }}>
                                <View style={{ marginBottom: 20 }}>

                                    <Text style={{ color: 'white', marginLeft: 10, letterSpacing: 3, fontSize: responsiveFontSize(2) }}>
                                        7 days forcast
                                    </Text>

                                </View>
                                <ScrollView
                                    style={{}}
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
                                            <View style={{
                                                width: responsiveWidth(28),
                                                marginHorizontal: 10,
                                                backgroundColor: '#535c68',
                                                borderRadius: responsiveWidth(10),
                                                // paddingVertical: 10,
                                                height: responsiveHeight(20),


                                            }} key={index}>

                                                <Image source={weatherImage[item?.day?.condition?.text]} style={{ height: '50%', width: '90%', alignSelf: 'center', }} />

                                                <Text style={{ color: 'white', textAlign: 'center', fontSize: responsiveFontSize(1.7), }}>{dayName}</Text>
                                                <Text style={{ color: 'white', textAlign: 'center', fontSize: responsiveFontSize(2), paddingTop: 10 }}>{item?.day?.avgtemp_c}&#176;</Text>
                                                {/* <Text style={{ color: 'white', textAlign: 'center', fontSize: 6 }}>{item?.day?.condition?.text}</Text> */}
                                            </View>
                                        )
                                    })}


                                </ScrollView>
                            </View>

                        </ScrollView>
                    </View>
                )
            }

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        // flex: 1,
        width: responsiveWidth(100),
        height: responsiveHeight(100)

    },
    imageStyle: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    container2: {
        // height: responsiveHeight(6),
        // width: responsiveWidth(100),
        // borderWidth: 1,
        // borderColor: 'green'
    },
    container2in: {
        // borderWidth: 1,
        // borderColor: "red",
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        width: responsiveWidth(90),
        // margin: 10,
        borderRadius: responsiveWidth(6),
        backgroundColor: '#8395a7',
        zIndex: 20,
        alignSelf: "center",
        // height: responsiveHeight(100)


    },
    inputStyle: {
        width: responsiveWidth(75),
        // height: '100%',
        fontSize: responsiveScreenFontSize(2.5),
        color: '#ecf0f1',
        // borderWidth: 0.3,
        paddingLeft: 15,
        // paddingVertical: 0




    },
    btnStyle: {
        position: 'absolute',
        right: 0,
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        borderRadius: responsiveWidth(7.5)


        // borderRadius: 40,




    },
    locationContainer: {
        backgroundColor: 'white',
        // marginHorizontal: responsiveWidth(10),
        paddingRight: 24,
        borderRadius: 20,
        position: 'absolute',
        width: responsiveWidth(80),
        // top: '10%',
        marginTop: responsiveHeight(7),
        zIndex: 20,
        // height: 500/
        elevation: 10,
        alignSelf: 'center'

    },
    locationTextStyle: {
        // paddingVertical: 10,
        fontSize: responsiveFontSize(2),
        marginLeft: 5,
        color: 'black',
        paddingVertical: responsiveHeight(1.5)


    },
    locationBtnStyle: {
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        // borderTopWidth: 1,
        borderColor: '#576574',
        // height: 45,
        // justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    herefont: {
        fontSize: responsiveFontSize(4 * scale)
    },
    heading: {
        fontSize: responsiveFontSize(3),
        color: 'white'
    },
    headingin: {
        fontSize: responsiveFontSize(4.5)
    }
})