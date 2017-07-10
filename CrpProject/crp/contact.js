import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    TouchableNativeFeedback
} from 'react-native';

var ITEM_HEIGHT = 100;
import PublicTitle from './public_title.js'
const TOP_IMAGE = require('./images/tabs/bg_my.png');
const DEFAULT_ICON = require('./images/tabs/icon_head.png');
const COPYRIGHT_ICON = require('./images/tabs/icon_copyright.png');
const CER_ICON = require('./images/tabs/icon_cerfity.png');
const SETTING_ICON = require('./images/tabs/icon_setup.png');
const ICON_MORE = require('./images/tabs/icon_more.png');
import LoginActivity from './login'
import Global from './global'
import MyCopyright from './mycopyright'
export default class MyContact extends Component {

    // 构造
    constructor(props) {
        super(props);

    }
    _onclickBtn(flag) {

        switch (flag) {
            case '1':
                if (this.checkLogin()) {

                    this.props.navigator.push({
                        component: MyCopyright,
                        params: {
                        }
                    })
                } else {
                    this.props.navigator.push({
                        component: LoginActivity,
                        params: {
                        }

                    })
                }
                break;
            case '2':
                break;

        }
    }

    checkLogin() {
        var is_login = false;
        if (Global.isLogin) {

            is_login = true;

        } else {
            is_login = false;

        }



    }
    fillName() {
        if (Global.isLogin) {

            return <Text style={{ fontSize: 15, color: '#ffffff' }}>{Global.userName}</Text>

        } else {
            return <Text style={{ fontSize: 15, color: '#ffffff' }}>登录/注册</Text>

        }


    }

    render() {

        return (
            <View style={styles.page}>
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#0187D0'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <View style={styles.top_view}>


                    <Image style={styles.top_img} source={TOP_IMAGE}>

                        <View style={styles.header_view}>
                            <Image style={styles.head_icon} source={DEFAULT_ICON} />

                            {this.fillName()}


                        </View>



                    </Image>


                </View>

                {/*我的版权*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 10, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('1')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Image source={COPYRIGHT_ICON} style={{ width: 20, height: 19 }} />
                                <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>我的版权</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                {/*证书管理*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 1, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Image source={CER_ICON} style={{ width: 20, height: 19 }} />
                                <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>证书管理</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                {/*设置*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 10, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Image source={SETTING_ICON} style={{ width: 20, height: 19 }} />
                                <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>设置</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    top_view: {   //根View样式
        justifyContent: 'center',
        alignItems: 'center',
        height: 260
    }, top_img: {

        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',


    }
    , header_view: {

        height: 120,
        alignItems: 'center',
        justifyContent: 'center',


    }
    , head_icon: {

        height: 74,
        width: 74,


    }
});