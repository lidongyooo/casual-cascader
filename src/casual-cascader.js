/*!
    @Address：https://github.com/LiDong525/casual-cascader.git
    @Name: casual-cascader
    @Description：无限级联选择
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
    CASUAL_MENU_LIST_ITEM_CLASS = 'casual-menu-list-item',
    ACTIVE_CLASS = 'casual-menu-list-item_active',
    ICON_UP_CLASS = 'casual-icon-up',
    ICON_DOWN_CLASS = 'casual-icon-down'

let casualIndex = 1,
    casualConfigs = []

let CasualCascader = function (element, data, options) {
    let _this = this
    options = options || {}

    //初始配置
    let config = {
        names: ['province', 'city', 'district', 'street'], //input的name值
        delimiter: '/',
        value: '',
        values: [],
        placeHolder: '省/市/区/街道',
        size: '14px',
        color: '#606266',
        activeColor: '#409eff',
        width: '180px',
        height: '190px',
        borderColor: '#e4e7ed',
        backgroundColor: 'white',
        children: 'children', //子级字段名称
        visibility: 'name', //显示字段名称
        close: true,
        isShow: false, //是否显示
        iconLeft: 0,
        iconTop: 0,
        iconSize : '16px',
        iconColor : 'black'
    }

    if (!(element) || element.tagName !== 'INPUT') {
        throw '请给定一个input元素'
    } else if (!(data)) {
        throw '请给定数据'
    }

    options.element = element
    options.data = data
    _this.bindcasualConfigs(CASUAL_PANEL_CLASS + '-' + casualIndex, Object.assign(config, options))
    _this.render()
    _this.default()
    _this.show()

    casualIndex++
}

CasualCascader.prototype.bindcasualConfigs = function (key, config) {
    casualConfigs[key] = config
    casualConfigs[key]['casualIndex'] = CASUAL_PANEL_CLASS + '-' + casualIndex
}

CasualCascader.prototype.setValue = function(element){
    this.default(casualConfigs[element.nextSibling.nextSibling.classList[1]])
}

CasualCascader.prototype.default = function(config){
    let index = 0,
        flag = true

    config = config || casualConfigs[CASUAL_PANEL_CLASS + '-' + casualIndex]

    config.value = config.value || config['element'].value
    config.values = config.values.length === 0 ? config.value.split(config['delimiter']) : config.values

    for (let value of config.values){
        let items = getElementsByClassName(config['casualIndex']).getElementsByClassName(CASUAL_MENU_CLASS)[index].getElementsByClassName(CASUAL_MENU_LIST_ITEM_CLASS)
        for (let item of items){
            if(item.getAttribute('data-value') === value){
                item.click()
                flag = true
                break
            }else{
                flag = false
            }
        }
        if(!flag){
            break
        }
        index++
    }
}

//渲染
CasualCascader.prototype.render = function () {
    let _this = this,
        config = casualConfigs[CASUAL_PANEL_CLASS + '-' + casualIndex],
        spaceAttribute = {
            left: _this.getElementLeft(config['element']),
            top: _this.getElementTop(config['element']),
            height: config['element']['offsetHeight'],
            width: config['element']['offsetWidth']
        },
        content = []

    config['element'].setAttribute('placeHolder', config['placeHolder'])

    content.push('<i class="' + ICON_UP_CLASS + '" style="color:'+config['iconColor']+';font-size: '+config['iconSize']+';position: absolute;left: ' + (spaceAttribute['left'] + spaceAttribute['width'] - 25 + parseInt(config['iconLeft'])) + 'px;top: ' + (spaceAttribute['top']+ spaceAttribute['height']/2 - 11 + parseInt(config['iconTop'])) + 'px"></i>' + CASUAL_PANEL)
    content = content.concat(generateMenu(config['data'], config))
    content.push(DIV_END)
    insertHTML(config['element'], 'afterend', content.join(''))

    //添加类名
    config['element'].nextSibling.nextSibling.classList.add(config['casualIndex'])

    _this.panelStyle(config, spaceAttribute)

    //绑定事件
    config['element'].addEventListener('click', _this.show)
    document.addEventListener('click', hidePanel)
}

CasualCascader.prototype.panelStyle = function (config, spaceAttribute) {
    let _this = this

    //panel 样式设置
    let panel = getElementsByClassName(config['casualIndex'])
    let styles = {
        "position": 'absolute',
        "left": spaceAttribute['left'] + 'px',
        "top": (spaceAttribute['top'] + config['element'].offsetHeight + 8) + 'px',
        "font-size": config['size'],
        'color': config['color']
    }
    _this.setStyle(panel, styles)
}

CasualCascader.prototype.setStyle = function (element, styles) {
    for (let key in styles) {
        element['style'][key] = styles[key]
    }
}

//显示隐藏
CasualCascader.prototype.show = function (event) {
    let panelIndex = event !== undefined ? event.target.nextSibling.nextSibling.classList[1] : casualConfigs[CASUAL_PANEL_CLASS + '-' + casualIndex]['element'].nextSibling.nextSibling.classList[1],
        config = casualConfigs[panelIndex]

    if (event !== undefined) {
        event.stopPropagation()
        config['isShow'] = config['isShow'] ? false : true
    }

    if (config['isShow']) {
        getElementsByClassName(panelIndex)['style']['display'] = 'inline-flex'
        iconChanged(getElementsByClassName(panelIndex).previousSibling, 'up')
    } else {
        getElementsByClassName(panelIndex)['style']['display'] = 'none'
        iconChanged(getElementsByClassName(panelIndex).previousSibling, 'down')
        setValues(config)
    }
}

CasualCascader.prototype.getElementLeft = function (element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent

    while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

CasualCascader.prototype.getElementTop = function (element) {
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}

function removeNextSiblings(element, currCasualMenu, casualMenus) {

    let casualMenusLength = casualMenus.length,
        flag = false,
        counter = 0

    for (let index = 0; index < casualMenusLength; index++) {
        if (flag === false) {
            flag = currCasualMenu === casualMenus[index]
        }
        if (flag && currCasualMenu !== casualMenus[index]) {
            casualMenus[index - counter].remove()
            counter++
        }
    }

    return casualMenus.length
}

function generateMenu(data, config, index) {
    let length = getElementsByClassName(config.casualIndex, 'much').length > 0 ? getElementsByClassName(config.casualIndex).getElementsByClassName(CASUAL_MENU_CLASS).length : 0,
        temp = [],
        counter = '',
        total = 0,
        row = {}

    index = index || ''
    temp.push('<div class="casual-menu" style="background-color: ' + config['backgroundColor'] + ';min-width: ' + config['width'] + ';border-right: 1px solid ' + config['borderColor'] + ';"><ul style="max-height: ' + config['height'] + '" class="casual-menu-list">')
    if (length !== 0) {
        index += '-'
    }

    for (let key in data) {
        row = data[key]
        total = config.children in row ? row[config.children].length : 0
        counter = config.children in row ? '（' + total + '）</span><span data-index="' + index + key + '" class="casual-menu-list-item-icon casual-icon-right"></span>' : '</span>'
        temp.push('<li class="casual-menu-list-item" data-value="'+row[config.visibility]+'" data-index="' + index + key + '" data-count="' + total + '"><span data-value="'+row[config.visibility]+'" data-index="' + index + key + '" class="casual-menu-list-item-text">' + row[config.visibility] + counter + '</li>')
    }

    setTimeout(stopPropagation, 300)

    //casual-menu & casual-menu-list
    temp.push(DIV_END + DIV_END)

    return temp
}

//防止误触关闭
function stopPropagation() {
    let collections = getElementsByClassName(CASUAL_MENU_LIST_CLASS, 'much')
    for (let collection of collections) {
        collection.addEventListener('click', function (e) {
            e.stopPropagation()
        })
    }
    collections = getElementsByClassName(CASUAL_MENU_CLASS, 'much')
    for (let collection of collections) {
        collection.addEventListener('click', function (e) {
            e.stopPropagation()
        })
    }
}

function together(event) {
    let element = event.target.tagName === 'SPAN' ? event.target.parentNode : event.target,
        currCasualMenu = element.parentNode.parentNode,
        casualMenus = currCasualMenu.parentNode.children,
        dataIndex = element.getAttribute('data-index').split('-'),
        config = casualConfigs[currCasualMenu.parentNode.classList[1]],
        data = config['data']

    //阻止事件冒泡
    event.stopPropagation()
    //首先删除后面的menu
    removeNextSiblings(element, currCasualMenu, casualMenus)

    //如果是选中状态则不渲染
    if (element.classList.contains(ACTIVE_CLASS)) {
        element.classList.remove(ACTIVE_CLASS)
        return
    }

    //选中状态
    activeClass(element, config)

    for (let i = 0; i < dataIndex.length; i++) {
        data = data[dataIndex[i]][config['children']]
    }

    insertHTML(getElementsByClassName(config['casualIndex']), 'beforeend', generateMenu(data, config, dataIndex.join('-')).join(''))

}

function setValues(config) {
    let actives = getElementsByClassName(config['casualIndex']).getElementsByClassName(ACTIVE_CLASS)
    let index = 0
    let temp = []

    for (let item of actives) {
        temp[index] = item.children[0].getAttribute('data-value')
        index++
    }

    config['values'] = temp
    config['value'] = temp.join(config['delimiter'])
    config['element'].value = config['value']
}

function insertHTML(element, position, content) {
    element.insertAdjacentHTML(position, content)
    bindEvent()
}

function bindEvent() {
    let items = getElementsByClassName(CASUAL_MENU_LIST_ITEM_CLASS, 'much')

    for (let item of items) {
        if (parseInt(item.getAttribute('data-count')) > 0) {
            item.addEventListener('click', together)
        } else {
            item.addEventListener('click', clickLast)
        }
    }
}

function clickLast(event) {
    let element = event.target,
        currCasualMenu = element.tagName === 'SPAN' ? element.parentNode.parentNode.parentNode : element.parentNode.parentNode,
        config = casualConfigs[currCasualMenu.parentNode.classList[1]]

    activeClass(element, config)

    //是否阻止事件冒泡
    if (config.close === false) {
        event.stopPropagation()
    } else {
        hidePanel()
    }

}

function activeClass(element, config) {
    element = element.tagName === 'SPAN' ? element.parentNode : element
    let children = element.parentNode.children
    for (let child of children) {
        child['style']['color'] = config['color']
        if (child.classList.contains(ACTIVE_CLASS)) {
            child.classList.remove(ACTIVE_CLASS)
        }
    }
    element.classList.add(ACTIVE_CLASS)
    element['style']['color'] = config['activeColor']
}

function hidePanel() {
    let panels = getElementsByClassName(CASUAL_PANEL_CLASS, 'much')
    for (let panel of panels) {
        if (panel['style']['display'] !== 'none') {
            panel['style']['display'] = 'none'
        }
    }
    for (let key in casualConfigs) {
        casualConfigs[key]['isShow'] = false
        iconChanged(casualConfigs[key]['element'].nextSibling, 'down')
        setValues(casualConfigs[key])
    }
}

function iconChanged(element, type) {
    if (type === 'down') {
        element.classList.remove(ICON_UP_CLASS)
        element.classList.add(ICON_DOWN_CLASS)
    } else {
        element.classList.remove(ICON_DOWN_CLASS)
        element.classList.add(ICON_UP_CLASS)
    }
}

function getElementsByClassName(className, type) {
    type = type || 'single'
    return type === 'single' ? document.getElementsByClassName(className)[0] : document.getElementsByClassName(className)
}