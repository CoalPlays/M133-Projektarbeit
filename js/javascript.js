$.getJSON("http://sandbox.gibm.ch/berufe.php", function (data) {
    data.forEach(element => {
        $('#job').append(`<option value='${element.beruf_id}'>${element.beruf_name}</option>`)
    });
});

$.getJSON(`http://sandbox.gibm.ch/klassen.php`, function (data) {
    data.forEach(element => {
        $('#group').append(`<option value='${element.klasse_id}'>${element.klasse_longname}</option>`)
    });
});
