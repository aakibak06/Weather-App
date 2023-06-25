import { StyleSheet, Text, View, Image, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const SplashScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('HomeScreen')
        }, 2000)
    }, [])
    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor={'#ffe2e2'} barStyle={'dark-content'} />
            <Image source={require('../../Assets/image/screen.png')} style={{ width: '100%', height: '100%' }} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})