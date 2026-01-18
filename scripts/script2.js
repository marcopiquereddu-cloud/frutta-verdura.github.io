function cambiaStile(prm) {
    var stili = document.getElementsByTagName('link');
    for (var i=0; i<stili.length; i++) {
        if (stili[i].getAttribute('title')==prm) {
            stili[i].disabled=false;
        } else {
            if (stili[i].getAttribute('title')!='default') {
                stili[i].disabled=true;
            }
        }
    }
}
function scegliStile() {
    var larghezza = window.innerWidth;
    if (larghezza<800) {
        cambiaStile('ridotto');
    }
    if (larghezza>=800) {
        cambiaStile('default');
    }
}
window.addEventListener('resize', scegliStile, false);