const express = require('express')
const app = express()
const fetch = require('node-fetch');
const notifyMe = require('./sendSMS')

app.get('/getCity', async (req, res) => {
    var currentDate = new Date(new Date().toLocaleString(undefined, { timeZone : 'Asia/Kolkata'}));
    var nextDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`
    var log = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${nextDate}`,
    {
        method: 'GET',
        headers: { 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
    })
    console.log(await log.text())
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
    var currentDate = new Date(new Date().toLocaleString(undefined, { timeZone : 'Asia/Kolkata'}));
    var nextDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`
    var log = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${nextDate}`,
    {
        method: 'GET',
        headers: { 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
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
    console.log(`${typeof new Date(new Date().toLocaleString(undefined, { timeZone : 'Asia/Kolkata'}))}`)
})

module.exports = app;