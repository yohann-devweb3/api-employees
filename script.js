/*----------variables---------*/
let urlApi = 'https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/';
let hiddenValue;

/*when page is ready and than all contents are loaded*/
$(document).ready(function (event) {
    getData();
    //display the form of employee's Profile 
    $(".btnProfileUser").click(function (event) {
        hiddenValue = $(event.currentTarget).data('id');
        event.preventDefault();
        info("notification is-info has-text-centered", "Profile", "", "Unlock (for updating)");
        generateForm(true);
    });

    //display the form's Profile 
    $("#btnAskAddEmp").click(function (event) {
        event.preventDefault();
        info("notification is-info has-text-centered", "Add an employee", "", "Add");
        generateForm(false);
    });

    //modal : waiting for deleting an employee or not
    $(".btnDeleteEmp").click(function (event) {
        hiddenValue = $(event.currentTarget).data('id');
        event.preventDefault();
        info("notification is-danger", "Warning", "Are you sure you want to delete this user?", "Yes (delete)");
    });

    //close the modal by clicking on button "cancel"
    $("#btnCancelModal").click(function (event) {
        event.preventDefault();
        $("#image-modal").hide();
    });

    //according the text of btnConfirmModal , execute a choice...
    $("#btnConfirmModal").click(function (event) {
        event.preventDefault();
        let btnTextConfirmModal = event.target.innerText;

        if (btnTextConfirmModal == "Yes (delete)") {
            deleteEmp(hiddenValue);//delete an user
            $(".modal").hide();
            message("Employee deleted ! ", "notification  is-success  is-verticaled ");
        }

        if (btnTextConfirmModal == "Unlock (for updating)") {//unlock form user
            $('#fieldSetProfile').prop("disabled", false);
            $('#btnConfirmModal').text("Save changes");
        }

        if (btnTextConfirmModal == "Save changes") {
            event.preventDefault();
            fname = $('#sai_firstname').val();
            lname = $('#sai_lastname').val();
            empMail = $('#sai_email').val();
            empJob = $('#sai_job').val();
            info("notification is-danger", "Warning", "Are you sure you want to update this user?", "Yes (update)")
        }

        //update the employee according params we give it into the form
        if (btnTextConfirmModal == "Yes (update)") {
            $('#fieldSetProfile').prop("disabled", false);
            updateEmp(hiddenValue, fname, lname, empMail, empJob);//update user
            message("Informations updated ! ", "notification  is-success  is-verticaled");
        }

        //ask by a modal the need to add an employee
        if (btnTextConfirmModal == "Add") {
            event.preventDefault();
            fname = $('#sai_firstname').val();
            lname = $('#sai_lastname').val();
            empMail = $('#sai_email').val();
            empJob = $('#sai_job').val();
            info("notification is-danger", "Warning", "Are you sure you want to add this user?", "Yes (add)")
        }
        //add the employee according params we give it into the form
        if (btnTextConfirmModal == "Yes (add)") {
            $('#fieldSetProfile').prop("disabled", false);
            addEmp(fname, lname, empMail, empJob);
            message("Employee added ! ", "notification  is-success  is-verticaled");
        }
    });

    //cancel the modal
    $("#btnCloseModal").click(function (event) {
        $(".modal").hide();
    });

    //close the modal by little button close on top side
    $("#btnCloseTopModal").click(function (event) {
        $(".modal").hide();
    });
});


//refresh the list of employees
$("#btnRefreshAllEmp").click(function (event) {
    event.preventDefault();
    getData();
    message("Refreshing... ", "notification  is-success ");
});

/*----------functions----------*/

//display a msg then hide after 1.35seconds
function message(message, classMessage) {
    $('#messageAlert').removeClass();
    $('#messageAlert').addClass(classMessage + ' columns is-vcentered ');
    $('#messageAlert').css('visibility', 'visible');
    $('#messageAlert').text(message);
    setTimeout(() => {
        $('#messageAlert').css('visibility', 'hidden');
    }, 1350);
}

//generate a form : set the parameter to true to disable all inputs from the form and set false for  the reverse situation
function generateForm(paramBool) {
    let myForm = '';
    if (paramBool === true) {
        myForm = myForm + `<div class="field"><fieldset disabled id="fieldSetProfile">`;
    } else {
        myForm = myForm + `<div class="field"><fieldset  id="fieldSetProfile">`;
        hiddenValue = "";
    }

    myForm = myForm +
        `   <div class="field ">
            <label class="label">Firstname</label>
                <div class="control">
                <input id="sai_firstname" class="input" type="text" value="">
                </div>
        </div>

        <div class="field">
        <label class="label">Lastname</label>
            <div class="control">
            <input id="sai_lastname" class="input" type="text">
            </div>
        </div>

        <div class="field">
        <label class="label">Job</label>
            <div class="control">
            <input class="input" id="sai_job" type="text">
            </div>
        </div>

        <div class="field">
        <label class="label">Email</label>
            <div class="control">
            <input class="input" id="sai_email" type="text">
            </div>
        </div>
    </fieldset>
    </div>
    `;

    $("#modal-card-body").append(myForm);//inject html strings from above to the form "myForm"
    getDataEmp(hiddenValue, paramBool);
}

//get the data from one employee with api /get : the parameter to access is 'idEmployee'
function getDataEmp(idEmployee, boolOk) {
    myUrl = urlApi + idEmployee.toString();
    $.ajax({
        url: myUrl,
        type: "GET",
        cache: false,
        async: false,
        data:response,

        success: function (response) {
            if (boolOk === true) {
                $('#sai_firstname').val(response.name);
                $('#sai_lastname').val(response.last_name);
                $('#sai_job').val(response.job_title);
                $('#sai_email').val(response.email);
            }
        },
        error: function(response, statusText) {
             alert("Error: "+statusText);
        }
    });
}

//configure & display a message (design & description & title)
function info(classAlert, textTitreModal, textMessage, textButtonConfirm) {
    $("#modal-card-head").removeClass();
    $("#modal-card-head").addClass("modal-card-head " + classAlert);
    $("#modal-card-title").text(textTitreModal);
    $("#modal-card-body").text(textMessage);
    $('#btnConfirmModal').text(textButtonConfirm);
    $('.modal').addClass('modal columns is-vcentered');
    $(".modal").show();
}

//delete a employee by api :/delete
function deleteEmp(myId) {
    myUrl = urlApi + myId.toString();
    $.ajax({
        type: "DELETE",
        url: myUrl,
        data: { "id": myId },
        async: false,
        success: function ($mockData) {
            getData();//refresh grid employees
        },
        error: function (request, error) {
            console.log("ERROR:" + error);
        }
    });
}

//update the employee's informations by api :'/put'
function updateEmp(myId, fname, lname, emailEmp, jobEmp) {
    myUrl = urlApi + myId.toString();
    $.ajax({
        type: "PUT",
        url: myUrl,
        cache: false,
        async: false,
        data: {
            "id": myId,
            "name": fname,
            "last_name": lname,
            "job_title": jobEmp,
            "email": emailEmp
        },
        async: false,
        success: function ($mockData) {
            $('.modal').hide();//hide modal
            getData();//refresh grid employees

        },
        error: function (request, error) {
            console.log("ERROR:" + error);
        }
    });
}

// add an employee with api /post
function addEmp(fname, lname, emailEmp, jobEmp) {
    myUrl = urlApi;
    $.ajax({
        type: "POST",
        url: myUrl,
        data: {
            "name": fname,
            "last_name": lname,
            "job_title": jobEmp,
            "email": emailEmp
        },
        async: false,
        success: function ($mockData) {
            $('.modal').hide(); //hide modal
            getData();//refresh grid employees
        },
        error: function (request, error) {
            console.log("ERROR:" + error);
        }
    });
}

//get the data from all employees with api /get
function getData() {
    $.ajax({
        url: urlApi,
        type: "GET",
        cache: false,
        async: false,
        success: function (response) {
            $('#tableData').empty();// empty table before load it
            let tHead =
                `<thead>
                <tr>
                    <th>#</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Action</th>
                </tr>
            </thead>`

            $('#tableData').append(tHead);
            $.each(response, function (key, value) {
                $('#tableData').append("<tbody><tr>\
                            <td>"+ value.id + "</td>\
                            <td>"+ value.name + "</td>\
                            <td>"+ value.last_name + "</td>" +
                    `<td><a href=''  data-id='` + value.id + `'  class="btnProfileUser mr-5"><i class="fa-solid fa-circle-info"></i></a>` +
                    `<a href=''  data-id='` + value.id + `'   class="btnDeleteEmp"><i class="fa-solid fa-user-xmark"></i></a>` + "</td>" +
                    "</tr></tbody")
            })
        },
        error: function(xhr, statusText) { alert("Error: "+statusText); }

 
    });
}