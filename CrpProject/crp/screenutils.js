/**
 * @author YASIN
 * @version [Android YASIN V01, ]
 * @blog http://blog.csdn.net/vv_bug
 * @description
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
import {
    PixelRatio,
}from 'react-native';
import Dimensions from 'Dimensions';
export var screenW = Dimensions.get('window').width;
export var screenH = Dimensions.get('window').height;
var fontScale = PixelRatio.getFontScale();
export var pixelRatio =PixelRatio.get();

export const DEFAULT_DENSITY=2;
const w2 = 750/DEFAULT_DENSITY;
const h2 = 1334/DEFAULT_DENSITY;

export function setSpText(size:Number) {
    var scaleWidth = screenW / w2;
    var scaleHeight = screenH / h2;
    var scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size;
}
/**
 * 屏幕适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
export function scaleSize(size:Number) {
    var scaleWidth = screenW / w2;
    var scaleHeight = screenH / h2;
    var scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round((size * scale + 0.5));
    return size/DEFAULT_DENSITY;
}