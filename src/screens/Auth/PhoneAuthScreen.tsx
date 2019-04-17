import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';
import { Overlay } from 'react-native-elements';
import CountryPicker, { CCA2Code, AnimationType, FlagType } from 'react-native-country-picker-modal';
import firebase from 'react-native-firebase';
import { FontWeights, Theme, DropDownAlertStyles } from '../../theme';
import { TextInput, Modal, Portal } from 'react-native-paper';
import { userUpdateAsync } from '../../utils/update';
import TextInputMask from 'react-native-text-input-mask';
import TouchableOpacityButton from '../../components/buttons/TouchableOpacityButton';
import VerifyPhoneAnimated from '../../components/loaders/VerifyPhoneAnimated';
interface Props {}

interface State {
  verifyOTP: boolean;
  spinner: boolean;
  resendTimer: number;
  phoneNumber: string;
  firebaseConfirmResult: any;
  otp: string;
  temporaryToken: string;
  country: {
    cca2: CCA2Code;
    callingCode: string;
  };
}

class PhoneAuthScreen extends Component<Props, State> {
  dropDownNotification: any;
  state: State = {
    verifyOTP: false,
    spinner: false,
    phoneNumber: __DEV__ ? '1234567890' : '',
    resendTimer: 60,
    firebaseConfirmResult: null,
    otp: '',
    temporaryToken: '',
    country: {
      cca2: 'IN',
      callingCode: '91'
    }
  };
  static navigationOptions = {
    header: null
  };

  unsubscribe: (() => void) | undefined;
  componentDidMount() {
    const { resendTimer } = this.state;
    setInterval(
      (self: { setState: (arg0: { resendTimer: number }) => void }) => {
        resendTimer >= 0 ? self.setState({ resendTimer: resendTimer - 1 }) : clearInterval(0);
      },
      1000,
      this
    );
    this.unsubscribe = firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        userUpdateAsync(user);
        // Navigate with a delay.
        this.dropDownNotification.alertWithType('success', 'Verified', 'Your phone number is verified');
        setTimeout(
          self => {
            self.props.navigation.navigate('App');
          },
          800,
          this
        );
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getCode = async () => {
    const {
      phoneNumber,
      country: { callingCode }
    } = this.state;
    const fullPhoneNumber = `+${callingCode}${phoneNumber}`;

    this.setState({ spinner: true });
    try {
      const firebaseConfirmResult = await firebase.auth().signInWithPhoneNumber(fullPhoneNumber);
      this.setState({
        firebaseConfirmResult,
        verifyOTP: true,
        spinner: false,
        phoneNumber
      });
      this.dropDownNotification.alertWithType('info', 'OTP Sent', 'OTP sent to your number');
    } catch (error) {
      this.setState({ spinner: false });
      this.dropDownNotification.alertWithType('error', 'OTP Not Sent', 'Unable to send the OTP' + __DEV__ && error);
    }
  };

  resendOTP = async () => {
    try {
      this.setState({ spinner: true });
      const {
        phoneNumber,
        country: { callingCode }
      } = this.state;
      const fullPhoneNumber = `+${callingCode}${phoneNumber}`;

      const firebaseConfirmResult = await firebase.auth().signInWithPhoneNumber(fullPhoneNumber);
      this.setState({ firebaseConfirmResult, spinner: false });
    } catch (error) {
      this.dropDownNotification.alertWithType(
        'error',
        'ResendOTP failed',
        'Resending the OTP has failed' + __DEV__ && error
      );
    }
  };

  verifyCode = async () => {
    /**
     * NOTE: onAuthStateChanged should handle update and navigation
     **/

    this.setState({
      spinner: true
    });
    const { otp, firebaseConfirmResult } = this.state;
    try {
      const onFirebaseConfirmResult = await firebaseConfirmResult.confirm(otp);
      this.setState({
        spinner: false
      });
    } catch (error) {
      this.setState({
        spinner: false
      });
      this.dropDownNotification.alertWithType(
        'error',
        'Not Verified',
        'The Otp you provided is incorrect' + __DEV__ && error
      );
    }
  };

  tryAgain = () => {
    this.setState({ verifyOTP: false });
  };

  getSubmitAction = () => {
    const { phoneNumber } = this.state;
    const regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (phoneNumber.match(regex) || this.state.verifyOTP) {
      this.state.verifyOTP ? this.verifyCode() : this.getCode();
    } else {
      this.dropDownNotification.alertWithType('error', 'Invalid Phone Number', 'Please provide valid phone number');
    }
  };

  changeCountry = (country: any) => {
    this.setState({ country });
  };

  renderFooter = () => {
    const { resendTimer } = this.state;

    return this.state.verifyOTP ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginLeft: 30,
          marginRight: 30
        }}
      >
        <Text style={styles.wrongNumberText}>Wrong number or need a new code?</Text>
        {resendTimer === 0 ? (
          <TouchableOpacity style={{ padding: 8 }} onPress={this.resendOTP}>
            <Text style={{ color: Theme.primary, fontSize: 16 }}>resend</Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              ...FontWeights.light,
              color: Theme.textDark,
              fontSize: 15
            }}
          >
            00:{resendTimer} sec
          </Text>
        )}
      </View>
    ) : (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginLeft: 30,
          marginRight: 30
        }}
      >
        <Text style={styles.disclaimerText}>
          By tapping "Submit", we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.
        </Text>
      </View>
    );
  };

  renderCountryPicker = () => {
    return this.state.verifyOTP ? (
      <View />
    ) : (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        filterable
        flagType={'emoji'}
        animationType={'slide'}
        autoFocusFilter={false}
        onChange={this.changeCountry}
        cca2={this.state.country.cca2}
        translation={'common'}
      />
    );
  };

  renderCallingCode = () => {
    return this.state.verifyOTP ? (
      <View />
    ) : (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>
            {this.state.verifyOTP ? 'Enter your verification code.' : "What's your Phone Number ?"}
          </Text>
          <View style={{ flexDirection: 'row', margin: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 20,
                alignItems: 'center'
              }}
            >
              {this.renderCountryPicker()}
              {this.renderCallingCode()}
            </View>
            {!this.state.verifyOTP ? (
              <TextInput
                ref={'textInput'}
                label={'Phone Number'}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={this.state.phoneNumber}
                placeholder={'Phone Number'}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                style={styles.textInput}
                returnKeyType={'next'}
                autoFocus
                placeholderTextColor={Theme.primary}
                selectionColor={Theme.primary}
                maxLength={20}
                onSubmitEditing={this.getSubmitAction}
                render={(props: any) => (
                  <TextInputMask
                    {...props}
                    onChangeText={(formatted: any, extracted: any) => {
                      this.setState({ phoneNumber: extracted });
                    }}
                    mask={'[000] [000] [0000]'}
                  />
                )}
              />
            ) : (
              <TextInput
                ref={'textInput'}
                label={'Code'}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={false}
                // onChangeText={this.onChageText}
                value={this.state.otp}
                placeholder={'OTP'}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                style={styles.otptextInput}
                returnKeyType={'go'}
                autoFocus
                placeholderTextColor={Theme.primary}
                selectionColor={Theme.blue}
                maxLength={12}
                onSubmitEditing={this.getSubmitAction}
                render={(props: any) => (
                  <TextInputMask
                    {...props}
                    onChangeText={(formatted: any, extracted: any) => {
                      this.setState({ otp: extracted });
                      if (extracted.length === 6) {
                        this.verifyCode();
                      }
                    }}
                    mask={'[000] - [000]'}
                  />
                )}
              />
            )}
          </View>
          {this.renderFooter()}
        </View>
        <TouchableOpacityButton style={styles.button} onPress={this.getSubmitAction}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacityButton>
        <Portal>
          <Modal visible={this.state.spinner}>
            <VerifyPhoneAnimated color={Theme.green} />
          </Modal>
        </Portal>
        <DropdownAlert {...DropDownAlertStyles} ref={(ref: any) => (this.dropDownNotification = ref)} />
      </View>
    );
  }
}

export default PhoneAuthScreen;

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: { flex: 1, backgroundColor: Theme.background },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: Theme.textDark,
    ...FontWeights.light
  },
  form: { flex: 1, margin: 20 },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: Theme.primary,
    ...FontWeights.light
  },
  otptextInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 42,
    textAlign: 'center',
    color: Theme.primary,
    ...FontWeights.regular
  },
  button: {
    position: 'absolute',
    bottom: 0,
    // right: 0,
    height: 45,
    width: '100%',
    // borderRadius: 50,
    backgroundColor: Theme.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Theme.background,
    fontSize: 16,
    ...FontWeights.light
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center',
    color: Theme.textDark,
    ...FontWeights.light
  },
  disclaimerText: {
    // marginTop: 30,
    fontSize: 12,
    color: Theme.text
    // ...FontWeights.light
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: Theme.primary,
    paddingHorizontal: 10,
    ...FontWeights.light
  }
});