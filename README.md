

## casual-cascader

### 本组件采用原生 javascript 编写

具体使用方法请参见 demo.html

### 配置参数

| 名称            | 是否必填 | 默认值                                              | 备注                                                         |
| --------------- | -------- | --------------------------------------------------- | ------------------------------------------------------------ |
| names           | 否       | array    ['province', 'city', 'district', 'street'] | 生成的隐藏域 name 值，如为空则不生成                         |
| delimiter       | 否       | string    " / "                                     | input value 的分隔符                                         |
| value           | 否       | string    ""                                        | input 的默认值；需依照 **delimiter** 来分割                  |
| values          | 否       | array    []                                         | 各级选中的 value 值；也可使用此属性来设置默认值，但还是建议使用 **value** |
| placeHolder     | 否       | string    "省 / 市 / 区 / 街道"                     | input 的 placeHolder                                         |
| size            | 否       | string    "14px"                                    | 面板的字体大小；需携带尺寸单位 例：16px  1rem                |
| color           | 否       | string    "#606266"                                 | 面板的字体颜色                                               |
| activeColor     | 否       | string    "#409eff"                                 | 选中时的字体颜色                                             |
| width           | 否       | string    "180px"                                   | 面板宽度；需携带尺寸单位 例：200px                           |
| height          | 否       | string    "190px"                                   | 面板高度；需携带尺寸单位 例：200px                           |
| borderColor     | 否       | string    "#e4e7ed"                                 | 面板边框线颜色                                               |
| backgroundColor | 否       | string    "white"                                   | 面板背景颜色                                                 |
| children        | 否       | string    "children"                                | 数据集的子级字段名称                                         |
| visibility      | 否       | string    "name"                                    | 数据集的显示字段名称                                         |
| isClose         | 否       | bool    true                                        | 选中最后菜单时是否自动关闭                                   |
| isOpen          | 否       | bool    false                                       | 是否默认打开                                                 |
| iconLeft        | 否       | int    0                                            | input 的 icon 向左偏移量                                     |
| iconTop         | 否       | int    0                                            | input 的 icon 向上偏移量                                     |
| iconSize        | 否       | string    "16px"                                    | input 的 icon 字体大小；需携带尺寸单位 例：16px  1rem        |
| iconColor       | 否       | string    "black"                                   | input 的 icon 字体颜色                                       |



### 事件

- clickEvent
  - @description  点击回调
  - @param  element  当前点击的元素
  - @param  value  当前元素的值
  - @param  options  配置
- openEvent
  - @description  面板打开回调
  - @param  options  配置
- closeEvent
  - @description  面板关闭回调
  - @param  options  配置



### 可用方法

- setValue
  - @description 此方法接收两个参数，设置value
  - @param  element  string|element object  必填
  - @param  value  string|array  必填  使用字符串时需按照 **delimiter** 分割
- close
  - @description 此方法接收一个参数，关闭面板
  - @param  element  string|element object  必填
- open
  - @description 此方法接收一个参数，打开面板
  - @param  element  string|element object  必填