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
    AsyncStorage,
    ScrollView
} from 'react-native';
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var CLEAR_ICON = require('./images/tabs/icon_delete.png');
var classifies = [];
const HISTORY_KEY = 'search_history';
var historyList = new Array();
import SearchResultActivity from './searchresult'
export default class SearchActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            history: [],


        };

    }
    // 判断是否在数组中
    historyExist(searchWord) {
        var isExist = false;

        if (classifies.length > 0) {

            for (var i = 0; i < classifies.length; i++) {

                if (classifies[i] == searchWord) {

                    isExist = true;

                }



            }


        } else {

            isExist = false;

        }


        return isExist;

    }
    hotWordClick(hotword) {
        if (this.historyExist(hotword)) {

        } else {

            var historyObj = new Object();
            historyObj.key = hotword;
            historyObj.value = hotword;
            historyList.push(historyObj);
            var json = JSON.stringify(historyList);
            this.saveHistoryData(json);
        }

        this._goSearchResult(null, hotword, false)


    }

    // 清除搜索历史
    clearBtn() {

        var str = '';
        AsyncStorage.removeItem(
            HISTORY_KEY,
            (error) => {
                if (!error) {
                    var strs = [];
                    this.setState({

                        history: strs

                    })
                }
            }
        )



    }
    componentDidMount() {
        this.getHistoryValue();

    }
    testOnlcik() {



    }
    // 存储历史数据
    saveHistoryData(value) {
        //appHotSearchTagList就是当时保存的时候所保存的key，而tags就是保存的值
        AsyncStorage.setItem(
            HISTORY_KEY,
            value,
            (error) => {
                if (error) {
                    alert('存值失败:', error);
                } else {

                    this.getHistoryValue();

                }
            }
        );
    }
    //获取历史数据
    getHistoryValue() {

        AsyncStorage.getItem(
            HISTORY_KEY,
            (error, result) => {
                if (error) {
                    alert('取值失败:' + error);
                } else {
                    const jsonValue = JSON.parse(result);
                    if (null != jsonValue && jsonValue.length > 0 && 'null' != jsonValue) {

                        historyList = jsonValue;
                        this.setState({
                            history: historyList
                        });
                    }

                }
            }
        )

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _submitBtn() {

        this.hotWordClick(this.state.keyWord)
    }
    _cancleBtn = () => {

        this.props.navigator.pop(
            {

            }
        );
    }
    _goSearchResult = (itemData, keyWord, isSearch) => {
        if (isSearch) {

            this.props.navigator.push({
                component: SearchResultActivity,
                params: {
                    keyword: itemData.item.value
                }
            })

        } else {
            this.props.navigator.push({
                component: SearchResultActivity,
                params: {
                    keyword: keyWord
                }
            })

        }

    }

    // 返回历史记录Item
    _renderHistoryItem = (itemData) => {
        return (
            <View style={{ height: 45, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <TouchableNativeFeedback onPress={() => this._goSearchResult(itemData, '', true)}>
                    <View style={{ height: 45, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.item.value}</Text>

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
                {/*搜索头部控件*/}
                <View style={styles.top_layout}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 45, flex: 1 }}>

                        <TextInput style={{
                            flex: 1, height: 36, backgroundColor: '#cde8fb', paddingLeft: 35, marginLeft: 20,
                            borderRadius: 5,
                        }} onChangeText={(keyWord) => this.setState({ keyWord })}
                            value={this.state.keyWord} placeholderTextColor='#999999' returnKeyType='search'
                            underlineColorAndroid='transparent' placeholder='搜索作品名、著作权人' onSubmitEditing={() => { this._submitBtn() }}>
                        </TextInput>
                        <Image style={{ width: 20, height: 20, marginLeft: 30, position: 'absolute' }} source={SEARCH_ICON} />
                        <View style={{
                            height: 36, width: 50, justifyContent: 'center',

                        }}>

                            <Text style={{
                                color: '#ffffff',
                                textAlign: 'center', justifyContent: 'center', fontSize: 14, padding: 5
                            }} onPress={this._cancleBtn}>取消</Text>

                        </View>

                    </View>


                </View>
                <View style={{ height: 35, paddingLeft: 20, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'auto', fontSize: 13, }}>
                        历史记录
                    </Text>

                </View>

                <ScrollView>
                    <View style={{ flex: 1 }}>


                        <FlatList
                            style={{ backgroundColor: '#ffffff' }}
                            ref={(flatList) => this.historyList = flatList}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderHistoryItem}
                            data={this.state.history}>
                        </FlatList>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2' }}></View>
                        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableNativeFeedback onPress={() => this.clearBtn()}>
                                <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>

                                    <Image style={{ width: 20, height: 20 }} source={CLEAR_ICON}></Image>
                                    <Text style={{ fontSize: 13, color: '#798b9a', textAlign: 'center' }}>清空历史记录</Text>

                                </View>
                            </TouchableNativeFeedback>

                        </View>

                    </View>

                </ScrollView>

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
        width: 30
    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 14,
        color: '#000000',
        marginTop: 5
    },
});
