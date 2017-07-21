import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    TouchableNativeFeedback,
    AsyncStorage,
    Alert
} from 'react-native';

var ITEM_HEIGHT = 100;
const TOP_IMAGE = require('./images/tabs/bg_my.png');
const ICON_MORE = require('./images/tabs/icon_more.png');
import Global from './global';
import StringUtil from './StringUtil';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
import PublicTitle from './public_title';
var BACK_ICON = require('./images/tabs/nav_return.png');
import EditPassActivity from './update_pass';
import LoginActivity from './login';
import WebviewDetail from './contact_our'
export default class SetActivity extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            loginState: '退出登录',
            cashSize: '0'

        }

    }
    componentDidMount() {
        var login = this.checkLogin() == true ? '退出登录' : '登录';
        var cash = (Math.random() * 10).toFixed(2);;

        this.setState({
            loginState: login,
            cashSize: cash

        })

    }

    _onclickBtn(flag) {

        switch (flag) {
            case '1'://修改密码
                this.gotoActivity(EditPassActivity);
                break;
            case '2'://清理缓存
                break;
            case '3'://已经反馈
                break;
            case '4'://联系我们
                this.props.navigator.push({
                    component: WebviewDetail,
                    params: {
                        title: '联系我们',
                    }
                })
                break;
            case '5'://退出登录
                this.loginOut();
                break;

        }
    }
    // 退出登录
    loginOut() {
        var that = this;

        if (this.checkLogin()) {
            Global.isLogin = false;
            Global.userIcon = '';
            that.props.navigator.popToTop({
            })

        } else {
            that.props.navigator.push({
                component: LoginActivity,
                params: {
                }

            })

        }
        var login = this.checkLogin() == true ? '退出登录' : '登录';
        this.setState({
            loginState: login

        })


    }
    gotoActivity(Activity) {
        var that = this;
        // if (this.checkLogin()) {

        // } else {
        //     that.props.navigator.push({
        //         component: LoginActivity,
        //         params: {
        //         }

        //     })
        // }
        that.props.navigator.push({
            component: Activity,
            params: {

            }
        })

    }

    //跳往完善信息
    completBtn() {
        this.props.navigator.push({
            component: CompletActivity,
            params: {
                userType: Global.UserInfos.usertype
            }
        })

    }

    cancleBtn() {

    }
    /**
     * 是否登录
     */
    checkLogin() {
        var is_login = false;
        if (Global.isLogin) {

            is_login = true;

        } else {
            is_login = false;

        }
        return is_login;
    }


    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

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
                <PublicTitle text='设置' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />

                {/*修改密码*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 10, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('1')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10 }}>修改密码</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                {/*清理缓存*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 10, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('2')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10 }}>清理缓存</Text>

                            </View>
                            <Text>{this.state.cashSize}M</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 20, marginRight: 20 }}></View>
                {/*已经反馈*/}
                <View style={{ flexDirection: 'row', height: 48, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('3')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10, }}>意见反馈</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 20, marginRight: 20 }}></View>
                {/*联系我们*/}
                <View style={{ flexDirection: 'row', height: 48, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('4')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10, }}>联系我们</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 20, marginRight: 20 }}></View>
                {/*退出登录*/}
                <View style={{ flexDirection: 'row', height: 48, backgroundColor: '#ffffff', alignItems: 'center', marginTop: 10 }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('5')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                            <View style={{ flexDirection: 'row', justifyContent: 'center', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10, }}>{this.state.loginState}</Text>

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


        alignItems: 'center',
        justifyContent: 'center',


    }
    , head_icon: {

        height: 74,
        width: 74,
        borderRadius: 120,
        resizeMode: 'contain'



    }, comBtnBtnView: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1 / 2,
        borderColor: '#f0f0f0',
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 5,
        marginBottom: 5,
        width: 100
    },
});