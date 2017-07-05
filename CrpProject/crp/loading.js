import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Modal, 
    StyleSheet,
    Platform,
    BackHandler
} from 'react-native';

export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_show: true
        }

    }
    // componentWillMount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    // componentWillUnmount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    // onBackAndroid = () => {
    //     const nav = this.navigator;
    //     const routers = nav.getCurrentRoutes();
    //     if (routers.length > 1) {

    //         this.setState({
    //             is_show: false

    //         })
    //         return true;
    //     }
    //     return false;
    // };
    render() {

        return (
            <Modal
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
            >
                <View style={styles.loadingBox}>
                    <ActivityIndicator animating={this.state.is_show}
                        style={[styles.centering, { height: 80 }]}
                        size="large" />
                </View>
            </Modal>
        );
    }

}
const styles = StyleSheet.create({
    loadingBox: { // Loading居中
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});
