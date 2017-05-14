// replace these values with those generated in your TokBox Account
var apiKey = '45840352';
var sessionId = '2_MX40NTg0MDM1Mn5-MTQ5NDY3OTM3NDcxNX54bVZGdnh5MDdqQ3BWQ1ZJMnRFcVREYU9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTg0MDM1MiZzaWc9MWZmM2MzYjAxMjYxMWQwNjkzYTE2NDgwZmQxODk0MjIyNjFlYWFjZjpzZXNzaW9uX2lkPTJfTVg0ME5UZzBNRE0xTW41LU1UUTVORFkzT1RNM05EY3hOWDU0YlZaR2RuaDVNRGRxUTNCV1ExWkpNblJGY1ZSRVlVOS1mZyZjcmVhdGVfdGltZT0xNDk0Njc5Mzk1Jm5vbmNlPTAuMTkwNTQ0NTQ4Nzg4OTk4OTYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ5NzI3MTQwMQ==';

var userId = "id" + Math.random().toString(16).slice(2);


$(document).ready(function () {
    // (optional) add server code here
    initializeSession();
});

function logToConsole(s) {
    var timeNow = new Date();
    var timeStamp = timeNow.toLocaleTimeString();
    $("#console").prepend(timeStamp + " " + s + '<br>');
}



function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {
        var subscriberProperties = {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        };
        var subscriber = session.subscribe(event.stream,
            'subscriber',
            subscriberProperties,
            function (error) {
                if (error) {
                    logToConsole(error);
                } else {
                    logToConsole('Subscriber added.');
                }
            });

        subscriber.setStyle('audioLevelDisplayMode', 'on');

        /*
        SpeakerDetection(subscriber, function () {
            logToConsole('started talking');
        }, function () {
            logToConsole('stopped talking');
        });

        var SpeakerDetection = function (subscriber, startTalking, stopTalking) {
            var activity = null;
            subscriber.on('audioLevelUpdated', function (event) {
                var now = Date.now();
                if (event.audioLevel > 0.2) {
                    if (!activity) {
                        activity = { timestamp: now, talking: false };
                    } else if (activity.talking) {
                        activity.timestamp = now;
                    } else if (now - activity.timestamp > 1000) {
                        // detected audio activity for more than 1s
                        // for the first time.
                        activity.talking = true;
                        if (typeof (startTalking) === 'function') {
                            startTalking();
                        }
                    }
                } else if (activity && now - activity.timestamp > 3000) {
                    // detected low audio activity for more than 3s
                    if (activity.talking) {
                        if (typeof (stopTalking) === 'function') {
                            stopTalking();
                        }
                    }
                    activity = null;
                }
            });
        };
        */
    });

    function initializePublisher(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });

            publisher.setStyle('audioLevelDisplayMode', 'on');
            publisher.on('audioLevelUpdated', function (event) {
                var audioLevel = event.audioLevel;
                if (audioLevel > 0.2) {
                    logToConsole(" Currently talking. audioLevel " + event.audioLevel);
                }
            });
            session.publish(publisher);
        } else {
            logToConsole('There was an error connecting to the session: ', error.code, error.message);
        }
    }

    // Connect to the session
    session.connect(token, initializePublisher);

    function requestToTalk() {
        logToConsole("Request to Talk");
        session.signal(
            {
                data: "RequestToTalk " + userId
            },
            function (error) {
                if (error) {
                    logToConsole("signal error ("
                        + error.name
                        + "): " + error.message);
                } else {
                    logToConsole("signal sent.");
                }
            }
        );
    }

    $("#button1").click(requestToTalk);

    session.on("signal", function (event) {        
        if (!event.data.includes(userId)){
            logToConsole("Signal sent from connection " + event.from.id);
            logToConsole("Signal data " + event.data);
        }
    });

}