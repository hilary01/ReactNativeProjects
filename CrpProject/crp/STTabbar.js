/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View, StyleSheet, Image, Animated, Text,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
const HOME = '首页';
const HOME_NORMAL = require('./images/tabs/tab_home_n.png');
const HOME_FOCUS = require('./images/tabs/tab_home_h.png');
const APPLY = '申请';
const APPLY_NORMAL = require('./images/tabs/tab_apply_n.png');
const APPLY_FOCUS = require('./images/tabs/tab_apply_h.png');
const PERSONAL = '我的';
const PERSONAL_NORMAL = require('./images/tabs/tab_my_n.png');
const PERSONAL_FOCUS = require('./images/tabs/tab_my_h.png');
import HomePage from './home';

import MessageComponent from './message';
import ContactComponent from './contact';

 export default class STTabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: HOME,
            anim: new Animated.Value(0),
            startAngle: '0deg',
            endAngle: '45deg',
            isshow: false

        };
    }
    render() {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === HOME}
                    title={HOME}
                    titleStyle={styles.tabText}
                    selectedTitleStyle={styles.selectedTabText}
                    renderIcon={() => <Image style={styles.icon} source={HOME_NORMAL} />}
                    renderSelectedIcon={() => <Image style={styles.icon} source={HOME_FOCUS} />}
                    onPress={() => this.setState({ selectedTab: HOME })}>
                    <HomePage {...this.props} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '申请'}
                    title=' '
                    titleStyle={styles.applydTabText}
                    selectedTitleStyle={styles.applydTabText}
                    renderIcon={() =>
                        <Animated.Image source={APPLY_NORMAL} style={[styles.apply_icon, {
                            transform: [
                                {

                                    rotate: this.state.anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [
                                            this.state.startAngle, this.state.endAngle
                                        ],
                                    })
                                },
                            ]
                        }
                        ]}>
                        </Animated.Image>}
                    onPress={() => {
                        if (this.state.isshow) {
                            this.setState({
                                startAngle: '0deg',
                                endAngle: '45deg',
                                isshow: false,
                                selectedTab: '申请'
                            });

                        } else {
                            this.setState({
                                startAngle: '45deg',
                                endAngle: '0deg',
                                isshow: true,
                                selectedTab: '申请'
                            });

                        }

                        Animated.spring(
                            this.state.anim,
                            {
                                toValue: 0,
                                friction: 0,
                            }
                        ).start();


                    }}>

                    <MessageComponent {...this.props} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === PERSONAL}
                    title={PERSONAL}
                    titleStyle={styles.tabText}
                    selectedTitleStyle={styles.selectedTabText}
                    renderIcon={() => <Image style={styles.icon} source={PERSONAL_NORMAL} />}
                    renderSelectedIcon={() => <Image style={styles.icon} source={PERSONAL_FOCUS} />}
                    onPress={() => this.setState({ selectedTab: PERSONAL })}>
                    <ContactComponent {...this.props} />
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}


const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    },
    tabText: {
        color: '#929292',
        fontSize:12
        
    },selectedTabText: {
        color: '#028ce6',
        fontSize:12
    },apply_icon: {
        width: 30,
        height: 30,
    },
    applydTabText: {
        color: '#929292',
        fontSize:0
    }
});