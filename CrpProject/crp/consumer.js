import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
export default class ConsumerActivity extends Component {
    constructor(props) {
        super(props);
       
    }

  testOnlcik() {



    }
    render() {
        return (

               <View>
               <Text> 个人资料</Text>
            </View>


        );

    }


}
const styles = StyleSheet.create({
 
    content: {
        flex:1,
        height: 50,
        alignItems: 'center',
    }
});
