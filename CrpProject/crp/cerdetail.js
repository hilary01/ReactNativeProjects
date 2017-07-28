import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    WebView,
    Image
} from 'react-native';
const { width
    , height
 } = Dimensions.get('window');
var BACK_ICON = require('./images/tabs/nav_return.png');
var CER_ICON = require('./images/tabs/icon_detail.png');
import PublicTitle from './public_title';
import LoadView from './loading';
import NetUitl from './netUitl';
var DETAIL_URL = 'http://drmlum.rdgchina.com/drmapp/copyright/certificatedetail';
import StringBufferUtils from './StringBufferUtil';
export default class CerDetailActivity extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.getData(this.props.detail_id);
    }
    backOnclick() {

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
            //下面的就是请求来的数据
            if (null != set && set.return_code == '0') {

            } else {
                that.setState({
                    show: false
                });

            }




        })

    }
    render() {
        return (

            <View style={styles.container}>
                <PublicTitle text='版权证书' _backOnclick={this.backOnclick.bind(this)} left_icon={BACK_ICON} />
                <WebView
                    style={{ width: width, backgroundColor: 'white' }}
                    source={{ uri: this.props.rootUrl, method: 'GET' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                />
                <View style={{ height: 360, flexDirection: 'column' }} >
                    <View style={{ height: 36, flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Image style={{ width: 24, height: 24, marginLeft: 20 }} source={CER_ICON} />
                        <Text style={{ color: '#666666', fontSize: 15, marginLeft: 10 }}>证书信息</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title} numberOfLines={1}>作品登记号:国作登记-2016-05616156</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>作品名称:春江水暖鸭先知</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>作品类型:美术作品</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>作者:张明珠</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>著作权人:张明珠</Text>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10, marginTop: 20, marginBottom: 5 }}></View>
                        <Text style={styles.rule_item_title} numberOfLines={1}>首次发表日期:2017-02-16</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>创造完成时间:2017-01-16</Text>
                        <Text style={styles.rule_item_title} numberOfLines={1}>登记日期:2016-02-20</Text>
                    </View>
                </View>

            </View>


        );

    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 200,
        backgroundColor: '#f2f2f2',
    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 14,
        color: '#666666',
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