import Editor ,{RowFlex,ElementType,EditorMode}from "@hufe921/canvas-editor"
import PageSet from "./set"
//阅读页面组件
export default function HomePage() {
  return (
      <div>
        <PageSet />
      <div id="ReadExample">
    </div></div>
   
  );
}
//页面配置
const IEditorOption = {
  margins: [5, 8, 5, 8],
  width: 920,
  pageNumber: {
    format: '第{pageNo}页 / 共{pageCount}页',
    size: 15
  },
  watermark: {
    data: '镜芯阅读',
    size: 80
  },
  title: '标题',
  marginIndicatorSize: 0,
  mode: EditorMode.READONLY
}
//页面初始化数据
const Radybody = [
    {
      value: '文章标题',
      size: 32,
      rowFlex: RowFlex.CENTER
    },
    {
      value: '\n',
      type: ElementType.SEPARATOR
    },
    {
      value: '   正文内容',
      //type: ElementType.SEPARATOR
    }
  ]

if (typeof Readct !== 'undefined') {
  window['Readct'].destroy()
}
// 1. 初始化编辑器
function tick() {
  const container = document.getElementById<HTMLDivElement>('ReadExample')!
  window['Readct'] = new Editor(
    container, Radybody,
    IEditorOption
  )
}
setTimeout(tick, 100)



