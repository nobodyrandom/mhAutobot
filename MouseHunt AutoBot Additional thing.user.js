// ==UserScript==
// @name        MouseHunt AutoBot Additional thing
// @author      nobodyrandom
// @version    	1.0
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// ==/UserScript==

// SETTING BASE VARS *******************************
var STATE = {
    title:        document.title,
    ready:        false,
    hash:         '',
    level:        -1,
    location:     -1,
    trap:         -1,
    base:         -1,
    cheese:       -1,
    route:        null,
    maintenance:  false,
    king:         false,
    redirect:     '',
    baseurl:      location.protocol + '//www.mousehuntgame.com/',
    hornstate:    0, // 0 = countdown, 1 = ready, 2 = sounding
    userobject:   null,
    errorshown:   false,
    tourney:      -1,
    lastjournal:  0
}

if (localStorage.getItem('NOB_data') == null || localStorage.getItem('NOB_data') == undefined) {
    NOBhtmlFetch();
    var STATE = localStorage.getItem('NOB_data');
} else {
    var STATE = localStorage.getItem('NOB_data');
}

var LOCATION_TIMERS = [
    [ 'Seasonal Garden', { first: 1283616000, length: 288000, breakdown: [ 1, 1, 1, 1 ], name: [ 'Summer', 'Autumn', 'Winter', 'Spring' ], color: [ 'Red', 'Orange', 'Blue', 'Green' ], effective: [ 'tactical', 'shadow', 'hydro', 'physical' ] } ],
    [ 'Balack\'s Cove', { first: 1294680060, length: 1200, breakdown: [ 48, 3, 2, 3 ], name: [ 'Low', 'Medium (in)', 'High', 'Medium (out)' ], color: [ 'Green', 'Orange', 'Red', 'Orange' ] } ],
    [ 'Forbidden Grove', { first: 1285704000, length: 14400, breakdown: [ 4, 1 ], name: [ 'Open', 'Closed' ], color: [ 'Green', 'Red' ] } ],
    [ 'Relic Hunter', { url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt' } ],
    [ 'Toxic Spill', { url: 'http://horntracker.com/backend/new/toxic.php?functionCall=spill' } ]
];

var NOBhasPuzzle = user.has_puzzle;
NOBhtmlFetch();

// SETTING BASE VARS DONE ******************************* INIT AJAX CALLS AND INIT CALLS
// Function calls after page LOAD
$(window).load(function(e) {
    var NOBhasPuzzle = user.has_puzzle;
    if (NOBhasPuzzle == false) {
        createClockArea();
        NOBcalculateTIME();
    }
});

function NOBajaxGet(url, callback) {
    var NOBhasPuzzle = user.has_puzzle;
    if (NOBhasPuzzle == false) {
        jQuery.ajax({
            url: url,
            type: "GET",
            statusCode: {
                0: function (){
                    console.log("Success get - " + url);
                    //Success message
                },
                200: function (){
                    console.log("Success get - " + url);
                    //Success Message
                }
            },
            success: callback /*function( data ) {
                //console.log(data);
                callback(data);
            }*/
        });
    }
}

function NOBajaxPost(url, data, callback) {
    var NOBhasPuzzle = user.has_puzzle;
    if (NOBhasPuzzle == false) {
        jQuery.ajax({
            url: url,
            data: data,
            type: "POST",
            statusCode: {
                0: function (){
                    console.log("Success post - " + url);
                    //Success message
                },
                200: function (){
                    console.log("Success post - " + url);
                    //Success Message
                }
            },
            success: callback /*function( data ) {
                callback(data);
                //console.log(data);
            }*/
        });
    }
}

function UpdateTimer(timeleft, inhours) {
    var ReturnValue = "";
    
    var FirstPart, SecondPart, Size;
    
    if (timeleft > 0) {
        if (inhours != null && inhours == true){
            FirstPart = Math.floor(timeleft / (60 * 60));
            SecondPart = Math.floor(timeleft / 60) % 60;
            Size = 'hrs';
        } else {
            FirstPart = Math.floor(timeleft / 60);
            SecondPart = timeleft % 60;
            Size = 'mins';
        }
        
        if (SecondPart < 10) {
            SecondPart = '0' + SecondPart;
        }
        
        ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
    } else {
        ReturnValue = 'Soon...';
    }
    
    return ReturnValue;
}

function GDoc(items, type) {
    var dataSend = JSON.parse(items);
    dataSend.type = type;
    var dataSendString = JSON.stringify(dataSend);
    var sheet = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec";
    
    NOBajaxPost(sheet, dataSendString, function(data){
        // CONSOLE LOGGING FOR DEBUG
        // console.log(data);
    });
}

function NOBhtmlFetch() {
    var value = document.documentElement.innerHTML;
    if (value != null) {
        if (typeof value == "string") {
            
            var StartPos = value.indexOf('user = ');
            var EndPos = value.indexOf('};', StartPos);
            
            if (StartPos != -1) {
                var FullObjectText = value.substring(StartPos + 7, EndPos + 1);
                NOBstore(JSON.parse(FullObjectText), "data");
            }
        }
        else if (typeof value == "object") {
            NOBstore(value, "data");
        }
            }
    value = undefined;
}

function NOBstore(data, type) {
    data = JSON.stringify(data);
    var name = "NOB-" + type;
    localStorage.setItem(name, data);
}

function MapRequest(handleData) {
    var url = "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php";
    var dataSend = {'action':'info', 'uh': user.unique_hash, 'viewas': null};
    /* NOBajaxPost(url, dataSend, function(output) {
            if ( output.status == 200 || output.status == 0 || output.status == undefined ){
                NOBstore(output, "data");
                GDoc(JSON.stringify(output), "map");
                return output;
            } else {
                console.log(output);
                mapRequestFailed = true;
                NOBhtmlFetch();
                output = localStorage.getItem('NOB_data');
                GDoc(output, "user");
                return JSON.parse(output);
            }
        }); */
    jQuery.ajax({
        url: url,
        data: dataSend,
        type: "POST",
        dataType: "json",
        success: function( data ) {
            // console.log(data);
            handleData(data);
        },
        error: function ( error ) {
            console.log("Map Request Failed");
            handleData(error);
        }
    });
}

// VARS DONE ******************************* COMMENCE CODE
var mapRequestFailed = false;
unsafeWindow.NOBscript = function(qqEvent) {
    var NOBhasPuzzle = user.has_puzzle;
    var NOBdata = localStorage.getItem('NOB_data');
    if(NOBhasPuzzle == false && NOBdata != null || NOBdata != undefined){
        if (mapRequestFailed == undefined || mapRequestFailed == false || mapRequestFailed == null){
            MapRequest(function(output) {
                if ( output.status == 200 || output.status == 0 || output.status == undefined ){
                    NOBstore(output, "data");
                    GDoc(JSON.stringify(output), "map");
                } else {
                    console.log(output);
                    mapRequestFailed = true;
                    NOBhtmlFetch();
                    output = localStorage.getItem('NOB_data');
                    GDoc(output, "user");
                }
            });
            // MapRequest();
        } else {
            console.log("Map fetch failed using USER data from html");
            NOBhtmlFetch();
            var output = localStorage.getItem('NOB_data');
            GDoc(output, "user");
        }
        //console.log(NOBoutput);
    }
}

unsafeWindow.showHideTimers = function(){
    $("#loadTimersElement").toggle();
}

// CALCULATE TIMER *******************************
function currentTimeStamp(){
    return parseInt(new Date().getTime().toString().substring(0, 10));
}

function createClockArea(){
    var parent = document.getElementById('loadTimersElement');
    var otherChild = document.getElementById('gDocLink');
    var child = [];
    
    var i = 0;
    for (i = 0; i<LOCATION_TIMERS.length; i++)
        child[i] = document.createElement('div');
    child[0].setAttribute("id","NOB" + LOCATION_TIMERS[3][0]);
    child[1].setAttribute("id","NOB" + LOCATION_TIMERS[0][0]);
    child[2].setAttribute("id","NOB" + LOCATION_TIMERS[1][0]);
    child[3].setAttribute("id","NOB" + LOCATION_TIMERS[2][0]);
    child[4].setAttribute("id","NOB" + LOCATION_TIMERS[4][0]);
    
    for (i=0; i<LOCATION_TIMERS.length; i++)
        parent.insertBefore(child[i], parent.firstChild);
}

function clockTick(){
    setTimeout(NOBcalculateTime, 10*60*1000);
}

function updateTime(){
    
}

function NOBcalculateTIME(){
    var CurrentTime = currentTimeStamp();
    //for (i = 0; i < 4; i++) {
    if (typeof LOCATION_TIMERS[3][1].url != 'undefined' || LOCATION_TIMERS[3][1].url != 'undefined') {
        var url = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec";
        // url = LOCATION_TIMERS[3][1].url;
        NOBajaxGet(url, function(text){
            // console.log(JSON.parse(text));
            text = JSON.parse(text);
            var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
            child.innerHTML = "Relic hunter now in: " + text.location + " \~ Next move time: " + UpdateTimer(text.next_move,true);
        });
    }
    
    for (i = 0; i < 4; i++) {
        var CurrentName = -1;
        var CurrentBreakdown = 0;
        var TotalBreakdown = 0;
        var iCount2;
        
        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length; iCount2++)
            TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];
        
        var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[i][1].first) / LOCATION_TIMERS[i][1].length) % TotalBreakdown;
        
        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1; iCount2++)
        {
            CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];
            
            if (CurrentValue < CurrentBreakdown)
            {
                CurrentName = iCount2;
            }
        }
        
        var SeasonLength = (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[CurrentName]);
        var CurrentTimer = (CurrentTime - LOCATION_TIMERS[i][1].first);
        var SeasonRemaining = 0;
        
        while (CurrentTimer > 0)
        {
            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0; iCount2++)
            {
                SeasonRemaining = CurrentTimer;
                CurrentTimer -= (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[iCount2])
            }
        }
        
        SeasonRemaining = SeasonLength - SeasonRemaining;
        
        var seasonalDiv = document.getElementById('NOB' + LOCATION_TIMERS[i][0]);
        seasonalDiv.innerHTML += LOCATION_TIMERS[i][0] + ': <font color="' + LOCATION_TIMERS[i][1].color[CurrentName] + '">' + LOCATION_TIMERS[i][1].name[CurrentName] + '</font>';
        if (LOCATION_TIMERS[i][1].effective != null)
        {
            seasonalDiv.innerHTML += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
        }
        
        seasonalDiv.innerHTML += ' ~ For ' + UpdateTimer(SeasonRemaining, true);
    }
}