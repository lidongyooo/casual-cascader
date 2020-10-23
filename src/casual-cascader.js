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
      CASUAL_MENU_LIST_CLASS = 'casual-menu-list',
      CASUAL_MENU_LIST_ITEM_CLASS = 'casual-menu-list-item'

let casualIndex = 1,
    configs  = []

let CasualCascader = function(element,data,options){
    let _this =  this
    options = options || {}

    //初始配置
    let config = {
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
        close : true,
        isShow : false //是否显示
    }

    if( !(element) ){
        throw '请给定一个input元素'
    }else if( !(data) ){
        throw '请给定数据'
    }

    options.element = element
    options.data = data
    _this.bindConfigs(CASUAL_PANEL_CLASS+'-'+casualIndex,Object.assign(config,options))
    _this.render()

    casualIndex++
}

CasualCascader.prototype.bindConfigs = function(key,config){
    configs[key] = config
    configs[key]['casualIndex'] = CASUAL_PANEL_CLASS+'-'+casualIndex
}

//渲染
CasualCascader.prototype.render = function () {
    let _this =  this,
        config = configs[CASUAL_PANEL_CLASS+'-'+casualIndex]

    let content  = [];
    content.push(CASUAL_PANEL)
    content = content.concat(generateMenu(config['data'],config))
    content.push(DIV_END)
    insertHTML(config['element'],'afterend',content.join(''))

    //添加类名
    config['element'].nextSibling.classList.add(config['casualIndex'])
    _this.show()
    _this.panelStyle(config)

    //绑定事件
    config['element'].addEventListener('click',_this.show)

    document.addEventListener('click',hidePanel)
}

CasualCascader.prototype.panelStyle = function (config) {
    let _this = this,
        spaceAttribute = {
            left : _this.getElementLeft(config['element']),
            top : _this.getElementTop(config['element'])+config['element'].offsetHeight+8,
            height : config['element']['offsetHeight'],
            width : config['element']['offsetHeight']
        }

    //panel 样式设置
    let panel = document.getElementsByClassName(config['casualIndex'])[0]
    let styles = {
        "position" : 'absolute',
        "left" : spaceAttribute['left']+'px',
        "top" : spaceAttribute['top']+'px',
        "font-size" : config['size'],
        'color' : config['color']
    }
    _this.setStyle(panel,styles)
}

CasualCascader.prototype.setStyle = function(element,styles){
    for (let key in styles){
        element['style'][key] = styles[key]
    }
}

//显示隐藏
CasualCascader.prototype.show = function (event) {
    let panelIndex = event !== undefined ? event.target.nextSibling.classList[1] : configs[CASUAL_PANEL_CLASS+'-'+casualIndex]['element'].nextSibling.classList[1]

    if(event !== undefined){
        event.stopPropagation()
        configs[panelIndex]['isShow'] = configs[panelIndex]['isShow'] ? false : true
    }

    if(configs[panelIndex]['isShow']){
        document.getElementsByClassName(panelIndex)[0]['style']['display'] = 'inline-flex'
    }else{
        document.getElementsByClassName(panelIndex)[0]['style']['display'] = 'none'
    }
}

CasualCascader.prototype.getElementLeft = function (element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent

    while (current !== null){
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

CasualCascader.prototype.getElementTop = function (element) {
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null){
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}

function removeNextSiblings(element,currCasualMenu,casualMenus){

    let casualMenusLength = casualMenus.length,
        flag = false,
        counter = 0

    for (let index = 0; index < casualMenusLength; index++){
        if(flag === false){
            flag = currCasualMenu === casualMenus[index]
        }
        if(flag && currCasualMenu !== casualMenus[index]){
            casualMenus[index-counter].remove()
            counter++
        }
    }

    return casualMenus.length
}

function generateMenu(data,config,index) {
    let length = document.getElementsByClassName(config.casualIndex).length > 0 ? document.getElementsByClassName(config.casualIndex)[0].getElementsByClassName(CASUAL_MENU_CLASS).length : 0,
        temp = [],
        counter = '',
        total = 0,
        row = {}

    index = index || ''
    temp.push(CASUAL_MENU+CASUAL_MENU_LIST)
    if(length !== 0){
        index += '-'
    }

    for (let key in data){
        row = data[key]
        total = config.children in row ? row[config.children].length : 0
        counter = config.children in row ? '（'+total+'）</span><span data-index="'+index+key+'" class="casual-menu-list-item-icon casual-icon-right"></span>' : '</span>'
        temp.push('<li class="casual-menu-list-item" data-index="'+index+key+'" data-count="'+total+'"><span data-index="'+index+key+'" class="casual-menu-list-item-text">'+row[config.visibility]+counter+'</li>')
    }

    setTimeout(function(){
        stopPropagation()
    },300)

    //casual-menu & casual-menu-list
    temp.push(DIV_END+DIV_END)

    return temp
}

//防止误触关闭
function stopPropagation(){
    let collections = document.getElementsByClassName(CASUAL_MENU_LIST_CLASS)
    for (let collection of collections){
        collection.addEventListener('click',function(e){
            e.stopPropagation()
        })
    }
    collections = document.getElementsByClassName(CASUAL_MENU_CLASS)
    for (let collection of collections){
        collection.addEventListener('click',function(e){
            e.stopPropagation()
        })
    }
}

function together (event) {
    let element = event.target,
        currCasualMenu =  element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode : element.parentNode.parentNode,
        casualMenus = element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode.parentNode.children: element.parentNode.parentNode.parentNode.children,
        dataIndex = element.getAttribute('data-index').split('-'),
        config = configs[currCasualMenu.parentNode.classList[1]],
        data = config['data']

    //阻止事件冒泡
    event.stopPropagation()
    //首先删除后面的menu
    removeNextSiblings(element,currCasualMenu,casualMenus)
    //选中状态
    active(element)

    for (let i = 0; i < dataIndex.length;i++){
        data = data[dataIndex[i]][config['children']]
    }

    insertHTML(document.getElementsByClassName(config['casualIndex'])[0],'beforeend',generateMenu(data,config,dataIndex.join('-')).join(''))
}

function insertHTML(element,position,content){
    element.insertAdjacentHTML(position,content)
    bindEvent()
}

function bindEvent (){
    let items = document.getElementsByClassName(CASUAL_MENU_LIST_ITEM_CLASS)

    for (let item of items){
        if(parseInt(item.getAttribute('data-count')) > 0){
            item.addEventListener('click',together)
        }else{
            item.addEventListener('click',last)
        }
    }
}

function last(event) {
    let element = event.target,
        currCasualMenu =  element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode : element.parentNode.parentNode,
        config = configs[currCasualMenu.parentNode.classList[1]]

    //是否阻止事件冒泡
    if(config.close === false){
        event.stopPropagation()
    }else{
        hidePanel()
    }

    active(element)
}

function active(element){
    element = element.tagName === 'SPAN' ? element.parentNode : element
    let children = element.parentNode.children
    for (let child of children) {
        if(child.classList.contains('casual-menu-list-item_active')){
            child.classList.remove('casual-menu-list-item_active')
        }
    }
    element.classList.add('casual-menu-list-item_active')
}

function hidePanel(){
    let panels = document.getElementsByClassName(CASUAL_PANEL_CLASS)
    for (let panel of panels){
        if(panel['style']['display'] !== 'none'){
            panel['style']['display'] = 'none'
        }
    }
    for (let key in configs){
        configs[key]['isShow'] = false
    }
}