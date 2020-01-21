import React, { useState, useEffect } from 'react';

import { View, TouchableOpacity, Text, ScrollView, Image, StyleSheet } from 'react-native';

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';

import { DBOps } from '../database/database';

import { SearchBar } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


interface ContactProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;

}

const contact: React.SFC<ContactProps> = ({ navigation }) => {

    const [contactArray, setContactArray] = useState([]);
    const [tempContactArray, setTempContactArray] = useState([]);
    const [searchTerm, setsearchTerm] = useState('');


    useEffect(() => {
        const navFocusListener = navigation.addListener('didFocus', () => {
            console.log('hooooks');
            DBOps.openDB(() => {
                debugger;

                DBOps.getAllcontacts(res => {
                    if (res) {
                        setContactArray(res)
                        setTempContactArray(res)
                    }

                })
            }, (err) => {
                console.log('openDB', err)
            });
        });

        return () => {
            navFocusListener.remove();
        };
    }, []);




    const updateSearch = (searchText) => {

        setsearchTerm(searchText)

        let filteredData = tempContactArray.filter((item) => {
            return item.name.toLowerCase().includes(searchText.toLowerCase());
        });

        setContactArray(filteredData);

    }



    let contactListBlock = contactArray.map((data) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    setsearchTerm('')
                    navigation.navigate('ContactDetailsScreen', { contactDetail: data })
                }}
                style={styles.mapItemView}>
                <View style={{ flex: 0.5 }}></View>
                <TouchableOpacity

                    style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Image
                        resizeMode="cover"
                        style={{ height: 40, width: 40, borderRadius: 40 / 2 }}
                        source={{ uri: data.profileImage }} />
                </TouchableOpacity>

                <View style={{ flex: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{data.name}</Text>
                    </View>

                </View>


            </TouchableOpacity>


        )
    });



    return <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ height: '3%' }}></View>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row' }}>

            <View style={{ flex: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 24, fontFamily: 'Verdana', fontWeight: 'bold', padding: 4, marginHorizontal: 10 }}>Contacts</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('AddContactScreen', { isAdd: true })
                }}
                style={{ flex: 2, padding: 8, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Image
                    resizeMode="contain"
                    style={{ height: 30, width: 30 }}
                    source={require('./../assets/iconAddContact.png')} />
            </TouchableOpacity>
        </View>
        <View style={{ flex: 0.6, height: '5%', backgroundColor: 'white' }}>
            <SearchBar
                round={true}
                //  inputStyle={{ backgroundColor: 'grey', borderBottomColor: 'grey' }}
                containerStyle={{ backgroundColor: 'white', borderColor: 'white', height: '60%', borderBottomColor: 'white', borderTopColor: 'white' }}
                // leftIconContainerStyle={{backgroundColor: 'grey' }}
                // rightIconContainerStyle = {{backgroundColor: 'grey'}}
                placeholderTextColor={'#g5g5g5'}
                lightTheme={true}
                placeholder={'Type here to search..'}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={updateSearch}
                value={searchTerm}

            />
        </View>
        <View style={{ flex: 8.3, backgroundColor: 'white' }}>
            {contactArray.length ? <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                {contactListBlock}
            </ScrollView> : <View style={{flex:1,height:200, justifyContent:'center', alignItems:'center'}}>
                <Text style={{textAlign:'center', fontSize:24, fontWeight:'700'}}>No Contact Added</Text>
                </View>}
        </View>
    </KeyboardAwareScrollView>
}

export default contact

const styles = StyleSheet.create({
    mapItemView:{
        flex: 1, padding: 12, backgroundColor: 'white', flexDirection: 'row',
        borderBottomColor: '#C0C0C0', borderBottomWidth: 0.3,
    }
})