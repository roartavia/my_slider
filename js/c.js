var GLOBAL_IMAGE_PLAYERS_URL = '';

$( document ).ready(function() {
    var config = 'https://dataint.pga.com/event/pgachampionship/2018/mobile/configs/appconfig_ios.json';
    $.ajax({
        type:'GET',
        url: config,
        dataType :"json",
        crossDomain: true,
        success: function(data) {
            var locator = data.endpoints.playerlocator.url;
            var courseInfoJson = data.endpoints.course.url;
            GLOBAL_IMAGE_PLAYERS_URL = data.images.headshots;
            setInfoHolesCards(courseInfoJson, locator);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Failed loading content, please try later.')
        }
    });
});

function buildPlayers(locatorURL) {
    $.ajax({
        type:'GET',
        url: locatorURL,
        success: function(data) {
            var groups = data.groups;
            for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                groupHoleNumber = groups[groupIndex].current_hole;
                if (groupHoleNumber == "F") {
                    // do nothing
                }
                else if (groupHoleNumber == "") {
                    // do nothing
                }
                else {
                    var players = groups[groupIndex].players;

                    for (var numPlayers = 0; numPlayers < players.length; numPlayers++) {
                        var player = players[numPlayers];
                        if (player.currentRound != 0) {
                            var tempCard = $('#card' + groupHoleNumber);
                            //this card.textwhatever disply none;
                            tempCard.find( '.no-players' ).css('display', 'none');
                            var playerImage = GLOBAL_IMAGE_PLAYERS_URL.replace("[width]", "170");
                            playerImage = playerImage.replace("[height]", "170");
                            playerImage = playerImage.replace("[player_id]", player.player_id.toString());
                            var playerContent = '<div class="img-circular-container" style="background-image:url('+playerImage+');"></div>'+'<h4>'+player.lname+'</h4>';
                            var playerCard = $('<div/>', {
                                class: 'player-card',
                                html: playerContent
                            });
                            tempCard.append(playerCard);
                        }
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Failed loading the players information, please try later.')
        },
        dataType: 'json'
    });
}

function setInfoHolesCards(courseURL, locator) {
    $.ajax({
        type:'GET',
        url: courseURL,
        success: function(data) {
            var holes = data.items.course.holes;
            for (var i = 0; i < holes.length; i++) {
                var hole = holes[i];
                var holeNum = hole.title;
                var yardsPar = hole.yards + " yards / par " + hole.par;
                var cardId = "card-hole-" + hole.hole_number;
                var newCard = $('#' + cardId);
                var newCardHeader = "<div class='card-header'><h2>" + holeNum + "</h2><h3>" + yardsPar + "</h3></div>";
                var newPlayersContainer = $('<div id="card' + hole.hole_number + '" class="card-players"/>');
                var noPlayersLabel = '<div class="no-players"><span>No Players Currently on Hole</span></div>';
                newPlayersContainer.append(noPlayersLabel);
                newCard.append(newCardHeader);
                newCard.append(newPlayersContainer);
            }
            //place all the players
            buildPlayers(locator);
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Failed loading the course information, please try later.')
        },
        dataType: 'json'
    });
    $('.slider-nav').on("afterChange", function (){
        // change dots selection
        $('.link-to-card').removeClass( 'is-selected');
        var slickIndex = $('.slick-current').data('slick-index') + 1;
        var linkToCardId = '#link-card-' + slickIndex;
        $(linkToCardId).addClass( 'is-selected');
    });
    $('a[data-slide]').click(function(e) {
        e.preventDefault();
        var slideno = $(this).data('slide');
        // remove all the before selection
        $('.link-to-card').removeClass( 'is-selected');
        // add class to new selection
        $(this).addClass( 'is-selected');
        $('.slider-nav').slick('slickGoTo', slideno - 1);
    });
}
