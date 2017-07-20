import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ToastAndroid,
    Button,
    AsyncStorage
} from 'react-native';
import PublicTitle from './public_title.js'
var REGIST_URL = 'http://drmlum.rdgchina.com/drmapp/person/register';
import StringUtil from './StringUtil';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
import DeviceStorage from './deviceStorage';
import Global from './global';
var BACK_ICON = require('./images/tabs/nav_return.png');
import BindEmail from './bind_email'
export default class ApplyActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            passWord: '',
            okPassWord: ''

        }

    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }

    _registdBtn() {
        var user_name = this.state.userName;
        var pass_word = this.state.passWord;
        var ok_pass = this.state.okPassWord;
        if (!StringUtil.isNotEmpty(user_name)) {

            ToastAndroid.show('请输入用户名', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(pass_word) || pass_word.length < 5) {

            ToastAndroid.show('请输入6-12位密码', ToastAndroid.SHORT);
            return;
        }
        if (pass_word != ok_pass) {

            ToastAndroid.show('两次输入密码不一致', ToastAndroid.SHORT);
            return;
        }
        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + user_name);
        StringBufferUtils.append('&&password=' + pass_word);
        StringBufferUtils.append('&&conpassword=' + ok_pass);
        let params = StringBufferUtils.toString();
        this.fetchData(params);


    }
    //保存用户信息
    saveUserNameData(value) {
        var json = JSON.stringify(value);

        AsyncStorage.removeItem('user_name_key');
        AsyncStorage.setItem(
            'user_name_key',
            json,
            (error) => {
                if (error) {
                    alert('存值失败:', error);
                } else {
                }
            }
        );
    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(REGIST_URL, param, '', function (set) {

            //下面的就是请求来的数据
            if (null != set && null != set.return_code && set.return_code == '0') {
                var userEntity = new Object();
                userEntity.userName = that.state.userName;
                userEntity.passWord = that.state.passWord;
                userEntity.userId = set.result.userid;
                Global.userName = that.state.userName;
                Global.passWord = that.state.passWord;
                Global.userId = set.result.userid;
                that.saveUserNameData(userEntity);
                that.setState({

                    show: false

                })
                that.props.navigator.push({
                    component: BindEmail,
                    params: {
                    }
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
                <PublicTitle text='注册' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', backgroundColor: '#ffffff' }} >

                    <TextInput
                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10 }}
                        placeholder='用户名' placeholderTextColor='#999999' maxLength={21}
                        onChangeText={(userName) => this.setState({ userName })}
                        value={this.state.userName}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }} >

                    <TextInput
                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10 }}
                        placeholder='请输入6-12位密码' placeholderTextColor='#999999' secureTextEntry={true} maxLength={12}
                        onChangeText={(passWord) => this.setState({ passWord })}
                        value={this.state.passWord}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }} >

                    <TextInput
                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10 }}
                        placeholder='请再次输入密码' placeholderTextColor='#999999' secureTextEntry={true} maxLength={12}
                        onChangeText={(okPassWord) => this.setState({ okPassWord })}
                        value={this.state.okPassWord}
                    />
                </View>
                <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>


                    <Button title={'登录'} color="#028CE5" onPress={() => this._registdBtn()}
                        style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40 }} />
                    <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

                        <Text style={{ fontSize: 13, color: '#666666', textAlign: 'right' }}
                        >点击注册默认同意</Text>
                        <Text style={{ fontSize: 13, color: '#666666', textAlign: 'left', textDecorationLine: 'underline' }}
                        >《版权登记用户使用条款》</Text>
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
