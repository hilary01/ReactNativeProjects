import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
export default class MyCopyrightActivity extends Component {
    constructor(props) {
        super(props);
       
    }

  testOnlcik() {



    }
    render() {
        return (

               <View>
               <Text> 我的版权</Text>
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
