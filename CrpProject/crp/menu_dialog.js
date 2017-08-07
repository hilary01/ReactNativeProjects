import React, { Component } from 'react';
import {
	View,
	Text,
	Platform,
	PickerIOS,
	StyleSheet,
	AsyncStorage,
	Modal,
	TouchableOpacity,
	Button,
	TouchableNativeFeedback,
	FlatList,
	Image,
	ToastAndroid
} from 'react-native';

import PickerAndroid from 'react-native-picker-android';

let Picker = PickerAndroid;
let PickerItem = Picker.Item;
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHegiht = Dimensions.get('window').height;
var menuName = ['摄影', '口述', '音乐', '戏剧', '曲艺', '舞蹈', '杂技', '美术', '文字', '电影', '建筑', '模型', '摄制作品', '地图', '设计图', '其他'];
var menuId = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
var MENU_ICON_01 = require('./images/tabs/icon_sheyin.png');
var MENU_ICON_02 = require('./images/tabs/icon_koushu.png');
var MENU_ICON_03 = require('./images/tabs/icon_yinyue.png');
var MENU_ICON_04 = require('./images/tabs/icon_xiju.png');
var MENU_ICON_05 = require('./images/tabs/icon_quyi.png');

var MENU_ICON_06 = require('./images/tabs/icon_wuda.png');
var MENU_ICON_07 = require('./images/tabs/icon_zaji.png');
var MENU_ICON_08 = require('./images/tabs/icon_meishu.png');
var MENU_ICON_09 = require('./images/tabs/icon_text.png');
var MENU_ICON_10 = require('./images/tabs/icon_moive.png');

var MENU_ICON_11 = require('./images/tabs/icon_jianzhu.png');
var MENU_ICON_12 = require('./images/tabs/icon_moxin.png');
var MENU_ICON_13 = require('./images/tabs/icon_shezhi.png');
var MENU_ICON_14 = require('./images/tabs/icon_map.png');
var MENU_ICON_15 = require('./images/tabs/icon_shejitu.png');
var MENU_ICON_16 = require('./images/tabs/icon_other.png');
export default class MenuDialog extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: true,
			visible: this.props.visible,
			menuList: {}


		}

	}

	initData() {
		var list = new Array();
		for (var i = 0; i < menuName.length / 2; i++) {
			var obj = new Object();
			obj.name = menuName[i];
			obj.id = menuId[i];
			list.push(obj);


		}

		this.setState({
			menuList: list
		});

	}

	close = () => {
		// this.setState({ visible: false });
		// this.props.navigator.pop(
		// 	{

		// 	}
		// );
	}
	dismiss = () => {
		this.setState({ visible: false });
	}
	passMenthod = () => {
	}
	componentWillReceiveProps(props) {
		this.setState({ visible: props.visible });
	}
	componentWillMount() {
		this.initData();
	}
	showToast = () => {

		ToastAndroid.show('抱歉由于版权局权限原因，暂不支持点击', ToastAndroid.SHORT);
	}
	//返回通知公告
	_renderMenuItem = (itemData, index) => {
		return (
			<View style={{ height: 84, width: ScreenWidth / 4, justifyContent: 'center', backgroundColor: '#F6F9FF' }}>
				<TouchableNativeFeedback onPress={this.showToast}>
					{this._makeGridView(itemData)}
				</TouchableNativeFeedback>
			</View>
		);
	}
	_makeGridView(itemData) {
		return <View style={{ height: 80, width: ScreenWidth / 4, flexDirection: 'column', justifyContent: 'center' }}>
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				{this._rendImage(itemData)}
				<Text style={styles.notice_type_txt} numberOfLines={1}>{itemData.item.name}</Text>
			</View>
		</View>
	}
	_rendImage(itemData) {
		var img_url = '';
		switch (itemData.item.id) {
			case '1':
				img_url = MENU_ICON_01;
				break
			case '2':
				img_url = MENU_ICON_02;
				break
			case '3':
				img_url = MENU_ICON_03;
				break
			case '4':
				img_url = MENU_ICON_04;
				break
			case '5':
				img_url = MENU_ICON_05;
				break
			case '6':
				img_url = MENU_ICON_06;
				break
			case '7':
				img_url = MENU_ICON_07;
				break
			case '8':
				img_url = MENU_ICON_08;
				break
			case '9':
				img_url = MENU_ICON_09;
				break
			case '10':
				img_url = MENU_ICON_10;
				break
			case '11':
				img_url = MENU_ICON_11;
				break
			case '12':
				img_url = MENU_ICON_12;
				break
			case '13':
				img_url = MENU_ICON_13;
				break
			case '14':
				img_url = MENU_ICON_14;
				break
			case '15':
				img_url = MENU_ICON_15;
				break
			case '16':
				img_url = MENU_ICON_16;
				break




		}

		return <Image style={{ width: 50, height: 50 }} source={img_url}></Image>
	}
	_renderItem() {
		{/* columnWrapperStyle={{ borderWidth: 0, borderColor: '#ffffff' }} */ }

		return <View style={{ flex: 1, alignItems: 'flex-start', marginTop: ScreenHegiht - 200 }}>

			<View >

				<FlatList
					style={{ backgroundColor: 'white' }}
					ref={(flatList) => this.flatList = flatList}
					renderItem={this._renderMenuItem}
					data={this.state.menuList}
					numColumns={4}
					getItemLayout={(data, index) => (
						{ length: 80, offset: (84) * index, index }
					)}
				>
				</FlatList>

			</View>

		</View>
	}

	render() {
		return (
			<View style={styles.page}>
				<Modal
					animationType='slide'//进场动画 fade  
					onRequestClose={() => this.close()}
					visible={this.state.visible}//是否可见  
					transparent={true} //背景透明  
				>
					<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this.close}//点击灰色区域消失  
					>
						<View style={styles.container} >
							{this._renderItem()}
						</View>
					</TouchableOpacity>
				</Modal>


			</View>
		);
	}
};
const styles = StyleSheet.create({

	page: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	item_txt: {

		fontSize: 16,
		color: '#666666'
	},
	container: {
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		width: ScreenWidth,
		backgroundColor: 'white',
		// rgba(0, 0, 0, 0.5)
	}, background: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
	}, notice_type_txt: {
		justifyContent: 'center',
		paddingLeft: 5,
		fontSize: 13,
		color: '#000000',
	},
});