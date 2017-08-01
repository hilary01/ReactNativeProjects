/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import React,{Component} from 'react';  
import  {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DatePickerAndroid,
TouchableOpacity,
Modal,
} from 'react-native';
//简单封装一个组件
var timeStr='';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
export default class DataPickerDemo extends Component {

constructor(props, context) {
		super(props, context);
			this.state={
      presetDate: new Date(2016, 3, 5),
	  visible: this.props.visible,
          }

	}
  //进行创建时间日期选择器
  async showPicker(stateKey, options) {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);      
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
         alert(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }
componentWillReceiveProps(props) {
		this.setState({ visible: props.visible });
	}
passMenthod = () => {
		return cityEntity;
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
		createButon() {
		return <View style={{ backgroundColor: '#f6f6f6', flexDirection: 'column', height: 45, alignItems: 'center', width: ScreenWidth,  }}>

			<View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
				<View style={{ height: 1, backgroundColor: '#e2e2e2', margin: 5, width: ScreenWidth }}></View>
				<Text onPress={() => this.props.callbackParent()}
					style={{ textAlign: 'center', width: ScreenWidth, backgroundColor: '#028CE5', color: 'white', paddingTop: 8, paddingBottom: 8 }} >确认</Text>

			</View>
		</View>

	}
  render() {
	alert(this.state.visible);
    return (
    <Modal
					animationType='slide'//进场动画 fade  
					onRequestClose={() => this.close()}
					visible={this.state.visible}//是否可见  
					transparent={true} //背景透明  
				>
					<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this.close()}//点击灰色区域消失  
					>
						<View style={styles.container} >
							{this.showPicker.bind(this, 'preset', {date: this.state.presetDate})}
							{this.createButon()}
						</View>
					</TouchableOpacity>
				</Modal>
    );
  }
}
const styles = StyleSheet.create({

	page: {
		height: 200,
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
		flexDirection: 'column',
		flex: 1,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		width: ScreenWidth,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	}, background: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
	}
});
 