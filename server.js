const express = require('express')
const app = express()
const fetch = require('node-fetch');
const notifyMe = require('./sendSMS')

app.get('/getCity', async (req, res) => {
    var nextDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    var log = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${nextDate}`,
    {
        method: 'GET',
        headers: { 'Accept-Language': 'en_US', 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
    })
    var responseFetch = await log.json()
    console.log(responseFetch)
    responseFetch.centers.forEach(perCenter => {
        perCenter.sessions.forEach(perSessionPerCenter => {
            if(perSessionPerCenter.min_age_limit == 18 && perSessionPerCenter.available_capacity > 0) {
                console.log("Vaccine Available")
            }
        });
    });
    return (responseFetch ? res.send({ responseFetch }) : res.send({'Alter' : 'Alter'}))
})

// app.listen(2000, () => {
//     console.log(`Example app listening at http://localhost:2000`)
// })

async function functionToCallAfter30Sec() {
    var nextDate = `${new Date().getDate() + 1}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    var log = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${nextDate}`,
    {
        method: 'GET',
        headers: { 'Accept-Language': 'en_US', 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
    })
    var responseFetch = await log.json()
    responseFetch.centers.forEach(perCenter => {
        perCenter.sessions.forEach(perSessionPerCenter => {
            if(perSessionPerCenter.min_age_limit == 18 && perSessionPerCenter.available_capacity > 0) {
                console.log("Vaccine Available")
                notifyMe(perCenter.pincode)
            }
        });
    });
}

// setInterval(function () {
//     console.log('running this')
//     functionToCallAfter30Sec()
// }, 30000)

app.get('/', (req, res) => {
    return res.send({"Hello": "Hello"})
})

app.listen(process.env.PORT, () => {
    console.log(`${convertUTCDateToLocalDate(new Date())}`)
})

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

module.exports = app;