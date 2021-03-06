import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import LoadingAnimated from '../../components/loaders/Activity';
import { NavigationType } from '../../types';
import { RootContext } from '../../context';

interface Props {
  navigation: NavigationType;
  isLoggedIn: boolean;
}

const AuthLoadingScreen: React.FC<Props> = (props: Props) => {
  const { state } = useContext(RootContext);
  useEffect(() => {
    props.navigation.navigate(props.isLoggedIn ? 'App' : 'Auth', {});
  }, [props.isLoggedIn, state.network]);
  return <LoadingAnimated />;
};
const mapStateToProps = (state: { isLoggedIn: boolean }) => ({
  isLoggedIn: state.isLoggedIn
});
export default connect(mapStateToProps)(AuthLoadingScreen);
