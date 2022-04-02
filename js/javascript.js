const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
let date = moment();

$(() => {
    getJobs();
    getGroups(localStorage.getItem('job'));
    if(localStorage.getItem('group') != null) {
        getTable(localStorage.getItem('group'))
        $("#schedule").css('display', "block");
        $("#calendarWeek").css('display', "block");    
    }
})

$("#job").change(function () {
    getGroups($('#job').val())
    localStorage.setItem('job', $("#job").val());
    localStorage.setItem('group', $("#group").val());
    $("#classes").css('display', "block");
});

$("#group").change(function () {
    localStorage.setItem('group', $("#group").val());
    getTable($("#group").val());
    $("#schedule").css('display', "block");
    $("#calendarWeek").css('display', "block");
});

$("#add").click(function () {
    addWeek();
    getTable( $("#group").val());
});

$("#subtract").click(function () {
    subtractWeek();
    getTable( $("#group").val());
});

function getJobs() {
    $.getJSON("http://sandbox.gibm.ch/berufe.php", function (data) {
        data.forEach(element => {
            let selectedjob = false
            if (localStorage.getItem('job') == element.beruf_id) {
                selectedjob = true;
                $("#classes").css('display', "block");
            }
            $('#job').append(`<option value='${element.beruf_id}' ${selectedjob == true ? "selected" : ""}>${element.beruf_name}</option>`)
        });
    });
};

function getGroups(val) {
    $.getJSON(`http://sandbox.gibm.ch/klassen.php${val == null ? '' : '?beruf_id=' + val}`, function (data) {
        $('#group').html('');
        $('#group').html('<option>Wähle deine Klasse aus</option>');
        data.forEach(element => {
            let selectedGroup = false
            if (localStorage.getItem('group') == element.klasse_id) {
                selectedGroup = true;
            }
            $('#group').append(`<option value='${element.klasse_id}' ${selectedGroup == true ? "selected" : ""}>${element.klasse_longname}</option>`)
        });
    });
};

function getTable(val) {
    const week = `${getCalendarWeek(date)}-${getYear(date)}`
    $("#date").html(`${getCalendarWeek(date)}-${getYear(date)}`)
    $.getJSON(`http://sandbox.gibm.ch/tafel.php?klasse_id=${val}&woche=${week}`, function (data) {
        $('#tableBody').html('');
        data.forEach(element => {
            $('#tableBody').append(`
            <tr>
                <td>${moment(element.tafel_datum).format('DD.MM.YYYY')}</td>
                <td>${days[element.tafel_wochentag]}</td>
                <td>${moment(element.tafel_von,'h:mm').format('HH:mm')}</td>
                <td>${moment(element.tafel_bis,'h:mm').format('HH:mm')}</td>
                <td>${element.tafel_lehrer}</td>
                <td>${element.tafel_longfach}</td>
                <td>${element.tafel_raum}</td>
            </tr>`)
        });
    });
};

function getCalendarWeek(date) {
    return calendarWeek = moment(date, "DD-MM-YYYY").isoWeek();
};

function getYear(date) {
    return date.year();
}

function addWeek() {
    date.add(1, "w");
}

function subtractWeek() {
    date = date.subtract(1, "w")
}
