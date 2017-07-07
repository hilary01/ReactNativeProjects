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
    ListView
} from 'react-native';

//根据需要引入
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh'
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/search';
var searchList;
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
var TYPE_ICON = require('./images/tabs/type_icon.png');
var TIME_ICON = require('./images/tabs/type_time.png');
var pageNum = 1;
var totalPage = 0;
export default class SearchActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            show: true,
            isLoadMore: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })


        };
        this._data = [];

    }

    componentDidMount() {

        this.setState({
            keyWord: this.props.keyword

        })
        this.getData(this.props.keyword);



    }

    getData(keyWord) {
        StringBufferUtils.init();
        StringBufferUtils.append('title=' + keyWord);
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
            if (null != set && 'undefind' != set && '' != set.totalPage) {
                totalPage = set.totalPage;
                that.addItemKey(set.result);
                pageNum++;
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
                show:false
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


            // end()//刷新成功后需要调用end结束刷新 不管成功或者失败都应该结束
        }, 1500)
    }


    /**
     * 
     * @param {*下拉加载更多} end 
     */
    _onLoadMore(end) {
        this.getData(this.props.keyword);
        let isNoMore = pageNum > parseInt(totalPage); //是否已无更多数据
        end(isNoMore)// 假设加载4页后数据全部加载完毕 加载成功后需要调用end结束刷新  


    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        var types = this._getType(itemData.category);
        return (
            <View style={{ height: 100, justifyContent: 'center', marginTop: 10 }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.name}</Text>
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
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _goSearchResult() {

        pageNum = 1;
        this.getData(this.state.keyWord);

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
                {/*{this.state.show == true ? (<LoadView />) : (null)}*/}
                {/*搜索头部控件*/}
                <View style={styles.top_layout}>
                    <View style={styles.left_view} >

                        <TouchableNativeFeedback onPress={() => this._backOnclick()} >
                            <Image style={styles.left_icon} source={BACK_ICON}></Image>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 45, flex: 1 }}>

                        <TextInput style={{
                            flex: 1, height: 36, backgroundColor: '#cde8fb', paddingLeft: 35, marginLeft: 5,
                            borderRadius: 5, marginRight: 10
                        }} onChangeText={(keyWord) => this.setState({ keyWord })}
                            value={this.state.keyWord} placeholderTextColor='#999999' returnKeyType='search'
                            underlineColorAndroid='transparent' placeholder='搜索作品名、著作权人' onSubmitEditing={() => { this._goSearchResult() }}>
                        </TextInput>
                        <Image style={{ width: 20, height: 20, marginLeft: 15, position: 'absolute' }} source={SEARCH_ICON} />

                    </View>


                </View>
                <SwRefreshListView
                    dataSource={this.state.dataSource}
                    ref="listView"
                    renderRow={this._renderSearchItem}
                    /*onRefresh={this._onListRefersh.bind(this)}//设置下拉刷新的方法 传递参数end函数 当刷新操作结束时 */
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
});
