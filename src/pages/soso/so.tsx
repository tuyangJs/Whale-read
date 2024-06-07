/* 
{
    name: '我开局震惊了女帝',
    label: ['玄幻', '脑洞', '无敌', '玄幻', '系统', '穿越'],
    author: '隔江',
    cover: 'https://bookcover.yuewen.com/qdbimg/349573/1037330858/600.webp',
    intr: '宁天来到天玄世界，睁眼竟然是女子的闺房？ 等等，这是什么情况？身为废物的他，绝美至极的女帝竟要在今晚和他成亲？！ 震惊！ 系统激活！ 震惊他人就能获得奖励！？ 开局震惊女帝，踏出人生大事第一步，完成举世震惊！ …… 宁天看向无数天骄圣子：“不是吧……我就随随便便修炼一下，都能让你们如此震惊？” 【简介无能，请移步正文！】',
    chapter: '第805章 天玄界主，震惊女帝！',
    state: 0,
    id: '0',
  }, */
function getStr(str: string, start: string, end: string) { //取出中间文本

    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}
const options = {
    method: 'get',
    url: '',
    headers: {
        'Cookie': 'Hm_lvt_42e120beff2c918501a12c0d39a4e067=1693656054,1693748376; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU4NzQ0OSwiaWF0IjoxNjk2NDIxMjI2LCJleHAiOjE2OTkwMTMyMjZ9.vp-kyVg7BODKTEhUcsY7eSWAYTYqoJTDUQeAK0ucP-A; token.sig=F7CHK9b6Lw3rAaNp-yjcdFJpzxQRdALg3EvTBU_AtT0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81',
    },


}
function sobook(name: string | null, page: number, callback: (data: any) => void) {

    if (name == undefined || name == '' || name == null) {
        callback([])
        return
    }
    name = encodeURI(name ? name : '')
    options.url = `https://api.yousuu.com/api/search?type=title&value=${name}&page=${page}`


    Hive.Http(options, function (error: any, response: any, body: any) {
        if (error == null) {
            let books: any = []
            const sodata = JSON.parse(body)
            callback(sodata.total)
            try {
                const bodys = sodata.data.books
                bodys.map((tiem: any) => {
                    const ldata = {
                        name: tiem.title,
                        label: tiem.tags,
                        author: tiem.author,
                        cover: tiem.cover,
                        updateAt: tiem.updateAt,
                        intr: '',
                        state: tiem.status,
                        id: tiem.bookId
                    }
                    books.push(ldata)
                })
                callback(books)
            } catch (error) {
                callback(response)
            }

        } else {
            callback(response)
        }
        // 请求成功的处理逻辑
    });
}
function unescapeHTML(a: string) {
    a = "" + a;
    a = a.replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&").replace(/"/g, '"').replace(/&apos;/g, "'");
    a = a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return a.replace(/\\u([a-fA-F0-9]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
}
function intbook(id: number, callback: (data:string) => void) {
    options.url = 'https://www.yousuu.com/book/' + id
    Hive.Http(options, (error: any, response: any, body: any) => {
        let intr: string | null = getStr(body, 'introduction:"', '",')
        intr = unescapeHTML(intr ? intr : '')
        callback(intr);
    })
}

export default { sobook: sobook, intbook: intbook }