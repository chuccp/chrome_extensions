const loadNew = ()=>{
    const time = 10*1000
    console.log(`等待${time/1000}秒，获取远程链接`)
    setInterval(()=>{
        console.log(`获取远程连接`)
        chrome.runtime.sendMessage({type:"loadNew",url: window.location.href},(res)=>{
            console.log("获取远程连接信息反馈")
        });
    },time)
}
const time = 5*1000
console.log(`等待${time/1000}秒提交数据`)
setTimeout(()=>{
    const doc = document.body.outerHTML
    if (doc) {
        chrome.runtime.sendMessage({type:"pushData",url: window.location.href,content:doc},()=>{
            console.log("提交数据信息反馈")
        });

    }else{
        console.log("读取数据失败")
    }
    loadNew()
},time)