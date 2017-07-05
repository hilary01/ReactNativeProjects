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
    ToastAndroid
} from 'react-native';
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/search';
var searchList;
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
var TYPE_ICON = require('./images/tabs/type_icon.png');
var TIME_ICON = require('./images/tabs/type_time.png');
export default class SearchActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            history: {},
            show: true


        };

    }

    componentDidMount() {

        this.setState({
            keyWord: this.props.keyword

        })


        StringBufferUtils.init();
        StringBufferUtils.append('title=' + this.props.keyword);
        StringBufferUtils.append('&&pageNo=' + '1');
        StringBufferUtils.append('&&recordsperpage=' + 10);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }



    fetchData(param) {
        //get请求,以百度为例,没有参数,没有header
        var that = this;
        NetUitl.post(SEARCH_URL, param, '', function (set) {
            // alert(set.result);
            //下面的就是请求来的数据
            that.addItemKey(set.result);
        })

    }
    //整合数据
    addItemKey(rulelist) {

        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].id;

            }
            this.setState({
                history: rulelist,
                show: false
            });


        }

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _goSearchResult(itemData) {

        // alert(itemData.item.value);

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
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        var types = this._getType(itemData.item.category);
        return (
            <View style={{ height: 100, justifyContent: 'center' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.item.name}</Text>
                        <Text style={styles.rule_item_time}>{itemData.item.certificatenumber}</Text>
                        <Text style={styles.rule_item_time}>{itemData.item.realname}</Text>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2', marginTop: 5 }}></View>
                        <View style={{ height: 40, flexDirection: 'row', marginTop: 5, flex: 1 }}>
                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>

                                <Image style={{ width: 16, height: 16, marginLeft: 20 }} source={TYPE_ICON} />
                                <Text style={{ textAlign: 'center', color: '#999999', fontSize: 13, marginLeft: 5 }}>{types}</Text>
                            </View>
                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>

                                <Image style={{ width: 16, height: 16 }} source={TIME_ICON} />
                                <Text style={{ textAlign: 'center', color: '#999999', fontSize: 13, marginLeft: 5, marginRight: 10 }}>{itemData.item.djdatetime}</Text>
                            </View>

                        </View>

                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
    render() {
        return (

            <View style={styles.page}>

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

                <FlatList
                    style={{ backgroundColor: '#ffffff' }}
                    ref={(flatList) => this.searchList = flatList}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderSearchItem}
                    data={this.state.history}>
                </FlatList>


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
