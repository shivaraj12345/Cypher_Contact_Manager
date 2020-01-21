import React, { Component, useState, useEffect } from 'react';

import {
    View, TextInput, StyleSheet, Keyboard, TouchableOpacity, Text, ScrollView, Image, Picker, Dimensions, KeyboardAvoidingView
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';

import { DBOps } from '../database/database';

import DateTimePicker from 'react-native-modal-datetime-picker';

let moment = require('moment');

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Toast from 'react-native-simple-toast';

interface addContactProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const addContact: React.SFC<addContactProps> = ({ navigation }) => {

    const [contactTitle, setcontactTitle] = useState('Male');
    const [contactName, setcontactName] = useState('');
    const [contactPhone, setcontactPhone] = useState('');
    const [contactDoB, setcontactDoB] = useState('');
    const [contactPersonal, setcontactPersonal] = useState('');
    const [contactProfileImage, setcontactProfileImage] = useState('');
    const [contactUserId, setcontactUserId] = useState('');
    const [isAdd, setIsAdd] = useState(false);
    const [showDatePicker, setshowDatePicker] = useState(false);


    let Size = Dimensions.get('window');

    useEffect(() => {


        setIsAdd(navigation.state.params.isAdd);

        if (isAdd == navigation.state.params.isAdd) {
            // console.log("isADD: ", navigation.state.params.isAdd)
            // console.log("obj: ", navigation.state.params.contactDetailObj)
            const contactDetailsObj = navigation.state.params.contactDetailObj
            //  setcontactDetailsObj(navigation.state.params.contactDetailObj);
            setcontactTitle(contactDetailsObj.title);
            setcontactName(contactDetailsObj.name);
            setcontactPhone(contactDetailsObj.phone);
            setcontactDoB(contactDetailsObj.dateOfBirth);
            setcontactPersonal(contactDetailsObj.email);
            setcontactProfileImage(contactDetailsObj.profileImage);
            setcontactUserId(contactDetailsObj.user_id);
        }
    }, [navigation.state.params.isAdd]);


    const addContact = () => {
        let contactObj = {
            contactTitle: contactTitle,
            contactName: contactName,
            contactPhone: contactPhone,
            contactDoB: contactDoB,
            contactPersonal: contactPersonal,
            contactProfileImage: contactProfileImage,
            contactUserId: contactUserId

        };

        if (contactName && contactName != '') {

            if (contactPhone && contactPhone != '') {

                if (contactProfileImage && contactProfileImage != '') {
                    DBOps.openDB(() => {
                        debugger;
                        console.log("isADD: ", isAdd)
                        if (isAdd) {
                            DBOps.createContactTable(contactObj, (result) => {
                                console.log('createContactTable', result)
                                Toast.showWithGravity('Contact added successfully!', Toast.LONG, Toast.CENTER);
                                navigation.navigate('ListOfContactScreen')
                            })
                        } else {
                            DBOps.updateContactTable(contactObj, (result) => {
                                console.log('updateContactTable', result)
                                Toast.showWithGravity('Contact updated successfully!', Toast.LONG, Toast.CENTER);
                                navigation.navigate('ListOfContactScreen')
                            })

                        }
                    }, (err) => {
                        console.log('Db opening Error', err)
                    });
                } else {
                    Toast.showWithGravity('Please add contact profile picture!', Toast.LONG, Toast.CENTER);
                    return false
                }
            } else {
                Toast.showWithGravity('Please add contact phone number!', Toast.LONG, Toast.CENTER);
                return false
            }
        } else {
            Toast.showWithGravity('Please add contact name!', Toast.LONG, Toast.CENTER);
            return false
        }


    }

    const launchCamera = () => {
        const options: any = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: false,
                path: '.images',
            }

        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('Image Uri: ', response);
                setcontactProfileImage(response.uri);
            }
        });
    }

    const selectTitle = (pickerValue) => {
        setcontactTitle(pickerValue);
    }


    const onDateConfirmClick = (date) => {
        let selectedDate = moment(date).format('DD/MM/YYYY');

        let todayDate = new Date()
        let CurrentDate = todayDate.getDate() + "/" + (("0" + (todayDate.getMonth() + 1)).slice(-2)) + "/" + todayDate.getFullYear();


        if (selectedDate < CurrentDate) {
            setshowDatePicker(!showDatePicker)
            setcontactDoB(selectedDate);

        } else {
            Toast.showWithGravity('Please select valid date', Toast.LONG, Toast.CENTER);

            setshowDatePicker(!showDatePicker)
        }
       


    }

    const onDateCancelClick = () => {
        console.log('Cancel Click ');
        setshowDatePicker(!showDatePicker)
    }

    return <View style={{ flex: 1 }}>

        <DateTimePicker
            isVisible={showDatePicker}
            onConfirm={onDateConfirmClick}
            onCancel={onDateCancelClick}
        />

        <View style={styles.container}>


            <TouchableOpacity

                onPress={() => {
                    navigation.navigate('ListOfContactScreen')
                }}
                style={{ flex: 2, padding: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={styles.textDone}>Cancel</Text>
            </TouchableOpacity>


            <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.textContactDetail}>{isAdd ? 'New Contact' : 'Edit Contact'}</Text>
            </View>


            <TouchableOpacity
                onPress={() => {
                    addContact();

                    //  navigation.navigate('ListOfContactScreen')
                }}
                style={{ flex: 2, padding: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={styles.textDone}>Done</Text>
            </TouchableOpacity>
        </View>

        <View style={{ flex: 7 }}>
            {/* <ScrollView style={{ flex: 1, backgroundColor: 'white' }}> */}
            <View style={{ flex: 1 }}>
                <View style={styles.containerDetail}>

                    <TouchableOpacity
                        onPress={() => {
                            launchCamera();
                        }}
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Image
                            resizeMode="stretch"
                            style={contactProfileImage ? {
                                width: Size.width,
                                height: Size.height / 2.5
                            } : { width: Size.width / 3, height: Size.height / 6 }}
                            source={contactProfileImage ? { uri: contactProfileImage } : require('./../assets/addProfilePicture.png')} />
                    </TouchableOpacity>
                    {contactProfileImage ? <TouchableOpacity
                        onPress={() => {
                            launchCamera();
                        }}
                        style={{ position: 'absolute', bottom: 10, right: 10, height: 50, width: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            resizeMode="stretch"
                            style={{ height: 25, width: 25 }}
                            source={require('./../assets/camera.png')} />

                    </TouchableOpacity> : null}
                </View>

                <View style={{ flex: 5, height: '70%' }}>
                    <View style={styles.rowContainer}>
                        <View style={styles.textView}>

                            <Text style={styles.textKey}>Title</Text>
                        </View>


                        <View style={{
                            flex: 7,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>

                            <Picker style={{ width: '100%' }} selectedValue={contactTitle} onValueChange={selectTitle}>
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />

                            </Picker>

                        </View>

                    </View>

                    <KeyboardAwareScrollView contentContainerStyle={

                        styles.rowContainer
                    }>
                        <View style={styles.textView}>

                            <Text style={styles.textKey}>Name</Text>
                        </View>
                        <View style={{
                            flex: 7,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                            <TextInput
                                editable={true}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                keyboardType={'name-phone-pad'}
                                onChangeText={(contactName) => {
                                    setcontactName(contactName);
                                }}
                                placeholder='Name'
                                value={contactName}
                                style={styles.textValue}
                            />
                        </View>

                    </KeyboardAwareScrollView>

                    <KeyboardAwareScrollView contentContainerStyle={styles.rowContainer}>
                        <View style={styles.textView}>

                            <Text style={styles.textKey}>Phone</Text>
                        </View>
                        <View style={{
                            flex: 7,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                            <TextInput
                                editable={true}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                keyboardType={'phone-pad'}
                                onChangeText={(contactPhoneNumber) => {
                                    setcontactPhone(contactPhoneNumber);
                                }}
                                placeholder='Phone Number'
                                value={contactPhone}
                                style={styles.textValue}
                            />
                        </View>

                    </KeyboardAwareScrollView>

                    <View style={styles.rowContainer}>
                        <View style={styles.textView}>

                            <Text style={styles.textKey}>DOB</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setshowDatePicker(true)
                            }}
                            style={{
                                flex: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                            <View style={{ flex: 7, flexDirection: 'row' }}>
                                <View
                                    style={{
                                        flex: 8,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >


                                    <Text style={{ fontWeight: '400', textAlign: 'center' }}>{contactDoB}</Text>
                                </View>

                                <View
                                    style={{
                                        display: 'flex',
                                        flex: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={require('./../assets/calendar.png')}
                                        style={{
                                            height: 30,
                                            width: 30,
                                            // position: 'absolute',
                                            right: 0
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>

                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.textView}>

                            <Text style={styles.textKey}>Personal</Text>
                        </View>
                        <View style={{
                            flex: 7,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                            <TextInput
                                editable={true}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                placeholder='Email'
                                keyboardType={'email-address'}
                                onChangeText={(contactEmail) => {
                                    setcontactPersonal(contactEmail);
                                }}
                                value={contactPersonal}
                                style={styles.textValue}
                            />
                        </View>

                    </View>
                </View>


            </View>
            {/* </ScrollView> */}
        </View>
        <View style={{ flex: 0 }}></View>

    </View>
}

export default addContact

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        backgroundColor: 'white',
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
        flex: 4,
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
        fontSize: 15,
        fontWeight: 'bold'
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white', marginBottom: 1, borderRadius: 1,

    }

});