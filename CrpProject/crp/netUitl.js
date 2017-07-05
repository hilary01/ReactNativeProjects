

/**
 * NetUitl 网络请求的实现
 * https://github.com/facebook/react-native
 */
import React, { Component } from 'react';
export default class NetUitl extends React.Component {
    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url, params, callback) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        //fetch请求
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' //记得加上这行，不然bodyParser.json() 会识别不了
            },
        })
            .then((response) => {
                callback(response)
            }).done();
    }
    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url, params, header, callback) {
        //fetch请求
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                callback(responseJSON)
            }).done();
    }


    // let params = {'start':'0',limit:'20','isNeedCategory': true, 'lastRefreshTime': '2016-09-25 09:45:12'};
    //     NetUitl.post('http://www.pintasty.cn/home/homedynamic',params,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJVLTliZGJhNjBjMjZiMDQwZGJiMTMwYWRhYWVlN2FkYTg2IiwiZXhwaXJhdGlvblRpbWUiOjE0NzUxMTg4ODU4NTd9.ImbjXRFYDNYFPtK2_Q2jffb2rc5DhTZSZopHG_DAuNU',function (set) {
    //         //下面的就是请求来的数据
    //         console.log(set)
    //     })
    //     //get请求,以百度为例,没有参数,没有header
    //     NetUitl.get('https://www.baidu.com/','',function (set) {
    //         //下面是请求下来的数据
    //         console.log(set)
    //     })



}
