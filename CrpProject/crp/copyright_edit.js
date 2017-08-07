import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableNativeFeedback,
    Image,
    FlatList,
    ScrollView,
    TextInput,
    DatePickerAndroid,
    ToastAndroid,
    Button
} from 'react-native';
import Global from './global';
import PublicTitle from './public_title';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringUtil from './StringUtil';
var BACK_ICON = require('./images/tabs/nav_return.png');
import StringBufferUtils from './StringBufferUtil';
const ICON_MORE = require('./images/tabs/icon_more.png');
var IMAGE_DEFAULT = require('./images/tabs/defalut_img.png');
var ADD_IMG = require('./images/tabs/icon_addimg.png');
var RADIO_NORMAL = require('./images/tabs/icon_normal.png');
var RADIO_AGREE = require('./images/tabs/icon_select.png');
import CityPicker from './city_picker';
var ADD_AUTHOR = require('./images/tabs/add_icon.png');
import CreateTypeActivity from './create_typelist';
import PowerListActivity from './power_owner';
import OrganizationActivity from './copyright_organization';
var type_id = '';
var organizationId = '';
var calsh_list = [];
var UPLOAD_URL = 'http://drmlum.rdgchina.com/drmapp/drmfile/upload';
var APPLY_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/apply';
var SAVE_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/save';
//图片选择器
var ImagePicker = require('react-native-image-picker');
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
import AddOuthorActivity from './add_author';
import AddCopyPersonActivity from './add_copyperson';
export default class CopyEditActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            detailId: '',
            workList: {},
            detailEntity: {},
            loadEnd: true,
            copyrightpersons: {},
            authorPersons: {},
            work_name: '',
            real_name: '',
            phone: '',
            description: '',
            report_state: '',
            selectedIndex: 0,
            show_pubaddress: false,
            show_city_picker: false,
            finishedaddress: '',
            countryId: '',
            provinceId: '',
            cityId: '',
            initilizepublishedsite: '',
            initilizepublisheddatetime: '',
            status: '0',
            show_time_picker: false,
            presetDate: new Date(),
            rightcreatetype: '',
            finisheddatetime: '',
            rightgettype: '',
            righttoattributionway: '',
            righttoattributionstatuss: '',
            copyrightcityname: ''


        };
    }
    _submiteBtn(state) {
        var work_name = this.state.work_name;
        var workList = this.state.workList;
        var description = this.state.description;
        var copyrightpersons = this.state.copyrightpersons;
        var authorPersons = this.state.authorPersons;
        var finisheddatetime = this.state.finisheddatetime;
        var finishedaddress = this.state.finishedaddress;
        var show_pubaddress = this.state.show_pubaddress;//发表状态
        var initilizepublishedsite = this.state.initilizepublishedsite;
        var initilizepublisheddatetime = this.state.initilizepublisheddatetime;
        var real_name = this.state.real_name;
        var phone = this.state.phone;
        var rightgettype = this.state.rightgettype;
        var righttoattributionstatuss = this._getPowerSize(this.state.righttoattributionstatuss);
        if (state == '0') {//发送申请

            if (null != workList && workList.length <= 0) {

                ToastAndroid.show('请上传您的作品', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(work_name)) {

                ToastAndroid.show('请输入您的作品名称', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(description)) {

                ToastAndroid.show('请输入您的作品说明', ToastAndroid.SHORT);
                return;
            }
            if (null != copyrightpersons && copyrightpersons.length <= 0) {

                ToastAndroid.show('请添加著作权人信息', ToastAndroid.SHORT);
                return;
            }
            if (null != authorPersons && authorPersons.length <= 0) {

                ToastAndroid.show('请添加作者信息', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.rightcreatetype)) {

                ToastAndroid.show('请选择作品创作性质', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(finisheddatetime)) {

                ToastAndroid.show('请选择创作/制作完成日期', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(finishedaddress)) {

                ToastAndroid.show('请选择创作/制作完成地址', ToastAndroid.SHORT);
                return;
            }
            if (show_pubaddress) {

                if (!StringUtil.isNotEmpty(initilizepublishedsite)) {

                    ToastAndroid.show('请选择首次发表地址', ToastAndroid.SHORT);
                    return;
                }
                if (!StringUtil.isNotEmpty(initilizepublisheddatetime)) {

                    ToastAndroid.show('请选择首次发表日期', ToastAndroid.SHORT);
                    return;
                }

            }
            if (!StringUtil.isNotEmpty(real_name)) {

                ToastAndroid.show('请输入您的真实名字', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(phone)) {

                ToastAndroid.show('请输入您的电话号码', ToastAndroid.SHORT);
                return;
            }

            if (!StringUtil.isNotEmpty(this.state.rightgettype)) {

                ToastAndroid.show('请选择您的权利取得方式', ToastAndroid.SHORT);
                return;
            }

            if (!StringUtil.isNotEmpty(this.state.righttoattributionway)) {

                ToastAndroid.show('请选择您的权利归属方式', ToastAndroid.SHORT);
                return;
            }

            if (righttoattributionstatuss <= 0) {

                ToastAndroid.show('请选择您的权利拥有情况', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.detailEntity.selectcopyrightcity)) {

                ToastAndroid.show('请选择您的办理机构', ToastAndroid.SHORT);
                return;
            }
        } else {//保存信息


            if (!StringUtil.isNotEmpty(work_name)) {

                ToastAndroid.show('请输入您的作品名称', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.rightcreatetype)) {

                ToastAndroid.show('请选择作品创作性质', ToastAndroid.SHORT);
                return;
            }
            if (show_pubaddress) {

                if (!StringUtil.isNotEmpty(initilizepublishedsite)) {

                    ToastAndroid.show('请选择首次发表地址', ToastAndroid.SHORT);
                    return;
                }
                if (!StringUtil.isNotEmpty(initilizepublisheddatetime)) {

                    ToastAndroid.show('请选择首次发表日期', ToastAndroid.SHORT);
                    return;
                }

            }
            if (!StringUtil.isNotEmpty(real_name)) {

                ToastAndroid.show('请输入您的真实名字', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(phone)) {

                ToastAndroid.show('请输入您的电话号码', ToastAndroid.SHORT);
                return;
            }

            if (!StringUtil.isNotEmpty(this.state.rightgettype)) {

                ToastAndroid.show('请选择您的权利取得方式', ToastAndroid.SHORT);
                return;
            }

            if (!StringUtil.isNotEmpty(this.state.righttoattributionway)) {

                ToastAndroid.show('请选择您的权利归属方式', ToastAndroid.SHORT);
                return;
            }

            if (righttoattributionstatuss <= 0) {

                ToastAndroid.show('请选择您的权利拥有情况', ToastAndroid.SHORT);
                return;
            }
            if (!StringUtil.isNotEmpty(this.state.detailEntity.selectcopyrightcity)) {

                ToastAndroid.show('请选择您的办理机构', ToastAndroid.SHORT);
                return;
            }

        }

        this.setState({

            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('id=' + this.state.detailEntity.id);
        StringBufferUtils.append('&userid=' + Global.userId);
        StringBufferUtils.append('&name=' + work_name);
        StringBufferUtils.append('&creativedescription=' + description);
        StringBufferUtils.append('&category=' + this.state.detailEntity.category);
        StringBufferUtils.append('&finishedaddress=' + finishedaddress);
        StringBufferUtils.append('&finisheddatetime=' + finisheddatetime);
        StringBufferUtils.append('&publishstatus=' + this.state.selectedIndex);
        StringBufferUtils.append('&initilizepublisheddatetime=' + initilizepublisheddatetime);
        StringBufferUtils.append('&countryid=' + this.state.countryId);
        StringBufferUtils.append('&provinceid=' + this.state.provinceId);
        StringBufferUtils.append('&cityid=' + this.state.cityId);
        StringBufferUtils.append('&righttoattributionway=' + this.state.righttoattributionway);
        StringBufferUtils.append('&initilizepublishedsite=' + initilizepublishedsite);
        StringBufferUtils.append('&righttoattributionstatuss=' + this.state.righttoattributionstatuss);
        StringBufferUtils.append('&rightgettype=' + rightgettype);
        StringBufferUtils.append('&rightcreatetype=' + this.state.rightcreatetype);
        StringBufferUtils.append('&realname=' + real_name);
        StringBufferUtils.append('&telephone=' + phone);
        StringBufferUtils.append('&selectcopyrightcity=' + this.state.detailEntity.selectcopyrightcity);
        StringBufferUtils.append('&storefile=' + JSON.stringify(workList));
        StringBufferUtils.append('&copyrightowner=' + JSON.stringify(copyrightpersons));
        StringBufferUtils.append('&authors=' + JSON.stringify(authorPersons));
        let params = StringBufferUtils.toString();
        this.fetchData(params, state)
    }

    fetchData(param, state) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        var url = '';

        if (state == '0') {//申请
            url = APPLY_URL;

        } else {//保存
            url = SAVE_URL;
        }
        // alert(url+param);
        NetUitl.post(url, param, '', function (set) {
            //下面的就是请求来的数据

            if (null != set && null != set.return_code && set.return_code == '0') {
                that.setState({

                    show: false

                })
                if (state == '0') {
                    that.props.navigator.popToTop({
                    })
                }
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

                that._updateWorks(set.result.filepath);
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
                that.setState({
                    show: false
                });

            }

        })


    }
    _updateWorks(path) {
        var list = this.state.workList;
        if (StringUtil.isNotEmpty(path)) {
            var obj = new Object();
            obj.filetype = '1';
            obj.storepath = path;
            list.push(obj);
            this.setState({
                show: false,
                workList: list

            })
        }


    }
    //进行创建时间日期选择器
    async showPicker(stateKey, options, state) {
        var date = null;
        var returnTime = '';
        try {
            var newState = {};
            const { action, year, month, day } = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
            } else {
                date = new Date(year, month, day);
            }
            var time = this._getFormatDate(year, (month + 1), day);
            if (state == '0') {

                this.setState({

                    initilizepublisheddatetime: time
                })
            } else {

                this.setState({

                    finisheddatetime: time
                })
            }

        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    }
    _getFormatDate(year, month, day) {

        var date = '';
        var _month = '';
        var _day = '';
        if (month < 10) {

            _month = '0' + month;

        } else {

            _month = month;
        }
        if (day < 10) {

            _day = '0' + day;

        } else {

            _day = day;
        }
        date = year + '-' + _month + '-' + _day;
        return date;

    }
    componentDidMount() {
        var data = this.props.detail_entity;
        var index = parseInt(data.publishstatus);
        var flag = data.publishstatus == '1' ? true : false;
        organizationId = data.selectcopyrightcity;
        this.setState({
            detailEntity: data,
            workList: data.storefile,
            copyrightpersons: data.copyrightowner,
            authorPersons: data.authors,
            work_name: data.name,
            real_name: data.realname,
            phone: data.telephone,
            description: data.creativedescription,
            selectedIndex: index,
            show_pubaddress: flag,
            finishedaddress: data.finishedaddress,
            provinceId: data.provinceid,
            countryId: data.countryid,
            cityId: data.cityid,
            initilizepublishedsite: data.initilizepublishedsite,
            initilizepublisheddatetime: data.initilizepublisheddatetime,
            rightcreatetype: data.rightcreatetype,
            finisheddatetime: data.finisheddatetime,
            rightgettype: data.rightgettype,
            righttoattributionway: data.righttoattributionway,
            righttoattributionstatuss: data.righttoattributionstatuss,
            copyrightcityname: data.copyrightcityname,
            show: false,

        })
    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    _renderWorkItem = (itemData, index) => {
        return <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginLeft: 10 }}>
            <Image source={{ uri: itemData.item.storepath }} style={{ width: 60, height: 60 }}
            />
        </View>

    }
    /**
     * 获取著作权人
     * @param {*} person 
     */
    _getCopyrightPerson() {
        var copyList = this.state.copyrightpersons;
        var str = '';
        if (copyList.length > 0) {

            for (var i = 0; i < copyList.length; i++) {
                var copyrightEntity = copyList[i];

                str = str + '| ' + copyrightEntity.name + '   ';
            }

        }
        return str;


    }
    /**
    * 获取作者
    * @param {*} person 
    */
    _getAuthorPerson() {
        var authorList = this.state.authorPersons;
        var str = '';
        if (authorList.length > 0) {

            for (var i = 0; i < authorList.length; i++) {
                var authorEntity = authorList[i];

                str = str + '| ' + authorEntity.authorname + '   ';
            }

        }
        return str;


    }

    /**
        * 选择城市
        */
    selectCity(state) {
        this.setState({

            show_city_picker: true,
            status: state
        })
    }
    /**
     * 选择日期
     */
    selectDatePicker() {
        this.setState({

            show_time_picker: true,
        })

    }

    pushDetails(state) {
        var cityEntity = this.refs.cPicker.passMenthod();
        if (this.state.status == '0') {
            var place = '中国 ' + cityEntity.province + ' ' + cityEntity.city;
            this.setState({

                show_city_picker: false,
                provinceId: cityEntity.provinceid,
                cityId: cityEntity.cityid,
                countryId: '1',
                finishedaddress: place

            })
        } else {
            var place = '中国 ' + cityEntity.province
            this.setState({

                show_city_picker: false,
                initilizepublishedsite: place

            })
        }
    }

    pushTimeDetails() {
        this.setState({

            show_time_picker: false,
        })
    }
    /**
     * 添加著作权人
     */
    _addPerson(state) {

        switch (state) {

            case '0':
                this.props.navigator.push({
                    component: AddCopyPersonActivity,
                    params: {
                        returnData: (reponseData) => this._getPersonData(reponseData, state)

                    }
                })
                break
            case '1':
                this.props.navigator.push({
                    component: AddOuthorActivity,
                    params: {
                        returnData: (reponseData) => this._getPersonData(reponseData, state)

                    }
                })

                break

        }

    }
    _getPersonData(person, state) {
        switch (state) {

            case '0'://添加著作权人
                var list = this.state.copyrightpersons;
                list.push(person);
                this.setState({
                    copyrightpersons: list

                })
                break
            case '1'://添加作者
                var list = this.state.authorPersons;
                list.push(person);
                this.setState({
                    authorPersons: list

                })
                break

        }



    }
    _getReturnData(reponseData, state) {
        switch (state) {

            case '0'://创作性质
                this.setState({

                    rightcreatetype: reponseData.id

                })
                break
            case '1'://权利取得方式
                this.setState({

                    rightgettype: reponseData.id

                })
                break
            case '2'://权利归属方式
                this.setState({

                    righttoattributionway: reponseData.id

                })
                break

        }


    }
    _goCreateType(state) {
        var createType = [];
        var createTypeId = [];
        var title = '';
        switch (state) {
            case '0'://创作性质
                createType = ['原创', '改编', '翻译', '汇编', '注释', '整理', '其他'];
                createTypeId = ['1', '2', '3', '4', '5', '6', '7'];
                title = '创作性质';
                type_id = this.state.rightcreatetype;
                break
            case '1'://权利取得方式
                createType = ['原始', '继承', '承受', '其他'];
                createTypeId = ['1', '2', '3', '4'];
                title = '取得方式';
                type_id = this.state.rightgettype;
                break
            case '2'://权利归属方式
                createType = ['个人作品', '合作作品', '法人作品', '职务作品', '委托作品'];
                createTypeId = ['1', '2', '3', '4', '5'];
                title = '归属方式';
                type_id = this.state.righttoattributionway;
                break


        }
        this.props.navigator.push({
            component: CreateTypeActivity,
            params: {
                title: title,
                createType: createType,
                createTypeId: createTypeId,
                id: type_id,
                returnData: (reponseData) => this._getReturnData(reponseData, state)

            }
        })
    }
    _getReturnPowerData(reponseData, selectLists) {
        calsh_list = reponseData;
        var right = this._getRightStatus(selectLists);
        this.setState({

            righttoattributionstatuss: right

        })

    }
    _getRightStatus(list) {
        var str = '';
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {

                if (i == list.length - 1) {

                    str = str + list[i].id;
                } else {
                    str = str + list[i].id + ',';
                }

            }



        }
        return str;

    }
    _goPowerListActivity() {

        var title = '拥有情况';
        var lists = [];
        if (calsh_list.length > 0) {

            lists = calsh_list;
        } else {

        }
        this.props.navigator.push({
            component: PowerListActivity,
            params: {
                title: title,
                list: lists,
                returnData: (reponseData, selectLists) => this._getReturnPowerData(reponseData, selectLists)

            }
        })
    }
    _goOrganizationActivity() {

        var title = '办理机构';
        this.props.navigator.push({
            component: OrganizationActivity,
            params: {
                title: title,
                id: organizationId,
                returnData: (reponseData) => this._getReturnOrganizationData(reponseData)

            }
        })
    }
    _getReturnOrganizationData(reponseData) {
        organizationId = reponseData.id;
        this.setState({

            copyrightcityname: reponseData.name

        })

    }
    /**
     * 未发表不显示首次发表地址等
     * @param {*} state 
     */
    _getPublishLayout(data) {
        if (this.state.show_pubaddress) {
            return <View>
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>首次发表日期</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => { this.showPicker('preset', { date: this.state.presetDate }, '0') }}>{this.state.initilizepublisheddatetime}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                </View>
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>首次发表地址</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => this.selectCity('1')}>{this.state.initilizepublishedsite}</Text>
                        </View>
                        <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                </View>

            </View>

        }

    }

    _getPowerSize(power) {
        if (StringUtil.isNotEmpty(power) && power != 'undefind') {

            var strs = new Array(); //定义一数组 
            strs = power.split(","); //字符分割
            return strs.length;
        }


    }

    /**
     * 获取权利归属
     * @param {*} id 
     */

    _getCreateTypeTxt(id) {
        var name = '';
        switch (id) {

            case '1':
                name = '原创';

                break;
            case '2':
                name = '改编';
                break;
            case '3':
                name = '翻译';
                break;
            case '4':
                name = '汇编';
                break;
            case '5':
                name = '注释';
                break;
            case '6':
                name = '整理';
                break;
            case '7':
                name = '其他';
                break;



        }
        return name;

    }

    /**
     * 权利取得方式
     * @param {*} id 
     */
    _getPowerGetTxt(id) {
        var name = '';
        switch (id) {

            case '1':
                name = '原始';

                break;
            case '2':
                name = '继承';
                break;
            case '3':
                name = '承受';
                break;
            case '4':
                name = '其他';
                break;



        }
        return name;

    }
    /**
     * 权利归属方式
     * @param {*} id 
     */
    _getPowerOwnerTxt(id) {
        var name = '';
        switch (id) {

            case '1':
                name = '个人作品';
                break;
            case '2':
                name = '合作作品';
                break;
            case '3':
                name = '法人作品';
                break;
            case '4':
                name = '职务作品';
                break;
            case '5':
                name = '委托作品';
                break;



        }
        return name;

    }
    _showRightBtn() {
        return <View style={styles.right_view} >
            <Text style={{
                textAlign: 'center', width: 60, color: '#ffffff'
            }} onPress={() => this._submiteBtn('1')}>
                保存
                        </Text>
        </View>
    }
    /**
     * 选择发表状态
     * @param {*} state 
     */
    _changeRadioBtn(state) {
        if (state == '0') {

            this.setState({
                selectedIndex: state,
                show_pubaddress: false
            })
        } else {
            this.setState({
                selectedIndex: state,
                show_pubaddress: true
            })

        }
    }

    /**
     * 封装radioButton
     */
    _radioButton() {


        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableNativeFeedback onPress={() => this._changeRadioBtn('0')} >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '0' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>未发表</Text>

                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this._changeRadioBtn('1')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '1' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>已发表</Text>

                </View>
            </TouchableNativeFeedback>

        </View>

    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    render() {
        return (
            <View style={styles.page}>
                {this.state.show == true ? (<LoadView />) : (null)}
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
                        <Text style={styles.textstyle} numberOfLines={1}>我的版权</Text>
                    </View>
                    {this._showRightBtn()}

                </View>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品信息</Text>
                        <View style={{ backgroundColor: 'white', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>上传作品</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginLeft: 40 }}>

                                <FlatList
                                    style={{ width: 140, marginRight: 5 }}
                                    ref={(flatList) => this._flatList = flatList}
                                    renderItem={this._renderWorkItem}
                                    horizontal={true}
                                    keyExtractor={this._keyExtractor}
                                    data={this.state.workList}>
                                </FlatList>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableNativeFeedback onPress={() => this.choosePic()} >
                                        <Image style={{ width: 60, height: 60, marginRight: 5, marginLeft: 5 }} source={ADD_IMG} />
                                    </TouchableNativeFeedback>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />

                                </View>

                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>作品名称</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                <TextInput
                                    style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 10, paddingLeft: 10 }}
                                    placeholder='请输入您的作品名称' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                    onChangeText={(work_name) => this.setState({ work_name })}
                                    value={this.state.work_name}
                                />
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品说明</Text>
                            <View style={{ backgroundColor: 'white', height: 80, flexDirection: 'row', }}>
                                <TextInput
                                    style={{ flex: 1, height: 80, backgroundColor: '#ffffff', paddingRight: 10, paddingLeft: 10, textAlign: 'left' }}
                                    placeholder='请输入您的作品说明' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                    onChangeText={(description) => this.setState({ description })} multiline={true}
                                    value={this.state.description}
                                />

                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, width: 120 }}>著作权人信息</Text>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>

                                    <Image style={{ width: 16, height: 16, marginRight: 5 }} source={ADD_AUTHOR} />
                                    <Text onPress={() => this._addPerson('0')}>添加</Text>
                                </View>

                            </View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>{this._getCopyrightPerson()}</Text>

                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, width: 120 }}>作者信息</Text>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>

                                    <Image style={{ width: 16, height: 16, marginRight: 5 }} source={ADD_AUTHOR} />
                                    <Text onPress={() => this._addPerson('1')}>添加</Text>
                                </View>

                            </View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>{this._getAuthorPerson()}</Text>

                            </View>
                        </View>

                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品状态信息</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>作品创作性质</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => { this._goCreateType('0') }}>{this._getCreateTypeTxt(this.state.rightcreatetype)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />

                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成日期</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => { this.showPicker('preset', { date: this.state.presetDate }, '1') }}>{this.state.finisheddatetime}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>

                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成地址</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => this.selectCity('0')}>{this.state.finishedaddress}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>发表状态</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    {this._radioButton()}
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>

                        {this._getPublishLayout(this.state.detailEntity)}


                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>申请人信息</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>姓名</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <TextInput
                                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 10, paddingLeft: 10 }}
                                        placeholder='请输入您的真实名字' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                        onChangeText={(real_name) => this.setState({ real_name })}
                                        value={this.state.real_name}
                                    />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>联系方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <TextInput
                                        style={{ flex: 1, height: 36, backgroundColor: '#ffffff', textAlign: 'right', paddingRight: 10, paddingLeft: 10 }}
                                        placeholder='请输入您的手机号码' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                        onChangeText={(phone) => this.setState({ phone })}
                                        value={this.state.phone}
                                    />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>


                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>权利状况说明</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利取得方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => { this._goCreateType('1') }}>{this._getPowerGetTxt(this.state.rightgettype)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利归属方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }} onPress={() => { this._goCreateType('2') }}>{this._getPowerOwnerTxt(this.state.righttoattributionway)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利拥有情况</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }} onPress={() => { this._goPowerListActivity() }}>{this._getPowerSize(this.state.righttoattributionstatuss)}项</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>选择办理机构</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>中国 山东省</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, alignItems: 'center' }}>
                                    <Text style={{ color: '#666666', paddingTop: 10, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }} onPress={() => { this._goOrganizationActivity() }}>{this.state.copyrightcityname}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                            <Button title={'发送申请'} color="#028CE5" onPress={() => this._submiteBtn('0')}
                                style={{ flex: 1, height: 40, textAlign: 'center', lineHeight: 40, }} />
                        </View>
                        <CityPicker visible={this.state.show_city_picker} callbackParent={() => this.pushDetails()} ref="cPicker" />
                    </View>
                </ScrollView>

            </View >


        );

    }


}
const styles = StyleSheet.create({

    content: {
        flex: 1,
        height: 50,
        alignItems: 'center',
    }, container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        backgroundColor: '#028CE5',
    }, page: {
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
