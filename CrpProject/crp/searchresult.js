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
var SEARCH_URL = new Request('http://drmlum.rdgchina.com/drmapp/copyright/search');
export default class SearchActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            history: {}


        };

    }

    componentDidMount() {

        this.setState({
            keyWord: this.props.keyword

        })
        // let formData = new FormData();
        // formData.append("title", this.state.keyWord);
        // this.fetchData(SEARCH_URL,formData);
    }
    // 数据请求 
    fetchData(url,formdata) {
        fetch(url, {
            method: 'POST',
            headers: {},
            body: formdata,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.addItemKey(responseData.result)

            })
            .catch((error) => {
                console.error(error);
            }).done();

    }
    //整合数据
    addItemKey(rulelist) {

        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].id;

            }
            this.setState({
                history: rulelist
            });

        }

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _goSearchResult(itemData) {

        alert(itemData.item.value);

    }
    _backOnclick() {

        this.props.navigator.pop(
            {

            }
        );

    }
    // 返回历史记录Item
    _renderHistoryItem = (itemData) => {
        return (
            <View style={{ height: 45, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <TouchableNativeFeedback onPress={() => this._goSearchResult(itemData)}>
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
