import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ToastAndroid,
    Button
} from 'react-native';
import PublicTitle from './public_title.js'
import Global from './global';
import StringUtil from './StringUtil';
var BACK_ICON = require('./images/tabs/nav_return.png');
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

        alert('注册提交');
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


                    <Button title={'登录'} color="#028CE5" onPress={() => this._submitLogin()}
                        style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40 }} />
                    <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row' ,justifyContent:'center'}}>

                        <Text style={{ fontSize: 13, color: '#666666', textAlign: 'right' }}
                            onPress={this._registdBtn.bind(this)} >点击注册默认同意</Text>
                        <Text style={{ fontSize: 13, color: '#666666', textAlign: 'left', textDecorationLine: 'underline' }}
                            onPress={this._registdBtn.bind(this)} >《版权登记用户使用条款》</Text>
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
