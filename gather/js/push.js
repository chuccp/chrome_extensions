window.gatherSubmit=()=>{

    const doc = document.body.outerHTML
    const link = window.location.href
    chrome.runtime.sendMessage({type:"pushData",url: link,content:doc},(e)=>{

    });

}