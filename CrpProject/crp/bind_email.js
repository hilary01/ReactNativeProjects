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
var VALIEMAIL_URL = 'http://drmlum.rdgchina.com/drmapp/mail/send';
import StringUtil from './StringUtil';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
import DeviceStorage from './deviceStorage';
var BACK_ICON = require('./images/tabs/nav_return.png');
var time_count = 60;
import STTabbar from './STTabbar';
import CompletActivity from './complet_info';
import Global from './global';
export default class BindEmailActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            vali_code: '',
            vali_txt: '获取验证码',
            init_color: true

        }

    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    /**
     * 检查邮箱
     */
    _getCheckEmail() {
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
        this.getcheckData(params);
    }
    /**
     *检查邮箱是否可用
     * @param {*} param 
     */
    getcheckData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(VALIDATE_URL, param, '', function (set) {

            //下面的就是请求来的数据
            var json = JSON.stringify(set.result);
            if (null != set && null != set.return_code && set.return_code == '0') {
                that._getValiCode();

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
        var valiCode = this.state.vali_code;
        if (!StringUtil.isNotEmpty(emailTxt)) {

            ToastAndroid.show('请输入您的邮箱', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(valiCode)) {

            ToastAndroid.show('请输入验证码', ToastAndroid.SHORT);
            return;
        }
        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + Global.userId);
        StringBufferUtils.append('&&email=' + emailTxt);
        StringBufferUtils.append('&&valicode=' + valiCode);
        StringBufferUtils.append('&&type=' + '0');

        let params = StringBufferUtils.toString();
        this.fetchData(params);


    }
    _getValiCode() {
        var emailTxt = this.state.email;
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + Global.userId);
        StringBufferUtils.append('&&email=' + emailTxt);
        let params = StringBufferUtils.toString();
        this.getValiCodeData(params);


    }

    /**
    *检查邮箱是否可用
    * @param {*} param 
    */
    getValiCodeData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(VALIEMAIL_URL, param, '', function (set) {

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
    //保存用户信息
    saveUserInfoData(value) {
        AsyncStorage.removeItem('user_info_key');
        AsyncStorage.setItem(
            'user_info_key',
            value,
            (error) => {
                if (error) {
                    alert('存值失败:', error);
                } else {

                }
            }
        );
    }
    getUserInfo() {

        var that = this;
        AsyncStorage.getItem(
            'user_info_key',
            (error, result) => {
                if (error) {
                    alert('取值失败:' + error);
                } else {
                    const jsonValue = JSON.parse(result);
                    if (null != jsonValue) {
                        jsonValue.isapproved = '1';
                        var json = JSON.stringify(jsonValue);
                        this.saveUserInfoData(json);
                        that.props.navigator.push({
                            component: CompletActivity,
                            params: {
                                userType: jsonValue.usertype
                            }
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
                that.getUserInfo();
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
                <PublicTitle text='绑定邮箱' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
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
                        this._getCheckEmail()}>{this.state.vali_txt}</Text>
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


                    <Button title={'完成'} color="#028CE5" onPress={() => this._finishBtn()}
                        style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40 }} />
                    <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

                        <Text style={{ fontSize: 14, color: '#666666', textAlign: 'center' }}
                            onPress={this._nextBtn.bind(this)} >下次再说</Text>
                    </View>
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
