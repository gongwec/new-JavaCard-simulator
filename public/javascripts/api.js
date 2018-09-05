/**
 * api
 *
 * This file contains the api which handles the request
 * byte-code for the simulator from the front page.
 *
 *
 * @author Weichao Gong
 * University of Southampton
 */

var smartcard = require('../../simulator/smartcard/smartcard.js');
var eeprom = require('../../simulator/smartcard/eeprom.js');
var errorMessage = require('./errorMessage');
var i,j;


var handler;


/**
 * Initiate the console in the main page when it is loaded.
 *
 * @author Weichao Gong
 * University of Southampton
 */
export function initConsole() {
    // Creating the console.
    var header = 'Welcome to the Java Card online simulator!\n' +
        'Adam Noakes - University of Southampton\n' +
        'Refactored by Weichao Gong - University of Southampton\n' +
        'Tip: Ensure window width is above 992px to view documentation.\n';

    window.jqconsole = $('#console').jqconsole(header, 'Java Card> ');

    // Abort prompt on Ctrl+Z.
    jqconsole.RegisterShortcut('Z', function () {
        jqconsole.AbortPrompt();
        handler();
    });
    // Move to line start Ctrl+A.
    jqconsole.RegisterShortcut('A', function () {
        jqconsole.MoveToStart();
        handler();
    });
    // Move to line end Ctrl+E.
    jqconsole.RegisterShortcut('E', function () {
        jqconsole.MoveToEnd();
        handler();
    });
    jqconsole.RegisterMatching('{', '}', 'brace');
    jqconsole.RegisterMatching('(', ')', 'paran');
    jqconsole.RegisterMatching('[', ']', 'bracket');

    //Initiate the indexedDB here
    initDB();

    // Handle a command.
    handler = function (command) {
        if (command) {
            try {
                sendCommand(command, handler);
            } catch (e) {
                jqconsole.Write('ERROR: ' + e.message + '\n');
            }
        } else {
            jqconsole.Prompt(true, handler);
        }
    };
    // Initiate the first prompt.
    handler();
};

/**
 * Initiate the indexedDB when the page is loaded.
 *
 * @author Weichao Gong
 * University of Southampton
 */
function initDB() {
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("javacard");

    request.onupgradeneeded = function (event) {
        var db = request.result;
        var smartcardStore = db.createObjectStore("smartcards", {autoIncrement: true});
        var sessionStore = db.createObjectStore("sessions", {autoIncrement: true});
        smartcardStore.createIndex('eepromIndex', 'EEPROM', {unique: true});
        smartcardStore.createIndex('ramIndex', 'RAM', {unique: false});
        console.log('initiate database success');

    }

    request.onsuccess = function (event) {
        console.log('open database success');
    };

    request.onerror = function (event) {
        console.log("initiate database fail");
    };

}

/**
 * Handles the button clicking
 *
 * @param {Array} command  the apdu command
 * @author Weichao Gong
 * University of Southampton
 */
export function executeButton(command) {
    jqconsole.Write("Java Card> " + command, "jqconsole-old-prompt");
    jqconsole.Write('\n');
    handler(command);
}


/**
 * get the command and call the specified api
 *
 * @author Weichao Gong
 * University of Southampton
 */
function sendCommand(input, handler) {
    var words = input.split(" ");
    switch (words[0]) {
        case "cards":
            getCards(handler);
            break;
        case "loadcard":
            loadCard(handler, words[1]);
            break;
        case "newcard":
            newCard(handler, words[1]);
            break;
        case "deletecard":
            deleteCard(handler, words[1]);
            break;
        default:
            input = input.replace(/; /g, ';')
            var lines = input.split(';');
            if (lines[lines.length - 1] === '') {
                lines.pop();
            }
            for (i = 0; i < lines.length; i++) {
                lines[i] = lines[i].split(" ");
            }
            sendAPDU(lines, handler);
            break;
    }
}

/**
 * get all cards in the database
 *
 * @author Weichao Gong
 * University of Southampton
 */
function getCards(handler) {
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("javacard");
    request.onsuccess = function (event) {
        var db = request.result;
        var ts = db.transaction('smartcards', 'readonly');
        var store = ts.objectStore('smartcards');
        var res = store.getAll();
        res.onsuccess = function (e) {
            var data = res.result;
            $.each(data, function (i, card) {
                jqconsole.Write(card.EEPROM.cardName + " ", "response-ok");
            });
            jqconsole.Write('\n');
            jqconsole.Prompt(true, handler);
        }
    }
}

/**
 * Load a new card in the database with specified card name
 *
 *
 * @author Weichao Gong
 * University of Southampton
 */
function loadCard(handler, cardName) {
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("javacard");
    var findedCard = null;
    request.onsuccess = function (event) {
        var db = request.result;
        var sts = db.transaction('sessions', 'readwrite');
        var sessions = sts.objectStore('sessions');
        if (sessions.get(0) !== cardName) {
            var ts = db.transaction('smartcards', 'readwrite');
            var smartcards = ts.objectStore('smartcards');
            var c = smartcards.openCursor();
            c.onsuccess = function (e) {
                var cursor = c.result;
                if (cursor) {
                    var card = cursor.value;
                    if (card.EEPROM.cardName === cardName) {
                        findedCard = card;
                        //smartcards.delete(card.keyPath);
                    } else {
                        cursor.continue();
                    }
                } else {
                    jqconsole.Write("There's no card named: " + cardName + " in the database", "response-error");
                    jqconsole.Write('\n');
                    jqconsole.Prompt(true, handler);
                }
                if(findedCard != null){
                    sts = db.transaction('sessions', 'readwrite');
                    sessions = sts.objectStore('sessions');
                    sessions.clear();
                    var loadedCard = {
                        'cardName': cardName
                    }
                    var req = sessions.add(loadedCard);
                    req.onsuccess = function (e) {
                        jqconsole.Write("Successfully loaded card: " + cardName, "response-ok");
                        jqconsole.Write('\n');
                        jqconsole.Prompt(true, handler);
                    }
                    req.onerror = function () {
                        jqconsole.Write("Filed to load card: " + cardName, "response-error");
                        jqconsole.Write('\n');
                        jqconsole.Prompt(true, handler);
                    }
                }
            }
        } else {
            jqconsole.Write("card: " + cardName + "have already been loaded", "response-error");
            jqconsole.Write('\n');
            jqconsole.Prompt(true, handler);
        }
    }
}


/**
 * Insert a new card in the database with specified card name
 *
 *
 * @author Weichao Gong
 * University of Southampton
 */
function newCard(handler, cardName) {
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("javacard");

    request.onsuccess = function (event) {
        var db = request.result;
        var ts = db.transaction('smartcards', 'readwrite');
        var smartcards = ts.objectStore('smartcards');

        var newCard = {
            'EEPROM': {
                'cardName': cardName,
                'packages': {},
                'heap': [0xA0, 0x00],
                'installedApplets': {},
                'objectheap': []
            },
            'RAM': {
                'transientData': [],
                'gRef': undefined,
                'transaction_buffer': [],
                'installingAppletAID': undefined,
                'selectedApplet': {'AID': undefined, 'appletRef': undefined, 'CAP': undefined},
                'currentComponent': null,
                'tempComponents': []
            }
        };

        newCard.EEPROM.installedApplets[[0xA0, 0x00, 0x00, 0x00, 0x62, 0x03, 0x01, 0x08, 0x01]] = -1;
        var req = smartcards.add(newCard);

        req.onsuccess = function () {
            console.log('insert eeprom success');
            jqconsole.Write("Successfully created virtual smart card: " + cardName, "response-ok");
            jqconsole.Write('\n');
            jqconsole.Prompt(true, handler);
        };

        req.onerror = function (e) {
            console.log('insert eeprom fail');
            jqconsole.Write(req.message, "response-ok");
            jqconsole.Write('\n');
            jqconsole.Prompt(true, handler);
        };
    };

    request.onerror = function (event) {
        console.log("insert new card fail");
    };
}

/**
 * delete a card in the database
 *
 * @author Weichao Gong
 * University of Southampton
 */
function deleteCard(handler, cardName) {
    // var indexedDB = window.indexedDB;
    // var deletedb = indexedDB.deleteDatabase("javacard");
    // deletedb.onsuccess = function(e){
    //     alert('delete db');
    // }
    var request = indexedDB.open("javacard");
    request.onsuccess = function (event) {
        var db = request.result;
        var ts = db.transaction('smartcards', 'readwrite');
        var smartcards = ts.objectStore('smartcards');
        var c = smartcards.openCursor();
        c.onsuccess = function(e){
            var cursor = c.result;
            if(cursor){
                var card = cursor.value;
                if(card.EEPROM.cardName === cardName){
                    var deleteRequest = cursor.delete();
                    var sts = db.transaction('sessions', 'readwrite');
                    var sessions = sts.objectStore('sessions');
                    sessions.clear();
                    deleteRequest.onsuccess = function(){
                        jqconsole.Write("Successfully delete card: " +  cardName, "response-ok");
                        jqconsole.Write('\n');
                        jqconsole.Prompt(true, handler);
                    };
                    deleteRequest.onerror = function(){
                        jqconsole.Write("Filed to delete card: " +  cardName, "response-error");
                        jqconsole.Write('\n');
                        jqconsole.Prompt(true, handler);
                    };
                    //smartcards.delete(card.keyPath);
                }else{
                    cursor.continue();
                }
            }else{
                jqconsole.Write("Filed to delete card: " +  cardName, "response-error");
                jqconsole.Write('\n');
                jqconsole.Prompt(true, handler);
            }
        }
    }

}



/**
 * Send apdu command to the simulator to process
 *
 * @author Weichao Gong
 * University of Southampton
 */
function sendAPDU(APDU, handler) {
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("javacard");
    request.onsuccess = function (event) {
        var db = request.result;
        var sts = db.transaction('sessions', 'readwrite');
        var sessions = sts.objectStore('sessions');
        var sc = sessions.openCursor();
        sc.onsuccess = function(e) {
            var cursor = sc.result;
            if (cursor) {
                var loadedcard = cursor.value;
                var ts = db.transaction('smartcards', 'readwrite');
                var smartcards = ts.objectStore('smartcards');
                var smartc = smartcards.openCursor();
                smartc.onsuccess = async function(e){
                    var smartcursor = smartc.result;
                    if(smartcursor){
                        var card = smartcursor.value;
                        if(card.EEPROM.cardName === loadedcard.cardName){

                            for (i = 0; i < APDU.length; i++) {
                                for (j = 0; j < APDU[i].length; j++) {
                                    APDU[i][j] = parseInt(APDU[i][j], 16);
                                }
                            }
                            try {
                                var flag = true;
                                var result = await smartcard.process(card, APDU)
                                    .catch(error => {
                                        console.log(error);
                                        var errorName = identifyError(error.message);
                                        jqconsole.Write("==> " + error, "response-ok");
                                        jqconsole.Write('\n');
                                        jqconsole.Prompt(true, handler);
                                        jqconsole.Write('Error: ' + errorName + '\n', 'response-error');
                                        jqconsole.Write('\n');
                                        jqconsole.Prompt(true, handler);
                                        flag = false;
                                    });

                                if (flag) {
                                    smartcards.clear();
                                    var updateReq = smartcards.put(card);
                                    updateReq.onsuccess = function (e) {
                                        console.log("update card success");
                                    }
                                    updateReq.onerror = function (e) {
                                        console.log("update card fail");
                                    }
                                    jqconsole.Write("==> " + result, "response-ok");
                                    jqconsole.Write('\n');
                                    jqconsole.Prompt(true, handler);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }else{
                            smartcursor.continue();
                        }
                    }else{
                        jqconsole.Write("There's no card named: " + loadedcard.cardName + " in the database", "response-error");
                        jqconsole.Write('\n');
                        jqconsole.Prompt(true, handler);
                    }
                }
            }else{
                jqconsole.Write("No card is loaded", "response-error");
                jqconsole.Write('\n');
                jqconsole.Prompt(true, handler);
            }
        }
    }
}

/**
 * Get the error name by APDU
 *
 * @param  {Error}  error
 * @return {String} errorName
 *
 * @author Weichao Gong
 * University of Southampton
 */
function identifyError(error){
    switch (error) {
        case '0x6FFF':
            return 'Unrecognised APDU format';

        case '0x6A82':
            return 'No Applet Selected';

        case '0x6E00':
            return 'SW_CLA_NOT_SUPPORTED';

        case '0x6443':
            return 'package not exist';

        case '0x6D00':
            return 'SW_INS_NOT_SUPPORTED';

        case '0x6999':
            return 'SW_APPLET_SELECT_FAILED';

        default:
            return errorMessage.get(error);
    }
}