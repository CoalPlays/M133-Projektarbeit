const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
let date = moment();

$(() => {
    getJobs();
    getGroups(localStorage.getItem('job'));
    if (localStorage.getItem('group') != null) {
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
    $("#schedule").animate({
        marginRight: '1000px',
        opacity: '0'
      });
    getTable($("#group").val());
    $("#schedule").animate({
        marginRight: '0',
        marginLeft: '1000px'
      }, "fast");
    $("#schedule").animate({
        marginLeft: '0',
        opacity: '1'
      });
});

$("#subtract").click(function () {
    subtractWeek();
    $("#schedule").animate({
        marginLeft: '1000px',
        opacity: '0'
      });
    getTable($("#group").val());
    $("#schedule").animate({
        marginLeft: '0',
        marginRight: '1000px'
      }, "fast");
    $("#schedule").animate({
        marginRight: '0',
        opacity: '1'
      });
});

function getJobs() {
    $("#loading").css('display', "block");
    $.getJSON("http://sandbox.gibm.ch/berufe.php", function (data) {
        data.forEach(element => {
            let selectedjob = false
            if (localStorage.getItem('job') == element.beruf_id) {
                selectedjob = true;
                $("#classes").css('display', "block");
            }
            $('#job').append(`<option value='${element.beruf_id}' ${selectedjob == true ? "selected" : ""}>${element.beruf_name}</option>`)
        });
    }).fail(function () {
        $("#error").css('display', "block");
        $("#table").css('display', "none");
        $("#classes").css('display', "none");
        $("#jobs").css('display', "none");
        $("#noData").css('display', "none");
    });;
    $("#loading").css('display', "none");
};

function getGroups(val) {
    $("#loading").css('display', "block");
    $.getJSON(`http://sandbox.gibm.ch/klassen.php${val == null ? '' : '?beruf_id=' + val}`, function (data) {
        $('#group').html('');
        $('#group').html('<option>Wähle deine Klasse aus</option>');
        if (data == 0) {
            $("#noData").css('display', "block");
            $("#schedule").css('display', "none");
        } else {
            data.forEach(element => {
                let selectedGroup = false
                if (localStorage.getItem('group') == element.klasse_id) {
                    selectedGroup = true;
                }
                $('#group').append(`<option value='${element.klasse_id}' ${selectedGroup == true ? "selected" : ""}>${element.klasse_longname}</option>`)
            });
        }
    }).fail(function (e) {
        console.log(e);
        $("#error").css('display', "block");
        $("#table").css('display', "none");
        $("#classes").css('display', "none");
        $("#noData").css('display', "none");
    });
    $("#loading").css('display', "none");
};

function getTable(val) {
    $("#loading").css('display', "block");
    $("#schedule").css('display', "block");
    $("#table").css('display', "block");
    $("#error").css('display', "none");
    const week = `${getCalendarWeek(date)}-${getYear(date)}`;
    $("#date").html(`${getCalendarWeek(date)}-${getYear(date)}`)
    $.getJSON(`http://sandbox.gibm.ch/tafel.php?klasse_id=${val}&woche=${week}`, function (data) {
        $('#tableBody').html('');
        if (data == 0) {
            $("#noData").css('display', "block");
            $("#schedule").css('display', "none");
        } else {
            data.forEach(element => {
                $("#noData").css('display', "none");
                $('#tableBody').append(`
                <tr>
                    <td>${moment(element.tafel_datum).format('DD.MM.YYYY')}</td>
                    <td>${days[element.tafel_wochentag]}</td>
                    <td>${moment(element.tafel_von, 'h:mm').format('HH:mm')}</td>
                    <td>${moment(element.tafel_bis, 'h:mm').format('HH:mm')}</td>
                    <td>${element.tafel_lehrer}</td>
                    <td>${element.tafel_longfach}</td>
                    <td>${element.tafel_raum}</td>
                </tr>`)
            });
        }
    }).fail(function () {
        $("#error").css('display', "block");
        $("#schedule").css('display', "none");
        $("#noData").css('display', "none");

    });;
    $("#loading").css('display', "none");
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
