// Refer to: https://meta.stackexchange.com/questions/2980/is-there-a-way-to-disable-the-hotkeys
let p = document.getElementById('wmd-input');
if (p) {
    p = p.parentNode;
    var ignore = function(e){e.stopPropagation();};
    p.addEventListener('keydown', ignore, true);
    p.addEventListener('keypress', ignore, true);
    p.addEventListener('keyup', ignore, true);
}

