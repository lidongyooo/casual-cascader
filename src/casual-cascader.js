/*!
    @Address：https://github.com/LiDong525/casual-cascader.git
    @Name: casual-cascader
    @Description：无限级联搜索
    @Author: lidong
    @License：MIT
*/

//严格模式
"use strict";

var thatCascader = null
let CasualCascader = function(options){
    thatCascader = this

    if( !('element' in options) ){
        throw '请给定一个input元素'
    }

    //合并配置
    Object.assign(thatCascader.config,options)

    thatCascader.loadData()
    thatCascader.render()
}

//初始配置
CasualCascader.prototype.config = {
    names : ['province','city','district','street'], //input的name值,同时也代表渲染的层级~
    placeHolder : '省/市/区/街道',
    size : '14',
    color : '#606266',
    activeColor : '#409eff',
    minWidth : '180',
    maxHeight : '190',
    borderColor : '#e4e7ed',
    backgroundColor : 'white',
    children : 'children', //子级字段名称
    visibility : 'name', //显示字段名称
    data : 'data.json'
}

//渲染
CasualCascader.prototype.render = () => {

}

//加载数据
CasualCascader.prototype.loadData = () => {
    if(typeof thatCascader.config.data === 'string'){
        let request = new XMLHttpRequest();
        request.open("get", thatCascader.config.data);
        request.send(null);
        request.onload = () => {
            console.log(request)
        }
    }
}

CasualCascader.prototype.getElementLeft = () =>{
    let element = thatCascader.element
    let actualLeft = element.offsetLeft
    let current = element.offsetParent

    while (current !== null){
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

CasualCascader.prototype.getElementLeft = () =>{
    let element = thatCascader.element
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null){
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}