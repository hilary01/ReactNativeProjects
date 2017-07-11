import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
    Animated,
    ScrollView,
    BackHandler,
    ToastAndroid,
    DeviceEventEmitter,
    Platform
} from 'react-native';

import PublicTitle from './public_title'
import AdverScreen from './home_screen'
var SEARCH_ICON = require('./images/tabs/icon_search.png');
import SearchActivity from './search'
var nav;
import Global from './global';
var lastBackTime = "";//记录点击返回键的时间 
export default class HomeActivity extends Component {
    // 构造
    constructor(props) {
        super(props);
        nav = this.props.navigator;
        this.state = {

        }

    }
    searchOnlcik() {
        nav.push({
            component: SearchActivity,
            params: {
            }
        })

    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', () => { });
        }
    }
    componentDidMount() {


    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (nav) {
                let routes = nav.getCurrentRoutes();
                let lastRoute = routes[routes.length - 1]; // 当前页面对应的route对象  
                if (lastRoute.onHardwareBackPress) {// 先执行route注册的事件  
                    let flag = lastRoute.onHardwareBackPress();
                    if (flag === false) {// 返回值为false就终止后续操作  
                        return true;
                    }
                }
                if (routes.length === 1) {// 在第一页了,2秒之内点击两次返回键，退出应用  

                    if ((lastBackTime + 2000) >= Date.now()) {

                        Global.isLogin = false;
                        Global.userName = undefined;
                        Global.userIcon = undefined;
                        BackHandler.exitApp();
                        return false;
                    }
                    // 此处可以根据情况实现 点2次就退出应用，或者弹出rn视图等  
                    //记录点击返回键的时间  
                    lastBackTime = Date.now();
                    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);


                } else {
                    nav.pop();
                }
            }
            return true;
        });
    }
    render() {

        return (
            <View style={styles.page}>
                <PublicTitle text='版权登记' _searchOnlcik={this.searchOnlcik.bind(this)} icon={SEARCH_ICON} />
                <ScrollView>

                    <View >
                        {/*广告栏*/}

                        <AdverScreen navigator={this.props.navigator} />



                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }, page: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    container: {   //根View样式
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    news_rule_view: {
        flexDirection: 'row',
        height: 40,
    }
    ,
    rule_left: {

        width: 120,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rule_left_img: {

        height: 20,
        width: 20,
        marginLeft: 5


    },
    rule_left_txt: {

        color: '#000000',
        fontSize: 15,
        marginLeft: 5,
    },
    rule_right: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }, rule_right_txt: {

        color: '#7f919f',
        fontSize: 14,

    },
    rule_right_img: {

        height: 16,
        width: 16,
        marginRight: 5


    },
});