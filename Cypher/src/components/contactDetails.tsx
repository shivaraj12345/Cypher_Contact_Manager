import React, { Component, useState, useEffect } from 'react';

import {
    View, TextInput, StyleSheet, Keyboard
    , TouchableOpacity, Text, ScrollView, Image, Platform, Linking, Dimensions
} from 'react-native';


import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';

import SendSMS from 'react-native-sms'

interface addContactProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>

}


const contactDetail: React.SFC<addContactProps> = ({ navigation }) => {

    const [contactDetailObj, setcontactDetailObj] = useState(navigation.state.params);
    let Size = Dimensions.get('window');

    useEffect(() => {
    //    contactObj.contactDetail = navigation.state.params
        setcontactDetailObj(navigation.state.params.contactDetail);
        console.log('navigation: ', contactDetailObj.contactDetail);  

    })

    const makeCall = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${' + contactDetailObj.phone + '}';
        } else {
            phoneNumber = 'telprompt:${' + contactDetailObj.phone + '}';
        }
        Linking.openURL(phoneNumber);
    }
   
    const sendSMS = () => {
        SendSMS.send({
            body: '',
            recipients: [contactDetailObj.phone],
            successTypes: ['sent', 'queued'],
            //  allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

        });
    }
    return <View style={{ flex: 1 }}>
        <View style={styles.container}>


            <TouchableOpacity

                onPress={() => {
                    navigation.navigate('ListOfContactScreen',{data:true})
                }}
                style={{ flex: 2, padding: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={styles.textDone}>Cancel</Text>
            </TouchableOpacity>


            <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.textContactDetail}>Contact Details</Text>
            </View>


            <TouchableOpacity
                onPress={(() => {
                    navigation.navigate('AddContactScreen', { isAdd: false, contactDetailObj: contactDetailObj })
                })}
                style={{ flex: 2, padding: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={styles.textDone}>Edit</Text>
            </TouchableOpacity>
        </View>

        <View style={{ flex: 7 }}>
            {/* <ScrollView style={{ flex: 1, backgroundColor: 'white' }}> */}
            <View style={{ flex: 1 }}>
                <View style={styles.containerDetail}>

                    <View
                       
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Image
                             resizeMode="stretch"
                            style={contactDetailObj.profileImage ? {
                                width: Size.width,
                                height: Size.height / 2.6
                            } : { width: Size.width / 3,height:Size.height/ 6}}
                            source={contactDetailObj.profileImage ? { uri: contactDetailObj.profileImage } : require('./../assets/addProfilePicture.png')} />

                    </View>
                </View>
                <View style={{flex:0.5}}></View>
                <View style={{ flex: 1.5, padding: 5 }}>
                    <View style={styles.rowContainer}>
                        <View style={[styles.textView, { alignItems: 'center' }]}>

                            <Text style={styles.textKey}>{contactDetailObj.name}</Text>
                        </View>

                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.textView}>

                            <Text style={styles.textEmail}>{contactDetailObj.email}</Text>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={[styles.textView, { flex: 7 }]}>

                            <Text style={styles.textPhoneNumber}>{contactDetailObj.phone}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={(() => {
                                makeCall()
                            })}
                            style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Image
                                resizeMode="contain"
                                style={{ width: 30, height: 30 }}
                                source={require('./../assets/iconCall.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={(() => {
                                sendSMS();
                            })}
                            style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Image
                                resizeMode="contain"
                                style={{ width: 30, height: 30 }}
                                source={require('./../assets/iconMessage.png')} />
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={{ flex: 3 }}></View>
            </View>
            {/* </ScrollView> */}
        </View>
        <View style={{ flex: 0 }}></View>
    </View>
}

export default contactDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
        flexDirection: 'row'
    },
    textDone: {
        fontSize: 16,
        fontFamily: 'Verdana',
        fontWeight: '400',
        padding: 4
    },
    textContactDetail: {
        fontSize: 20,
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        padding: 4
    },
    containerDetail:
    {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textView: {
        flex: 3,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',


    },
    textValue: {
        width: '100%',
        padding: 5,
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        fontSize: 16
    },
    textKey: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    textKeySmall: {
        fontSize: 16,
        fontWeight: '500'
    },
    rowContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    textEmail: {
        fontSize: 12,
        fontWeight: '300',
        color: 'grey'

    },
    textPhoneNumber:
    {
        fontSize: 18,
        fontWeight: '600',


    }

});