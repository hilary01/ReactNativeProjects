'use strict';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import STNav from './crp/STNavigation'

class ReactNativeDemo extends Component {


    render() {
        return (

            <STNav />
        )



    }
}

AppRegistry.registerComponent('CrpProject', () => ReactNativeDemo);