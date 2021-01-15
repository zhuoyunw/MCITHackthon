var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06', '2021-07']
var calendar = document.getElementById('calendar');
var monthsHtml = document.querySelector('#calendar .months-con');
var weeksHtml = document.querySelector('#calendar .weeks');
var daysHtml = document.querySelector('#calendar .days');
var selDayHtml = document.querySelector('.selNowDays')
var pre = document.querySelector('#pre');
var next = document.querySelector('#next');
var nowSelYear = null;
var nowSelMonth = null;
var nowSelDay = null;
var nowMonthIndex = 0;
var shift = 0;

function getMonths(ind) {
    var str = ''
    var css = ''
    var monthArr = uniq(months)
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let i = 0; i < monthArr.length; i++) {
        if (i === parseInt(ind)) {
            css = ' class = "sel-month"'
            nowSelYear = monthArr[i].substring(0, 4)
            nowSelMonth = monthArr[i].substring(5, 7)
        } else {
            css = ''
        }
        var temp = (i + shift) % 12;
        if (temp < 0) temp = temp + 12;
        str += '<span data-index=' + i + css + '>' + monthName[temp] + '</span>'
    }

    return str
}

monthsHtml.innerHTML = getMonths(nowMonthIndex)


function uniq(array) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (array[i].substring(0, 7) === array[j].substring(0, 7)) {
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}


function getWeeks() {
    var str = ''
    for (let i = 0; i < weeks.length; i++) {
        str += '<span>' + weeks[i] + '</span>'
    }
    return str
}
weeksHtml.innerHTML = getWeeks()


function getDays(year, month) {
    var days = getThisMonthDays(year, month)
    var daysFirst = getFirstDayOfWeek(year, month)
    var str = ''
    var str2 = ''
    var css = ''
    var date = formatDate(new Date())

    nowSelDay = nowSelDay ? nowSelDay : 1

    for (let i = 1; i <= daysFirst % 7; i++) {
        str2 += '<span></span>'
    }
    for (let i = 1; i <= days; i++) {
        if (nowSelYear == date.substring(0, 4) && nowSelMonth == date.substring(5, 7) && i == date.substring(8, 10)) {
            css = 'today-day'
        } else {
            css = ''
        }
        str += '<span data-days="' + i + '" class="' + css + ' ' + '">' + i + '</span>'
    }
    return str2 + str
}
daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)


function formatDate(param) {
    const date = new Date(param)
    const Y = date.getFullYear() + '-'
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
    const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate()
    return Y + M + D
}

function getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay() + 1;
}

function getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
}


function preMonth() {
    if (nowMonthIndex == 0) {
        shift = shift - 1;
        months = months.slice(0, -1);
        var newMonth;
        var newYear = 0;
        newMonth = parseInt((months[0]).substring(5, 7)) - 1;
        if (newMonth < 1) {
            newMonth = newMonth + 12;
            newYear = -1;
        }
        newMonth = newMonth.toString().padStart(2, "0");
        newYear = (newYear + parseInt(months[0].substring(0, 4))).toString();
        months.unshift(newYear + '-' + newMonth)
        nowSelDay = 1
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    } else {
        nowMonthIndex--
        nowSelDay = 1
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    }
}


function nextMonth() {
    if (nowMonthIndex == uniq(months).length - 1) {
        shift = shift + 1;
        months = months.slice(1);
        var newMonth;
        var newYear = 0;
        newMonth = parseInt((months[5]).substring(5, 7)) + 1;
        if (newMonth > 12) {
            newMonth = newMonth - 12;
            newYear = 1;
        }
        newMonth = newMonth.toString().padStart(2, "0");
        newYear = (newYear + parseInt(months[5].substring(0, 4))).toString();
        months.push(newYear + '-' + newMonth)
        nowSelDay = 1
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    } else {
        nowMonthIndex++
        nowSelDay = 1
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    }
}

function nowSelDate() {
    var str = ''
    str = 'Date: ' + nowSelYear + '/' + nowSelMonth + '/' + nowSelDay
    return str
}
selDayHtml.innerHTML = nowSelDate()

window.onload = function () {
    document.querySelector('.months-con').onclick = function (ev) {
        var ev = ev || window.event
        var target = ev.target || ev.srcElement
        if (target.nodeName.toLowerCase() == 'span') {
            if (target.className == 'sel-month') {
                return
            } else {
                nowMonthIndex = target.dataset.index
                monthsHtml.innerHTML = getMonths(target.dataset.index)
                daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
                selDayHtml.innerHTML = nowSelDate()
            }
        }
    }


    document.querySelector('.days').onclick = function (ev) {
        var ev = ev || window.event
        var target = ev.target || ev.srcElement
        if (target.nodeName.toLowerCase() == 'span') {
            nowSelDay = target.dataset.days
            daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
            selDayHtml.innerHTML = nowSelDate()
        }
    }

    document.getElementById('pre').onclick = function () {
        preMonth()
    }

    document.getElementById('next').onclick = function () {
        nextMonth()
    }

    document.onkeydown = function (e) {
        e = e || window.event;
        if (e.key == 'ArrowLeft') {
            preMonth() //left <- show Prev image
        } else if (e.key == 'ArrowRight') {
            // right -> show next image
            nextMonth()
        }
    }
}