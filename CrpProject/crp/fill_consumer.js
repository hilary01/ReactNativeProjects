import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ToastAndroid,
    Button,
    AsyncStorage,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import PublicTitle from './public_title.js'
var REGIST_URL = 'http://drmlum.rdgchina.com/drmapp/person/passedit';
import StringUtil from './StringUtil';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
import DeviceStorage from './deviceStorage';
import Global from './global';
var BACK_ICON = require('./images/tabs/nav_return.png');
import BindEmail from './bind_email';
const ICON_MORE = require('./images/tabs/icon_more.png');
export default class ResetActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realName: '',
            credentials: '身份证',
            areal: '请选择',
            address: '',
            credentNum: '',
            phone: '',
            registNum: '',
            law_person: '',
            cerOrg: '',
            cityStatus: false,
            cityText: '',
            cityId: '',
            city_data: {}


        }
    }
    componentDidMount() {

        var credentiType = this.props.userType == '0' ? '身份证' : '营业执照';
        this.setState({

            credentials: credentiType

        })
    }
    _gotoPickerUtil() {

        this._showPicker();

    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    _showPicker() {
        var that = this;
        var person_name;
        var initName = '身份证';
        var userType = this.props.userType;
        if (userType == '0') {

            person_name = ['身份证', '军官证', '护照'];
        } else {
            person_name = ['营业执照', '企业法人营业执照', '组织机构代码证书', '事业单位法人证书', '社团法人证书', '其他有效证件'];
        }

        initName = person_name[0];
        Picker.init({
            pickerData: person_name,
            selectedValue: [initName],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '',
            onPickerConfirm: data => {
                that.setState({

                    credentials: data
                })
            },
            onPickerCancel: data => {
            },
            onPickerSelect: data => {

            }
        });
        Picker.show();
    }
    _getTypeId(name, userType) {
        let person_name;
        let person_id;
        if (userType == '0') {//个人
            person_name = ['身份证', '军官证', '护照']
            person_id = ['0', '1', '2']
        } else {
            person_name = ['营业执照', '企业法人营业执照', '组织机构代码证书', '事业单位法人证书', '社团法人证书', '其他有效证件'];
            person_id = ['11', '12', '13', '14', '15', '16']

        }

        var id = person_id[0];
        for (var i = 0; i < person_name.length; i++) {
            if (person_name[i] == name) {

                id = person_id[i];


            }


        }
        return id;

    }
    /**
    * 获取城市信息
    */
    getCityData() {
        var that = this;

        AsyncStorage.getItem(
            'city_list',
            (error, result) => {
                if (error) {
                    alert('取值失败:' + error);
                } else {
                    const jsonValue = JSON.parse(result);
                    if (null != jsonValue) {
                        that.setState({

                            city_data: jsonValue

                        })
                    } else {

                    }

                }
            }
        )
    }

    _registdBtn() {
        var pass_word = this.state.passWord;
        var ok_pass = this.state.okPassWord;
        var old_pass = this.state.oldpass;
        if (!StringUtil.isNotEmpty(old_pass) || old_pass.length < 5) {

            ToastAndroid.show('请输入6-12位旧密码', ToastAndroid.SHORT);
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
        StringBufferUtils.append('type=' + '2');
        StringBufferUtils.append('&&password=' + pass_word);
        StringBufferUtils.append('&&userid=' + Global.userName);
        StringBufferUtils.append('&&conpassword=' + ok_pass);
        StringBufferUtils.append('&&oldpass=' + old_pass);

        let params = StringBufferUtils.toString();
        this.fetchData(params);


    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(REGIST_URL, param, '', function (set) {

            //下面的就是请求来的数据
            if (null != set && null != set.return_code && set.return_code == '0') {
                that.setState({

                    show: false

                })
                that.props.navigator.popToTop({
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
     * 证件号
     */
    _cerNum() {
        if (this.props.userType == '0') {

            return <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>证件号码</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的证件号码' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(credentNum) => this.setState({ credentNum })}
                            value={this.state.credentNum}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
            </View>
        }
    }
    /**
     * 注册号
     */
    _registNum() {

        if (this.props.userType == '1') {

            return <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>注册号</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的注册号' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(registNum) => this.setState({ registNum })}
                            value={this.state.registNum}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}>

                </View>
            </View>
        }

    }
    /**
     * 法人
     */
    _lawPerson() {

        if (this.props.userType == '1') {

            return <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>法人</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的法人姓名' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(law_person) => this.setState({ law_person })}
                            value={this.state.law_person}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}>

                </View>
            </View>
        }

    }
    /**
    * 发证机构
    */
    _sendCerOrg() {

        if (this.props.userType == '1') {

            return <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>发证机构</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的发证机构' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(cerOrg) => this.setState({ cerOrg })}
                            value={this.state.cerOrg}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}>

                </View>
            </View>
        }

    }
    render() {
        var title = this.props.userType == '0' ? '完善个人信息' : '完善企业信息';
        var areal_title = this.props.userType == '0' ? '籍贯' : '区域';
        var nameTxt = this.props.userType == '0' ? '姓名' : '公司名称';
        var nameHint = this.props.userType == '0' ? '请输入您的真实姓名' : '请输入您的企业名称';
        return (

            <View style={styles.page}>
                <PublicTitle text={title} _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>证件类型</Text>
                    <TouchableNativeFeedback onPress={() => this._gotoPickerUtil()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Text style={{ color: '#999999', textAlign: 'center' }}>{this.state.credentials}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>{nameTxt}</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder={nameHint} placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(realName) => this.setState({ realName })}
                            value={this.state.realName}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                {this._registNum()}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>{areal_title}</Text>
                    <TouchableNativeFeedback onPress={() => this.handleCityPress()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Text style={{ color: '#999999', textAlign: 'center' }}>{this.state.areal}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>详细地址</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的详细地址' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(address) => this.setState({ address })}
                            value={this.state.address}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>

                {this._cerNum()}


                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>手机号码</Text>
                    <View style={{ flexDirection: 'row', }}>

                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 80, paddingLeft: 10 }}
                            placeholder='请输入您的手机号码' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                {this._lawPerson()}
                {this._sendCerOrg()}
                <View style={{ marginTop: 30, flex: 1, justifyContent: 'flex-end' }}>


                    <Button title={'提交'} color="#028CE5" onPress={() => this._registdBtn()}
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
