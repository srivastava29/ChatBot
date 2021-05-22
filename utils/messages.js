const moment = require('moment')

function formatMsg(user,message)
{

    return{
        user,
        message,
        time: moment().format('h:mm a')
    }
}

module.exports= formatMsg