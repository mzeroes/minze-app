import React, { Component } from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';

import DropdownAlert from 'react-native-dropdownalert';
import auth from '@react-native-firebase/auth';

import { FontWeights, Theme, Colors, DropDownAlertStyles, activeOpacity, baseStyle, Layout } from '../../theme';
import { userUpdateAsync } from '../../utils/auth/userUpdateAsync';
import OTPTextView from '../../components/inputs/OTPTextView';
import { Button } from 'react-native-elements';
import { NavigationType } from '../../types';

interface Props {
  navigation: NavigationType;
}

interface State {
  verifyOTP: boolean;
  spinner: boolean;
  resendTimer: number;
  phoneNumber: string;
  firebaseConfirmResult: any;
  otp: string;
}

class OTPScreen extends Component<Props, State> {
  static navigationOptions = {
    label: 'OTPScreen'
  };

  dropDownNotification: any;
  state: State = {
    verifyOTP: false,
    spinner: false,
    phoneNumber: '',
    resendTimer: __DEV__ ? 10 : 60,
    firebaseConfirmResult: null,
    otp: '123456'
  };
  timerHandle: number | undefined;
  componentWillMount() {
    const phoneNumber = this.props.navigation.getParam('phoneNumber');
    this.setState({ phoneNumber });
  }

  unsubscribe: (() => void) | undefined;

  async componentDidMount() {
    try {
      this.getCode();
      const resendTimer = () => {
        const { resendTimer } = this.state;
        resendTimer > 0 ? this.setState({ resendTimer: resendTimer - 1 }) : clearInterval(0);
      };
      // @ts-ignore
      this.timerHandle = setInterval(resendTimer, 1000);
      const authStateChangeHandler = async (user: any) => {
        if (user) {
          this.dropDownNotification.alertWithType('success', 'Verified', 'Your phone number is verified');

          await userUpdateAsync(user);
          this.setState({
            spinner: false
          });
          setTimeout(
            self => {
              self.props.navigation.navigate('Loading');
            },
            800,
            this
          );
        }
      };
      this.unsubscribe = auth().onAuthStateChanged(authStateChangeHandler);
    } catch (err) {
      // console.warn(err);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }

  handleOTPResend = async () => {
    try {
      this.setState({ spinner: true });
      const { phoneNumber } = this.state;
      const firebaseConfirmResult = await auth().signInWithPhoneNumber(phoneNumber);
      this.setState({ firebaseConfirmResult, spinner: false });
      this.dropDownNotification.alertWithType('info', 'OTP Sent', 'OTP sent to your number : ' + phoneNumber);
      this.setState({ resendTimer: __DEV__ ? 10 : 60 });
    } catch (error) {
      this.dropDownNotification.alertWithType(
        'error',
        'handleOTPResend failed',
        'Resending the OTP has failed' + __DEV__ && error
      );
    }
  };

  getCode = async () => {
    const { phoneNumber } = this.state;
    this.setState({ spinner: true });
    try {
      const firebaseConfirmResult = await auth().signInWithPhoneNumber(phoneNumber);
      this.setState({
        firebaseConfirmResult,
        verifyOTP: true,
        spinner: false,
        phoneNumber
      });
      this.dropDownNotification.alertWithType('info', 'OTP Sent', 'OTP sent to your number: ' + phoneNumber);
    } catch (error) {
      this.setState({ spinner: false });
      this.dropDownNotification.alertWithType('error', 'OTP Not Sent', 'Unable to send the OTP');
      console.warn(error);
      setTimeout(this.props.navigation.goBack, 200);
    }
  };

  verifyCode = async () => {
    this.setState({
      spinner: true
    });
    try {
      /**
       * NOTE: onAuthStateChanged should handle update and navigation
       **/
      await this.state.firebaseConfirmResult.confirm(this.state.otp);
    } catch (error) {
      this.dropDownNotification.alertWithType('error', 'Not Verified', 'The OTP you provided is not correct');
      console.warn(error);
      this.setState({
        spinner: false
      });
    }
  };

  tryAgain = () => {
    this.setState({ verifyOTP: false });
  };

  handleSubmit = () => {
    const { otp } = this.state;
    Keyboard.dismiss();
    if (otp.length >= 6) {
      this.verifyCode();
    } else {
      this.dropDownNotification.alertWithType(
        'error',
        'Please Enter a correct OTP',
        'The OTP you provided is not correct'
      );
    }
  };

  renderFooter = () => {
    const { resendTimer } = this.state;

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          marginLeft: 30,
          marginRight: 30
        }}
      >
        <Text style={styles.wrongNumberText}>Wrong number or need a new code?</Text>
        {resendTimer === 0 ? (
          <Button
            onPress={this.handleOTPResend}
            title={'Resend'}
            type={'clear'}
            activeOpacity={activeOpacity}
            containerStyle={{ borderRadius: 0, marginLeft: 20, marginRight: 20 }}
            titleStyle={{ ...baseStyle.heading2, color: Theme.darkText }}
          />
        ) : (
          <Text
            style={{
              ...FontWeights.light,
              color: Theme.darkText,
              fontSize: 16
            }}
          >
            00:{resendTimer} sec
          </Text>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>{'Enter your verification code.'}</Text>
          <OTPTextView
            containerStyle={{ padding: 20, flexWrap: 'wrap' }}
            textInputStyle={{ color: Colors.darkBlack, backgroundColor: Theme.background }}
            handleTextChange={async (value: string) => {
              this.setState({ otp: value });
              if (value.length >= 6) {
                this.verifyCode();
              }
            }}
          />
          <Button
            testID="submitButton_1"
            onPress={this.handleSubmit}
            title={'Submit'}
            type={'solid'}
            loading={this.state.spinner}
            activeOpacity={activeOpacity}
            containerStyle={{ marginTop: Layout.window.height / 6, borderRadius: 0, marginLeft: 20, marginRight: 20 }}
            buttonStyle={{ backgroundColor: Theme.darkText }}
            titleStyle={{ ...baseStyle.heading2, color: Theme.secondary }}
          />
          {this.renderFooter()}
        </View>
        <DropdownAlert {...DropDownAlertStyles} ref={(ref: any) => (this.dropDownNotification = ref)} />
      </View>
    );
  }
}

export default OTPScreen;

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: '100%',
    backgroundColor: Theme.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.white,
    fontSize: 24,
    ...FontWeights.light
  },
  container: { backgroundColor: Theme.background, flex: 1 },
  header: {
    color: Theme.darkText,
    fontSize: 22,
    marginTop: 60,
    margin: 20,
    textAlign: 'center',
    ...FontWeights.light
  },
  otpTextInput: {
    color: Theme.primary,
    flex: 1,
    fontSize: 42,
    margin: 0,
    padding: 0,
    textAlign: 'center',
    ...FontWeights.regular
  },
  wrongNumberText: {
    color: Theme.darkText,
    fontSize: 14,
    margin: 10,
    textAlign: 'center',
    ...FontWeights.light
  }
});
