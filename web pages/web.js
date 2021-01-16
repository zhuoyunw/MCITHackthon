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
var nowSelDay = formatDate(new Date()).substring(8, 10);
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
            css = ' class = "other-month"'
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
    var str2 = '<div class="week">'
    var css = ''
    var css2 = ''
    var dis = '';
    var date = formatDate(new Date())

    nowSelDay = nowSelDay ? nowSelDay : 1
    var events = [];


    for (let i = 1; i <= daysFirst % 7; i++) {
        str2 += '<div class="day other"></div>'
    }
    for (let i = 1; i <= days; i++) {
        css = ''
        css2 = ''
        if (nowSelYear == date.substring(0, 4) && nowSelMonth == date.substring(5, 7) && i == date.substring(8, 10)) {
            css = 'today-day'
        }
        if ((i + daysFirst) % 7 == 1) {
            str += '<div class="week">'
        }
        // str += '<div id="' + i + '"><span data-title="' + dis + '" data-days="' + i + '" class="' + css + ' ' + css2 + '">' + i + '</span></div>'
        str += '<div class="day other" id="days_number' + i.toString().padStart(2, "0") + '">'//<div class="day-name"> + weeks[(i + daysFirst) % 7] + '</div>
            + '<div data-days="'
            + i + '" class="' + css + ' ' + css2 + ' day-number">'
            + i + '</div><div class="day-events" id="days'
            + i.toString().padStart(2, "0") + '"></div></div>'

        if ((i + daysFirst) % 7 == 0) {
            str += '</div>'
        }
    }

    var text = '';
    var array = [];
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            text = xmlhttp.responseText;
            // Now convert it into array using regex
            array = text.split(/\n/g);
            for (let i = 0; i < array.length - 1; i++) {
                var tempdayStart = parseInt(array[i].substring(6, 8));
                var tempdayEnd = parseInt(array[i].substring(15, 17));
                for (let j = tempdayStart; j <= tempdayEnd || tempdayStart > tempdayEnd; j++) {
                    var element = document.getElementById("days" + j.toString().padStart(2, "0"));
                    // element.innerHTML += '<span class="blue"><p class="todoinfo">' + array[i].slice(18) + '</p></span>';
                    element.innerHTML += '<span class="blue"></span>';

                    var element2 = document.getElementById("days_number" + j.toString().padStart(2, "0"));
                    var existed = element2.getAttribute('data-title');
                    if (existed == null) element2.setAttribute('data-title', array[i].slice(18, -1));
                    else element2.setAttribute('data-title', existed + '\n' + array[i].slice(18, -1));
                    if ((j + daysFirst) % 7 == 1) {
                        element2.setAttribute('pos', '-20px');
                    }
                    else if ((j + daysFirst) % 7 == 2) {
                        element2.setAttribute('pos', '-50px');
                    }
                    else if ((j + daysFirst) % 7 == 6) {
                        element2.setAttribute('pos', '-150px');
                    }
                    else if ((j + daysFirst) % 7 == 0) {
                        element2.setAttribute('pos', '-180px');
                    }
                    else {
                        element2.setAttribute('pos', '-100px');
                    }
                }
            }
        }
    }
    xmlhttp.open("GET", "./UPenn_Events/cleaned_up/" + year + month + ".txt", true);
    xmlhttp.send();

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
        nowSelDay = 01
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    } else {
        nowMonthIndex--
        nowSelDay = 01
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
        nowSelDay = 01
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    } else {
        nowMonthIndex++
        nowSelDay = 01
        monthsHtml.innerHTML = getMonths(nowMonthIndex)
        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
    }
}

function nowSelDate() {
    var str = ''
    str = 'Date: ' + nowSelYear + '/' + nowSelMonth + '/' + nowSelDay.toString().padStart(2, "0")
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
        // if (target.nodeName.toLowerCase() == 'div') {
        if (target.classList.contains('other')) {
            // nowSelDay = target.dataset.days
            let children = target.childNodes
            nowSelDay = children[0].innerHTML
        }
        if (target.classList.contains('day-number'))
            nowSelDay = target.dataset.days

        daysHtml.innerHTML = getDays(nowSelYear, nowSelMonth)
        selDayHtml.innerHTML = nowSelDate()
        var element = document.getElementById("days_number" + nowSelDay.toString().padStart(2, "0"));
        element.classList.add('chosen-day');

        // now find week and add details
        // var weekNumber = Math.ceil((parseInt(nowSelDay) + getFirstDayOfWeek(nowSelYear, nowSelMonth)) / 7) - 1;
        // var allWeeks = document.getElementsByClassName('week');
        // var relativepos = 27 + ((parseInt(nowSelDay) + getFirstDayOfWeek(nowSelYear, nowSelMonth) - 1) % 7) * 60;
        // var info = theDay.getElementsByClassName('todoinfo');
        // $('body').ajaxComplete(function () {
        //     var theDay = document.getElementsByClassName('day-events')[parseInt(nowSelDay) - 1];
        //     info = theDay.getElementsByClassName('todoinfo');
        // });
        // document.getElementById("demo").innerHTML = info.length
        // allWeeks[weekNumber].innerHTML += '<div class="details in"><div class="arrow" style="left: '
        //     + relativepos.toString() + 'px;"><div class="events in">'
        //     + '<div class="event"><div class="event-category blue"></div><span>' + document.getElementsByClassName('day-events')[parseInt(nowSelDay) - 1].innerHTML + '</span></div>'
        //     + '</div></div></div>'


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