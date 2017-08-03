import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ListView,
    StatusBar,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import Global from './global';
import LoadView from './loading';
import PublicTitle from './public_title';
var BACK_ICON = require('./images/tabs/nav_return.png');
var SELECT_ICON = require('./images/tabs/icon_yes.png');
import StringUtil from './StringUtil';
export default class ListViewActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataList: {},


        };
    }


    componentDidMount() {
        var id = this.props.id;
        this.initData(id);

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
    initData(id) {
        if (StringUtil.isNotEmpty(id)) {
            var createType = this.props.createType;
            var createTypeId = this.props.createTypeId;
            var list = new Array();
            var index = this._getSelectIndex(id);
            for (var i = 0; i < createType.length; i++) {

                var obj = new Object();
                obj.id = createTypeId[i];
                obj.name = createType[i];
                if (i == index) {
                    obj.isSelect = true;
                } else {
                    obj.isSelect = false;
                }
                list.push(obj);

            }
            this.setState({

                dataList: list,
                show: false

            })

        } else {

            var createType = this.props.createType;
            var createTypeId = this.props.createTypeId;
            var list = new Array();
            for (var i = 0; i < createType.length; i++) {

                var obj = new Object();
                obj.id = createTypeId[i];
                obj.name = createType[i];
                if (i == 0) {
                    obj.isSelect = true;
                } else {
                    obj.isSelect = false;
                }
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
        var createType = this.props.createType;
        var createTypeId = this.props.createTypeId;
        var list = new Array();
        for (var i = 0; i < createType.length; i++) {
            var obj = new Object();
            obj.id = createTypeId[i];
            obj.name = createType[i];
            if (i == itemData.index) {
                obj.isSelect = true;
            } else {
                obj.isSelect = false;
            }
            list.push(obj);

        }
        dataList = [];
        this.setState({

            dataList: list,
        })
        if (this.props.returnData) {
            if (this.props.returnData(itemData.item));
        }
        this.props.navigator.pop(
            {

            }
        );

    }
    _getSelectIcon(isSelect) {

        if (isSelect) {

            return <Image style={{ width: 16, height: 16, marginRight: 10 }} source={SELECT_ICON} />
        }


    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2', marginLeft: 10, marginRight: 10 }} />;
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
                <PublicTitle text={this.props.title} _backOnclick={this._backOnclick.bind(this)} left_icon={BACK_ICON} />
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

    },
});
