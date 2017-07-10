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
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
//根据需要引入
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh'
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/news/newslist';
var searchList;
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
var TYPE_ICON = require('./images/tabs/type_icon.png');
var TIME_ICON = require('./images/tabs/type_time.png');
var pageNum = 1;
var totalPage = 0;
var typeId = '1';//默认1国际法规2国内法规
import PublicTitle from './public_title';
import WebviewDetail from './webdetail';
var toplist = new Array();
export default class LawRuleActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            show: true,
            isLoadMore: false,
            isSelect: true,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),


        };
        this._data = [];

    }

    componentDidMount() {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法
        this.getData(typeId);



    }


    getData(typeid) {
        console.log(typeid);
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
        return (
            <View style={{ height: 100, justifyContent: 'center', marginTop: 1, backgroundColor: 'white' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: 80, width: 80 }} source={itemData.thumbpath}></Image>
                        <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={styles.news_item_title} numberOfLines={2}>{itemData.title}</Text>
                            <Text style={styles.rule_item_time}>{itemData.publishtime}</Text>
                            <Text style={styles.rule_item_title} numberOfLines={2}>{itemData.content}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>
            </View>
        );
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
        this.props.navigator.push({
            component: WebviewDetail,
            params: {
                root_url: item.tourl,
                title: item.title,
            }
        })
    }

    // 选中类型
    selectMenu(flag) {

        switch (flag) {
            case '1':
                this.changeSelectData('1', true);
                break;
            case '2':
                this.changeSelectData('2', false);
                break;

        }

    }
    //更改数据
    changeSelectData(type, flag) {
        var is_select = true;
        typeId = type;
        is_select = flag;
        pageNum = 1;
        this._data = [];
        this.setState({

            show: true,
            isSelect: is_select
        })
        this.getData(typeId);
    }
    changeMenu(itemData) {
        menuId = itemData.item.id;
        pageNum = 1;
        this.setState({

            show: true,
        })
        this._data = [];
        this.getData(menuId);

    }
    _topTab = () => {

        return <View style={{ height: 50, backgroundColor: 'white', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <TouchableOpacity activeOpacity={1} onPress={() => this.selectMenu('1')}>


                <View style={{ flexDirection: 'row', alignItems: 'center', width: ScreenWidth / 2 - 20, marginRight: 10, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {this.state.isSelect == true ? (<Text style={[{ height: 48, textAlign: 'center', width: ScreenWidth / 2 - 20 }, styles.top_select_name]}>省内资讯</Text>
                        )
                            : (<Text style={[{ height: 48, textAlign: 'center', width: ScreenWidth / 2 - 20 }, styles.top_name]}>省内资讯</Text>)}
                        {this.state.isSelect == true ? (<View style={{ height: 2, backgroundColor: '#ff9602', width: ScreenWidth / 2 - 100 }} />
                        )
                            : (<View style={{ height: 2, backgroundColor: '#ffffff', width: ScreenWidth / 2 - 100 }} />)}

                    </View>
                </View>

            </TouchableOpacity >
            <TouchableOpacity activeOpacity={1} onPress={() => this.selectMenu('2')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: ScreenWidth / 2 - 20, marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {this.state.isSelect == true ? (<Text style={[{ height: 48, textAlign: 'center', width: ScreenWidth / 2 - 20 }, styles.top_name]}>国内资讯</Text>
                        )
                            : (<Text style={[{ height: 48, textAlign: 'center', width: ScreenWidth / 2 - 20 }, styles.top_select_name]}>国内资讯</Text>)}

                        {this.state.isSelect == true ? (<View style={{ height: 2, backgroundColor: '#ffffff', width: ScreenWidth / 2 - 100 }} />
                        )
                            : (<View style={{ height: 2, backgroundColor: '#ff9602', width: ScreenWidth / 2 - 100 }} />)}
                    </View>
                </View>
            </TouchableOpacity >

        </View >



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
                <PublicTitle text='相关法规' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <View style={{ height: 50, flexDirection: 'row' }}>

                    {this._topTab()}

                </View>
                <SwRefreshListView
                    style={{ marginTop: 10 }}
                    dataSource={this.state.dataSource}
                    ref="listView"
                    renderRow={this._renderSearchItem}
                    onRefresh={this._onListRefersh.bind(this)}//设置下拉刷新的方法 传递参数end函数 当刷新操作结束时 */
                    onLoadMore={this._onLoadMore.bind(this)} //设置上拉加载执行的方法 传递参数end函数 
                    isShowLoadMore={this.state.isLoadMore}
                    //可以通过state控制是否显示上拉加载组件，可用于数据不足一屏或者要求数据全部加载完毕时不显示上拉加载控件


                    customRefreshView={(refresStatus, offsetY) => {
                        return null;
                    }}

                    customRefreshViewHeight={0} //自定义刷新视图时必须指定高度*/

                />
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
        fontSize: 13,
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
    }, news_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    },
});
