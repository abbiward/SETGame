var SetGame = {
    selected_cards :  [],
    deck :  [],
    card_elements :  [],
    displayed_cards :  [],
    reset_button : undefined ,
    notification_text : undefined,
    num_sets_found : undefined,
    score_element : undefined,
        
    // TODO:
    // 1) Add another 3 cards when no set exists
    // 2) make it so that you can select cards with key presses:
    //      quwi / asjk / zxnm
    // add timer
    // add number of sets found

    init : function() {
        // reset all variables
        SetGame.selected_cards = [];
        SetGame.deck = [];
        SetGame.card_elements = [];
        SetGame.displayed_cards = [];
        SetGame.num_sets_found = 0;

        // get card elements
        for (var i = 1; i < 4; i++) {
            for (var j = 1; j < 5; j++) {
                var elementId = "p" + i + j;
                var card_img = document.getElementById(elementId);
                SetGame.card_elements.push(card_img);
                document.getElementById(elementId).onclick=function() {
                    SetGame.selectCard(this);
                }
                card_img.className="unselected";
            }
        }

        // shuffle and deal
        SetGame.deck = SetGame._populateDeck([]);

        // deal
        for (var i = 0; i < 12; i++) {
            SetGame.card_elements[i].src = SetGame.deck.pop();
        }
      
        // Reset
        SetGame.reset_button = document.getElementById("reset");
        SetGame.reset_button.onclick=function() {
            SetGame.resetGame();
        }

        // Notification text
        SetGame.notification_text = document.getElementById("notification");
        SetGame.notification_text.innerHTML = "Welcome :)";

        SetGame.score_element = document.getElementById("score");
        SetGame.score_element.innerHTML = SetGame.num_sets_found;

        if (!SetGame._isThereAValidSet(SetGame.card_elements)) {
            SetGame.init();
        }
    },

    resetGame : function() {
        SetGame.init();
    },  

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    _shuffle : function(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    _populateDeck : function(deck) {
        var colors = ['r','g','p'];
        var shapes = ['d','r','s'];
        var numbers = ['1','2','3'];
        var textures = ['f','s','e'];
        for (var i = 0; i < colors.length; i++) {
            for (var j = 0; j < shapes.length; j++) {
                for (var k = 0; k < numbers.length; k++) {
                    for (var m = 0; m < textures.length; m++) {
                        deck.push('cards/' + colors[i] + shapes[j] + numbers[k] + textures[m] + '.jpg');
                    }
                }
            }
        }

        //return deck;
        return SetGame._shuffle(deck);
        // mydeck = [];
        // for (var i = 0; i < 12; i+=2) {
        //     mydeck.push(deck[i]);
        // }
        // return mydeck;
    },    

    _isThereAValidSet : function(displayed_cards) {
        // alert("here")
        var selected_cards = [];
        for (var i = 0; i < displayed_cards.length; i++) {
            selected_cards.push(displayed_cards[i]);
            for (var j = 1; j < displayed_cards.length; j++) {
                if (i == j) {
                    continue;
                }
                selected_cards.push(displayed_cards[j]);
                for (var k = 2; k < displayed_cards.length; k++) {
                    if ((i == k) || (j == k)) {
                        continue;
                    }
                    selected_cards.push(displayed_cards[k]);
                    if (SetGame._isValidSet(selected_cards)) {
                        console.log(selected_cards); // in case you need to cheat :P
                        return true;
                    }
                    selected_cards.pop();
                }
                selected_cards.pop();
            }
            selected_cards.pop();
        }
        return false;
    }, 

    _isValidSet : function(selected_cards) {
        // should only be 3 selected cards!
        if (selected_cards.length != 3) {
            alert('More than 3 cards selected!');
            return false;
        }         
        // extract card names
        card_names = [];
        for (var i = 0; i < selected_cards.length; i++) {
            var filename = selected_cards[i].src;
            filename = filename.substring(filename.length-8,filename.length-4);
            if (filename == "lank") {
                return false;
            }               
            card_names.push(filename);
        }

        // check that every element is all the same or all different
        for (var i = 0; i < card_names[0].length; i++){
            var vals = [];
            vals.push(card_names[0][i]);
            if (vals.indexOf(card_names[1][i]) == -1) {
                vals.push(card_names[1][i]);
            }
            if (vals.indexOf(card_names[2][i]) == -1) {
                vals.push(card_names[2][i]);
            }
            
            if (vals.length == 2) {
                return false;
            }
        }
        return true; 
    },

    _dealNewCards : function(selected_cards) {
        // given the selected cards, replace them with moar from the deck
        for (var i = 0; i < selected_cards.length; i++) {
            var index = SetGame.card_elements.indexOf(selected_cards[i]);
            if ((index != -1) && (SetGame.deck.length > 0)){
                SetGame.card_elements[index].src = SetGame.deck.pop();
            }
            else if ((index != -1) && (SetGame.deck.length == 0)){
                // insert a blank card once the deck starts to empty
                SetGame.card_elements[index].src = './cards/blank.jpg';
            }
            
        }
    },

    _checkSet : function(selected_cards) {
        if (SetGame._isValidSet(selected_cards)) {
            // replace the cards with different ones from the deck
            SetGame.notification_text.innerHTML = "Set!";
            SetGame._dealNewCards(SetGame.selected_cards);
            SetGame.num_sets_found++;
            SetGame.score_element.innerHTML = SetGame.num_sets_found;
        } else {
            SetGame.notification_text.innerHTML = "Not a set :(";
        }    
    },
   
    selectCard : function(cardElement) {
        var filename = cardElement.src;
        var card = filename.substring(filename.length-8,filename.length-4);
        cardElement.className="selected";
        //SetGame.notification_text.innerHTML = "Pending ... "
        if (SetGame.selected_cards.indexOf(cardElement) != -1) {
            SetGame.selected_cards[SetGame.selected_cards.indexOf(cardElement)] = SetGame.selected_cards[SetGame.selected_cards.length - 1];
            SetGame.selected_cards.pop();
            cardElement.className="unselected";
            return;
        }
        SetGame.selected_cards.push(cardElement);
        if (SetGame.selected_cards.length == 3) {
            SetGame._checkSet(SetGame.selected_cards);
            for (var i = 0; i < SetGame.selected_cards.length; i++) {
                SetGame.selected_cards[i].className="unselected";
            }
            SetGame.selected_cards = [];
            if (!SetGame._isThereAValidSet(SetGame.card_elements)) {
                SetGame.notification_text.innerHTML = "THERE IS NO SET";
            } else {
                SetGame.notification_text.innerHTML = "A set is here...";
            }
        }
    }
};