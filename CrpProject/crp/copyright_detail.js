import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableNativeFeedback,
    Image,
    FlatList,
    ScrollView
} from 'react-native';
import Global from './global';
import PublicTitle from './public_title';
import LoadView from './loading';
import NetUitl from './netUitl';
import StringUtil from './StringUtil';
var BACK_ICON = require('./images/tabs/nav_return.png');
var RETURN_ICON = require('./images/tabs/icon_return.png');
var SHENPI_ICON = require('./images/tabs/icon_already.png');
var SHENPING_ICON = require('./images/tabs/icon_in.png');
var WTJ_ICON = require('./images/tabs/icon_not.png');
import StringBufferUtils from './StringBufferUtil';
var DETAIL_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/detail';
import CopyRightEdit from './copyright_edit';
var IMAGE_DEFAULT = require('./images/tabs/defalut_img.png');
// var powerName = ['发表权', '署名权', '修改权', '保护作品完整权', '复制权', '发行权',
//     '出租权', '展览权', '表演权', '放映权', '广播权', '信息网络传播权', '摄制权', '改编权', '翻译权', '汇编权', '其他'];
export default class ApplyActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            detailId: '',
            workLists: {},
            detailEntity: {},
            loadEnd: true,
            copyrightpersons: {},
            authorPersons: {}


        };
    }
    componentDidMount() {
        this.getData(this.props.detail_id);
    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    getData(id) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('id=' + id);
        let params = StringBufferUtils.toString();
        this.fetchData(params);


    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(DETAIL_URL, param, '', function (set) {
            // alert(JSON.stringify(set));
            //下面的就是请求来的数据
            if (null != set && set.return_code == '0') {
                that.setState({
                    detailEntity: set.result,
                    workLists: set.result.storefile,
                    copyrightpersons: set.result.copyrightowner,
                    authorPersons: set.result.authors

                })
            } else {
                that.setState({
                    show: false
                });

            }




        })

    }
    /**
     * 审批状态栏
     * @param {*} state 
     */
    _getStateLayout(state) {

        switch (state) {
            case '1'://1已审批
                return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <Image style={{ height: 16, width: 16 }} source={SHENPI_ICON} />
                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>已审批</Text>
                </View>

                break
            case '2'://2审批中
                return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <Image style={{ height: 16, width: 16 }} source={SHENPING_ICON} />
                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>审批中</Text>
                </View>
                break
            case '3'://3未提交
                return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <Image style={{ height: 16, width: 16 }} source={WTJ_ICON} />
                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>未提交</Text>
                </View>
                break
            case '4'://4被驳回
                return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <Image style={{ height: 16, width: 16 }} source={RETURN_ICON} />
                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>被驳回</Text>
                </View>
                break

        }

    }
    /**
     * 驳回理由
     */
    _returnLayout(state) {
        if (state == '4') {
            return <View>
                <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>驳回理由</Text>
                <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>作品描述过于简单</Text>

                </View>
            </View>
        }


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
        if (data.publishstatus == '1') {
            return <View>
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>首次发表日期</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{data.initilizepublisheddatetime}</Text>
                        </View>

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                </View>
                <View>
                    <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>首次发表地址</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{data.initilizepublishedsite}</Text>
                        </View>

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
        if (state == '3' || state == '4') {


            return <View style={styles.right_view} >
                <Text style={{
                    textAlign: 'center', width: 60, color: '#ffffff'
                }} onPress={() => this._editInfo(state)}>
                    修改
                        </Text>
            </View>
        } else if (state == '1') {

            return <View style={styles.right_view} >
                <Text style={{
                    textAlign: 'center', width: 60, color: '#ffffff'
                }} onPress={() => this._editInfo(state)}>
                    证书
                        </Text>
            </View>
        }
    }
    _editInfo(state) {
        var that = this;
        if (state == '3' || state == '4') {//跳转到编辑界面

            that.props.navigator.push({
                component: CopyRightEdit,
                params: {
                    detail_entity: that.state.detailEntity

                }
            })
        } else {



        }


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
                        <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品状态信息</Text>
                        <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>当前状态</Text>
                            {this._getStateLayout(this.state.detailEntity.status)}
                        </View>

                        {this._returnLayout(this.state.detailEntity.status)}
                        <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品信息</Text>
                        <View style={{ backgroundColor: 'white', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>上传作品</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginLeft: 60 }}>

                                <FlatList
                                    style={{ width: 100 }}
                                    ref={(flatLists) => this._flatLists = flatLists}
                                    renderItem={this._renderWorkItem}
                                    horizontal={true}
                                    keyExtractor={this._keyExtractor}
                                    data={this.state.workLists}>
                                </FlatList>

                            </View>
                        </View>
                        <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>作品名称</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.name}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>作品说明</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, paddingRight: 5 }}>{this.state.detailEntity.creativedescription}</Text>

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
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getCreateTypeTxt(this.state.detailEntity.rightcreatetype)}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成日期</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.finisheddatetime}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>

                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>创作/制作完成地址</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.finishedaddress}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>发表状态</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.publishstatus == '1' ? '已发表' : '未发表'}</Text>
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
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.realname}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>联系方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.telephone}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>


                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>权利状况说明</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利取得方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getPowerGetTxt(this.state.detailEntity.rightgettype)}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利归属方式</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getPowerOwnerTxt(this.state.detailEntity.righttoattributionway)}</Text>
                                </View>

                            </View>
                        </View>
                        <View>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>权利拥有状况</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this._getPowerSize(this.state.detailEntity.righttoattributionstatuss)}</Text>
                                </View>

                            </View>
                        </View>
                        <View>
                            <Text style={{ color: '#666666', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>选择办理机构</Text>
                            <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 14, }}>中国 山东省</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ color: '#666666', paddingTop: 10, paddingBottom: 5, paddingLeft: 5, fontSize: 14, marginRight: 10 }}>{this.state.detailEntity.copyrightcityname}</Text>
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />
                        </View>
                    </View>

                </ScrollView>
            </View>


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
