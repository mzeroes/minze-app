import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import TabBarIcon from '../../../components/icons/TabBarIcon';
import ProfileTabScreen from '../../../screens/AccountScreen';
import EditProfileScreen from '../../../screens/AccountScreen/EditProfileScreen';

const ProfileStack = createStackNavigator(
  {
    Settings: ProfileTabScreen,
    EditProfile: EditProfileScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarTestID: 'Account',
  tabBarIcon: ({ focused }: any) => (
    <TabBarIcon
      size={26}
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-contact${focused ? '' : '-outline'}` : 'ios-contact'}
    />
  )
};

export default ProfileStack;
