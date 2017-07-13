import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default class CompletActivity extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // alert(this.props.userType);



    }
    render() {
        return (

            <View style={styles.page}>
                <Text style={{ padding: 3 }}> 请选择您的用户类别</Text>
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
