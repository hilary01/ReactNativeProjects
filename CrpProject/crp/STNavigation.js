import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components'
import STTabbar from './STTabbar';
export default class RootView extends Component {
    constructor(props) {
        super(props);
        // this.renderScene = this.renderScene.bind(this);
    }

    goBack() {
        return NaviGoBack(_navigator);
    }

    configureScene(route, routeStack) {
        return Navigator.SceneConfigs.PushFromRight;
    }
    render() {
        return (
            <View style={{ flex: 1 }}>

                <Navigator
                    ref='navigator'
                    style={styles.navigator}
                    configureScene={this.configureScene}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} />
                    }}
                    initialRoute={{
                        component: STTabbar,
                        name: 'RootView'
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navigator: {
        flex: 1
    }
});

