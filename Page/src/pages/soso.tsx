
import QueueAnim from 'rc-queue-anim';
import BookBoxM from './bookBox/main';
import styles from './index.less';
import Modal from './diydemo/bookModal';
import { useState } from 'react';
const Bookbody = [
  {
    name: '我开局震惊了女帝',
    label: ['玄幻', '脑洞', '无敌', '玄幻', '系统', '穿越'],
    author: '隔江',
    cover: 'https://bookcover.yuewen.com/qdbimg/349573/1037330858/600.webp',
    intr: '宁天来到天玄世界，睁眼竟然是女子的闺房？ 等等，这是什么情况？身为废物的他，绝美至极的女帝竟要在今晚和他成亲？！ 震惊！ 系统激活！ 震惊他人就能获得奖励！？ 开局震惊女帝，踏出人生大事第一步，完成举世震惊！ …… 宁天看向无数天骄圣子：“不是吧……我就随随便便修炼一下，都能让你们如此震惊？” 【简介无能，请移步正文！】',
    chapter: '第805章 天玄界主，震惊女帝！',
    state: 0,
    id: '0',
  },
  {
    name: '神豪：签到四年，我成了千亿大佬',
    label: ['都市脑洞', '都市', '系统', '神豪', '无脑爽'],
    author: '忆宛',
    cover: 'https://bookcover.yuewen.com/qdbimg/349573/1016530091/600.webp',
    intr: '【最火签到爽文】 高考落榜，楚凌会所嫩模梦想被现实一套正蹬鞭腿左刺拳打的粉碎，只能去男子职业学院当和尚，本以为要打一辈子光棍，却没想到开启神豪签到系统 【在艺术教室签到，获得神级草书技能！】 【在宿舍签到，获得汤臣一品十套！】 【在财务处签到，获得呼吸有奖技能！呼吸便可得钱！】 ...... 四年时间，楚凌在校园不断签到。 四年之后，走出校园！ 这一次，让现实知道知道，什么叫做，年轻人从不讲武德！',
    chapter: '第968章 人尽皆知（大结局！）',
    id: '0',
  },
  {
    name: '冰河末世，我囤积了百亿物资',
    label: ['科幻', '重生', '空间', '末世', '求生'],
    author: '记忆的海',
    cover: 'https://p6-reading-sign.fqnovelpic.com/novel-pic/p2odb1d8d52526f87ca2da80619b8738509~tplv-resize:225:0.image?x-expires=1692713611&x-signature=%2FoQN0ghdqKOKHh6gI05%2B3lk5bhE%3D',
    intr: '末世+重生+爆囤物资+苟+无限空间+黑化复仇不圣母 　　全球进入冰河时代，寒冰末世来临，星球95%的人类全部丧生！ 　　上一世，张奕因为心地善良，结果被自己帮助过的人杀死了。 　　重生回到寒冰末世前一个月，张奕觉醒空间异能，开始疯狂的囤积物资！ 　　缺少物资？他直接掏空一座超级商场价值百亿的仓库！ 　　住的不舒服？他打造了一座堪比末日堡垒的超级安全屋！ 　　末日来临，别人都冻成狗，为了一口吃的可以舍弃一切。',
    chapter: '第645章 魂兽',
    state: 1,
    id: '0',
  },
  {
    name: '开局长生万古，苟到天荒地老',
    label: ['玄幻脑洞', '玄幻', '系统', '穿越', '诸天万界'],
    author: '紫灵风雪',
    cover: 'http://img.faloo.com/Novel/498x705/1/1018/001018345.jpg',
    intr: '非爽文+平淡日常+轻松诙谐+无女主+无刀子+苟王】入坑谨慎。 一本以长生者视角跨越几个修仙大时代的长生文，从平凡小山村走出小界域，跨入修仙大世，经历修仙界蓬勃发展时代、黄金鼎盛时代、规则崩灭时代，黑暗大动乱时代，万灵皆寂时代…… 陈浔穿越到浩瀚无垠的修仙界，觉醒长生系统，竟然还送了一头长生灵兽为伴。 我陈浔对打打杀杀没有兴趣，也不想招惹任何人，只想带着老牛看遍世间繁华。 一个不经意，他露出了腰间的三把开山',
    chapter: '第765章 长生世家 君',
    id: '0',
    state: 2,
  }
  ,
  {
    name: '反派：迎娶植物人女主，疯狂贴贴',
    label: ['都市脑洞', '都市', '系统', '穿越', '直播'],
    author: '请叫我太子殿下',
    cover: 'https://p9-reading-sign.fqnovelpic.com/novel-pic/p2o71b0057836070ec8bff9874b5780f56c~tplv-resize:225:0.image?x-expires=1692714219&x-signature=Og5P3hRdGKeNvohHuIKhhEKXmeQ%3D',
    intr: '林轩穿成都市小说中的暴躁反派。 开局被偏爱私生子的渣爹，逼着替嫁身患厌男症的植物人女配。 幸好【疯狂贴贴】系统到账。 只要和气运值高的人肢体接触，就能获得积分，购买各种商品技能。 于是林轩当机立断，选择成为女配苏清歌的冲喜对象。 新婚夜。 望着绝美的植物人女配，林轩开启了疯狂贴贴模式。 ... 我叫苏清歌，我被心生嫉妒的姑姑谋害为植物人。 在绝望之际，爷爷找来了林轩为我冲喜。 对方无微不至的“贴贴”照顾，令我羞耻的同',
    chapter: '第64章 林轩与苏清歌准备领结婚证啦！（4千字大章）',
    id: '0',
    state: 1,
  }
]

const DocsPage = () => {
   const {Modals,show} = Modal()[0]
    //console.log(ModalApi);
    
      
  return (
    <div>
      <div style={{ margin: '0 auto' }}>
        <QueueAnim className={'queue-simple ' + styles.cradFox} type='scale' forcedReplay={false} delay={100} >
         <Modals/>
          {Bookbody.map((book, i) => {
            return (
              <div key={'book-' + i} >
                <BookBoxM onclick={
                  () => {
                    show(true)
                  }
                } bookinfo={book} />
              </div>
            )
          })}
        </QueueAnim>
      </div>
    </div>

  );
};

export default DocsPage;
