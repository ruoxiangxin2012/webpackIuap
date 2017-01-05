/**
 * Created by 28646 on 2017/1/4.
 */
import html from './index.html';    //es6模块加载
import './index.scss'
module.exports = function() {
    document.querySelector('.u-content').innerHTML = html;
}