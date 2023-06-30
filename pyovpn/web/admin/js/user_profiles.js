function addTd(tr, value) {
    var td = document.createElement('td');
    td.classList.add('align-middle', 'text-center');
    if (value === null || value === undefined || value == 'None') {
        value = '';
    }

    td.appendChild(document.createTextNode(value));
    tr.appendChild(td);
}

function addTh(thead, value) {
    var th = document.createElement('th');
    th.classList.add('align-middle', 'text-center');
    th.appendChild(document.createTextNode(value));
    thead.appendChild(th);
}


function createNewProfile() {
    user = $('#modal_username').val();
    type = $('input[name=profile-type]:checked').val();
    comment = $('#profile-comment').val();
    tlscryptv2 = $('#tls-crypt-v2').is(':checked');

    $.post(rootURL + "/create_new_profile", {
        'type': type,
        'user': user,
        'comment': comment,
        'tlscryptv2': tlscryptv2
    },
        function(serial) {
            window.location = rootURL + "/downloads?action=profile&serial=" + serial;

            $('#profileModal').modal('hide');
            var table = $('#user-profiles-table').DataTable()
            table.ajax.reload();
        });
}

function createNewProfileModal(user) {
    // fetch autologin permissions for this user
    $.post(rootURL + "/get_autologin", { 'user': user },
        function(result) {
            // show modal with autologin permissions
            $('#profileModalLabel').text('Create Profile for ' + user);
            $('#modal_username').val(user);

            if (result == 'false') {
                $('#profile-type-autologin').attr('disabled', 'true');
                $('#profile-type-autologin').attr('checked', 'false');
                $('#profile-type-userlocked').prop('checked', 'true');
            } else {
                $('#profile-type-autologin').removeAttr('disabled');
                $('#profile-type-autologin').attr('checked', 'true');
                $('#profile-type-userlocked').prop('checked', 'false');
            }

            $('#profileModal').modal('show');
        }
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const headers = [
    'SN #',
    'Autologin',
    'tls-crypt v2',
    'Created',
    'Expires',
    'Signing CA',
    'Comment',
    'Last Used',
    'Delete'
]

const cols = [
    'serial_number',
    'autologin',
    'tls_crypt_2',
    'not_before',
    'not_after',
    'signingCA',
    'comment',
    'last_used'
]

function format(d) {
    // create table
    var outer_div = document.createElement('div');
    outer_div.classList.add("slider");

    // if 0 profiles
    if (d.info == null) {
        div = document.createElement('div');
        div.innerHTML = 'No profiles found. Please create a Profile first.';
        div.classList.add('pb-4');
        div.classList.add('pt-4');
        div.classList.add('text-center');
        outer_div.appendChild(div);

        return outer_div;
    }


    var tbl = document.createElement('table');
    tbl.classList.add(
        "pb-4",
        "mb-5",
        "mt-3",
        "table",
        "table-sm",
        "table-borderless",
        "table-striped");

    // create table header
    var thead = document.createElement('thead');
    headers.forEach(function(th) {
        addTh(thead, th);
    });
    tbl.appendChild(thead);

    // create table body
    var tbody = document.createElement('tbody');
    ca = d.info;

    // create rows
    ca.forEach(function(item) {
        var tr = document.createElement('tr');

        // create cols
        cols.forEach(function(x) {
            addTd(tr, item[x]);
        });

        // create delete checkbox for row
        div = $('<div></div', { class: 'checkbox' }).append(
            $('<input />', {
                class: 'gridCheckbox',
                type: 'checkbox',
                name: 'CERT_' + item.serial_number,
                id: 'CERT_' + item.serial_number,
                value: 'true'
            }),
            $('<label />', {
                for: 'CERT_' + item.serial_number,
                class: 'text-center'
            })
        );
        td = $('<td></td', { class: 'align-middle text-center', style: 'padding-top: 12px;' }).append(div);
        tr.append(td[0]);

        tbody.appendChild(tr);
    });

    tbl.appendChild(tbody);
    outer_div.appendChild(tbl);
    return outer_div;
}

function render_username(data, type, row) {
    return data + ' (' + row['num_profiles'] + ')';
}

function cell_username(td, cellData, rowData, row, col) {
    $(td).attr('id', cellData);
}

function render_new_profile(data, type, row) {
    return '<button onclick="createNewProfileModal(\'' + data + '\');" type="button" class="btn btn-outline-secondary"><i class="fal fa-plus-circle"></i> New Profile</button>'
}

function render_delete(data, type, row) {
    return '<button class="btn btn-outline-secondary specialBox" type="button"><i class="fal fa-check-square "></i> All Profiles</button>'
}
var rootURL;
$(document).ready(function() {
    rootURL = window.location.href;
    var table = $('#user-profiles-table').DataTable({
        "processing": true, // enable if we want to show a spinner/text while loading
        "rowId": "username",
        "ajax": {
            "url": rootURL + "/dt",
            "type": "POST",
        },
        "columns": [
            {
                "className": "icon more-info align-middle",  // Fontawesome chevron
                "orderable": false,
                "data": null,
                "defaultContent": ""
            },
            {
                "className": "align-middle",
                "data": "username",
                "render": render_username,
                "createdCell": cell_username
            },
            {
                "className": "text-right",
                "data": "username",
                "orderable": false,
                "render": render_new_profile
            },
            {
                "className": "text-right",
                "orderable": false,
                "render": render_delete
            },
        ],
        "order": [[1, "asc"]]
    });


    $('#user-profiles-table').on('click', 'td.icon.more-info', function() {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {  // This row is already open - close it

            $('div.slider', row.child()).slideUp(function() {
                row.child.hide();
                tr.removeClass('shown');
            });
        }
        else {  // Open this row
            row.child(format(row.data()), 'no-padding').show();
            tr.addClass('shown');

            $('div.slider', row.child()).slideDown();
        }
    });

    // select all profiles for a username
    $(document).on('click', '.specialBox', function() {
        var select_all = $(this).text() == ' All Profiles';

        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (!row.child.isShown()) {  // Open this row

            row.child(format(row.data()), 'no-padding').show();
            tr.addClass('shown');

            $('div.slider', row.child()).slideDown();
        }

        if (select_all) {
            tr.next().find('.gridCheckbox').prop('checked', true);
            $(this).html('<i class="fal fa-square "></i> All Profiles ');
        } else {
            tr.next().find('.gridCheckbox').prop('checked', false);
            $(this).html('<i class="fal fa-check-square "></i> All Profiles');
        }
    });

    // Btn handler for 'Show All Profiles'
    $(document).on('click', '#btn-show-all', function() {
        $.ajax({ url: rootURL + "/showall" });
    });

});
