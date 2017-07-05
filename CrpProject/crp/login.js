import React, {Component} from 'react';
import { TextInput, Text, View, Button,ToastAndroid} from 'react-native';
import MainActivity from './main'

export default class LoginInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        }

        }
    _pressButton(){
        const { navigator } = this.props;
        //或者写成 const navigator = this.props.navigator;
        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        if(navigator) {
            navigator.push({
                name: 'MainActivity',
                component: MainActivity,
                params:{
                    user:this.state.userName,
                    pwd:this.state.password
                }
            })
        }
    }




    render() {
        return (

            <View style={{flexDirection: 'column'}}>

                <View style={{flexDirection: 'row', marginTop: 20,height: 40, marginRight: 20}} testId={'user'}>


                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{textAlign: 'center',width:80}}>用户名:</Text>

                    </View>
                    <TextInput
                        style={{flex: 1, height: 40, borderColor: 'gray'}}
                        //onChangeText={(text) => this.setState({text})}
                        onChangeText={(userName) => this.setState({userName})}
                        value={this.state.userName}
                    />


                </View>
                <View style={{flexDirection: 'row', marginTop: 10, marginRight: 20}}
                      testId={'pass'}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{textAlign: 'center',  width:80}}>密 码:</Text>

                    </View>

                    <TextInput
                        style={{flex: 1, height: 40, borderColor: 'gray'}}
                        //onChangeText={(text) => this.setState({text})}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />


                </View>
                <View style={{marginTop: 20, marginLeft: 60, marginRight: 20}}>


                    <Button title={'登录'} color="#841584" onPress={this._pressButton.bind(this)}
                            style={{flex: 1, height: 40, textAlign: 'center', lineHeight: 40}}/>

                </View>


            </View>


        );
    }

}


