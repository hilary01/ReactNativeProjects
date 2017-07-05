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
    ScrollView
} from 'react-native';
const SEARCH_ICON = require('./images/tabs/search_icon.png');
var BACK_ICON = require('./images/tabs/nav_return.png');
var SEARCH_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/search';
var searchList;
import LoadView from './loading'
import NetUitl from './netUitl'
import StringBufferUtils from './StringBufferUtil'
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
        var that=this;
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
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 60, justifyContent: 'center' }}>
                <TouchableNativeFeedback onPress={() => this.clickItem(itemData, index)}>
                    <View style={{ height: 60, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.item.name}</Text>
                        <Text style={styles.rule_item_time}>{itemData.item.certificatenumber}</Text>

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
    },
});
