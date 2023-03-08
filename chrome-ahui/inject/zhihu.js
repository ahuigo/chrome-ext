
function twork(){
    // ahui idea
    //location.href='https://geektutu.com/post/hpg-range.html'
    //location.href='https://www.reddit.com/r/Deno/'
    location.href='https://m:4500/idea'
}
export function cleanZhihu(){
    // copy selector
    switch(location.pathname){
        case '/hot':
        case '/zvideo':
        case '/':
            return twork()
        default: {
            let h = document.querySelector('#root  header');
            h && h.remove();
            h = document.querySelector('div>.App-main .SearchSideBar');
            h && h.remove();
        }
    }
}
export function cleanBilibili(){
    const blackPaths = [
        /^\/$/,
        /^\/v\//,
    ]
    for(const bpath of blackPaths){
        if(location.pathname.match(bpath)){
            twork(); 
        }
    }
}
