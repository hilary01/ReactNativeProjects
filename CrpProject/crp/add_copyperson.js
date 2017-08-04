import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableNativeFeedback,
    Image,
    Button,
    TextInput,
    ToastAndroid
} from 'react-native';
import PublicTitle from './public_title';
import StringUtil from './StringUtil';
var BACK_ICON = require('./images/tabs/nav_return.png');
import Picker from 'react-native-picker';
const ICON_MORE = require('./images/tabs/icon_more.png');
var ADD_ICON = require('./images/tabs/but_shanchuan.png');
var UPLOAD_URL = 'http://drmlum.rdgchina.com/drmapp/drmfile/upload';
//图片选择器
var ImagePicker = require('react-native-image-picker');
import LoadView from './loading';
import NetUitl from './netUitl';
import CityPicker from './city_picker';
//图片选择器参数设置
var options = {
    title: '请选择图片来源',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    // customButtons: [
    //     { name: 'hangge', title: 'hangge.com图片' },
    // ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
var RADIO_NORMAL = require('./images/tabs/icon_normal.png');
var RADIO_AGREE = require('./images/tabs/icon_select.png');
export default class AddAuthorActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            credentials: '身份证',
            name: '',
            show_img: '',
            cerId: '0',
            selectedIndex: '1',
            jg: '',
            show_city_picker: false,
            cerNum: '',
            provinceId: '',
            cityId: '',
            countryId: '1',




        };
    }
    /**
     * 封装radioButton
     */
    _radioButton() {


        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableNativeFeedback onPress={() => this._changeRadioBtn('1')} >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '1' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>自然人</Text>

                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this._changeRadioBtn('2')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '2' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>法人</Text>

                </View>
            </TouchableNativeFeedback>

        </View>

    }
    /**
           * 选择城市
           */
    selectCity(state) {
        this.setState({

            show_city_picker: true,
        })
    }
    /**
         * 选择发表状态
         * @param {*} state 
         */
    _changeRadioBtn(state) {
        if (state == '1') {

            this.setState({
                selectedIndex: state,
                credentials: '身份证'
            })
        } else {
            this.setState({
                selectedIndex: state,
                credentials: '营业执照'
            })

        }
    }
    _submitBtn() {
        var name = this.state.name;
        var cerNum = this.state.cerNum;
        var img = this.state.show_img;
        if (!StringUtil.isNotEmpty(name)) {

            ToastAndroid.show('请输入您的姓名', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(this.state.jg)) {

            ToastAndroid.show('请选择您的籍贯', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(cerNum)) {

            ToastAndroid.show('请输入您的证件号码', ToastAndroid.SHORT);
            return;
        }
        if (!StringUtil.isNotEmpty(img)) {

            ToastAndroid.show('请上传证件照', ToastAndroid.SHORT);
            return;
        }

        var author = new Object();
        author.ownerid = '';
        author.name = name;
        author.category = this.state.selectedIndex;
        author.certificatedcategory = this.state.cerId;
        author.shenfenurl = img;
        author.certificatedid = this.cerNum;
        author.countryid = this.state.countryId;
        author.provinceid = this.state.provinceId;
        author.cityId = this.state.cityId;
        if (this.props.returnData) {
            if (this.props.returnData(author));
        }
        this.props.navigator.pop(
            {

            }
        );




    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    pushDetails(state) {
        var cityEntity = this.refs.cPicker.passMenthod();
        var place = '中国 ' + cityEntity.province + ' ' + cityEntity.city;
        this.setState({

            show_city_picker: false,
            provinceId: cityEntity.provinceid,
            cityId: cityEntity.cityid,
            countryId: '1',
            jg: place

        })
    }

    /**
   * 获取文件后缀名
   * @param {*} fileName 
   */
    getFileType(fileName) {
        var type = fileName.substring(fileName.lastIndexOf('.') + 1);
        return type;
    }
    //选择照片按钮点击
    choosePic() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('用户取消了选择！');
            }
            else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                let source = { path: response.path };
                // alert(source.path);
                var path = 'file://' + source.path;
                var startTime = new Date().getTime();
                this.uploadImage(UPLOAD_URL, path, startTime + '.' + this.getFileType(path));
            }

        });
    }
    /**
   * 上传图片
   * @param {*} url 
   * @param {*} path 
   * @param {*} name 
   */
    uploadImage(url, path, name) {
        var that = this;
        this.setState({
            show: true

        })
        NetUitl.uploadImage(url, path, name, function (set) {
            //下面的就是请求来的数据

            if (null != set && null != set.return_code && set.return_code == '0') {
                that.setState({

                    show_img: set.result.filepath,
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

    _showPicker() {
        var that = this;
        var person_name;
        var initName = '身份证';
        var userType = this.state.userType;
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
                var id = this._getTypeId(data);
                that.setState({

                    credentials: data,
                    cerId: id
                })
            },
            onPickerCancel: data => {
            },
            onPickerSelect: data => {

            }
        });
        Picker.show();
    }

    render() {
        return (

            <View style={styles.page}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#028CE5'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle text='新增著作权人' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />

                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#000000', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>著作权类型</Text>
                    {this._radioButton()}

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 45 }} >

                    <Text style={{ color: '#000000', width: 60, textAlign: 'left', flex: 1, marginLeft: 10, marginRight: 10 }}>证件类型</Text>
                    <TouchableNativeFeedback onPress={() => this._showPicker()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Text style={{ color: '#999999', textAlign: 'center', marginRight: 5 }}>{this.state.credentials}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>
                    </TouchableNativeFeedback>

                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>姓名</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 10, paddingLeft: 10 }}
                            placeholder='请输入您的姓名' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                        />
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>籍贯</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => this.selectCity('0')}>{this.state.jg}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                </View>
                <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>证件号码</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                        <TextInput
                            style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 10, paddingLeft: 10 }}
                            placeholder='请输入您的证件号码' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(cerNum) => this.setState({ cerNum })}
                            value={this.state.cerNum}
                        />
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                <View style={{ backgroundColor: 'white', alignItems: 'flex-start' }}>

                    <Text style={{ marginLeft: 10, paddingTop: 5, paddingBottom: 5, color: '#000000', }}>证件照</Text>
                    <TouchableNativeFeedback onPress={() => this.choosePic()}>
                        <View style={{ marginTop: 5, marginLeft: 10, alignItems: 'center' }}>

                            <Image style={{ height: 80, width: 100, resizeMode: 'stretch', }} source={(this.state.show_img == '' ? ADD_ICON : { uri: this.state.show_img })} />
                            <Text style={{ fontSize: 13, }}>{this.state.credentials}正面照</Text>


                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <Button title={'提交'} color="#028CE5" onPress={() => this._submitBtn()}
                        style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40, }} />
                </View>
                <CityPicker visible={this.state.show_city_picker} callbackParent={() => this.pushDetails()} ref="cPicker" />


            </View>


        );

    }


}
const styles = StyleSheet.create({

    content: {
        flex: 1,
        height: 50,
        alignItems: 'center',
    },
    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'

    },
});
