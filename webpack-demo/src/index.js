import _ from "lodash"
import './style.css'
import Icon from './smallHuihui.jpg'
import Data from './data.xml';
import printMe from './print.js';
function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello')

  //将图片添加到我们现有的div
  var myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon)
  console.log(Data);


  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);



  
  return element;
}

document.body.appendChild(component());