// ==UserScript==
// @name        MouseHunt AutoBot Additional thing BETA
// @author      NobodyRandom
// @namespace   https://greasyfork.org/users/6398
// @version    	1.3.007z
// @description	This is an additional file for NobodyRandom's version of MH autobot (https://greasyfork.org/en/scripts/6092-mousehunt-autobot-revamp) BETA
// @license 	GNU GPL v2.0
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
unsafeWindow.addonScriptVer = '1.3.007z';
var NOBhasPuzzle = user.has_puzzle;
var NOBclockLoaded = false;
var NOBpage = false;
var mapRequestFailed = false;
var clockTicking = false;
var clockNeedOn = false;
var counter = 0;
var dots = "";

var LOCATION_TIMERS = [
    ['Seasonal Garden', {
        first: 1283616000,
        length: 288000,
        breakdown: [1, 1, 1, 1],
        name: ['Summer', 'Autumn', 'Winter', 'Spring'],
        color: ['Red', 'Orange', 'Blue', 'Green'],
        effective: ['tactical', 'shadow', 'hydro', 'physical']
    }],
    ['Balack\'s Cove', {
        first: 1294680060,
        length: 1200,
        breakdown: [48, 3, 2, 3],
        name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
        color: ['Green', 'Orange', 'Red', 'Orange']
    }],
    ['Forbidden Grove', {
        first: 1285704000,
        length: 14400,
        breakdown: [4, 1],
        name: ['Open', 'Closed'],
        color: ['Green', 'Red']
    }],
    ['Relic Hunter', {
        url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
    }],
    ['Toxic Spill', {
        url: 'http://horntracker.com/backend/new/toxic.php?functionCall=spill'
    }]
];

// SETTING BASE VARS DONE ******************************* INIT AJAX CALLS AND INIT CALLS
// Function calls after page LOAD
$(window).load(NOBinit);
function NOBinit() {
    if (!NOBhasPuzzle) {
        if (window.location.href == "http://www.mousehuntgame.com/" ||
            window.location.href == "http://www.mousehuntgame.com/#" ||
            window.location.href == "http://www.mousehuntgame.com/?switch_to=standard" ||
            window.location.href == "https://www.mousehuntgame.com/" ||
            window.location.href == "https://www.mousehuntgame.com/#" ||
            window.location.href == "https://www.mousehuntgame.com/?switch_to=standard" ||
            window.location.href.indexOf("mousehuntgame.com/turn.php") != -1 ||
            window.location.href.indexOf("mousehuntgame.com/index.php") != -1 ||
            window.location.href == "http://www.mousehuntgame.com/canvas/" ||
            window.location.href == "http://www.mousehuntgame.com/canvas/#" ||
            window.location.href == "https://www.mousehuntgame.com/canvas/" ||
            window.location.href == "https://www.mousehuntgame.com/canvas/#" ||
            window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1 ||
            window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1 ||
            window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
            NOBpage = true;
        }

        if (NOBpage) {
            NOBhtmlFetch();
            createClockArea();
            clockTick();
            fetchGDocStuff();
            setTimeout(function() {
                pingServer();
            }, 30000);
        }
    }
}

function checkIntroContainer() {
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    } else {
        gotIntroContainerDiv = false;
    }

    try {
        return (gotIntroContainerDiv);
    } finally {
        gotIntroContainerDiv = undefined;
    }
}

function NOBajaxGet(url, callback, throwError) {
    var NOBhasPuzzle = user.has_puzzle;
    if (NOBhasPuzzle == false) {
        jQuery.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            statusCode: {
                200: function() {
                    console.log("Success get - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function NOBajaxPost(url, data, callback, throwError) {
    var NOBhasPuzzle = user.has_puzzle;
    if (NOBhasPuzzle == false) {
        jQuery.ajax({
            url: url,
            data: data,
            type: "POST",
            timeout: 5000,
            statusCode: {
                200: function() {
                    console.log("Success post - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function UpdateTimer(timeleft, inhours) {
    var ReturnValue = "";

    var FirstPart, SecondPart, Size;

    if (timeleft > 0) {
        if (inhours != null && inhours == true && timeleft > 3600) {
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

    NOBajaxPost(sheet, dataSendString, function(data) {
        //console.log(data);
    }, function(a, b, c) {
        console.log(b)
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
        } else if (typeof value == "object") {
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

function NOBget(type) {
    return localStorage.getItem('NOB-' + type);
}

function MapRequest(handleData) {
    var url = "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php";
    var dataSend = {
        'action': 'info',
        'uh': user.unique_hash,
        'viewas': null
    };
    jQuery.ajax({
        url: url,
        data: dataSend,
        type: "POST",
        dataType: "json",
        timeout: 5000,
        success: function(data) {
            // console.log(data);
            handleData(data);
        },
        error: function(error) {
            console.log("Map Request Failed");
            handleData(error);
        }
    });
}

function NOBloading(location, name) {
    var element = document.getElementById(location);
    if (counter < 10) {
        for (var i = 0; i < counter; i++) {
            dots = dots + ".";
        }
    } else {
        dots = "";
        counter = 0;
    }
    element.innerHTML = "Loading" + dots;
    counter++;

    timeoutVar1 = setTimeout(function() {
        NOBloading(location);
    }, 1000);
}

function NOBstopLoading(name) {
    clearTimeout(timeoutVar1);
}

// VARS DONE ******************************* COMMENCE CODE
unsafeWindow.NOBscript = function(qqEvent) {
    if (NOBpage) {
        var NOBdata = NOBget('data');
        var mapThere = document.getElementsByClassName('treasureMap')[0];
        if (mapThere == null || mapThere == undefined || mapThere == "") {
            mapThere = false;
            console.log("No map, using HTML data now");
        } else {
            mapThere = true;
        }
        if (NOBdata != null || NOBdata != undefined) {
            if (!mapRequestFailed && mapThere) {
                MapRequest(function(output) {
                    if (output.status == 200 || output.status == undefined) {
                        NOBstore(output, "data");
                        GDoc(JSON.stringify(output), "map");
                    } else {
                        console.log(output);
                        mapRequestFailed = true;
                        NOBhtmlFetch();
                        output = NOBget('data');
                        GDoc(output, "user");
                    }
                });
            } else {
                console.log("Map fetch failed using USER data from html (" + mapRequestFailed + ", " + mapThere + ")");
                NOBhtmlFetch();
                var output = NOBget('data');
                GDoc(output, "user");
            }
        } else {
            console.log("Data is not found, doing HTML fetch now.");
            NOBhtmlFetch();
        }
    }
}

unsafeWindow.showHideTimers = function() {
    $("#loadTimersElement").toggle();
}

unsafeWindow.NOBtravel = function(location) {
    if (NOBpage) {
        var url = "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php";
        var data = {
            "origin": self.getCurrentUserEnvironmentType(),
            "destination": location,
            'uh': user.unique_hash
        };
        NOBajaxPost(url, data, function(r) {
            console.log(r);
        }, function(a, b, c) {
            console.log(a, b, c);
        });
    }
}

// Update + message fetch
function fetchGDocStuff() {
    if (NOBpage) {
        var currVer = GM_info.script.version;
        //var currVer = "1.4.400a";
        var checkVer;
        var url = 'https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec?location=all';
        document.getElementById('NOBmessage').innerHTML = "Loading";
        NOBloading('NOBmessage');
        NOBajaxGet(url, function(text) {
            NOBstopLoading();
            text = JSON.parse(text);
            // MESSAGE PLACING
            message = text.message;
            var NOBmessage = document.getElementById('NOBmessage');
            NOBmessage.innerHTML = message;

            // UPDATE CHECK
            checkVer = text.version;
            console.log('Current mouseHunt AutoBot version: ' + currVer);
            console.log('Current mouseHunt AutoBot additional thing version: ' + addonScriptVer);
            console.log('Server mouseHunt AutoBot version: ' + checkVer);
            console.log('Server mouseHunt AutoBot additional thing version: ' + text.versionAddon);
            console.log('Server GoogleScript version: ' + text.versionGoogle);
            if (checkVer > currVer) {
                var updateElement = document.getElementById('updateElement');
                updateElement.innerHTML = "<a href=\"https://greasyfork.org/en/scripts/6092-mousehunt-autobot-revamp\" target='_blank'><font color='red'>YOUR SCRIPT IS OUT OF DATE, PLEASE CLICK HERE TO UPDATE IMMEDIATELY</font></a>";
            }
        }, function(a, b, c) {
            NOBstopLoading();
            console.log(b + ' error - Google Docs is now not working qq');
            if (b == "timeout")
                document.getElementById('NOBmessage').innerHTML = "Google Docs is being slow again ._.";
        });
    }
}

function pingServer() {
    if (NOBpage) {
        var theData = JSON.parse(NOBget('data'));
        if(typeof theData.user !== 'undefined') {
        	theData = theData.user;
        }

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
        Parse.User.logIn(NOBget('parseUser'), NOBget('parsePassword'), {
		  success: function(user) {},
		  error: function(user, error) {
		  	var newUsername = theData.username;
		  	var newPassword = theData.sn_user_id;
		  	NOBstore(newUsername, 'parseUser');
		  	NOBstore(newPassword, 'parsePassword');
		  	var user = new Parse.User();
			user.set("username", newUsername);
			user.set("password", newPassword);
			user.set("email", newPassword + "@abc.com");
 
			user.signUp(null, {
			  success: function(user) {
				// Hooray! Let them use the app now.
				pingServer();
			  },
			  error: function(user, error) {
				// Show the error message somewhere and let the user try again.
				alert("Parse Error: " + error.code + " " + error.message);
			  }
			});
		  }
		});
        var UserData = Parse.Object.extend("UserData");
        
        var findOld = new Parse.Query(UserData);
        findOld.containedIn("user_id", [theData.sn_user_id, JSON.stringify(theData.sn_user_id)]);
        findOld.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var theObject = results[i];
                    theObject.destroy();
                }
            }
        });

        var userData = new UserData();

        userData.set("user_id", theData.sn_user_id);
        userData.set("name", theData.username);
        userData.set("script_ver", GM_info.script.version);
        userData.set("data", JSON.stringify(theData));
        userData.setACL(new Parse.ACL(Parse.User.current()));

        userData.save(null, {
            success: function(userData) {
                //console.log(userData);
                console.log("Success Parse");
                NOBstore(userData, 'NOBparse');
            },
            error: function(userData, error) {
                console.log("Parse failed - " + error);
            }
        });
        
        Parse.User.logOut();
    }
}

function hideMessage(time) {
    var element = document.getElementById('NOBmessage');
}

unsafeWindow.NOBraffle = function() {
    if (!($(".tabs a:eq(1)").length > 0))
        $("#hgbar_messages").click();
    setTimeout(function() {
    	var tabs = $('.tab');
    	var theTab = "";
    	for(var i = 0; i < tabs.length; i++)
    		if (tabs[i].dataset.tab == 'daily_draw') theTab = temp[i];
        theTab.click();
    }, 1000);
    setTimeout(function() {
        var ballot = $(".notificationMessageList .tab:eq(1) .sendBallot");
        for (var i = ballot.length - 1; i >= 0; i--) {
            ballot[i].click();
        }
        setTimeout(function() {
            $("a.messengerUINotificationClose").click();
        }, 7000);
    }, 4000);
    tabs = null;
    theTab = null;
}

// CALCULATE TIMER *******************************
function currentTimeStamp() {
    return parseInt(new Date().getTime().toString().substring(0, 10));
}

function createClockArea() {
    var parent = document.getElementById('loadTimersElement');
    var otherChild = document.getElementById('gDocLink');
    var child = [];
    var text;

    for (i = 0; i < LOCATION_TIMERS.length; i++) {
        child[i] = document.createElement('div');
        child[i].setAttribute("id", "NOB" + LOCATION_TIMERS[i][0]);
        text = '<span id="text_' + LOCATION_TIMERS[i][0] + '">';
        child[i].innerHTML = text;
    }

    for (i = 0; i < LOCATION_TIMERS.length; i++)
        parent.insertBefore(child[i], parent.firstChild);
}

function clockTick() {
    var temp = document.getElementById('NOBrelic');
    if (clockNeedOn && !clockTicking && temp) {
        // Clock needs to be on, but is not ticking
        updateTime();
    } else if (clockTicking && clockNeedOn && temp) {
        // Clock needs to be on and is already ticking
    } else {
        // Clock does not need to be on
        NOBcalculateTime();
    }
    setTimeout(function() {
        clockTick();
    }, 15 * 60 * 1000);
}

function updateTime() {
    var timeLeft = JSON.parse(NOBget('relic'));
    if (timeLeft > 0) {
        timeLeft--;
        var element = document.getElementById('NOBrelic');
        element.innerHTML = UpdateTimer(timeLeft, true);
        NOBstore(timeLeft, 'relic');
        NOBcalculateOfflineTimers();
        clockTicking = true;

        setTimeout(function() {
            updateTime();
        }, 1000);
    } else {
        clockTicking = false;
        clockNeedOn = false;
    }
}

function NOBcalculateTime() {
    var CurrentTime = currentTimeStamp();
    if (typeof LOCATION_TIMERS[3][1].url != 'undefined' || LOCATION_TIMERS[3][1].url != 'undefined') {
        var url = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec?location=relic";
        NOBajaxGet(url, function(text) {
            text = JSON.parse(text);
            if (text.result == "error") {
                var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                child.innerHTML = "<font color='red'>" + text.error + "</font>";
            } else {
                var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                child.innerHTML = "Relic hunter now in: <font color='green'>" + text.location + "</font> \~ Next move time: <span id='NOBrelic'>" + UpdateTimer(text.next_move, true);
                if (text.next_move > 0) {
                    clockTicking = true;
                    NOBstore(text.next_move, 'relic');
                    updateTime();
                    clockNeedOn = true;
                } else {
                    clockTicking = false;
                    clockNeedOn = false;
                }
            }
        }, function(a, b, c) {
            var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
            child.innerHTML = "<font color='red'>" + b + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
        });
    }

    if (typeof LOCATION_TIMERS[4][1].url != 'undefined' || LOCATION_TIMERS[4][1].url != 'undefined') {
        var url = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec?location=toxic";
        NOBajaxGet(url, function(text) {
            text = JSON.parse(text);
            if (text.result == "error") {
                var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                child.innerHTML = "<font color='red'>" + text.error + "</font>";
            } else {
                var child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                if (text.level == 'Closed') {
                    text.level = {
                        color: 'red',
                        state: text.level
                    };
                } else {
                    text.level = {
                        color: 'green',
                        state: text.level
                    };
                }
                if (text.percent < 0) {
                    text.percent = '';
                } else {
                    text.percent = ' ~ ' + (100 - text.percent) + '% left';
                }
                child.innerHTML = 'Toxic spill is now - <font color="' + text.level.color + '">' + text.level.state + '</font>' + text.percent;
            }
        }, function(a, b, c) {
            // console.log(b);
            var child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
            child.innerHTML = "<font color='red'>" + b + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
        });
    }

    NOBcalculateOfflineTimers();
}

function NOBcalculateOfflineTimers() {
    var CurrentTime = currentTimeStamp();
    for (i = 0; i < 3; i++) {
        var CurrentName = -1;
        var CurrentBreakdown = 0;
        var TotalBreakdown = 0;
        var iCount2;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length; iCount2++)
            TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

        var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[i][1].first) / LOCATION_TIMERS[i][1].length) % TotalBreakdown;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1; iCount2++) {
            CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

            if (CurrentValue < CurrentBreakdown) {
                CurrentName = iCount2;
            }
        }

        var SeasonLength = (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[CurrentName]);
        var CurrentTimer = (CurrentTime - LOCATION_TIMERS[i][1].first);
        var SeasonRemaining = 0;

        while (CurrentTimer > 0) {
            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                SeasonRemaining = CurrentTimer;
                CurrentTimer -= (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[iCount2])
            }
        }

        SeasonRemaining = SeasonLength - SeasonRemaining;

        var seasonalDiv = document.getElementById('NOB' + LOCATION_TIMERS[i][0]);
        var content = "";
        content += LOCATION_TIMERS[i][0] + ': <font color="' + LOCATION_TIMERS[i][1].color[CurrentName] + '">' + LOCATION_TIMERS[i][1].name[CurrentName] + '</font>';
        if (LOCATION_TIMERS[i][1].effective != null) {
            content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
        }

        content += ' ~ For ' + UpdateTimer(SeasonRemaining, true);
        seasonalDiv.innerHTML = content;
    }
}