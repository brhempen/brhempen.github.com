// replace these values with those generated in your TokBox Account
var apiKey = '45840352';
var sessionId = '2_MX40NTg0MDM1Mn5-MTQ5NDY3OTM3NDcxNX54bVZGdnh5MDdqQ3BWQ1ZJMnRFcVREYU9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTg0MDM1MiZzaWc9MWZmM2MzYjAxMjYxMWQwNjkzYTE2NDgwZmQxODk0MjIyNjFlYWFjZjpzZXNzaW9uX2lkPTJfTVg0ME5UZzBNRE0xTW41LU1UUTVORFkzT1RNM05EY3hOWDU0YlZaR2RuaDVNRGRxUTNCV1ExWkpNblJGY1ZSRVlVOS1mZyZjcmVhdGVfdGltZT0xNDk0Njc5Mzk1Jm5vbmNlPTAuMTkwNTQ0NTQ4Nzg4OTk4OTYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ5NzI3MTQwMQ==';

$(document).ready(function () {
    // (optional) add server code here
    initializeSession();
});

function logToConsole(s){
    $('console').append('<p>' + s + '</p>');
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
                    console.log(error);
                } else {
                    console.log('Subscriber added.');
                }
            });

    subscriber.on('audioLevelUpdated', function (event) {
        logToConsole("suscriber audioLevel " + event.audioLevel);
    });
    
    subscriber.setStyle('audioLevelDisplayMode', 'on');

        /*

        SpeakerDetection(subscriber, function () {
            console.log('started talking');
        }, function () {
            console.log('stopped talking');
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

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });

            publisher.on('audioLevelUpdated', function(event) {
                console.log("publisher audioLevel " + event.audioLevel);
            });

            session.publish(publisher);
        } else {
            logToConsole('There was an error connecting to the session: ', error.code, error.message);
        }
    });



}