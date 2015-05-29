// -------------------------------------------------------------------------------------------
// Joc de tres en ratlla en javascript per explicar:
// 1. com dibuixar en canvas
// 2. La serparació la part de programació de LOGICA de la part de RENDERITZAT de gràfics.
// 3. L'us de graelles en jocs tipus puzzle.
//
// Exemple fet per Jaume Solé. Març 2015.
// Per més aclariments consulteu els apunts......xxxxxx
// Des de el primer moment en que pensem el pseudocodi fins que tenim el programa enllestit i ordenat podem estar
// unes dues jornades de treball a jornada completa (16 hores. Descansos inclosos ;-))
// Aquest exemple es pot fer de diferentes formes. Podeu trobar altres maneres buscant per internet:
// "tic tac toe" 
//
// Per completar el joc faltaria tota la part de interficie i de posar-ho bonic.
//---------------------------------------------------------------------------------------------
//
/* FUNCIÓ PRINCIPAL*/
function TresEnRatlla(){

/* DECLARACIÓ DE VARIABLES*/

// PER CANVAS I POSICIO
var midaCanvas;  
var canvas;
var ctx;
var posicion;
var xCoor;
var yCoor;
var posxCanvas;
var posyCanvas;

// PER DIBUIXOS
var mida; 
var p1;
var p2;
var marge;
var radi;
var tamany;
var xDib; 
var yDib;

// LOGICA DE GRID
var posicioFila; //Variable de idetificador de posicio del tauler fila
var posicioColumna; //variable de identificador posicio tauler columna
var COL; // constant numero de columnes del taulell de joc. 
var FILA; // constant numero de files del taulell de joc. 
// Array bidimensional el farem de 3x3 amb les constatns COLU i FILA indiquem en un array 
//si "X" (2), "O" (1) o ningú (0) ocupa la posició. inicialitzem a 0.
var posicioOcupada; // per cridar l'array ho farem de la forma aij: [[a00,a01,a02],[a10,a11,a12],[a20,a21,a22]]  

//LOGICA DE TORNS
var torn; // per comtar els torns
var fetClick; // serveix per veure si hem clicalt

//LOGICA DE COMPROVAR GUANYADORS
var multiplicantFila;
var multiplicantColumna;
var multiplicantDiagonals;
var arrayGuanyadors;
var idPlayerO;
var gunayaPlayerO;
var idPlayerX;
var gunayaPlayerX;
    
/*INCICIALITZACIÓ DE VARIABLES*/
    function inicialitzar(){

        // Definim la mida del canvas (això no cal fer-ho si en el HTML heu posat ja la mida)
        midaCanvas = 600;  

        // definim coordenadades dels objectes i taulell de joc en funció de la mida del canvas.
        mida=midaCanvas; 
        p1=mida/3;
        p2= 2*p1;
        xCoor=0;
        yCoor=0;

        //creem la variable canvas i el context per dibuixar en 2D
        canvas = document.getElementById("tresRatlla");
        ctx = canvas.getContext("2d");
        
        //Mides del canvas.
        canvas.width = midaCanvas; // ample del canvas.
        canvas.height = midaCanvas;// altura del canvas.
        
        
        // per obtenir les coordenades de l'element canvas per despres fer la localització dels clicks
        // més info: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        
        posicion = canvas.getBoundingClientRect(); 
        posxCanvas = posicion.left;
        posyCanvas = posicion.top;

        
        

        // definim variables per fer LOGICA del GRID del tauler i de les posicions de jugadors.
        posicioFila=0; //Variable de idetificador de posicio del tauler fila
        posicioColumna=0; //variable de identificador posicio tauler columna
        COL=3; // constant numero de columnes del taulell de joc. 
        FILA=3; // constant numero de files del taulell de joc. 
        
        // Array bidimensional el farem de 3x3 amb les constatns COLU i FILA indiquem en un array 
        //si "X" (2), "O" (1) o ningú (0) ocupa la posició. inicialitzem a 0.
        // per cridar l'array ho farem de la forma aij: [[a00,a01,a02],[a10,a11,a12],[a20,a21,a22]]  
        // Mirar teoria adjunta de com convertir arrays bidemensionals en arrays simples i les avantatges.
        posicioOcupada = [[0,0,0],[0,0,0],[0,0,0]]; 
        
        // Aquests arrays ens serveixen per identificar el tres en ratlla fet a partir
        // de la multiplicació de fila o columna o diagonal .
        // Després comprovarem l'array per veure si algún ha guanyat.      
        multiplicantFila=[1,1,1];
        multiplicantColumna=[1,1,1];
        multiplicantDiagonals=[1,1,0];
        // Una altra manera de declarar un array bidimensional:
        arrayGuanyadors=[multiplicantFila,multiplicantColumna,multiplicantDiagonals]
       
        // Aqui donem valors a l'identificador numeric de cada player i de la comprovació numérica de gunayar.
        idPlayerO=3;
        gunayaPlayerO=idPlayerO*idPlayerO*idPlayerO;
        idPlayerX=2;
        gunayaPlayerX=idPlayerX*idPlayerX*idPlayerX;

        // variables necessaries per dibuixar la X i la O en funcions dibuixarX i dibuixarCercle.
        marge=10;
        radi=(p1-marge)/2;
        tamany =p1-marge;

        // variables usades en la funcio dibuixarPerTorns.
        torn=0;
        fetClick=false;     
    }
        
    /*Funcio per dibuixar el taulell de joc*/     
    function dibuixarTauler(){
            
        ctx.beginPath();
        ctx.moveTo(p1,0); // posicionem l'inici de la linia
        ctx.lineTo(p1,mida); // tracem
        ctx.moveTo(p2,0);
        ctx.lineTo(p2,mida);
        ctx.moveTo(0,p1);
        ctx.lineTo(mida,p1);
        ctx.moveTo(0,p2);
        ctx.lineTo(mida,p2);
        ctx.stroke();            
    }
     
    /*Funcio per dibuixar cercle*/
    function dibuixarCercle(x, y, radi){
        ctx.beginPath(); // creem un path
        ctx.arc(x,y,radi,0,2*Math.PI); //arc(x,y,r,start,stop)
        ctx.stroke();
        console.log("radi:"+radi);
    }

    /* funcio per dibuixar X desde la posicio central */
    function dibuixarX(xc, yc, tamany){
        // com que agafem la posicio de la figura centrada ens desplacem per començar a dibuixar.
        // la posicio (x,y) ens marcarà linic del traç de la X
        var x= xc-tamany/2; 
        var y= yc-tamany/2;
          
        // dibuixem la X
        ctx.beginPath(); // Inici del path
        // primera aspa: de esquerra a dreta de dalt a baix: "\"
        ctx.moveTo(x,y);
        ctx.lineTo(x+tamany,y+tamany);
        //segona aspa: de dreta a esquerra de dalt a baix "/"
        ctx.moveTo(x+tamany,y);
        ctx.lineTo(x,y+tamany);
        ctx.stroke(); // tanquem el path
    }
    
    /* Funcio per escriure. */
    function escriureText(text, x, y){
        ctx.clearRect(0,0,mida,mida);//borrem lo que hi havia
        ctx.font="20px Georgia";
        ctx.fillText(text,x,y);
    }

    /*Comprovació de cuadrant del GRID a partir de COORDENADES*/
    function identificarPosicio(x,y){

        posicioFila = Math.floor(y / p1); // Quina fila estem? dividim per l'amplada de la fila i agafem el enter més petit
        posicioColumna = Math.floor(x / p1); // Quina columna estem? dividim per l'amplada de la columna i agafem el enter més petit

         //Per fer comprovacions: 
        console.log("posicioFila="+posicioFila);
        console.log("posicioColumna="+posicioColumna);

        // posció de inici dibuix.
        xDib=(posicioColumna)*p1+p1/2; 
        yDib=(posicioFila)*p1+p1/2;
    }
       
     /* Calcul de matrius de gunayadors

            Tenim 8 possiblitats de guanyar.
            fila 0: a00=a01=a02
            fila 1: a10=a11=a12
            fila 2: a20=a21=a22

            colu 0: a00=a10=a20
            colu 1: a01=a11=a21
            colu 2: a02=a12=a22

            diagonal 1: a00=a11=a22
            diagonal 2: a02=a11=a20

    si dins de una de les igualtats no tenim cap zero. si els tres elements multipliquen 27(3*3*3) guanya "O"
    si els tres elemnents multiplquen 8 (2*2*2) guanya "X"
    La comprovació final la podriem fer aqui però en aquest cas la farem en una altra funció: "comprovarGuanyador"
    Recordeu que les tres arrays d'aquesta funcio els hem integrat en un altre array:  "arrayGuanyadors"
    Hi ha altres formes de fer la comprovació,(links) però aqui us proposem aquesta.*/
    
    function calculantGuanyador(){
        multiplicantFila[posicioColumna]*=posicioOcupada[posicioFila][posicioColumna]; // Fem comprovacions de si guanyem per fila  
        multiplicantColumna[posicioFila]*=posicioOcupada[posicioFila][posicioColumna]; // Fem comprovacions de si guanyem per columa
        multiplicantDiagonals[0]= posicioOcupada[0][0]*posicioOcupada[1][1]*posicioOcupada[2][2];// comprovant diagonal
        multiplicantDiagonals[1]= posicioOcupada[0][2]*posicioOcupada[1][1]*posicioOcupada[2][0]; // comprovant diagobal inversa
    }

   /*Comprovar torn i dibuixar X i O i omplir array guanyadors*/
    function dibuixarPerTorns(){
        var nTorn = torn % 2; // comprovem si estem en un torn parell (player 1 (O) o imparell player 2 (X))  
        if (nTorn==0 && fetClick){               
        fetClick=false;                  
            if (posicioOcupada[posicioFila][posicioColumna]==0){
            dibuixarCercle (xDib,yDib,radi); // dibuixem el "O"
            posicioOcupada[posicioFila][posicioColumna]=idPlayerO; // marquem si la posició esta ocupada i per quin player    
            calculantGuanyador(); //calculem si hi ha tres en ratlla : (veure nota)
            torn++;
            }              
        }else{
                            
        fetClick=false;
                           
            if (posicioOcupada[posicioFila][posicioColumna]==0){
            dibuixarX(xDib,yDib,tamany); // dibuixem la "X"
            posicioOcupada[posicioFila][posicioColumna]=idPlayerX; // marquem si la posició esta ocupada i per quin player
            calculantGuanyador(); //calculem si hi ha tres en ratlla
            torn++;
            }                         
        } 
    }       
    
    /*COMPROVEM GUANYADORS*/

    /* A partir dels arrays omplerts a la funció "calulantGuanyadors" comprovem si algu a guanyat.
    
    si dins de una de les igualtats no tenim cap zero. si els tres elements multipliquen 27(3*3*3) guanya "O"
    si els tres elemnents multiplquen 8 (2*2*2) guanya "X"
    
    Es podria fer sense l'array bidimensional ja que anem comprovant a cada tirada però aprofitarem per explicar
    l'exploració d'un array bidimensional amb un doble "for"  */

    function comprovarGuanyador(){

        for (var i = FILA - 1; i >= 0; i--) {
            for (var j = COL - 1; j >= 0; j--) {
                            
                if (arrayGuanyadors[i][j]==gunayaPlayerO){
                    //WIN "O"           
                    setTimeout(function (){escriureText("WIN O",100,100);}, 800);
                    console.log("WIN O")
                    break;
                }else if (arrayGuanyadors[i][j]==gunayaPlayerX){
                    //WIN "X"
                    setTimeout(function (){escriureText("WIN X",100,100);}, 800);
                    console.log("WIN X")
                    break;
                }else{
                    console.log("torn següent")
                }
            }
        }
    }  
   
   /* Usem: "object.onclick=function(){myScript};" per tal de poder obtenir la posicio quan cliquem. 
    Ho farem a través de la funció "clicar(event)".

    Aquesta funció ens permet obtenir les coordenades del ratoli al clickar 
    i per tant saber en quina casella hem clicat. 

    A partir d'aqui amb la funció identificarPosicio indexarem l'array per saber en quina 
    posició volem posar el nostre grafic. Farem el dibuix per torns amb dibuixarPerTorns 
    i comproivarem qui guanya amb comprovarGuanyador*/

    function clicar(event){
      
        var x = event.clientX;     // Get the horizontal coordinate
        var y = event.clientY;     // Get the vertical coordinate
        fetClick = true;
        
        xCoor = x-posxCanvas; // Posicio de click respecte el canvas.
        yCoor = y-posyCanvas;
       
        var coor = "X coords: " + xCoor + ", Y coords: " + yCoor;  
        console.log(coor); 
       
        identificarPosicio(xCoor,yCoor); 
        dibuixarPerTorns();
        comprovarGuanyador();
    } 

 

/*Un cop declarades les variables i les funcions podem començar a donar ordres:*/

inicialitzar(); //inicialitzem les variables. Seria semblant a un OnLoad.
dibuixarTauler(); //dibuixem el taulell. Seria semblant a un OnRender
canvas.onclick=function(){clicar(event);}; // Comprovem click de ratoli sobre canvas. Seria semblant a un OnUpdate.
} 


/* Nota: la funció de comprovar el tres en ratlla es pot fer al final o bé en cada torn. Tot depen de si volem fer que 
que el nostre programa sigui eficient en memoria o eficient en càlcul*/
