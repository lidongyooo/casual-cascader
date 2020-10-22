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
      CASUAL_MENU_CLASS = 'casual-menu',
      CASUAL_MENU_LIST_ITEM_CLASS = 'casual-menu-list-item'

let casualIndex = 1,
    configs  = {}

let CasualCascader = function(element,data,options){
    let _this =  this
    options = options || {}

    if( !(element) ){
        throw '请给定一个input元素'
    }else if( !(data) ){
        throw '请给定数据'
    }
    _this.data = data
    _this.element = element
    options.casualIndex = CASUAL_PANEL_CLASS+'-'+casualIndex
    options.data = _this.data
    //合并配置
    Object.assign(_this.config,options)

    _this.bindConfigs()
    _this.render()

    casualIndex++
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
    isShow : false //是否显示
}

CasualCascader.prototype.bindConfigs = function(){
    configs[this.config['casualIndex']] = this.config
}

//渲染
CasualCascader.prototype.render = function () {
    let _this =  this

    let attributes = {
        left : _this.getElementLeft(),
        top : _this.getElementTop()+_this.element.offsetHeight,
        height : _this.element.offsetHeight,
        width : _this.element.offsetWidth
    }

    let content  = [];
    content.push(CASUAL_PANEL)
    content = content.concat(generateMenu(_this.data,_this.config))
    content.push(DIV_END)
    _this.element.insertAdjacentHTML('afterend',content.join(''))

    //添加类名
    _this.element.nextSibling.classList.add(_this.config.casualIndex)
    _this.show()

    //绑定事件
    _this.element.addEventListener('click',_this.show)
    let items = document.getElementsByClassName(CASUAL_MENU_LIST_ITEM_CLASS)
    for (let index = 0; index <  items.length-1; index++){
        if(parseInt(items[index].getAttribute('data-count')) > 0){
            items[index].addEventListener('click',_this.together)
        }
    }
}

CasualCascader.prototype.together = function (event) {
    //首先删除后面的menu
    let element = event.target,
        currCasualMenu =  element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode : element.parentNode.parentNode,
        casualMenus = element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode.parentNode.children: element.parentNode.parentNode.parentNode.children,
        dataIndex = element.getAttribute('data-index'),
        index = dataIndex.split('-').length, //当前点击的层级
        config = configs[currCasualMenu.parentNode.classList[1]],
        data = config['data']

        removeNextSiblings(element,currCasualMenu,casualMenus)

        for (let i = 0; i < index;i++){
            data = data[dataIndex.split('-')[i]]
        }
        document.getElementsByClassName(config['casualIndex'])[0].insertAdjacentHTML('beforeend',generateMenu(data,config,dataIndex).join(''))
}


//批量设置属性
CasualCascader.prototype.style = function (elements,styles) {

    for (let index in elements){
        for (let key in styles){
            elements[index]['style'][key] = styles[key]
        }
    }

}

//显示隐藏
CasualCascader.prototype.show = function (event) {
    let _this =  this,
        panelIndex = event !== undefined ? event.target.nextSibling.classList[1] : _this.element.nextSibling.classList[1]

    if(event !== undefined){
        configs[panelIndex]['isShow'] = configs[panelIndex]['isShow'] ? false : true
    }

    if(configs[panelIndex]['isShow']){
        document.getElementsByClassName(panelIndex)[0]['style']['display'] = 'inline-flex'
    }else{
        document.getElementsByClassName(panelIndex)[0]['style']['display'] = 'none'
    }
}

CasualCascader.prototype.getElementLeft = function () {
    let _this =  this

    let element = _this.element
    let actualLeft = element.offsetLeft
    let current = element.offsetParent

    while (current !== null){
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

CasualCascader.prototype.getElementTop = function () {
    let _this =  this

    let element = _this.element
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null){
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}

//删除后面的节点
function removeNextSiblings(element,currCasualMenu,casualMenus){

    casualMenus =  [].filter.call(casualMenus, function(menu) {
        return menu !== currCasualMenu;
    });

    casualMenus.forEach(menu => {
        menu.remove()
    })
    console.log(casualMenus)
}

function generateMenu(data,config,index) {
    let length = document.getElementsByClassName(config.casualIndex).length > 0 ? document.getElementsByClassName(config.casualIndex)[0].getElementsByClassName(CASUAL_MENU_CLASS).length : 0,
        temp = [],
        counter = '',
        row = {}

    index = index || ''
    temp.push(CASUAL_MENU+CASUAL_MENU_LIST)
    if(length !== 0){
        data =  data[config['children']]
        index += '-'
    }

    for (let key in data){
        row = data[key]
        counter = config.children in row ? '（'+row[config.children].length+'）</span><span data-index="'+index+key+'" class="casual-menu-list-item-icon casual-icon-right"></span>' : '</span>'
        temp.push('<li class="casual-menu-list-item" data-index="'+index+key+'" data-count="'+row[config.children].length+'"><span data-index="'+index+key+'" class="casual-menu-list-item-text">'+row[config.visibility]+counter+'</li>')
    }

    //casual-menu & casual-menu-list
    temp.push(DIV_END+DIV_END)

    return temp
}