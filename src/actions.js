import config from './config';

export const actions = [
    {
        name: 'remote',
        fn: updateRemote
    }, {
        name: 'lametric',
        fn: updateLametric
    }
];


function updateRemote(data) {
    let uri = `${config.REMOTE_PROTOCOL}://${config.REMOTE_HOST}${config.REMOTE_PATH}?temp=${data.temperature}`
    console.log(data, uri);
    request.get(uri);
}

function updateLametric(data) {

    let headers = {
        'Accept': 'application/json',
        'X-Access-Token': config.LAMETRIC_KEY,
        'Cache-Control': 'no-cache'
    };

    let bodyData = {
        frames: [
            {
                text: `${data.temperature} °C`,
                icon: 'i3253',
                index: 0
            }
        ]
    };

    request({
            headers: headers,
            uri: config.LAMETRIC_URL,
            json: bodyData,
            method: 'POST'
        }, (err, res, body) => {
        console.error(err)
    });
}