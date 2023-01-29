console.log(jQuery)
const url = chrome.runtime.getURL('html/options.html');
$.get(url,function (text){
    const v = $($(text)[7]);
    $("body").append(v)
    v.children(".click").click(function (){
        window.gatherSubmit()
    })
})

window.abc="12232434";
console.log(window.abc)