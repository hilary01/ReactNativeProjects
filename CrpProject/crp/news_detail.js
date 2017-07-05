import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';

import WebView from './webview.js'
export default class WebviewDetail extends Component {
    constructor(props) {
    super(props);
    this.state={

        rooturl:'',
        title:''
    }
  }
     componentDidMount() {
       var url=this.props.root_url;
       var titleTxt=this.props.title;
       alert(url);
       this.setState({

       rooturl: url,
       title:titleTxt
    })
    alert(this.state.rooturl);
    }
    render() {
        return (

             <View style={styles.container} >  
                  <PublicTitle text={this.state.title} _searchOnlcik={this.testOnlcik}/>
               <WebView path={this.state.rooturl}/>
            </View>


        );

    }


}
const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: '#f2f2f2',  
  },  
});  
