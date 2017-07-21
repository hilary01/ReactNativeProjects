import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView,
  Dimensions,
  Platform,
  BackHandler
} from 'react-native';

const { width, height } = Dimensions.get('window');
var BACK_ICON = require('./images/tabs/nav_return.png');
import PublicTitle from './public_title';
var nav;
export default class ContactOurActivity extends Component {

  constructor(props) {
    super(props);
    nav = this.props.navigator;
    this.state = {

      title: '',

    }
  }

  backOnclick() {

    nav.pop(
      {

      }
    );

  }
  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', function () {
    // });
  }

  componentDidMount() {

    // BackHandler.addEventListener('hardwareBackPress', function () {
    //   if (nav) {
    //     nav.pop();
    //     return true;

    //   } else {
    //     return false;
    //   }
    // });
    this.setState({

      title: this.props.title,

    })
  }
  render() {
    return (
      <View style={styles.container}>
        <PublicTitle text={this.state.title} _backOnclick={this.backOnclick.bind(this)} left_icon={BACK_ICON} />
        <WebView
          style={{ width: width, height: height - 20 }}
          source={{ uri: 'file:///android_asset/contact.html' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    backgroundColor: '#f2f2f2',
  },
});
