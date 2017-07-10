import React, { Component } from 'react';
import {
    TextInput,
    Text,
    View,
    Button,
    ToastAndroid,
    StyleSheet,
    Image,
    TouchableNativeFeedback,
    StatusBar
} from 'react-native';
const USER_ICON = require('./images/tabs/user_icon.png');
const PASSWORD_ICON = require('./images/tabs/icon_pass.png');
const SHOWPASS_ICON = require('./images/tabs/icon_show.png');
const APP_ICON = require('./images/tabs/icon_logo.png');
const CLOSE_ICON = require('./images/tabs/icon_closes.png');
var LOGIN_URL = 'http://drmlum.rdgchina.com/drmapp/person/login';
import StringUtil from './StringUtil';
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
export default class LoginInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '安卓线上123',
            password: '123456',
            show: false
        }

    }

    /**
     * 登录操作
     * @param {*用户名} username 
     * @param {*用户密码} password 
     */
    _submitLogin() {
        var user_name = this.state.userName;
        var pass_word = this.state.password;
        if (!StringUtil.isNotEmpty(user_name)) {

            ToastAndroid.show('请输入用户名');
            return;
        }
        if (!StringUtil.isNotEmpty(pass_word) || pass_word.length < 6) {

            ToastAndroid.show('请输入6-12位密码');
            return;
        }
        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + user_name);
        StringBufferUtils.append('&&password=' + pass_word);
        let params = StringBufferUtils.toString();
        this.fetchData(params);

    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(LOGIN_URL, param, '', function (set) {

            //下面的就是请求来的数据
            // var json = JSON.stringify(set);
            // alert(json);
            if (null != set && null != set.return_code && set.return_code == '0') {
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
    _pressButton() {
        this.props.navigator.pop(
            {

            }
        );
    }
    //显示密码
    _showPassBtn() {

        alert('显示密码');
    }
    //忘记密码
    _forgetPassWordBtn() {

        alert('忘记密码');
    }
    //关闭
    _closeBtn() {

        this.props.navigator.pop(
            {

            }
        );
    }


    render() {
        return (
            <View style={styles.page}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#f6f6f6'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <TouchableNativeFeedback onPress={this._closeBtn.bind(this)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10, paddingTop: 10 }}>
                            <Image style={{ width: 28, height: 28 }} source={CLOSE_ICON}></Image>

                        </View>
                    </TouchableNativeFeedback>
                    <View style={{ marginTop: 80, flexDirection: 'column', alignItems: 'center' }}>
                        <Image style={{ width: 60, height: 60 }} source={APP_ICON} />
                        <Text style={{ fontSize: 16, color: '#000000' }}>版权登记</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20, height: 40, marginRight: 20, alignItems: 'center' }} testId={'user'}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#f6f6f6', marginLeft: 20, paddingLeft: 35 }}
                            placeholder='用户名' placeholderTextColor='#999999'
                            onChangeText={(userName) => this.setState({ userName })}
                            value={this.state.userName}
                        />

                        <Image style={{ width: 16, height: 16, marginLeft: 30, position: 'absolute' }} source={USER_ICON} />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginRight: 20, alignItems: 'center' }}
                        testId={'pass'}>
                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#f6f6f6', marginLeft: 20, paddingLeft: 35 }}
                            placeholder='密码' placeholderTextColor='#999999' secureTextEntry={true} maxLength={12}
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                        />
                        <Image style={{ width: 16, height: 16, marginLeft: 30, position: 'absolute' }} source={PASSWORD_ICON} />
                        <TouchableNativeFeedback onPress={() => this._showPassBtn()}>
                            <View style={{ width: 25, height: 25, flexDirection: 'row', justifyContent: 'center', position: 'absolute', marginLeft: 310, alignItems: 'center' }}>

                                <Image style={{ width: 16, height: 16 }} source={SHOWPASS_ICON} />

                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <Text style={{ fontSize: 15, color: '#999999', marginTop: 5, textAlign: 'right', paddingRight: 20 }} onPress={this._forgetPassWordBtn.bind(this)} >忘记密码</Text>

                    <View style={{ marginTop: 30, marginLeft: 20, marginRight: 20 }}>


                        <Button title={'登录'} color="#028CE5" onPress={() => this._submitLogin()}
                            style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40 }} />

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

    },
});

