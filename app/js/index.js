var btn_ok = document.getElementById('btn-ok');
btn_ok.onclick = function(){
    var user_name = document.getElementById('user-name').value;
    var user_mima = document.getElementById('mima').value;
    
    exports.user_name = user_name;
}