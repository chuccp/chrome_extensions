function readDoc() {
    return window.document.body.outerHTML
}


const location = (locationLink) => {
    console.log("刷新页面:" + locationLink)
    if (locationLink.startsWith("http")) {
        window.location.replace(locationLink)
    }
}

const writeLog = (tabId, text) => {
    console.log(text)
    chrome.scripting.executeScript({
        target: {tabId: tabId}, func: (text) => {
            console.log(text)
        }, args: [text]
    }, () => {
    })
}
const loadNewLink = (tabId) => {
    writeLog(tabId,"准备获取新连接")
    fetch("http://121.42.232.158:8092/crawler-dynamic/maoYan/getMaoYanDetailUrl").then(async res => {
        const body = await res.json()
        if (body.data) {
            writeLog(tabId,"跳转新链接："+body.data)
            chrome.scripting.executeScript({target: {tabId: tabId},func:location,args:[body.data]},()=>{

            })
        }
    }).catch(() => {

    })
}

const writePushScript =  (tabId) => {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ["push.js"],
    }, () => {
        writeLog(tabId,"写入脚本成功")
    })

}

const pushData = (tabId,{url,content})=>{
    const formData = new FormData()
    formData.append("url", url)
    formData.append("content",content)
    fetch("http://121.42.232.158:8092/crawler-dynamic/maoYan/parseMaoYanHtml", {
        body: formData,
        method: "POST"
    }).then((res) => {
        console.log(res)
        console.log("提交数据完成")
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    const tabId = sender.tab.id
    if(message.type=="pushData"){
        pushData(tabId,message)
        sendResponse()
    }else if(message.type=="loadNew"){
        loadNewLink(tabId)
        sendResponse()
    }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const link = tab.url
    if (link.indexOf("maoyan.com") != -1) {
        if (changeInfo.status == "complete") {
            writeLog(tabId,"加载网页完成")
            writePushScript(tabId)
            // loadNewLink(tabId)
        }
    }else{
        writeLog(tabId,"不是猫眼网站，请进入猫眼")
    }
})