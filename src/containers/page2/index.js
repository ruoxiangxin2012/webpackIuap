// var html=require('./index.html');
import './index.scss'
import html from './index.html';
module.exports = function() {
     document.querySelector('.u-content').innerHTML = html;
}
