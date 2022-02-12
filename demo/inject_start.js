// called by document_start.js
if (window.location.hostname=='m'){
    Object.defineProperty(navigator, 'platform', {
        get: function(){
            return "Android"
    }});
}
console.log("new navigator.platform:", navigator.platform)
