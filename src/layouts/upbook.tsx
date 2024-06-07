import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Tooltip, Upload } from 'antd';
import Select from './function/Select Group'
import './upbook.less';
import { useState } from 'react';
const { Dragger } = Upload;

interface Props {
  dosShow: Boolean,
  openMsg: Function
}
const options = {
  title: '导入书籍',
  buttonLabel: '导入',
  properties: ['multiSelections'],
  filters: [
    { name: '书籍格式', extensions: ['epub'] },
  ]
}
let Upoptions: string
options.filters.forEach(element => {
  Upoptions += `.${element.extensions},`
});
const msgKey = 'openbook_5a4s1'

const App: React.FC<Props> = ({ dosShow, openMsg }) => {
  const [showSelect, setshowSelect] = useState(false)
  const [active, setactive] = useState<boolean>(false);
  const [Filel, setFilel] = useState<{ name: string; File: string; }[]>([]);
  const Newbook = function () {
    openMsg({
      key: msgKey,
      type: 'loading',
      content: '等待导入文件',
      duration: 0,
    })
    //@ts-ignore 打开系统对话框
    Hive.osdialog('showOpenDialog', options).then((result) => {
      if (result.canceled) {
        openMsg({
          key: msgKey,
          type: 'info',
          content: '取消导入',
          duration: 4,
        })
      } else {  //对话框打开文件导入
        let bookl: { name: string; File: any; }[] = []
        result.filePaths.forEach((key: any) => {
          let File = key
          let name = Hive.path.basename(key)
          bookl.push({
            name: name,
            File: File
          })
        })
        SelectGroup(bookl)

      }
    })
  }
  const props: UploadProps = {
    name: 'file',
    accept: Upoptions,
    openFileDialogOnClick: false,
    multiple: true,
    fileList: [],
    onChange(info) { //拖动文件导入
      let bookl: { name: string; File: string; }[] = []
      info.fileList.forEach((key) => {
        bookl.push({
          name: key.name,
          File: key['originFileObj']?.path
        })
      })
      SelectGroup(bookl)
    },
    onDrop(info) {
      openMsg({
        key: msgKey,
        type: 'warning',
        content: '格式不受支持的文件!',
        duration: 3,
      })
    }
  };
  function SelectGroup(url: { name: string; File: string; }[]) {
    openMsg({
      key: msgKey,
      type: 'loading',
      content: '等待确认书籍分组',
      duration: 0,
    })
    setFilel(url)
    setshowSelect(true)
  }
  const ImporBooks = (keys: string, Filel: any[]) => { //导入处理
    setshowSelect(false)
    upepub(keys, Filel)
  }
  //书籍格式导入处理
  function upepub(keys: string, Filel: any[]) {
    openMsg({
      key: msgKey,
      type: 'loading',
      content: `正在导入 ${Filel.length} 个书籍...`,
      duration: 0,
    })
    Filel.forEach((key, i) => {
      Hive.Mobilegroup(Number(keys), key.name)
      Hive.ImporBooks(key.File, (err: any) => {
        if (!err) {
          openMsg({
            type: 'error',
            content: `${key.name} 导入失败！${err}`,
            duration: 4,
          })
        } else {
          openMsg({
            type: 'success',
            content: `${key.name} 导入成功！`,
            duration: 3,
          })
        }
        if (i + 1 == Filel.length) {
          openMsg(msgKey)
        }
      })

    })
  }
  return (
    <div

      onDragEnter={(e) => {
        if (active) return
        setactive(true)
      }}
      onDragOver={(e) => {
        if (!active) {
          setactive(true)
        }
      }}
      onDragLeave={() => {
        setactive(false)
      }}
      onDrop={() => {
        setactive(false)
      }}
    >
      <Select callBack={ImporBooks}
        Filel={Filel}
        open={showSelect}
        openMsg={openMsg}
        onCancel={() => {
          console.log(1);

          openMsg(msgKey)
          setshowSelect(false)
        }} />
      <Tooltip title="由此导入本地书籍">
        <div onClick={Newbook}>
          <Dragger className='dragger'  {...props} >
            <p className="ant-upload-drag-icon" style={{ margin: 0 }}>
              <InboxOutlined className={active ? 'upbookactive' : ''} style={{ transition: 'font-size 0.26s linear', fontSize: dosShow ? 38 : 48 }} />
            </p>
            {dosShow ? null : (
              <><p className="ant-upload-text">将文件拖到此处进行导入</p>
                <p className="ant-upload-hint">
                  支持单个或多个文件
                </p>
              </>)
            }

          </Dragger>
        </div>

      </Tooltip>
    </div>

  );

}
export default App;