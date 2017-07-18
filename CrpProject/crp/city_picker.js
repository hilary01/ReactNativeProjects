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
} from 'react-native';

import PickerAndroid from 'react-native-picker-android';

let Picker = PickerAndroid;
let PickerItem = Picker.Item;
export default class SomeScene extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			city: 0,
			cityIndex: 0,
			privince_data: {},
			isLoading: true,
			modelIndex: 0,
			visible: this.props.visible


		}
	}
	close = () => {
		this.setState({ visible: false });
		// this.props.navigator.pop(
		// 	{

		// 	}
		// );
	}
	componentWillReceiveProps(props) {
		this.setState({ visible: props.visible });
	}
	componentWillMount() {

		this.getCityData();
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
							privince_data: jsonValue[0].provincelist,
							isLoading: false

						})



					} else {

					}

				}
			}
		)
	}
	_renderItem() {

		if (!this.state.isLoading) {
			let provincelist = this.state.privince_data;
			let citylist = provincelist[this.state.city].citylist;
			return <View style={styles.background}>

				<Picker
					pickerStyle={styles.picker_style}
					selectedValue={this.state.city}
					itemStyle={styles.item_txt}
					onValueChange={(city) => this.setState({ city, modelIndex: 0 })}>
					{Object.keys(provincelist).map((city) => (

						<PickerItem
							key={city}
							value={city}
							label={provincelist[city].province}
						/>

					))}
				</Picker>
				<Picker
					pickerStyle={styles.picker_style2}
					selectedValue={this.state.modelIndex}
					key={this.state.city}
					itemStyle={styles.item_txt}
					onValueChange={(modelIndex) => this.setState({ modelIndex })}>
					{citylist.map((modelName, modelIndex) => (
						<PickerItem
							key={this.state.city + '_' + modelIndex}
							value={modelIndex}
							label={citylist[modelIndex].city}
						/>
					))}
				</Picker>
			</View>
		}
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
		height: 400,
		// backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	item_txt: {

		fontSize: 16,
		color: '#666666'
	},
	picker_style: {
		height: 200,
		width: 60,
		backgroundColor: '#f6f6f6'
	}, picker_style1: {
		height: 200,
		width: 60,
		backgroundColor: '#f6f6f6'
	}, picker_style2: {
		height: 200,
		width: 60,
		backgroundColor: '#f6f6f6'
	},
	container: {
		flex: 1,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	}, background: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
	}
});