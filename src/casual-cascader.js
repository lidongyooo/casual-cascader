/*!
    @Address：https://github.com/LiDong525/casual-cascader.git
    @Name: casual-cascader
    @Description：无限级联搜索
    @Author: lidong
    @License：MIT
*/

//严格模式
"use strict";


const CASUAL_PANEL = '<div class="casual-panel">',
      CASUAL_MENU = '<div class="casual-menu">',
      CASUAL_MENU_LIST = '<ul class="casual-menu-list">',
      DIV_END = '</div>'

const CASUAL_PANEL_CLASS = 'casual-panel',
      CASUAL_MENU_CLASS = 'casual-menu'

let that = null
let CasualCascader = function(element,data,options){
    that = this
    options = options || {}

    if( !(element) ){
        throw '请给定一个input元素'
    }else if( !(data) ){
        throw '请给定数据'
    }

    that.data = data
    that.element = element
    //合并配置
    Object.assign(that.config,options)

    that.render()
}

//初始配置
CasualCascader.prototype.config = {
    names : ['province','city','district','street'], //input的name值,同时也代表渲染的层级~
    placeHolder : '省/市/区/街道',
    size : '14',
    color : '#606266',
    activeColor : '#409eff',
    width : '180',
    height : '190',
    borderColor : '#e4e7ed',
    backgroundColor : 'white',
    children : 'children', //子级字段名称
    visibility : 'name', //显示字段名称
    show : false //是否显示
}

//渲染
CasualCascader.prototype.render = () => {
    let attributes = {
        left : that.getElementLeft(),
        top : that.getElementTop()+that.element.offsetHeight,
        height : that.element.offsetHeight,
        width : that.element.offsetWidth
    }

    let content  = [];
    content.push(CASUAL_PANEL)
    content = content.concat(that.renderMenu())
    content.push(DIV_END)
    that.element.insertAdjacentHTML('afterend',content.join(''))

    that.show()
    that.element.addEventListener('click',that.show)
}

//批量设置属性
CasualCascader.prototype.style = (elements,styles) => {

    for (let index in elements){
        for (let key in styles){
            elements[index]['style'][key] = styles[key]
        }
    }

}

//显示隐藏
CasualCascader.prototype.show = (event) => {
    event = event || null
    if(event !== null){
        that.config.show = that.config.show ? false : true
    }

    if(that.config.show){
        that.element.nextSibling['style']['display'] = 'inline-flex'
    }else{
        that.element.nextSibling['style']['display'] = 'none'
    }

}

CasualCascader.prototype.renderMenu = () => {
    let length = document.getElementsByClassName(CASUAL_MENU_CLASS).length,
        temp = [],
        counter = '',
        row = {}

    temp.push(CASUAL_MENU+CASUAL_MENU_LIST)
    if(length === 0){
        for (let key in that.data){
            row = that.data[key]
            counter = that.config.children in row ? '（'+row[that.config.children].length+'）</span><span class="casual-menu-list-item-icon casual-icon-right"></span>' : '</span>'
            temp.push('<li class="casual-menu-list-item" data-count="'+row[that.config.children].length+'"><span class="casual-menu-list-item-text">'+row[that.config.visibility]+counter+'</li>')
        }
    }
    //casual-menu & casual-menu-list
    temp.push(DIV_END+DIV_END)

    return temp
}

CasualCascader.prototype.getElementLeft = () =>{
    let element = that.element
    let actualLeft = element.offsetLeft
    let current = element.offsetParent

    while (current !== null){
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

CasualCascader.prototype.getElementTop = () =>{
    let element = that.element
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null){
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}