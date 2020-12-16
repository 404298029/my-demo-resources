//在所有SharedWorker共享的worker.js中,
//保存一个data变量,用于存储多个worker共享的数据
let data="";
//必须提供一个名为onconnect的事件处理函数
//每当一个页面中new SharedWorker('worker.js')时,
//就会为新创建的worker绑定onconnect事件处理函数
onconnect=function(e){
    //获得当前连接上来的客户端对象
    var client =e.ports[0];
    //当当前对象收到消息时,自动执行下面这句话
    client.onmessage=function(e){
        //如果消息内容为空,说明该客户端想获取共享的数据data
        if(e.data===""){
            //就给当前客户端发送data数据
            client.postMessage(data);
        }else{
            //否则如果消息不为空,
            //说明客户端想要提供新的消息保存在共享的data中,供别人获取
            data=e.data;
        }
    }
}