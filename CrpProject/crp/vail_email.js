import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ToastAndroid,
    Button,
    AsyncStorage,
    StatusBar
} from 'react-native';
import PublicTitle from './public_title.js'
var VALIDATE_URL = 'http://drmlum.rdgchina.com/drmapp/mail/validate';
var BINDEMAIL_URL = 'http://drmlum.rdgchina.com/drmapp/mail/bind';
import StringUtil from './StringUtil';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
import DeviceStorage from './deviceStorage';
import Global from './global';
var BACK_ICON = require('./images/tabs/nav_return.png');
var time_count = 60;
import STTabbar from './STTabbar'
import ResetActivity from './reset_pass'
export default class VailEmainActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            vali_code: '',
            vali_txt: '获取验证码',
            init_color: true,
            UserInfos: {}

        }

    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    componentDidMount() {

        this.getUserInfo();



    }
    /**
     * 获取验证码
     */
    _getValiCode() {
        var emailTxt = this.state.email;
        if (!StringUtil.isNotEmpty(emailTxt)) {

            ToastAndroid.show('请输入您的邮箱', ToastAndroid.SHORT);
            return;
        }
        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('email=' + emailTxt);
        let params = StringBufferUtils.toString();
        this.getVailCodeData(params);
    }
    /**
     * 获取验证码
     * @param {*} param 
     */
    getVailCodeData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(VALIDATE_URL, param, '', function (set) {

            //下面的就是请求来的数据
            var json = JSON.stringify(set.result);
            if (null != set && null != set.return_code && set.return_code == '0') {
                that._countTime();
                that.setState({

                    show: false

                })
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
                that.setState({
                    show: false
                });

            }

        })

    }
    /**
     * 计时开始
     */
    _countTime() {

        var that = this;
        if (this.state.init_color) {

            if (time_count == 60) {

                this.timer = setInterval(
                    () => {
                        time_count--;
                        if (time_count <= 0) {
                            time_count = 60;
                            that.setState({

                                vali_txt: '获取验证码',
                                init_color: true


                            })
                            that.timer && clearInterval(that.timer);


                        } else {
                            that.setState({

                                vali_txt: time_count + 's后重发',
                                init_color: false

                            })
                        }

                    },
                    1000
                );
            }
        }
    }


    _nextBtn() {
        this.props.navigator.popToTop({
        })
    }
    _finishBtn() {
        var emailTxt = this.state.email;
        var vali_code = this.state.vali_code;
        var ok_pass = this.state.okPassWord;
        if (!StringUtil.isNotEmpty(emailTxt)) {

            ToastAndroid.show('请输入您的邮箱', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(vali_code)) {

            ToastAndroid.show('请输入验证码', ToastAndroid.SHORT);
            return;
        }
        this.setState({

            show: true

        })
        var userEntity = this.state.UserInfos;
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + userEntity.userid);
        StringBufferUtils.append('&&email=' + emailTxt);
        StringBufferUtils.append('&&valicode=' + vali_code);
        StringBufferUtils.append('&&type=' + '1');
        let params = StringBufferUtils.toString();
        this.fetchData(params);


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
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(BINDEMAIL_URL, param, '', function (set) {

            //下面的就是请求来的数据
            var json = JSON.stringify(set.result);
            if (null != set && null != set.return_code && set.return_code == '0') {
                that.props.navigator.push({
                    component: ResetActivity,
                    params: {
                        email: that.state.email
                    }
                })
                that.setState({

                    show: false

                })
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
                that.setState({
                    show: false
                });

            }

        })

    }
    render() {

        return (

            <View style={styles.page}>
                <PublicTitle text='验证邮箱' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#f6f6f6'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', backgroundColor: '#ffffff' }} >

                    <TextInput
                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10 }}
                        placeholder='请输入您的邮箱' placeholderTextColor='#999999'
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                    />
                    <Text style={this.state.init_color == true ? ({ position: 'absolute', justifyContent: 'flex-end', backgroundColor: '#9fa8b6', textAlign: 'center', padding: 3, marginLeft: 268, width: 80 }) : ({ width: 80, position: 'absolute', justifyContent: 'flex-end', backgroundColor: '#dddddd', textAlign: 'center', padding: 3, marginLeft: 268 })} onPress={() =>
                        this._getValiCode()}>{this.state.vali_txt}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }} >

                    <TextInput
                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10 }}
                        placeholder='验证码' placeholderTextColor='#999999'
                        onChangeText={(vali_code) => this.setState({ vali_code })}
                        value={this.state.vali_code}
                    />
                </View>

                <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>


                    <Button title={'下一步'} color="#028CE5" onPress={() => this._finishBtn()}
                        style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40 }} />
                </View>
            </View>


        );

    }


}
const styles = StyleSheet.create({

    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'

    }, top_layout: {
        height: 50,
        backgroundColor: '#028CE5',
        flexDirection: 'row',
        alignItems: 'center'


    },
    left_icon: {
        width: 28,
        height: 28,
        marginLeft: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 30,
    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 14,
        color: '#000000',
        marginTop: 5
    }, rule_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 12,
        color: '#999999',
        marginTop: 2
    },
});
