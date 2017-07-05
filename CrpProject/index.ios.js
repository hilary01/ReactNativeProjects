'use strict';
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import LoginActivity from './crp/login'
import { Navigator } from 'react-native-deprecated-custom-components'


class ReactNativeDemo extends Component {


    render() {
        var defaultName = 'LoginActivity';
        var defaultComponent = LoginActivity;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}
                configureScene={(route) => {
                    return Navigator.SceneConfigs.HorizontalSwipeJump;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator} />
                }}/>
        )

    }

}

AppRegistry.registerComponent('CrpProject', () => ReactNativeDemo);