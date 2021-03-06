import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { APP_URL } from '../../config';
import { Theme, Colors } from '../../theme';
import { Button } from 'react-native-elements';

import { handleUrl, signOutUserAsync } from '../../utils';

export const LogOutCard = () => (
  <View style={[styles.container, { justifyContent: 'space-between' }]}>
    <Button
      type="clear"
      containerStyle={{ paddingLeft: 10, marginBottom: 10, alignItems: 'flex-start' }}
      onPress={() => {
        handleUrl(`${APP_URL}/privacy`);
      }}
      icon={{
        name: 'security',
        type: 'material',
        size: 15,
        color: Colors.greyLight
      }}
      title="Privacy policy"
      titleStyle={{ color: Colors.greyLight }}
    />
    <Button
      type="clear"
      containerStyle={{ paddingLeft: 10, marginBottom: 10, alignItems: 'flex-start' }}
      onPress={() => {
        handleUrl(`${APP_URL}/tnc`);
      }}
      icon={{
        name: 'infocirlceo',
        type: 'antdesign',
        size: 15,
        color: Colors.greyLight
      }}
      title="Licences & Terms of Service"
      titleStyle={{ color: Colors.greyLight }}
    />
    <Button
      type="clear"
      onPress={signOutUserAsync}
      containerStyle={{ paddingLeft: 10, marginBottom: 10, alignItems: 'flex-start' }}
      icon={{
        name: 'logout',
        type: 'antdesign',
        size: 15,
        color: Colors.greyLight
      }}
      title="Logout"
      titleStyle={{ color: Colors.greyLight }}
    />
  </View>
);

export const TermsCard = () => (
  <View style={[styles.container, { justifyContent: 'flex-end', borderWidth: 0 }]}>
    <TouchableOpacity style={styles.ppContainer} onPress={() => handleUrl(`${APP_URL}/privacy`)}>
      <Text>Privacy policy</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tncContainer} onPress={() => handleUrl(`${APP_URL}/tnc`)}>
      <Text>Licences & Terms of Service</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  logOutButton: {
    backgroundColor: Colors.darkRed,
    borderColor: Colors.darkRed,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 10,
    padding: 10
  },
  ppContainer: {
    borderColor: Theme.secondary,
    borderWidth: 1,
    padding: 10
  },
  tncContainer: {
    borderColor: Theme.secondary,
    borderWidth: 1,
    marginTop: 10,
    padding: 10
  }
});
