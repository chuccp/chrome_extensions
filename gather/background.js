// const link2 = "http://192.168.1.194:8876/maoYan/parseMaoYanHtml";
const link2 = "http://121.42.232.158:8092/crawler-dynamic/maoYan/parseMaoYanHtml"

const writeLog = (tabId, text) => {
    console.log(text)
    chrome.scripting.executeScript({
        target: {tabId: tabId}, func: (text) => {
            console.log(text)
        }, args: [text]
    }, () => {
    })
}

const alert = (tabId, text) => {
    console.log(text)
    chrome.scripting.executeScript({
        target: {tabId: tabId}, func: (text) => {
            window.alert(text)
        }, args: [text]
    }, () => {
    })
}

const pushData = (tabId,{url,content})=>{
    const formData = new FormData()
    formData.append("url", url)
    formData.append("content",content)
    fetch(link2, {
        body: formData,
        method: "POST"
    }).then((res) => {

        console.log(res.status)
        if(res.status!=200){
            alert(tabId,"提交数据服务器异常")
        }else{
            alert(tabId,"提交数据完成")
        }
    }).catch(()=>{
        alert(tabId,"提交数据失败，请检查网络")
    })
}

const writePushScript =  (tabId) => {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ["js/push.js"],
    }, () => {
        writeLog(tabId,"写入脚本成功")
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
    if (changeInfo.status == "complete") {
        writeLog(tabId,"加载网页完成")
        writePushScript(tabId)
    }
})