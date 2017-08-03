import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ListView,
    StatusBar,
    Image,
    TouchableNativeFeedback,
    ToastAndroid
} from 'react-native';
import Global from './global';
import LoadView from './loading';
import PublicTitle from './public_title';
var BACK_ICON = require('./images/tabs/nav_return.png');
var SELECT_ICON = require('./images/tabs/icon_yes.png');
import StringUtil from './StringUtil';
var powerName = ['全部', '发表权', '署名权', '修改权', '保护作品完整权', '复制权', '发行权',
    '出租权', '展览权', '表演权', '放映权', '广播权', '信息网络传播权', '摄制权', '改编权', '翻译权', '汇编权', '其他'];
var powerId = ['0', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
var isAllSelect = false;
export default class PowerListActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataList: {},


        };
    }


    componentDidMount() {
        var list = this.props.list;
        this.initData(list);

    }
    _getSelectIndex(id) {

        var index = 0;
        var createTypeId = this.props.createTypeId;
        for (var i = 0; i < createTypeId.length; i++) {

            if (id == createTypeId[i]) {
                index = i;
            }

        }
        return index;

    }
    initData(list) {
        this.setState({
            show: true

        })
        if (null != list && list.length > 0) {
            this.setState({

                dataList: list,
                show: false

            })

        } else {

            var list = new Array();
            for (var i = 0; i < powerName.length; i++) {

                var obj = new Object();
                obj.id = powerId[i];
                obj.name = powerName[i];
                obj.isSelect = false;
                list.push(obj);

            }
            this.setState({

                dataList: list,
                show: false

            })


        }


    }

    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }
    _renderItem = (itemData, index) => {
        return <TouchableNativeFeedback onPress={() => this._onItemClick(itemData, index)}>
            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>

                <Text style={{ marginLeft: 10, flex: 1 }}>{itemData.item.name}</Text>
                {this._getSelectIcon(itemData.item.isSelect)}


            </View>
        </TouchableNativeFeedback>

    }

    _onItemClick(itemData, index) {
        var list = this.state.dataList;
        if (itemData.index == 0) {

            this._selectAllItem(list, !isAllSelect);
        } else {
            if (list[itemData.index].isSelect) {

                list[itemData.index].isSelect = false;
            } else {
                list[itemData.index].isSelect = true;
            }
            if (this._getSelectSize(list).length == 17) {

                this._selectAllItem(list, true);
            } else {

                list[0].isSelect = false;
            }

            this.setState({

                dataList: list,
            })
        }




    }
    _getSelectSize(list) {
        var tempList = [];

        for (var i = 1; i < list.length; i++) {

            if (list[i].isSelect == true) {

                tempList.push(list[i])
            }

        }
        return tempList;

    }
    _selectAllItem(list, flag) {
        for (var i = 0; i < list.length; i++) {

            list[i].isSelect = flag;

        }
        isAllSelect = flag;
        this.setState({

            dataList: list,
        })
    }
    _editInfo() {
        var list = this.state.dataList;
        if (this._getSelectSize(list).length > 0) {

            if (this.props.returnData) {
                if (this.props.returnData(list, this._getSelectSize(list)));
            }
            this.props.navigator.pop(
                {

                }
            );
        } else {
            ToastAndroid.show('请您选择权利拥有情况', ToastAndroid.SHORT);

        }

    }
    _getSelectIcon(isSelect) {

        if (isSelect) {

            return <Image style={{ width: 16, height: 16, marginRight: 10 }} source={SELECT_ICON} />
        }


    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />;
    }
    _showRightBtn() {
        return <View style={styles.right_view} >
            <Text style={{
                textAlign: 'center', width: 60, color: '#ffffff'
            }} onPress={() => this._editInfo()}>
                确定
                        </Text>
        </View>
    }

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    render() {
        return (
            <View style={styles.page}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <View style={styles.container}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor={'#028CE5'}
                        barStyle={'default'}
                        networkActivityIndicatorVisible={true}
                    />
                    <View style={styles.left_view} >

                        <TouchableNativeFeedback onPress={() => this._backOnclick()} >
                            <Image style={styles.left_icon} source={BACK_ICON}></Image>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.textview}>
                        <Text style={styles.textstyle} numberOfLines={1}>{this.props.title}</Text>
                    </View>
                    {this._showRightBtn()}

                </View>
                <FlatList
                    style={{ marginTop: 10 }}
                    ref={(flatList) => this._flatList = flatList}
                    renderItem={this._renderItem}
                    horizontal={false}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._separator}
                    data={this.state.dataList}>

                </FlatList>
            </View>
        );

    }


}
const styles = StyleSheet.create({

    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'

    }, container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        backgroundColor: '#028CE5',
    },
    right_view: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        borderColor: '#f0f0f0',
        borderRadius: 3,
        borderWidth: 1,
        height: 30,
        marginRight: 5
    },
    right_icon: {
        width: 28,
        height: 28,
        marginRight: 10,
        justifyContent: 'center'

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
    },
    textview: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    textstyle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        width: 200
    }
});
