import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableNativeFeedback } from 'react-native';
const PERSONAL_IMG = require('./images/tabs/icon_personal.png');
const COMPANY_IMG = require('./images/tabs/icon_company.png');
const ICON_MORE = require('./images/tabs/icon_more.png');
import PublicTitle from './public_title.js'
var BACK_ICON = require('./images/tabs/nav_return.png');
import FillConsumer from './fill_consumer'
export default class CompletActivity extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // alert(this.props.userType);



    }
    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    //跳往完善信息
    _completBtn(flag) {
        this.props.navigator.push({
            component: FillConsumer,
            params: {
                userType:flag
            }
        })

    }
    cancleBtn() {

    }
    /**
  * 完善信息
  */
    showInfoAlert() {
        var options = {
            thide: true, /*不显示头部标题*/
            messText: '完善个人资料后才可以申请额',
            innersWidth: ScreenWidth - 60,
            innersHeight: 140,
            divice: true,
            buttons: [
                {
                    txt: '下次再说',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#929292' },
                    onpress: this.cancleBtn.bind(this),


                },
                {
                    txt: '',
                    btnStyle: { backgroundColor: '#e2e2e2', width: 1, height: 42, marginTop: 0, marginBottom: 0 },
                    onpress: this.cancleBtn.bind(this),

                },
                {
                    txt: '去完善',
                    btnStyle: styles.comBtnBtnView,
                    txtStyle: { color: '#037BFF' },
                    onpress: this.cancleBtn.bind(this)
                }
            ]
        }
        this.refs.completInfoDialog.show(options)
    }

    render() {
        return (

            <View style={styles.page}>
                <PublicTitle text='完善资料' _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#f6f6f6'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <Text style={{ padding: 3 }}> 请选择您的用户类别</Text>
                <TouchableNativeFeedback onPress={() => this._completBtn('0')}>
                    <View style={{ backgroundColor: 'white', height: 100, flexDirection: 'row', }}>

                        <View style={{ alignItems: 'center', marginLeft: 10, justifyContent: 'center' }}>

                            <Image style={{ width: 70, height: 70 }} source={PERSONAL_IMG} />


                        </View>
                        <View style={{ marginLeft: 10, marginTop: 20 }}>
                            <Text style={{ color: '#666666', fontSize: 15 }}>个人用户</Text>
                            <Text style={{ color: '#999999' }}>使用版权登记为个人申请、保护版权等</Text>
                        </View>
                        <Image style={{ width: 14, height: 14, marginRight: 10, marginLeft: 10, justifyContent: 'center', marginTop: 43 }} source={ICON_MORE} />
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => this._completBtn('1')}>
                    <View style={{ backgroundColor: 'white', height: 100, flexDirection: 'row', marginTop: 10 }}>

                        <View style={{ alignItems: 'center', marginLeft: 10, justifyContent: 'center' }}>

                            <Image style={{ width: 70, height: 70 }} source={COMPANY_IMG} />


                        </View>
                        <View style={{ marginLeft: 10, marginTop: 20, marginRight: 10, width: 230 }}>
                            <Text style={{ color: '#666666', fontSize: 15 }}>企业</Text>
                            <Text style={{ color: '#999999' }}>使用版权登记为企业或员工申请、保护版权等</Text>
                        </View>
                        <Image style={{ width: 14, height: 14, marginRight: 10, marginLeft: 10, justifyContent: 'center', marginTop: 43 }} source={ICON_MORE} />
                    </View>
                </TouchableNativeFeedback>
            </View>


        );

    }


}
const styles = StyleSheet.create({

    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'

    },
});
