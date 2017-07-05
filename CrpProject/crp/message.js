import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
export default class ApplyActivity extends Component {
    constructor(props) {
        super(props);
       
    }

  testOnlcik() {



    }
    render() {
        return (

               <View>
               <Text> 我是申请</Text>
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
