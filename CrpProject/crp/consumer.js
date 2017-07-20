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
    TouchableNativeFeedback,
    StatusBar
} from 'react-native';
import PublicTitle from './public_title.js'
var GETNFO_URL = 'http://drmlum.rdgchina.com/drmapp/person/info';
var EDITINFO_URL = 'http://drmlum.rdgchina.com/drmapp/person/infoedit';
import StringUtil from './StringUtil';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
import DeviceStorage from './deviceStorage';
import Global from './global';
var BACK_ICON = require('./images/tabs/nav_return.png');
import BindEmail from './bind_email';
const ICON_MORE = require('./images/tabs/icon_more.png');
import Picker from 'react-native-picker';
import CityPicker from './city_picker';
var imageUrl = 'http://preview.quanjing.com/yhkj01/yhkj01-5195el.jpg';
export default class EditConsumerActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headimg: imageUrl,
            realName: '',
            credentials: '身份证',
            areal: '请选择',
            address: '',
            credentNum: '',
            phone: '',
            registNum: '',
            law_person: '',
            cerOrg: '',
            show_city_picker: false,
            provinceId: '',
            cityId: '',
            editable: false,
            rightBtnTxt: '修改'


        }
    }
    componentDidMount() {

        this._getInfo();
    }
    _editInfo() {
        var flag = this.state.editable;

        this.setState({

            editable: !flag
        })
        var txt = this.state.editable == true ? '修改' : '保存';
        this.setState({
            rightBtnTxt: txt

        })
        if (this.state.editable) {
            this._submiteBtn();
        }
    }

    _gotoPickerUtil() {

        if (this.state.editable) {

            this._showPicker();
        }

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
     * 选择城市
     */
    selectCity() {
        if (this.state.editable) {
            this.setState({

                show_city_picker: true
            })
        }
    }

    _submiteBtn() {
        var realname = this.state.realName;
        var cerType = this._getTypeId(this.state.credentials, this.props.userType);

        if (this.props.userType == '0') {
            if (!StringUtil.isNotEmpty(realname)) {

                ToastAndroid.show('请输入您的真实姓名', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.provinceId) || !StringUtil.isNotEmpty(this.state.cityId)) {

                ToastAndroid.show('请选择籍贯', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.address)) {

                ToastAndroid.show('请输入您的详细地址', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.credentNum)) {

                ToastAndroid.show('请输入您的证件号码', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.phone)) {

                ToastAndroid.show('请输入您的手机号码', ToastAndroid.SHORT);
                return;
            }
        } else {
            if (!StringUtil.isNotEmpty(realname)) {

                ToastAndroid.show('请输入您的企业名称', ToastAndroid.SHORT);
                return;
            }

            // if (!StringUtil.isNotEmpty(this.state.registNum)) {

            //     ToastAndroid.show('请输入您的注册号', ToastAndroid.SHORT);
            //     return;
            // }
            if (!StringUtil.isNotEmpty(this.state.provinceId) || !StringUtil.isNotEmpty(this.state.cityId)) {

                ToastAndroid.show('请选择区域', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.address)) {

                ToastAndroid.show('请输入您的详细地址', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.phone)) {

                ToastAndroid.show('请输入您的手机号码', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.law_person)) {

                ToastAndroid.show('请输入您的法人姓名', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.cerOrg)) {

                ToastAndroid.show('请输入您的发证机构', ToastAndroid.SHORT);
                return;
            }
        }


        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + Global.userId);
        // StringBufferUtils.append('&headimg=' + imageUrl);
        StringBufferUtils.append('&usertype=' + this.props.userType);
        StringBufferUtils.append('&realname=' + realname);
        StringBufferUtils.append('&certificatetype=' + cerType);
        StringBufferUtils.append('&nation=' + '1');
        StringBufferUtils.append('&province=' + this.state.provinceId);
        StringBufferUtils.append('&city=' + this.state.cityId);
        StringBufferUtils.append('&address=' + this.state.address);
        StringBufferUtils.append('&certificatenum=' + this.state.credentNum);
        StringBufferUtils.append('&phone=' + this.state.phone);
        StringBufferUtils.append('&enterpriselegalperson=' + this.state.law_person);
        StringBufferUtils.append('&certifyingauthority=' + this.state.cerOrg);
        let params = StringBufferUtils.toString();
        this.fetchData(params)
    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(EDITINFO_URL, param,'', function (set) {
            //下面的就是请求来的数据

            if (null != set && null != set.return_code && set.return_code == '0') {
                Global.userIcon = imageUrl;
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


    _getInfo() {
        var that = this;
        that.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + Global.userId);
        let params = StringBufferUtils.toString();
        this.getData(params);
    }

    getData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(GETNFO_URL, param, '', function (set) {
            //下面的就是请求来的数据
            if (null != set && null != set.return_code && set.return_code == '0') {
                that._fillView(set.result);
            } else {
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
                that.setState({
                    show: false
                });

            }

        })

    }

    /**
     * 获取证件类型
     * @param {*} id 
     */
    _getCerType(id) {
        var name = '身份证';
        switch (id) {
            case '0':
                name = '身份证';
                break
            case '1':
                name = '军官证';
                break
            case '2':
                name = '护照';
                break
            case '11':
                name = '营业执照';
                break
            case '12':
                name = '企业法人营业执照';
                break
            case '13':
                name = '组织机构代码证书';
                break
            case '14':
                name = '事业单位法人证书';
                break
            case '15':
                name = '社团法人证书';
                break
            case '16':
                name = '其他有效证件';
                break

        }
        return name;



    }
    /**
     * 填充数据
     */
    _fillView(result) {

        var place = result.province + ' ' + result.city;
        var cerType = this._getCerType(result.certificatetype);
        this.setState({
            headimg: imageUrl,
            realName: result.realname,
            credentials: cerType,
            areal: place,
            show: false,
            address: result.address,
            credentNum: result.certificatenum,
            registNum: '',
            law_person: result.enterpriselegalperson,
            cerOrg: result.certifyingauthority,
            show_city_picker: false,
            provinceId: result.provinceid,
            cityId: result.cityid,
            phone: result.phone,
            editable: false

        })



    }

    pushDetails() {
        var cityEntity = this.refs.cPicker.passMenthod();
        var place = cityEntity.province + ' ' + cityEntity.city;
        this.setState({

            areal: place,
            show_city_picker: false,
            provinceId: cityEntity.provinceid,
            cityId: cityEntity.cityid

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
                            editable={this.state.editable}
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
                            editable={this.state.editable}
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
                            editable={this.state.editable}
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
                            editable={this.state.editable}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}>

                </View>
            </View>
        }

    }
    _renderIcon() {
        if (this.state.editable) {

            return <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />;
        }

    }
    render() {
        var title = this.props.userType == '0' ? '个人资料' : '企业资料';
        var areal_title = this.props.userType == '0' ? '籍贯' : '区域';
        var nameTxt = this.props.userType == '0' ? '姓名' : '公司名称';
        var nameHint = this.props.userType == '0' ? '请输入您的真实姓名' : '请输入您的企业名称';
        var logo_txt = this.props.userType == '0' ? '个人头像' : '企业logo';
        return (

            <View style={styles.page}>
                <View style={styles.container}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor={'#028CE5'}
                        barStyle={'default'}
                        networkActivityIndicatorVisible={true}
                    />
                    <View style={styles.left_view} >

                        <TouchableNativeFeedback onPress={() => this._backOnclick()} >
                            <Image style={styles.left_icon} source={BACK_ICON}></Image>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.textview}>
                        <Text style={styles.textstyle} numberOfLines={1}>{title}</Text>
                    </View>
                    <View style={styles.right_view} >
                        <Text style={{
                            textAlign: 'center', width: 60, color: '#ffffff'
                        }} onPress={() => this._editInfo()}>
                            {this.state.rightBtnTxt}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', marginLeft: 10 }}>{logo_txt}</Text>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 10 }}>

                        <Image style={{
                            width: 40, height: 40, borderRadius: 50
                        }} source={{ uri: this.state.headimg }} />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>证件类型</Text>
                    <TouchableNativeFeedback onPress={() => this._gotoPickerUtil()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Text style={{ color: '#999999', textAlign: 'center', marginRight: 5 }}>{this.state.credentials}</Text>
                            {this._renderIcon()}
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
                            editable={this.state.editable}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                {this._registNum()}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#666666', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>{areal_title}</Text>
                    <TouchableNativeFeedback onPress={() => this.selectCity()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Text style={{ color: '#999999', textAlign: 'center', marginRight: 5 }}>{this.state.areal}</Text>
                            {this._renderIcon()}
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
                            editable={this.state.editable}
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
                            editable={this.state.editable}
                        />
                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }}></View>
                {this._lawPerson()}
                {this._sendCerOrg()}
                <CityPicker visible={this.state.show_city_picker} callbackParent={() => this.pushDetails()} ref="cPicker" />
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
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        backgroundColor: '#028CE5',
    },
    textview: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    textstyle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        width: 200
    },
    right_view: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        borderColor: '#f0f0f0',
        borderRadius: 3,
        borderWidth: 1,
        height: 30,
        marginRight: 5
    },
    right_icon: {
        width: 28,
        height: 28,
        marginRight: 10,
        justifyContent: 'center'

    },
    left_icon: {
        width: 28,
        height: 28,
        marginLeft: 10,
        justifyContent: 'center'

    }
});
