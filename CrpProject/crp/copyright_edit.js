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
    TextInput
} from 'react-native';
import Global from './global';
import PublicTitle from './public_title';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringUtil from './StringUtil';
var BACK_ICON = require('./images/tabs/nav_return.png');
import StringBufferUtils from './StringBufferUtil';
var DETAIL_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/detail';
const ICON_MORE = require('./images/tabs/icon_more.png');
var IMAGE_DEFAULT = require('./images/tabs/defalut_img.png');
var ADD_IMG = require('./images/tabs/icon_addimg.png');
// var powerName = ['发表权', '署名权', '修改权', '保护作品完整权', '复制权', '发行权',
//     '出租权', '展览权', '表演权', '放映权', '广播权', '信息网络传播权', '摄制权', '改编权', '翻译权', '汇编权', '其他'];
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
export default class ApplyActivity extends Component {
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
            show_pubaddress: false


        };
        this.onSelect = this.onSelect.bind(this)
    }
    onSelect(index, value) {
        if (value == '0') {

            this.setState({

                show_pubaddress: false
            })
        } else {
            this.setState({

                show_pubaddress: true
            })

        }
    }
    componentDidMount() {
        var data = this.props.detail_entity;
        var index = parseInt(data.publishstatus);
        var flag = data.publishstatus == '1' ? true : false;

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
            show_pubaddress: flag
        })
    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    _addImage() {

        alert('add_img');
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
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{data.initilizepublisheddatetime}</Text>
                            <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                        </View>

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                </View>
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>首次发表地址</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{data.initilizepublishedsite}</Text>
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
            return strs.length + '项';
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
    _showRightBtn(state) {
        return <View style={styles.right_view} >
            <Text style={{
                textAlign: 'center', width: 60, color: '#ffffff'
            }} onPress={() => this._editInfo(state)}>
                保存
                        </Text>
        </View>
    }
    _editInfo(state) {

        alert('保存数据');

    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    render() {
        return (
            <View style={styles.page}>
                {/* {this.state.show == true ? (<LoadView />) : (null)} */}
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
                    {this._showRightBtn(this.state.detailEntity.status)}

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
                                    <TouchableNativeFeedback onPress={() => this._addImage()} >
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
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>著作权人信息</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>{this._getCopyrightPerson()}</Text>

                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作者信息</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>{this._getAuthorPerson()}</Text>

                            </View>
                        </View>

                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品状态信息</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>作品创作性质</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{this._getCreateTypeTxt(this.state.detailEntity.rightcreatetype)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />

                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成日期</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{this.state.detailEntity.finisheddatetime}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>

                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成地址</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{this.state.detailEntity.finishedaddress}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>发表状态</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <RadioGroup selectedIndex={this.state.selectedIndex}
                                        onSelect={(index, value) => this.onSelect(index, value)}
                                    >

                                        <RadioButton value={'0'}  >
                                            <Text>未发表</Text>
                                        </RadioButton>
                                        <RadioButton value={'1'} >
                                            <Text>已发表</Text>
                                        </RadioButton>



                                    </RadioGroup>
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
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{this._getPowerGetTxt(this.state.detailEntity.rightgettype)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利归属方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getPowerOwnerTxt(this.state.detailEntity.righttoattributionway)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利拥有状况</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getPowerSize(this.state.detailEntity.righttoattributionstatuss)}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>选择办理机构</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>中国 山东省</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 10, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 5 }}>{this.state.detailEntity.copyrightcityname}</Text>
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
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
