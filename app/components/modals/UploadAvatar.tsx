import React, { Component } from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { uploadImage } from '../../utils/profile/uploadPhoto';
import { Theme, Layout } from '../../theme';
import { Avatar, Modal, Portal, Button, Text } from 'react-native-paper';
interface Props {
  getImage: (uploadResponse: any) => void;
}
interface State {
  image: any;
  uploading: boolean;
  visible: boolean;
}
export default class UploadAvatar extends Component<Props, State> {
  state = {
    image: '',
    uploading: false,
    visible: false
  };

  maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, localstyles.maybeRenderUploading]}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return <View />;
  };

  share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image
    });
  };

  copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    Alert.alert('Copied image URL to clipboard');
  };

  takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      this.handleImagePicked(pickerResult);
    }
  };

  pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      this.handleImagePicked(pickerResult);
    }
  };

  handleImagePicked = async (pickerResult: any) => {
    const { getImage } = this.props;
    // log(getImage);
    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        const uploadResponse = uploadImage(pickerResult.uri);
        // uploadResult = await uploadResponse.json();
        await this.setState({
          image: uploadResponse
        });
        getImage(uploadResponse);
      }
    } catch (err) {
      Alert.alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  render() {
    const { image } = this.state;
    return (
      <View style={[{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }]}>
        {image !== '' ? (
          <ImageBackground
            style={{
              width: 400,
              height: 600,
              alignSelf: 'center'
            }}
            source={{ uri: image }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              const { visible } = this.state;
              this.setState({ visible: !visible });
            }}
          >
            <Avatar.Icon style={{ alignSelf: 'center', backgroundColor: '#ccc' }} icon="photo-camera" size={60} />
          </TouchableOpacity>
        )}
        {image !== '' ? (
          <Button
            loading={this.state.uploading}
            onPress={() => {
              this.setState({
                image: '',
                uploading: false,
                visible: false
              });
            }}
          >
            Clear
          </Button>
        ) : (
          <Portal>
            <Modal
              visible={this.state.visible}
              // contentContainerStyle={[
              //   localstyles.container,
              //   {
              //     position: 'absolute',
              //     bottom: 0,
              //     maxHeight: 200,
              //     height: 200,
              //     width: '100%',
              //     flexDirection: 'row',
              //     justifyContent: 'space-around',
              //     alignItems: 'center',
              //     backgroundColor: Theme.surface
              //   }
              // ]}
              onDismiss={() => {
                const { visible } = this.state;
                this.setState({ visible: !visible });
              }}
            >
              {this.state.uploading && (
                <View style={[StyleSheet.absoluteFill, localstyles.maybeRenderUploading]}>
                  <ActivityIndicator size="large" />
                </View>
              )}
              <TouchableOpacity
                onPress={image ? this.copyToClipboard : this.takePhoto}
                style={localstyles.maybeRenderImageText}
              >
                <Avatar.Icon style={{ alignSelf: 'center', backgroundColor: '#ccc' }} icon="add-a-photo" size={60} />

                <Text
                  style={{
                    paddingTop: 10,
                    color: Theme.infoText
                  }}
                >
                  Take from Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={image ? this.share : this.pickImage} style={localstyles.maybeRenderImageText}>
                <Avatar.Icon style={{ alignSelf: 'center', backgroundColor: '#ccc' }} icon="file-upload" size={60} />

                <Text
                  style={{
                    paddingTop: 10,
                    color: Theme.infoText
                  }}
                >
                  Add from Files
                </Text>
              </TouchableOpacity>
            </Modal>
          </Portal>
        )}
      </View>
    );
  }
}

const localstyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headText: {
    color: Theme.darkText,
    fontSize: 14
  },
  headingContainer: {
    backgroundColor: Theme.statusbar,
    borderColor: Theme.statusbar
  },
  maybeRenderContainer: {
    justifyContent: 'center'
  },
  maybeRenderImage: {
    height: Layout.window.width,
    maxHeight: '100%',
    maxWidth: '100%',
    width: Layout.window.width
  },
  maybeRenderImageContainer: {},
  maybeRenderImageText: {},
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: Theme.statusbar,
    justifyContent: 'center'
  },
  monoText: {
    color: Theme.infoText,
    fontFamily: 'space-mono',
    fontSize: 17,
    textAlign: 'center'
  },
  touchableButton: {
    alignItems: 'center',
    backgroundColor: Theme.statusbar,
    justifyContent: 'center',
    padding: 10
  }
});
