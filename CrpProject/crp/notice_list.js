import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    TouchableNativeFeedback,
    StatusBar,
    ScrollView,
    ToastAndroid,
    ListView,
    TouchableOpacity
} from 'react-native';

//根据需要引入
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh'
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/news/noticelist';
var searchList;
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
var TYPE_ICON = require('./images/tabs/type_icon.png');
var TIME_ICON = require('./images/tabs/type_time.png');
var pageNum = 1;
var totalPage = 0;
var typeId = '1';
var menuName = ['摄影', '口述', '音乐', '戏剧', '曲艺', '舞蹈', '杂技', '美术', '文字', '电影', '建筑', '模型', '摄制作品', '地图', '设计图', '其他'];
var menuId = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
import PublicTitle from './public_title';
var toplist = new Array();
export default class NoticeActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            show: true,
            isLoadMore: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            topList: {}


        };
        this._data = [];

    }

    componentDidMount() {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法
        this.initTopMenu();
        this.getData(typeId);



    }
    componentWillUnmount() {
        toplist.length = 0;
        pageNum = 1;
        totalPage = 0;
        this.setState({
            topList: {}

        })

    }
    initTopMenu() {


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

    getData(typeid) {
        StringBufferUtils.init();
        StringBufferUtils.append('typeid=' + typeid);
        StringBufferUtils.append('&&pageNo=' + pageNum);
        StringBufferUtils.append('&&recordsperpage=' + 10);
        let params = StringBufferUtils.toString();
        this.fetchData(params);

    }


    /**
     * 判断是否是最后一页
     * @param {*} totalPage 
     */

    getIsLastPage(totalPage) {
        var islast = false;

        if (pageNum <= parseInt(totalPage)) {

            islast = false;
        } else {
            this.refs.listView.setNoMoreData()
            islast = true;
        }



        return islast;
    }



    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(SEARCH_URL, param, '', function (set) {

            //下面的就是请求来的数据
            if (null != set && 'undefind' != set && '' != set.totalPage && set.return_code == '0') {
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
            that.setState({
                dataSource: that.state.dataSource.cloneWithRows(this._data),
                isLoadMore: ismore,
                show: false
            });


        }

    }

    /**
     * 下拉刷新
     * @param {*} end 
     */
    _onListRefersh(end) {
        let timer = setTimeout(() => {

            clearTimeout(timer)
            end()//刷新成功后需要调用end结束刷新 不管成功或者失败都应该结束
        }, 500)
    }


    /**
     * 
     * @param {*下拉加载更多} end 
     */
    _onLoadMore(end) {
        this.getData(typeId);
        let isNoMore = pageNum > parseInt(totalPage); //是否已无更多数据
        end(isNoMore)// 假设加载4页后数据全部加载完毕 加载成功后需要调用end结束刷新  


    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        var types = this._getType(itemData.category);
        return (
            <View style={{ height: 110, justifyContent: 'center', marginTop: 10, backgroundColor: 'white' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 110, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title} numberOfLines={2}>{itemData.name}</Text>
                        <Text style={styles.rule_item_time}>{itemData.certificatenumber}</Text>
                        <Text style={styles.rule_item_time}>{itemData.realname}</Text>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2', marginTop: 5 }}></View>
                        <View style={{ height: 40, flexDirection: 'row', marginTop: 5, flex: 1 }}>
                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>

                                <Image style={{ width: 16, height: 16, marginLeft: 20 }} source={TYPE_ICON} />
                                <Text style={{ textAlign: 'center', color: '#999999', fontSize: 13, marginLeft: 5 }}>{types}</Text>
                            </View>
                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>

                                <Image style={{ width: 16, height: 16 }} source={TIME_ICON} />
                                <Text style={{ textAlign: 'center', color: '#999999', fontSize: 13, marginLeft: 5, marginRight: 10 }}>{itemData.djdatetime}</Text>
                            </View>

                        </View>

                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
    _renderTopItem = (itemData, index) => {
        return <TouchableOpacity key={index} activeOpacity={1} onPress={() => this.selectMenu(itemData, index)}>

            {this.selectIcon(itemData.item.select, itemData.item.name)}
        </TouchableOpacity >

    }
    selectIcon(select, name) {
        if (select) {

            return <View style={{ flexDirection: 'column' }}>

                <Text style={[{ height: 48, width: 60 }, styles.top_select_name]}>{name}</Text>
                <View style={{ height: 2, width: 60, backgroundColor: '#ff9602' }} />
            </View>
        } else {
            return <View style={{ flexDirection: 'column' }}>

                <Text style={[{ height: 48, width: 60 }, styles.top_name]}>{name}</Text>
                <View style={{ height: 2, width: 60, backgroundColor: '#ffffff' }} />
            </View>

        }


    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }

    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    //点击列表点击每一行
    clickItem(item, index) {
        ToastAndroid.show('抱歉由于版权局权限原因，暂不支持点击', ToastAndroid.SHORT);
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
        menuId = itemData.item.id;
        pageNum = 1;
        this.setState({

            show: true,
            topList: list,
        })
        this._data = [];
        this.getData(menuId);

    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
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
                <PublicTitle text='登记公告' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <View style={{ height: 50, backgroundColor: 'white' }}>

                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        renderItem={this._renderTopItem}
                        horizontal={true}
                        keyExtractor={this._keyExtractor}
                        data={this.state.topList}>
                    </FlatList>

                </View>
                <SwRefreshListView
                    dataSource={this.state.dataSource}
                    ref="listView"
                    renderRow={this._renderSearchItem}
                    onRefresh={this._onListRefersh.bind(this)}//设置下拉刷新的方法 传递参数end函数 当刷新操作结束时 */
                    onLoadMore={this._onLoadMore.bind(this)} //设置上拉加载执行的方法 传递参数end函数 
                    isShowLoadMore={this.state.isLoadMore}
                //可以通过state控制是否显示上拉加载组件，可用于数据不足一屏或者要求数据全部加载完毕时不显示上拉加载控件

                /*customRefreshView={(refresStatus, offsetY) => {
                    return (<Text>{'状态:' + refresStatus + ',' + offsetY}</Text>)
                }} 

                customRefreshViewHeight={100} //自定义刷新视图时必须指定高度*/

                />
            </View>


        );

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
