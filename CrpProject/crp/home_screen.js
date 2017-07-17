import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    FlatList,
    TouchableNativeFeedback,
    ProgressBarAndroid,
    ToastAndroid,
    AsyncStorage
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import LoadView from './loading'
var HOME_URL = 'http://drmlum.rdgchina.com/drmapp/index/indexlist';
var CITY_URL = 'http://drmlum.rdgchina.com/drmapp/publicfuc/regionlist';
const RULE_BG = require('./images/tabs/rule_bg.png');
const RULE_ICONS = require('./images/tabs/rule_icons.png');
const RIGHT_ICONS = require('./images/tabs/icon_more.png');
const NEWS_ICONS = require('./images/tabs/news_icon.png');
const NOTICE_ICONS = require('./images/tabs/notice_icons.png');
const POINT_ICONS = require('./images/tabs/point_icons.png');
import WebviewDetail from './webdetail';
import NetUitl from './netUitl';
import NoticeActivity from './notice_list'
import LawActivity from './law_rule'
import NewsActivity from './news_list'
export default class TopScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            dataSource: new ViewPager.DataSource({
                pageHasChanged: (p1, p2) => p1 !== p2,
            }),
            show: true,
            ruleData: {},
            newsData: {},
            noticeData: {},
        }
    }

    componentDidMount() {
        this.fetchData(HOME_URL);
        this.mounted = true;
    }
    // 数据请求 
    fetchData(url) {
        var that = this;
        NetUitl.post(url, '', '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && 'undefind' != responseData && responseData.return_code == '0') {
                that.setState({
                    dataSource: that.state.dataSource.cloneWithPages(responseData.adlist),
                });
                that.addItemKey(responseData.statutelist, responseData.newslist, responseData.noticelist)

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }

    //整合数据
    addItemKey(rulelist, newslist, noticeList) {

        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].id;

            }
            this.setState({
                ruleData: rulelist
            });

        }


        if (null != newslist && newslist.length > 0) {
            //整合法规数据
            for (var i = 0; i < newslist.length; i++) {
                newslist[i].key = newslist[i].id;

            }
            this.setState({
                newsData: newslist
            });

        }
        if (null != noticeList && noticeList.length > 0) {
            //整合法规数据
            for (var i = 0; i < noticeList.length; i++) {
                noticeList[i].key = i;

            }
            this.setState({
                noticeData: noticeList,

            });
            this.getCityData();

        }
    }

    // 数据请求 
    fetchCityData(url) {
        var that = this;
        NetUitl.post(url, '', '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && 'undefind' != responseData && responseData.return_code == '0') {
                that.saveCityData(responseData.result);
                that.setState({
                    show: false
                });
            } else {
                that.setState({
                    show: false
                });

            }
        })
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

                            show: false
                        })

                    } else {
                        that.fetchCityData(CITY_URL);

                    }

                }
            }
        )
    }

    //保存城市信息
    saveCityData(value) {

        AsyncStorage.setItem(
            'city_list',
            JSON.stringify(value),
            (error) => {
                if (error) {
                    alert('存值失败:', error);
                } else {

                    alert('保存城市数据成功');
                }
            }
        );
    }
    _renderAdvPage(item, pageID) {
        return (
            <Image
                source={{ uri: item.imagefilepath }}
                style={styles.img_item} />
        );
    }
    // 返回国内法规Item
    _renderRuleItem = (itemData, index) => {
        return (
            <View style={{ height: 60, justifyContent: 'center' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 60, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.item.title}</Text>
                        <Text style={styles.rule_item_time}>{itemData.item.publishtime}</Text>

                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
    //返回版权资讯
    _renderNewsItem = (itemData, index) => {
        return (
            <View style={{ height: 120, justifyContent: 'center' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 120, flexDirection: 'column', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                            {this.imageNotEmpty(itemData.item.thumbpath)}
                            <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>

                                <Text style={styles.rule_item_title}>{itemData.item.title}</Text>
                                <Text style={styles.rule_item_time}>{itemData.item.publishtime}</Text>
                                <Text style={styles.rule_content_txt} numberOfLines={2}>{itemData.item.content}</Text>

                            </View>
                        </View>

                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
    //返回通知公告
    _renderNoticeItem = (itemData, index) => {
        var types = this._getType(itemData.item.category);
        return (
            <View style={{ height: 120, width: 180, justifyContent: 'center', backgroundColor: '#F6F9FF' }}>
                <TouchableNativeFeedback onPress={this.showToast}>
                    {this._makeGridView(itemData, types)}
                </TouchableNativeFeedback>
            </View>
        );
    }
    /**
     * 
     * @param {*构建表格} item 
     */
    _makeGridView(itemData, types) {
        if (itemData.index % 2 == 0) {


            return <View style={{ height: 120, width: 175, flexDirection: 'row', justifyContent: 'center', marginLeft: 5 }}>



                <View style={{ height: 120, width: 173, flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 5, height: 5, marginLeft: 5 }} source={POINT_ICONS}></Image>
                        <Text style={styles.notice_type_txt} numberOfLines={1}>{types}</Text>
                    </View>
                    <Text style={styles.notice_time} numberOfLines={1}>{itemData.item.name}</Text>
                    <Text style={styles.notice_time} numberOfLines={1}>作者:{itemData.item.djdatetime}</Text>
                    <Text style={styles.notice_time} numberOfLines={1}>时间:{itemData.item.authorsname}</Text>


                </View>
                <View style={{ height: 120, width: 6, backgroundColor: '#ffffff' }}>

                </View>


            </View>

        } else {

            return <View style={{ height: 120, width: 175, flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 5, height: 5, marginLeft: 5 }} source={POINT_ICONS}></Image>
                    <Text style={styles.notice_type_txt} numberOfLines={1}>{types}</Text>
                </View>
                <Text style={styles.notice_time} numberOfLines={1}>{itemData.item.name}</Text>
                <Text style={styles.notice_time} numberOfLines={1}>作者:{itemData.item.djdatetime}</Text>
                <Text style={styles.notice_time} numberOfLines={1}>时间:{itemData.item.authorsname}</Text>


            </View>
        }


    }
    //返回非空图片
    imageNotEmpty(path) {


        if (null != path && path != '') {

            return <Image style={styles.news_img_item} source={{ uri: path }}></Image>;
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
    //点击列表点击每一行
    clickItem(item, index) {
        //或者写成 const navigator = this.props.navigator;
        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        this.props.navigator.push({
            component: WebviewDetail,
            params: {
                root_url: item.item.tourl,
                title: item.item.title,
            }
        })
    }


    showToast = () => {

        ToastAndroid.show('抱歉由于版权局权限原因，暂不支持点击', ToastAndroid.SHORT);
    }
    // 跳转到公告列表
    _goNoticeActivity = () => {
        this.props.navigator.push({
            component: NoticeActivity,
            params: {
            }
        })

    }
    // 跳转到法规列表
    _goLawActivity = () => {
        this.props.navigator.push({
            component: LawActivity,
            params: {
            }
        })

    }

    // 跳转到资讯列表
    _goNewsActivity = () => {
        this.props.navigator.push({
            component: NewsActivity,
            params: {
            }
        })

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _keyExtractor = (item, index) => item.key;
    render() {
        return (
            <View style={styles.main_view}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                <View style={styles.page}>
                    <ViewPager
                        style={{ height: 140 }}
                        dataSource={this.state.dataSource}
                        renderPage={this._renderAdvPage}
                        keyExtractor={this._keyExtractor}
                        isLoop={true}
                        autoPlay={true} />
                </View>
                {/*相关法规*/}
                <View style={{ backgroundColor: '#ffffff', marginTop: 3 }}>


                    <View style={styles.news_rule_view}>

                        <View style={styles.rule_left}>

                            <Image style={styles.rule_left_img} source={RULE_ICONS}></Image>
                            <Text style={styles.rule_left_txt}>相关法规</Text>

                        </View>

                        <TouchableNativeFeedback onPress={this._goLawActivity}>
                            <View style={styles.rule_right}>
                                <Text style={styles.rule_right_txt}>更多</Text>
                                <Image style={styles.rule_right_img} source={RIGHT_ICONS} />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <Image source={RULE_BG} style={{ height: 100 }} />
                    <View style={{ height: 185 }}>


                        <FlatList
                            ref={(flatList) => this.ruleList = flatList}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderRuleItem}
                            data={this.state.ruleData}>
                        </FlatList>

                    </View>
                </View>
                {/*版权资讯*/}
                <View style={{ backgroundColor: '#ffffff', marginTop: 8 }}>


                    <View style={styles.news_rule_view}>

                        <View style={styles.rule_left}>

                            <Image style={styles.rule_left_img} source={NEWS_ICONS}></Image>
                            <Text style={styles.rule_left_txt}>版权资讯</Text>

                        </View>
                        <TouchableNativeFeedback onPress={this._goNewsActivity}>
                            <View style={styles.rule_right}>
                                <Text style={styles.rule_right_txt}>更多</Text>
                                <Image style={styles.rule_right_img} source={RIGHT_ICONS} />
                            </View>
                        </TouchableNativeFeedback>

                    </View>

                    <View style={{ height: 360 }}>


                        <FlatList
                            ref={(flatList) => this.ruleList = flatList}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderNewsItem}
                            data={this.state.newsData}>
                        </FlatList>

                    </View>
                </View>

                {/*登记公告*/}
                <View style={{ backgroundColor: '#ffffff', marginTop: 8 }}>


                    <View style={styles.news_rule_view}>

                        <View style={styles.rule_left}>

                            <Image style={styles.rule_left_img} source={NOTICE_ICONS}></Image>
                            <Text style={styles.rule_left_txt}>登记公告</Text>

                        </View>
                        <TouchableNativeFeedback onPress={this._goNoticeActivity}>
                            <View style={styles.rule_right}>
                                <Text style={styles.rule_right_txt}>更多</Text>
                                <Image style={styles.rule_right_img} source={RIGHT_ICONS} />
                            </View>
                        </TouchableNativeFeedback>

                    </View>

                    <View style={{ height: 255, paddingLeft: 5, paddingRight: 5 }}>


                        <FlatList
                            ref={(flatList) => this.ruleList = flatList}
                            renderItem={this._renderNoticeItem}
                            data={this.state.noticeData}
                            numColumns={2}
                            columnWrapperStyle={{ borderWidth: 2, borderColor: '#ffffff' }}
                            getItemLayout={(data, index) => (
                                { length: 104, offset: (104 + 4) * index, index }
                            )}
                        >
                        </FlatList>

                    </View>
                </View>
            </View>

        );

    }


}
var styles = StyleSheet.create({
    img_item: {
        flex: 1,
        height: 140,
        resizeMode: 'stretch',
        flexDirection: 'column'
    }, page: {
        height: 145,
        backgroundColor: '#f6f6f6'
    },
    container: {   //根View样式
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    news_rule_view: {
        flexDirection: 'row',
        height: 40,
    }
    ,
    rule_left: {

        width: 120,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rule_left_img: {

        height: 20,
        width: 20,
        marginLeft: 5


    },
    rule_left_txt: {

        color: '#000000',
        fontSize: 15,
        marginLeft: 5,
    },
    rule_right: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }, rule_right_txt: {

        color: '#7f919f',
        fontSize: 14,

    },
    rule_right_img: {

        height: 12,
        width: 12,
        marginRight: 5


    },
    main_view: {

        flex: 1,
        backgroundColor: '#F0F0F2'


    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 5,
        fontSize: 14,
        color: '#000000',
        marginTop: 5
    },
    rule_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 5,
        fontSize: 12,
        color: '#999999',
    }, rule_content_txt: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 5,
        fontSize: 12,
        color: '#666666',
        marginTop: 5,
    }, news_img_item: {
        height: 60,
        resizeMode: 'stretch',
        width: 60
    }, notice_type_txt: {
        justifyContent: 'center',
        paddingLeft: 5,
        fontSize: 15,
        color: '#000000',
    }, notice_time: {
        justifyContent: 'center',
        paddingLeft: 5,
        fontSize: 12,
        color: '#666666',
    }

});