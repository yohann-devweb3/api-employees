/*----------variables------*/
let urlApi = 'https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/';
let hiddenValue;
let fname;
let lname;
let ejob;
let mail;


/*when page is ready and than all contents are loaded*/
$(document).ready(function () {

    getData();


    $(".btnProfileUser").click(function (event) {
     
    event.preventDefault();

        myForm = '';
        myForm = `
        <form class="field">

        <fieldset disabled id="fieldSetProfile">

            <div class="field">
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
        </form>
        `;


        info("notification is-info has-text-centered", "Profile", "", "Update");
  
        $("#modal-card-body").append(myForm);
        getDataEmp(hiddenValue);

    });



    //modal : waiting for deleting an employee or not
    $(".btnDeleteUser").click(function (event) {
        event.preventDefault();
        info("notification is-danger", "Warning", "Are you sure you want to delete this user?", "Yes (delete)");
    });

    //close the modal
    $("#btnCancelModal").click(function (event) {
        event.preventDefault();
        $("#image-modal").hide();
    });

    //according the text of btnConfirmModal , execute a choice...
    $("#btnConfirmModal").click(function (event) {
        event.preventDefault();
        let btnTextConfirmModal = event.target.innerText;

        if (btnTextConfirmModal == "Yes (delete)") {
            deleteUser(hiddenValue);
        }

        if (btnTextConfirmModal == "Update") {
            $('.fieldSetProfile').setAttribute('disabled', '');
        }
    });

    //cancel the modal
    $("#btnCloseModal").click(function (event) {
        $(".modal").hide();
    });


    $('#btnConfirmModal').click(function (event) {
        $(".modal").hide();
    });

});



/*----------functions----------*/
function getDataEmp(idEmployee){
    
    myUrl = urlApi + idEmployee.toString();

    $.ajax({
        url: myUrl,
        type: "GET",
        cache: false,
        async: false,

        success: function (response) {
            $('#sai_firstname').val(response.name);
            $('#sai_lastname').val(response.last_name);
            $('#sai_job').val(response.job_title);
            $('#sai_email').val(response.email);
        }


    });
}

function info(classAlert, textTitreModal, textMessage, textButtonConfirm) {
    $("#modal-card-head").removeClass();
    $("#modal-card-head").addClass("modal-card-head " + classAlert);
    $("#modal-card-title").text(textTitreModal);
    $("#modal-card-body").text(textMessage);
    $('#btnConfirmModal').text(textButtonConfirm);

    $(".modal").show();
}

function deleteUser(myId) {
    myUrl = urlApi + myId.toString();
    alert(myUrl);
    $.ajax({
        type: "DELETE",
        url: myUrl,
        data: { "id": myId },
        async: false,
        success: function ($mockData) {
            getData();
        },
        error: function (request, error) {
            console.log("ERROR:" + error);
        }
    });
    window.location.reload();
}

/*------------------------------------
function name : setHiddenId()
description : set the hidden id value to manipulate id from users
parameters : none
returns :  none
--------------------------------------*/
function setHiddenId(myId) {
    hiddenValue = '';
    hiddenValue = myId;
}


/*------------------------------------
function name : getData()
description : data object into the table "tableData"
parameters : none
returns :  data object into the table "tableData"
--------------------------------------*/

function getData() {
    $.ajax({
        url: urlApi,
        type: "GET",
        cache: false,
        async: false,

        success: function (response) {
            $.each(response, function (key, value) {

                $('#tableData').append("<tbody><tr>\
                            <td>"+ value.id + "</td>\
                            <td>"+ value.name + "</td>\
                            <td>"+ value.last_name + "</td>" +
                    `<td><a href="" onclick='setHiddenId(` + value.id + `)' class="btnProfileUser mr-5"><i class="fa-solid fa-circle-info"></a></i>` +
                    `<a href="" onclick='setHiddenId(` + value.id + `)' class="btnDeleteUser"><i class="fa-solid fa-user-xmark"></a></i>` + "</td>" +
                    "</tr></tbody");

            })


        }


    });

}
