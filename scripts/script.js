//PARSER
function caricaXML(nomeFile) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else {
    // IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", nomeFile, false);
    xmlhttp.send();
    return xmlhttp.responseXML;
}
//ALBERO DATI
function Alimento() {
    this.nome;
    this.gruppo;
    this.proprieta=[];
    this.mesi=[];
    this.inizializza=
        function (prm, prm2) {
            this.nome=prm.getAttribute('name');
            this.gruppo=prm2;
            var nodo=prm.getElementsByTagName('property');
            for(var i=0; i<nodo.length; i++) {
                this.proprieta.push(nodo[i].firstChild.nodeValue);
            }
            nodo=prm.getElementsByTagName('month');
            for(var i=0; i<nodo.length; i++) {
                this.mesi.push(nodo[i].firstChild.nodeValue);
            }
        }
    this.listaMesi=
        function () {
            var s='<option selected="selected">scegli un mese</option>';
            for (i in this.mesi) {
                s += '<option>'+this.mesi[i]+'</option>';
            }
            return s;
        }
    this.mostraAltriMesi=
        function () {
            var s='';
            for (i in this.mesi) {
                s+='<li>'+this.mesi[i]+'</li>';
            }
            return s;
        }
        this.stringaAlimento=
            function () {
                return(
                '<div class="aliment">'+
                  '<img class="imgAliment" src="images/'+this.nome+'.png" />'+
                  '<input type="button" class="nameAliment" id="'+this.nome+'"value="'+this.nome+'" onclick="mostraProprietaAlimento(this.id)">'+'</input>'+
                '</div>');
            }
        this.proprietaAlimento=
            function () {
                var string=
                '<input type="button" id="close" value="chiudi"></input>'+
                '<h1 id="open" class="">'+this.nome+'</h1>'+
                '<p id="boxLink">'+'<a href='+this.proprieta[0]+'>link</a>'+'</p>'+
                '<ul id="allMonths">'+this.mostraAltriMesi()+'</ul>';
                return string;
            }
}
function Gruppo() {
    this.nome;
    this.descrizione;
    this.alimenti=[];
    this.inizializza=
        function (prm) {
            this.nome=prm.getAttribute('name');
            this.descrizione=prm.getElementsByTagName('description')[0].firstChild.nodeValue;
            var nodo=prm.getElementsByTagName('aliment');
            for(var i=0; i<nodo.length; i++) {
                var a=new Alimento();
                a.inizializza(nodo[i], this.nome);
                this.alimenti.push(a);
            }
        }
        this.pulsanteGruppo=
            function () {
                return '<li>'+'<input type="button" class="color" id="'+this.nome+'" value="'+this.nome+'"></input>'+'</li>';
            }
        this.descrizioneGruppo=
            function () {
                return '<h1>'+'Gruppo'+' '+this.nome+' : tutti gli alimenti'+'</h1>'+'<p>'+this.descrizione+'</p>';
            }
}
function Colori() {
    this.gruppi=[];
    this.inizializza=
        function () {
            var xml=caricaXML('colori.xml');
            var nodo=xml.getElementsByTagName('group');
            for(var i=0; i<nodo.length; i++) {
                var g=new Gruppo();
                g.inizializza(nodo[i]);
                this.gruppi.push(g);
            }
        }
    this.filtriColori=
        function () {
            var s='<li>Scegli un colore: </li>';
            for (i in this.gruppi) {
                s+=
                '<li>'+
                    '<input type="radio" class="radioButton" name="filterColor" value="'+this.gruppi[i].nome+'" onclick="filtraColore(this.value)">'+this.gruppi[i].nome+'</input>'+
                '</li>';
            }
            return s;
        }
}
var c=new Colori();
//GESTORI DI EVENTI
function mostraRicerca (prm1, prm2) {
    if (prm1!=undefined && prm2!=undefined) {
        var s='<h2>'+"hai cercato:"+'</h2>'+'<p id="textResult">'+prm1+' , '+prm2+'</p>';
    } else {
        if (prm1!=undefined) {
            var s='<h2>'+"hai cercato:"+'</h2>'+'<p id="textResult">'+prm1+' , tutti i colori'+'</p>';
        }
    }
    document.getElementById('result').innerHTML=s;
    //mese non selezionato
    if (prm1=='scegli un mese') {
        alert('non è stato scelto nessun mese!');
    }
}
function filtraColore (prm) {
    var mese = document.getElementById('selectionMonth').value;
    var s='';
    for (i in c.gruppi) {
        for (e in c.gruppi[i].alimenti) {
            for (o in c.gruppi[i].alimenti[e].mesi) {
                if (c.gruppi[i].alimenti[e].mesi[o]==mese && c.gruppi[i].alimenti[e].gruppo==prm)/*condizione filtro*/ {
                    s+=c.gruppi[i].alimenti[e].stringaAlimento();
                }
            }
        }
    }
    //combinazione non trovata
    if (s=='') {
        alert('mi dispiace, non ho trovato la combinazione che hai scelto');
    }
    document.getElementById('alimentsList').innerHTML=s;
    mostraRicerca(mese, prm);
}
function mostraAlimentiGruppo() {
    var s='';
    var e=0;
    for (i in c.gruppi) {
        if (c.gruppi[i].nome==this.id) {
            document.getElementById('groupDescription').innerHTML=c.gruppi[i].descrizioneGruppo();
        }
        while (e<c.gruppi[i].alimenti.length && c.gruppi[i].alimenti[e].gruppo==this.id) {
            s += c.gruppi[i].alimenti[e].stringaAlimento();
            e++;
        }
    }
    document.getElementById('alimentsList').innerHTML=s;
    document.getElementById('result').innerHTML="";
}
function mostraAlimentiMese (prm) {
    var s='';
    for (i in c.gruppi) {
        for (e in c.gruppi[i].alimenti) {
            for (o in c.gruppi[i].alimenti[e].mesi) {
                if (c.gruppi[i].alimenti[e].mesi[o]==prm) {
                    s+=c.gruppi[i].alimenti[e].stringaAlimento();
                }
            }
        }
    }
    document.getElementById('groupDescription').innerHTML="";
    document.getElementById('alimentsList').innerHTML=s;
    mostraRicerca(prm);
}
function mostraProprietaAlimento(prm) {
    for (var i=0; i<c.gruppi.length; i++) {
        for (var u=0; u<c.gruppi[i].alimenti.length; u++) {
            if (c.gruppi[i].alimenti[u].nome==prm) {
                document.getElementById('alimentDescription').innerHTML = c.gruppi[i].alimenti[u].proprietaAlimento();
            }
        }
    }
    document.getElementById('alimentDescription').style.height='auto';
    document.getElementById('alimentDescription').style.marginBottom='0';
    document.getElementById('alimentDescription').style.backgroundColor='rgba(255, 255, 255, 0.9)';
    document.getElementById('close').onclick=
        function () {
            document.getElementById('alimentDescription').style.height='3em';
            document.getElementById('alimentDescription').style.marginBottom='0';
            document.getElementById('alimentDescription').style.backgroundColor='rgba(255, 255, 255, 0.1)';
        }
    document.getElementById('open').onclick=
        function () {
            document.getElementById('alimentDescription').style.height='auto';
            document.getElementById('alimentDescription').style.marginBottom='0';
            document.getElementById('alimentDescription').style.backgroundColor='rgba(255, 255, 255, 0.9)';
        }
}
//GENERA ELEMENTI DINAMICI
function generaInter() {
    var stringa='';
    for (i in c.gruppi) {
        for (u in c.gruppi[i].alimenti) {
            if (c.gruppi[i].alimenti[u].mesi.length==12) {
                stringa += c.gruppi[i].alimenti[u].listaMesi();//options mesi
                break;
            } else {
                continue;
            }
        }break;
    }
    var s='<select id="selectionMonth" onchange="mostraAlimentiMese(this.options[selectedIndex].value)">'+stringa+'</select>';//applica gestore di evento change a scelta mese
    s+='<ul id="selectionColor"></ul>'
    document.getElementById('selectable').innerHTML = s;
    //scelta mese generata
    document.getElementById('selectionColor').innerHTML = c.filtriColori();//radio-buttons colori
    //scelta filtro colore generata
    var s='<ul id="colors"></ul>';
    document.getElementById('buttons').innerHTML=s;
    s='';
    for (i in c.gruppi) {
        s += c.gruppi[i].pulsanteGruppo();//buttons colori
    }
    document.getElementById('colors').innerHTML=s;
    //scelta esclusiva colore generata
    var nodo=document.getElementsByClassName('color');
    for (var i=0; i<nodo.length; i++) {
        nodo[i].style.color="rgba(255, 255, 255, 0.8)";
        if (i==0) {
            nodo[i].style.color="rgba(0, 0, 0, 0.5)";
        }
        nodo[i].style.backgroundImage="url('images/"+nodo[i].id+".png')";

        nodo[i].onclick=mostraAlimentiGruppo;//applica gestore di evento click su scelta esclusiva colore
    }
}
//INIZIO
function inizializza() {
    c.inizializza();
    generaInter();
}
//ONLOAD
window.onload=inizializza;