import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    TouchableNativeFeedback,
    Image,
    InteractionManager,
    FlatList,
    ToastAndroid
} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import LoadingMore from './loadmore';
var pageNum = 1;
var totalPage = 0;
import LoadView from './loading';
import NetUitl from './netUitl';
import StringBufferUtils from './StringBufferUtil';
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/list';
var DELETE_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/delete';
import Global from './global';
import PublicTitle from './public_title';
var BACK_ICON = require('./images/tabs/nav_return.png');
var TYPE_ICON = require('./images/tabs/type_icon.png');
var isFrist = false;
var typeId = '0';
import StringUtil from './StringUtil';
var menuName = ['全部', '已审批', '审批中', '未提交', '被驳回'];
var menuId = ['0', '1', '2', '3', '4'];
var toplist = new Array();
import Dimensions from 'Dimensions';
var screenW = Dimensions.get('window').width;
import CopyRightDetail from './copyright_detail';
var RETURN_ICON = require('./images/tabs/icon_return.png');
var SHENPI_ICON = require('./images/tabs/icon_already.png');
var SHENPING_ICON = require('./images/tabs/icon_in.png');
var WTJ_ICON = require('./images/tabs/icon_not.png');
export default class MyCopyrightActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoadMore: false,
            show_foot: false,
            is_end: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            topList: {}

        };
        this._data = [];
    }

    componentDidMount() {
        this.initTopMenu();
        this.getData(typeId);
    }
    componentWillUnmount() {
        toplist = [];
        pageNum = 1;
        totalPage = 0;
        this.setState({
            topList: {}

        })

    }
    _getStateLayout(state) {
        switch (state) {
            case '1'://1已审批
                return <Image style={{ height: 16, width: 16, marginLeft: 20 }} source={SHENPI_ICON} />;
                break
            case '2'://2审批中
                return <Image style={{ height: 16, width: 16, marginLeft: 20 }} source={SHENPING_ICON} />;
                break
            case '3'://3未提交
                return <Image style={{ height: 16, width: 16, marginLeft: 20 }} source={WTJ_ICON} />;
                break
            case '4'://4被驳回
                return <Image style={{ height: 16, width: 16, marginLeft: 20 }} source={RETURN_ICON} />;
                break

        }

    }
    initTopMenu() {
        topList = [];
         toplist.length=0;
        for (var i = 0; i < menuName.length; i++) {
            var menu = new Object();
            menu.id = menuId[i];
            menu.name = menuName[i];
            if (i == 0) {

                menu.select = true;
            } else {
                menu.select = false;

            }
            toplist.push(menu);

        }
        this.setState({
            topList: toplist,

        })


    }

    getData(typeId) {


        if (!this.state.show_foot) {

            this.setState({
                show: true
            });
        }
        StringBufferUtils.init();
        StringBufferUtils.append('userid=' + Global.userId);
        StringBufferUtils.append('&&status=' + typeId);
        StringBufferUtils.append('&&pageNo=' + pageNum);
        StringBufferUtils.append('&&recordsperpage=' + 10);
        let params = StringBufferUtils.toString();
        this.fetchData(params);


    }
    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(SEARCH_URL, param, '', function (set) {
            //下面的就是请求来的数据
            if (null != set && set.return_code == '0') {
                totalPage = set.totalPage;
                that.addItemKey(set.result);
                pageNum++;
            } else {
                that.setState({
                    show: false
                });

            }




        })

    }
    //整合数据
    addItemKey(rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].id;

            }

            that._data = that._data.concat(rulelist);
            var ismore = false;
            if (parseInt(totalPage) > 1) {

                ismore = true;
            }
            let isNoMore = pageNum >= parseInt(totalPage); //是否已无更多数据
            if (!isNoMore) {

                that.setState({

                    isLoadMore: false,
                    show_foot: true,

                })
            } else {
                that.setState({

                    isLoadMore: false,
                    show_foot: false,

                })

            }


            that.setState({
                dataSource: that.state.dataSource.cloneWithRows(that._data),
                show: false
            });


        } else {
            that.setState({
                show: false,
            });
        }


    }
    deleteRow(data, rowId) {
        // rowMap[`${secId}${rowId}`].closeRow();

        this.deleteMethord(data.id, rowId);
    }

    /**
     * 删除版权
     * @param {*} id 
     */
    deleteMethord(id, rowId) {
        this.setState({
            show: true

        })
        StringBufferUtils.init();
        StringBufferUtils.append('id=' + id);
        let params = StringBufferUtils.toString();
        this.deleteData(params, rowId);
    }
    deleteData(param, rowId) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(DELETE_URL, param, '', function (set) {
            //下面的就是请求来的数据
            if (null != set && set.return_code == '0') {
                var list = that._data;
                //移除列表中下标为index的项
                delete list[rowId];
                //更新列表的状态
                that._data = list;
                that.setState({
                    dataSource: that.state.dataSource.cloneWithRows(list),
                    show: false
                });
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(set.msg, ToastAndroid.SHORT);
                that.setState({
                    show: false
                });

            }




        })

    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }

    /**
    * 
    * @param {*下拉加载更多} end 
    */
    _onLoadMore() {
        InteractionManager.runAfterInteractions(() => {

            //执行耗时的同步任务
            this.getData(typeId);
            let isNoMore = pageNum > parseInt(totalPage); //是否已无更多数据
        });

    }

    /**
   * 显示上啦加载view
   * @private
   */
    _renderLoadMore() {
        var that = this;
        if (this.state.show_foot) {

            return (
                <LoadingMore
                    isLoading={this.state.isLoadMore}
                    onLoading={() => {
                        that.setState({
                            isLoadMore: true
                        });
                        that._onLoadMore();

                    }}
                />
            );
        }
    }

    /**
       * 返回类型
       * @param {*} typeStr 
       */
    _getType(typeStr) {
        var typeTitle = '';

        if (null != typeStr && typeStr != '') {
            switch (parseInt(typeStr)) {
                case 1:
                    typeTitle = "摄影";
                    break;
                case 2:
                    typeTitle = "口述";
                    break;
                case 3:
                    typeTitle = "音乐";
                    break;
                case 4:
                    typeTitle = "戏剧";
                    break;
                case 5:
                    typeTitle = "曲艺";
                    break;
                case 6:
                    typeTitle = "舞蹈";
                    break;
                case 7:
                    typeTitle = "杂技";
                    break;
                case 8:
                    typeTitle = "美术";
                    break;
                case 9:
                    typeTitle = "文字";
                    break;
                case 10:
                    typeTitle = "电影";
                    break;
                case 11:
                    typeTitle = "建筑";
                    break;
                case 12:
                    typeTitle = "模型";
                    break;
                case 13:
                    typeTitle = "摄制作品";
                    break;
                case 14:
                    typeTitle = "地图";
                    break;
                case 15:
                    typeTitle = "设计图";
                    break;
                case 16:
                    typeTitle = "其他";
                    break;

            }


        }


        return typeTitle;


    }

    _getStatesType(typeStr) {
        var typeTitle = '';

        if (null != typeStr && typeStr != '') {
            switch (parseInt(typeStr)) {
                case 0:
                    typeTitle = "全部";
                    break;
                case 1:
                    typeTitle = "已审批";
                    break;
                case 2:
                    typeTitle = "审批中";
                    break;
                case 3:
                    typeTitle = "未提交";
                    break;
                case 4:
                    typeTitle = "被驳回";
                    break;
            }

        }


        return typeTitle;


    }
    _renderImage = (data) => {

        if (StringUtil.isNotEmpty(data.storepath)) {

            return <Image style={{ width: 60, height: 60, marginLeft: 10 }} source={{ uri: data.storepath }}></Image>
        }
    }
    //点击列表点击每一行
    clickItem(item) {
        this.props.navigator.push({
            component: CopyRightDetail,
            params: {
                detail_id: item.id

            }
        })
    }
    _renderTopItem = (itemData, index) => {
        return <TouchableOpacity key={index} activeOpacity={1} onPress={() => this.selectMenu(itemData, index)}>

            {this.selectIcon(itemData.item.select, itemData.item.name)}
        </TouchableOpacity >

    }
    selectIcon(select, name) {
        if (select) {

            return <View style={{ flexDirection: 'column' }}>

                <Text style={[{ height: 48, width: (screenW - 10) / 5 }, styles.top_select_name]}>{name}</Text>
                <View style={{ height: 2, width: (screenW - 10) / 5, backgroundColor: '#ff9602' }} />
            </View>
        } else {
            return <View style={{ flexDirection: 'column' }}>

                <Text style={[{ height: 48, width: (screenW - 10) / 5 }, styles.top_name]}>{name}</Text>
                <View style={{ height: 2, width: (screenW - 10) / 5, backgroundColor: '#ffffff' }} />
            </View>

        }


    }
    // 选中类型
    selectMenu(itemData, index) {
        this.changeMenu(itemData);
    }
    changeMenu(itemData) {

        var menuList = this.state.topList;
        var list = new Array();
        for (var i = 0; i < menuList.length; i++) {
            var menus = menuList[i];
            if (itemData.index == i) {

                menus.select = true;

            } else {
                menus.select = false;

            }
            list.push(menus);
        }
        typeId = itemData.item.id;
        pageNum = 1;
        totalPage = 0;
        this._data = [];
        this.setState({

            show: true,
            topList: list,
            show: false,
            show_foot: false,
            dataSource: this.state.dataSource.cloneWithRows(this._data),
        })
        this.getData(typeId);

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }

    // 返回国内法规Item
    _renderSearchItem = (itemData) => {
        var types = this._getType(itemData.category);
        var status = this._getStatesType(itemData.examinestatus);
        return (
            <View style={{ height: 90, justifyContent: 'center', marginTop: 1, backgroundColor: 'white' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {this._renderImage(itemData)}
                        <View style={{ height: 90, flexDirection: 'column', justifyContent: 'center', flex: 1, marginLeft: 10 }}>
                            <Text style={styles.rule_item_title} numberOfLines={2}>{itemData.name}</Text>
                            <Text style={styles.rule_item_time}>作品类型:{types}</Text>
                            <Text style={styles.rule_item_time}>著作权人:{itemData.username}</Text>

                        </View>
                        <View style={{ height: 90 }}>
                            <View style={{ flexDirection: 'row', marginTop: 20, marginRight: 10 }}>

                                {this._getStateLayout(itemData.examinestatus)}
                                <Text style={{ textAlign: 'center', color: '#999999', fontSize: 13, marginLeft: 5 }}>{status}</Text>
                            </View>

                        </View>


                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }


    /**
     * 是否可以删除
     * @param {*} data 
     */

    _isDelete = (data) => {
        var _delete = false;
        if (data.examinestatus == '3' || data.examinestatus == '4') {

            _delete = true;
        } else {
            _delete = false;
        }

        return _delete;

    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    render() {
        let self = this;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#028CE5'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle text='我的版权' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <View style={{ height: 50, backgroundColor: 'white' }}>

                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        renderItem={this._renderTopItem}
                        horizontal={true}
                        keyExtractor={this._keyExtractor}
                        data={this.state.topList}>
                    </FlatList>

                </View>
                <SwipeListView
                    dataSource={this.state.dataSource}
                    renderFooter={() => self._renderLoadMore()}
                    renderRow={(data, secId, rowId, rowMap) => (
                        <SwipeRow
                            disableLeftSwipe={false}
                            disableRightSwipe={this._isDelete(data)}
                            leftOpenValue={0}
                            rightOpenValue={-80}
                        >
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(data, rowId)}>
                                    <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            {this._renderSearchItem(data)}
                        </SwipeRow>
                    )}
                />


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    backTextWhite: {
        color: '#FFF',
        textAlign: 'center'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 90,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 60,
    },
    backRightBtnRight: {
        backgroundColor: '#ff9602',
        right: 0,
        height: 88,
        marginTop: 1,

    },
    controls: {
        alignItems: 'center',
        marginBottom: 30
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
    top_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontSize: 14,
    }, top_select_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#ff9602',
        fontSize: 14,
    }
});
