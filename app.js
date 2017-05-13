// replace these values with those generated in your TokBox Account
var apiKey = '45840352';
var sessionId = '2_MX40NTg0MDM1Mn5-MTQ5NDY3OTM3NDcxNX54bVZGdnh5MDdqQ3BWQ1ZJMnRFcVREYU9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTg0MDM1MiZzaWc9MWZmM2MzYjAxMjYxMWQwNjkzYTE2NDgwZmQxODk0MjIyNjFlYWFjZjpzZXNzaW9uX2lkPTJfTVg0ME5UZzBNRE0xTW41LU1UUTVORFkzT1RNM05EY3hOWDU0YlZaR2RuaDVNRGRxUTNCV1ExWkpNblJGY1ZSRVlVOS1mZyZjcmVhdGVfdGltZT0xNDk0Njc5Mzk1Jm5vbmNlPTAuMTkwNTQ0NTQ4Nzg4OTk4OTYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ5NzI3MTQwMQ==';

$(document).ready(function () {
    // (optional) add server code here
    initializeSession();
});

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

            session.publish(publisher);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });



}