$( document ).ready(function() {
    var courseInfoJson = "/court.json";
    $.getJSON( courseInfoJson, {
        tags: "mount rainier",
        tagmode: "any",
        format: "json"
    }).done(function( data ) {
        var holes = data.course[0].hole;
        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i];
            var holeNum = "Hole " + hole.holeNum;
            var yardsPar = hole.yards + " yards / par " + hole.par;
            var newCard = $('<div class="card"/>');
            var newCardHeader = "<div class='card-header'><h2>" + holeNum + "</h2><h3>" + yardsPar + "</h3></div>";
            var newPlayersContainer = $('<div id="card' + hole.holeNum + '" class="card-players"/>');
            newCard.append(newCardHeader);
            newCard.append(newPlayersContainer);
            newCard.appendTo("#cards-contanier");
        }
        // place all the players
        var players = data.player;
        for (var numPlayers = 0; numPlayers < players.length; numPlayers++) {
            var player = players[numPlayers];
            // console.log(player);
            if (player.currentRound != 0) {
                var playerHoleNum =  player.round[player.currentRound - 1].thru;
                if (playerHoleNum == "F") {
                    // do nothing
                }
                else if (playerHoleNum == "") {
                    // do nothing
                }
                else {
                    var tempCard = $('#card' + playerHoleNum);
                    var playerImage = 'http://i.cdn.turner.com/dr/golf/golfm/release/sites/rydercup/files/2016/headshots/300x225/'+ player.id.toString() +'.jpg'
                    var playerContent = '<div class="img-circular-container" style="background-image:url('+playerImage+');"></div>'+'<h4>'+player.firstName+" "+player.lastName+'</h4>';
                    var playerCard = $('<div/>', {
                        class: 'player-card',
                        html: playerContent
                    });
                    tempCard.append(playerCard);
                }
            }

        }
        $('.slider-nav').slick({
          centerMode: true,
          centerPadding: '15px',
          slidesToShow: 1,
          speed: 250,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '15px',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '15px',
                slidesToShow: 1
              }
            }
          ]
        });
    });
});
