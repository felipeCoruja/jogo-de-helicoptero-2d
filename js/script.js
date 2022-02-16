function start(){
    $("#inicio").hide();// escondendo a div inicio usando o jquery

    //adicionando divs dentro de #fundoGame
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>"); 
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    

    //VARIAVEIS PRINCIPAIS DO GAME
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somMusica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdeuVida = document.getElementById("somPerdeuVida");
    var somResgate = document.getElementById("somResgate");
    var jogo = {};
    var fimDoJogo = false;
    var velocidade = 5;
    var positionY = parseInt(Math.random()* 334);
    var podeAtirar = true;
    var TECLA = {
        W: 87,
        S: 83,
        ENTER: 13 
    };
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    jogo.pressionou = [];

    //colocando a musica de fundo em loop
    somMusica.addEventListener("ended", function(){somMusica.currentTime = 0;somMusica.play();},false);
    somMusica.play();

    

    // verificando se há alguma tecla precionada 

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;//caso alguma esteja pressionada
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;//caso nenhuma esteja pressionada
    });



    jogo.timer = setInterval(loop,30);//função loop sendo chamada a cada 30 milisegundos 

    function loop(){
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    }

    function moveFundo(){
        let esquerda = parseInt($("#fundoGame").css("background-position"));// pega a posição do fundo
        $("#fundoGame").css("background-position",esquerda-1); //reposiciona o fundo 1px para a esquerda
    }

    function moveJogador(){
        if(jogo.pressionou[TECLA.W]){
            let topo = parseInt($("#jogador").css("top"));
            if(topo>=0){
                $("#jogador").css("top",topo-10)
            }
        }

        if(jogo.pressionou[TECLA.S]){
            let topo = parseInt($("#jogador").css("top"));
            if(topo <=445){
                $("#jogador").css("top",topo+10)
            }
        }

        if(jogo.pressionou[TECLA.ENTER]){
            
            disparo();
            
        }
    }
   
    function moveInimigo1(){
        let positionX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",positionX - velocidade);
        $("#inimigo1").css("top",positionY);

        if(positionX <=0 && fimDoJogo == false){
            positionY = parseInt(Math.random()* 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",positionY);
        }
    }


    function moveInimigo2(){
        let posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX-2);
				
		if (posicaoX<=0) {
			
		    $("#inimigo2").css("left",775);
					
		}
    }

    function moveAmigo(){
        let posicaoX = parseInt($("#amigo").css("left"));
	    $("#amigo").css("left",posicaoX+1);
				
		if (posicaoX>906) {
			
		    $("#amigo").css("left",0);
					
		}
    }

    function disparo(){

        if(podeAtirar == true){
            podeAtirar = false;
            somDisparo.play();
            //pegando as posições de top e left do jogador no momento do disparo
            let topo = parseInt($("#jogador").css("top"));
            let posicaoX = parseInt($("#jogador").css("left"));
            //agora setando a posição do tiro na direita do objeto jogador no eixo X
            let tiroX = posicaoX+190;
            let topoTiro = topo +37;
            //adicionando a div que ira conter a imagem 
            $("#fundoGame").append("<div id ='disparo'></div>");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);

            //loop de tempo do disparo na tela
            var tempoDisparo = window.setInterval(executaDisparo, 30)
        }

        function executaDisparo(){
            let posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+15);
    
            if(posicaoX > 900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
    
        }
    }

    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
       
        //COLISÃO ENTRE O JOGADOR E O INIMIGO1
        if(colisao1.length > 0){
            somExplosao.play();
            //passando a posição do inimigo1 para a explosao
            console.log("step 1")
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
            console.log("step 2"+inimigo1X +" " + inimigo1Y)
            explosao1(inimigo1X,inimigo1Y);
            console.log("step 3 explosão já foi chamada")

            //setando a posição do inimigo1 no inicio da tela
            positionY = parseInt(Math.random()* 334);//positionY var Global
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",positionY);
            energiaAtual--;

        }

        //COLISÃO ENTRE O JOGADOR E O INIMIGO2
        if(colisao2.length >0){
            somExplosao.play();
            let inimigo2X = parseInt($("#inimigo2").css("left"));
            let inimigo2Y = parseInt($("#inimigo2").css("top"));

            explosao2(inimigo2X,inimigo2Y);//passando a explosao1 no ponto em que atingiu o inimigo
            $("#inimigo2").remove();

            reposicionaInimigo2();
            energiaAtual--;
        }

        //COLISÃO ENTRE O DISPARO E O INIMIGO1
        if(colisao3.length >0){
            somExplosao.play();
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);

            $("#disparo").css("left",950);

            positionY = parseInt(Math.random()* 334);//positionY var Global
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",positionY);
           
            pontos = pontos + 100;
            velocidade = velocidade+ 0.3;
        }

        //COLISÃO ENTRE O DISPARO E O INIMIGO2
        if(colisao4.length >0){
            somExplosao.play();
            let inimigo2X = parseInt($("#inimigo2").css("left"));
            let inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            $("#disparo").css("left",950);
            explosao1(inimigo2X,inimigo2Y);
            reposicionaInimigo2();
            pontos = pontos + 50;
        }

        //COLISAO ENTRE O JOGADOR E O AMIGO
        if(colisao5.length >0){
            somResgate.play();
            $("#amigo").remove();
            reposicionaAmigo();
            salvos++;
        }

        //COLISÃO ENTRE O AMIGO E O INIMIGO2
        if(colisao6.length >0){
            somPerdeuVida.play();
            let amigoX = parseInt($("#amigo").css("left"));
            let amigoY = parseInt($("#amigo").css("top"));
            
            $("#amigo").remove();
            explosao3(amigoX,amigoY);
            reposicionaAmigo();
            perdidos++;
        }

    }
    

    
    function explosao1(posicaoX,posicaoY){
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image","url(imgs/Explosao.png)");

        const div = $("#explosao1");
        div.css("top",posicaoY);
        div.css("left",posicaoX);
        div.animate({width:200, opacity:0},"slow");//indica que a div vai mudar de tamanho até 200 e a opacidade vai mudar de 100 até 0, com velocidade slow. (a config inicial dessa div está no css)

        let tempoDaExplosao = setInterval(removeExplosao, 1000);

        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoDaExplosao)
            tempoDaExplosao = null;
        }

    }

    function explosao2(posicaoX,posicaoY){
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image","url(imgs/Explosao.png)");

        let div = $("#explosao2");
        div.css("top",posicaoY);
        div.css("left",posicaoX);
        div.animate({width:200, opacity:0},"slow");//indica que a div vai mudar de tamanho até 200 e a opacidade vai mudar de 100 até 0, com velocidade slow. (a config inicial dessa div está no css)

        let tempoDaExplosao = setInterval(removeExplosao, 1000);

        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoDaExplosao)
            tempoDaExplosao = null;
        }
    }

     function explosao3(posicaoX,posicaoY){
        $("#fundoGame").append("<div id='explosao3' class = 'anima4'></div>")
        $("#explosao3").css("top",posicaoY);
        $("#explosao3").css("left",posicaoX);

        let tempoDaExplosao =  window.setInterval(resetExplosao,1000);

        function resetExplosao(){
            window.clearInterval(tempoDaExplosao)
            tempoDaExplosao = null;
            $("#explosao3").remove();
        }
    }

    function reposicionaInimigo2(){

        var tempoDeColisao2 = window.setInterval(reposiciona2,5000)

        function reposiciona2(){
            window.clearInterval(tempoDeColisao2);
            tempoDeColisao2 = null;

            if(fimDoJogo == false){
                $("#fundoGame").append("<div id='inimigo2'></div>")
            }
        }
    }

    function reposicionaAmigo(){
        let tempo = setInterval(reposiciona5,5000);

        function reposiciona5(){
            window.clearInterval(tempo);
            tempo = null;
            
            if(fimDoJogo ==false){
                $("#fundoGame").append("<div id='amigo' class ='anima3'></div>")
            }
        }
    }

    function placar(){
        $("#placar").html("<h2>Pontos: "+pontos+" | Salvos: "+salvos+" | Perdidos: "+perdidos+" </h2>")
    }

    function energia(){

        if(energiaAtual==3){
            $("#energia").css("background-image","url(imgs/energia3.png)");
        }else if(energiaAtual == 2){
            $("#energia").css("background-image","url(imgs/energia2.png)");
        }else if(energiaAtual == 1){
            $("#energia").css("background-image","url(imgs/energia1.png)");
        }else if(energiaAtual < 1){
            $("#energia").css("background-image","url(imgs/energia0.png)");
            gameOver();
        }
        
    }
    
    function gameOver(){
        fimDoJogo = true;
        somMusica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1>Game Over</h1> <p>Sua Pontuação foi: "+pontos+"</p>"+
                        "<div id='reinicia' onclick='reiniciaJogo()'><h3>Jogar Novamente</h3></div>");
        
    }
}


function reiniciaJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
}