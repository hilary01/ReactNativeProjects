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
import PublicTitle from './public_title.js'
const TOP_IMAGE = require('./images/tabs/bg_my.png');
const DEFAULT_ICON = require('./images/tabs/icon_head.png');
const COPYRIGHT_ICON = require('./images/tabs/icon_copyright.png');
const CER_ICON = require('./images/tabs/icon_cerfity.png');
const SETTING_ICON = require('./images/tabs/icon_setup.png');
const ICON_MORE = require('./images/tabs/icon_more.png');
import LoginActivity from './login';
import Global from './global';
import MyCopyright from './mycopyright';
import CerManager from './cermanager';
import Consumer from './consumer';
import StringUtil from './StringUtil';
import CommonDialog from 'react-native-dialogs-master';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
import CompletActivity from './complet_info'
import BindEmail from './bind_email'
export default class MyContact extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            UserInfos: {}

        }

    }
    componentDidMount() {

        this.getUserInfo();



    }


    _onclickBtn(flag) {

        switch (flag) {
            case '1'://我的版权
                this.gotoActivity(MyCopyright);
                break;
            case '2'://证书管理
                this.gotoActivity(CerManager);
                break;
            case '3'://个人资料
                this.gotoActivity(Consumer);
                break;

        }
    }
    gotoActivity(Activity) {
        var that = this;
        if (this.checkLogin()) {
            if (that.isBindEmail()) {//绑定邮箱了
                if (that.isComplet()) {//完善信息了
                    that.props.navigator.push({
                        component: Activity,
                        params: {


                        }
                    })

                } else {

                    that.showInfoAlert();//去完善信息
                }

            } else {

                that.showBindEmailAlert();//去绑定邮箱

            }

        } else {
            that.props.navigator.push({
                component: LoginActivity,
                params: {
                }

            })
        }
    }

    //跳往完善信息
    completBtn() {
        this.props.navigator.push({
            component: CompletActivity,
            params: {
                userType: this.state.UserInfos.usertype
            }
        })

    }
    //跳往绑定邮箱
    bindBtn() {
           this.props.navigator.push({
            component: CompletActivity,
            params: {
                userType: this.state.UserInfos.usertype
            }
        })
        // this.props.navigator.push({
        //     component: BindEmail,
        //     params: {
        //     }
        // })

    }

    cancleBtn() {

    }
    /**
   * 完善信息
   */
    showInfoAlert() {
        var options = {
            thide: true, /*不显示头部标题*/
            messText: '您还未完善认证',
            innersWidth: ScreenWidth - 60,
            innersHeight: 140,
            divice: true,
            buttons: [
                {
                    txt: '下次再说',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#929292' },
                    onpress: this.cancleBtn.bind(this),


                },
                {
                    txt: '',
                    btnStyle: { backgroundColor: '#e2e2e2', width: 1, height: 42, marginTop: 0, marginBottom: 0 },
                    onpress: this.cancleBtn.bind(this),

                },
                {
                    txt: '去完善',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#037BFF' },
                    onpress: this.completBtn.bind(this)
                }
            ]
        }
        this.refs.completInfoDialog.show(options)
    }

    /**
     * 绑定邮箱
     */
    showBindEmailAlert() {


        var options = {
            thide: true, /*不显示头部标题*/
            messText: '您还未绑定邮箱',
            innersWidth: ScreenWidth - 60,
            innersHeight: 140,
            divice: true,
            buttons: [
                {
                    txt: '下次再说',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#929292' },
                    onpress: this.cancleBtn.bind(this),


                },
                {
                    txt: '',
                    btnStyle: { backgroundColor: '#e2e2e2', width: 1, height: 42, marginTop: 0, marginBottom: 0 },
                    onpress: this.cancleBtn.bind(this),

                },
                {
                    txt: '去绑定',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#037BFF' },
                    onpress: this.bindBtn.bind(this)
                }
            ]
        }
        this.refs.bindEmailDialog.show(options)
    }
    /**
     * 是否绑定邮箱
     *
     * @return
     */
    isBindEmail() {

        var isBind = false;
        var userEntity = this.state.UserInfos;
        // alert(JSON.stringify(userEntity));
        // alert('isapproved='+userEntity.isapproved);
        if (null != userEntity && StringUtil.isNotEmpty(userEntity.isapproved) && "1" ==
            userEntity.isapproved) {
            isBind = true;
        } else {

            isBind = false;

        }
        return isBind;


    }

    /**
     * 是否完善信息
     *
     * @return
     */
    isComplet() {

        var isComp = false;
        var userEntity = this.state.UserInfos;
        // alert('isdetail=' + userEntity.isdetail);
        if (null != userEntity && StringUtil.isNotEmpty(userEntity.isdetail) && "1" ==
            userEntity.isdetail) {
            isComp = true;
        } else {

            isComp = false;

        }
        return isComp;


    }
    //获取用户信息
    getUserInfo() {

        AsyncStorage.getItem(
            'user_info_key',
            (error, result) => {
                if (error) {
                    alert('取值失败:' + error);
                } else {
                    const jsonValue = JSON.parse(result);
                    if (null != jsonValue) {
                        this.setState({

                            UserInfos: jsonValue

                        })
                    }

                }
            }
        )

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
                        <TouchableNativeFeedback onPress={() => this._onclickBtn('3')}>
                            <View style={styles.header_view}>
                                <Image style={styles.head_icon} source={(typeof Global.userIcon == 'undefined') ? (DEFAULT_ICON) : { uri: Global.userIcon }} />
                                <Text style={{ fontSize: 14, color: '#ffffff' }}>{((Global.isLogin == false) || (typeof Global.isLogin == 'undefined')) ? ('登录 / 注册') : Global.userName}</Text>

                            </View>

                        </TouchableNativeFeedback>

                    </Image>


                </View>

                {/*我的版权*/}
                <View style={{ flexDirection: 'row', height: 48, marginTop: 10, backgroundColor: '#ffffff', alignItems: 'center' }}>

                    <TouchableNativeFeedback onPress={() => this._onclickBtn('1')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 160, alignItems: 'center', marginLeft: 10, flex: 1, height: 48 }}>

                                <Image source={COPYRIGHT_ICON} style={{ width: 20, height: 19 }} />
                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10 }}>我的版权</Text>

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
                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10 }}>证书管理</Text>

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
                                <Text style={{ fontSize: 12, color: '#000000', marginLeft: 10, }}>设置</Text>

                            </View>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <CommonDialog ref="completInfoDialog" />
                <CommonDialog ref="bindEmailDialog" />
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
        borderRadius: 50


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