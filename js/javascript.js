$(() => {
    getJobs();
    getGroups(localStorage.getItem('job'));
})

$("#job").change(function () {
    getGroups($('#job').val())
    localStorage.setItem('job', $("#job").val());
    localStorage.setItem('group', $("#group").val());
    $("#classes").css('display', "block");
});

$("#group").change(function () {
    localStorage.setItem('group', $("#group").val());
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
        data.forEach(element => {
            let selectedGroup = false
            if (localStorage.getItem('group') == element.klasse_id) {
                selectedGroup = true;
            }
            $('#group').append(`<option value='${element.klasse_id}' ${selectedGroup == true ? "selected" : ""}>${element.klasse_longname}</option>`)
        });
    });
};

