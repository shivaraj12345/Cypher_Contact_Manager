/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider, connect } from 'react-redux';
import contact from './src/components/contact'
import addContact from './src/components/addContact'
import contactDetails from './src/components/contactDetails'



const AppStack = createStackNavigator({

  ListOfContactScreen: {
    screen: contact,
    navigationOptions: {
      header: () => {
        return null;
      }
    }
  },
  AddContactScreen: {
    screen: addContact,
    navigationOptions: {
      header: () => {
        return null;
      }
    }
  },
 
  ContactDetailsScreen: {
    screen: contactDetails,  
    navigationOptions: {
      header: () => {
        return null;
      }
    }
  },


});

const AppContainer:any = createAppContainer(createSwitchNavigator(

  {
    App: AppStack,
  },
  {
    initialRouteName: "App"
  }

));


export default AppContainer
