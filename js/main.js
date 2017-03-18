$(document).ready(function () {
    handelbars();
    showModalChart();
});

function getTemplateAjax(path, tmpl) {
    var source, template;
    $.ajax({
        url: path,
        dataType: "html",
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            zebraTable();
            if (tmpl) tmpl(template);
        }
    });
}

function renderHandlebarsTemplate(withTemplate, inElement, withData, callback) {
    getTemplateAjax(withTemplate, function (template) {
        var targetDiv = (typeof inElement == 'string') ? $(inElement) : inElement;
        targetDiv.append(template(withData));
        if (callback) {
            callback()
        }
    })
}

function handelbars() {
    var tbody = $('table tbody');
    var header = $('#largeImg');
    var footer = $('#footer');
    loadData(function (users) {
        users.results.forEach(function (result) {
            var user = {
                id: result.id.value,
                first: result.name.first,
                last: result.name.last,
                username: result.login.username,
                phone: result.phone,
                location: result.location.city,
                registered: result.registered,
                email: result.email,
                gender: result.gender,
                address: result.location.street,
                state: result.location.state,
                postcode: result.location.postcode,
                dob: result.dob,
                cell: result.cell,
                imgLarge: result.picture.large,
                imgMedium: result.picture.medium,
                imgThumb: result.picture.thumbnail
            };

            Handlebars.registerHelper('if_gender', function (a, b, opts) {
                if (a == b) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            });

            Handlebars.registerHelper("debug", function (opts) {
                console.log("Current Context");
                console.log("====================");
                console.log(this);

                if (opts) {
                    console.log("Value");
                    console.log("====================");
                    console.log(opts);
                }
            });

            renderHandlebarsTemplate('js/templates/users.tmpl.hbs', tbody, user);
        });
        toggleTable(users);

        var info = {
            createdBy: "Anton Shamseev",
            copyright: "2017",
            first: users.results[0].name.first,
            imgLarge: users.results[0].picture.large,
            countUsers: function () {
                return users.results.length;
            }
        };

        renderHandlebarsTemplate('js/templates/header.tmpl.hbs', header, info);
        renderHandlebarsTemplate('js/templates/footer.tmpl.hbs', footer, info);
    });

}

function loadData(users) {
    $.ajax({
        url: 'https://randomuser.me/api/?results=10',
        dataType: 'json',
        success: function (data) {
            drawChart(data);
            searchUser(data);
            users(data);
        }
    });
}

function searchUser() {

    $("#searchUser").keyup(function () {
        var searchUser = this;
        $.each($("#users tbody tr"), function () {
            if ($(this).text().indexOf($(searchUser).val()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
}

function showModalChart() {
    $('#showChart').click(function () {
        $('.modal-overlay').addClass('shown')

    });

    $('button.modal-close').click(function () {
        $('.modal-overlay').removeClass('shown')
    });
}

function drawChart(genderData) {

    var malesCount = femalesCount = 0;

    genderData.results.forEach(function (result) {
        result.gender === 'male' ? malesCount++ : femalesCount++;
    });
    var ctx = $('#gender-chart');
    var data = {
        labels: [
            "Female",
            "Male"
        ],
        datasets: [
            {
                data: [femalesCount, malesCount],
                backgroundColor: [
                    "#FF6384",
                    "#376cff"
                ],
                hoverBackgroundColor: [
                    "#ff5a70",
                    "#1f50ff"
                ]
            }]
    };

    var genderChart = new Chart(ctx, {
        type: 'doughnut',
        data: data
    });

}

function toggleTable(userId) {

    userId.results.forEach(function (result) {
        var id = result.login.username;
        $('td.fullDesc').hide();
        $('a').find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
        $(document).on('click', 'a#' + id, function (e) {
            e.preventDefault();
            $('td.' + id).slideToggle('slow');
            $('.fullDesc').not('.' + id).hide('slow');
            $('a').find('i').toggleClass('fa-plus-circle fa-minus-circle');
            $('.fullDesc' + id).show('slow');
            $('a').not('#' + id).find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });
    });
}

function zebraTable(shortDesc) {
    var countRow = 0;
    $('.shortDesc').each(function (index, row) {
        $(row).removeClass('odd');
        if ($(row).is(":visible")) {
            if (countRow % 2 == 1) { //odd row
                $(row).addClass('odd');
                $(row).next('tr').addClass('odd');
            }
            countRow++;
        }
    });
}

