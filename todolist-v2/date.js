
exports.getDate  = function (){
    const today = new Date();
    const options={
        weekday:"long",
        month:"long",
        day:"numeric"
    }
    return day = today.toLocaleDateString("en-US",options);

}

exports.getDay = function (){
    const today = new Date();
    const options={
        weekday:"long",
    }
    return day = today.toLocaleDateString("en-US",options);

}

exports.getTime = function (){
    const today = new Date();
    const options = {
        hour: "numeric",
        minute: "numeric"
    }
    // get date
    return day = today.toLocaleDateString("en-US", options);
}



exports.getToday=function formatDate(param) {
    const date = new Date(param)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate()
    return Y + M + D;
}