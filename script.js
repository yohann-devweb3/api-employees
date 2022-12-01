/*----------variables------*/
let urlApi = 'https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/';
let hiddenValue;
let fname;
let lname;
let userJob;
let userMail;


/*when page is ready and than all contents are loaded*/
$(document).ready(function () {

    getData();

    

    $(".btnProfileUser").click(function (event) {
     
    event.preventDefault();
    info("notification is-info has-text-centered", "Profile", "", "Unlock (for updating)");

       generateForm(true);
    });



    //modal : waiting for deleting an employee or not
    $(".btnDeleteEmp").click(function (event) {
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
            deleteEmp(hiddenValue);
            $(".modal").hide();
        }

        if (btnTextConfirmModal == "Unlock (for updating)") {
             $('#fieldSetProfile').prop("disabled", false);
             $('#btnConfirmModal').text("Save changes");
      
        }

        if (btnTextConfirmModal == "Save changes") {
            event.preventDefault();
      
        
           info("notification is-danger", "Warning", "Are you sure you want to update this user?", "Yes (update)")
           $('#fieldSetProfile').prop("disabled", false);
           generateForm(false);
         $('#sai_firstname').val(fname);
            $('#sai_lastname').val(lname);
            $('#sai_job').val(userJob);
            $('#sai_email').val(userMail);
         
        }

        if (btnTextConfirmModal == "Yes (update)") {
            $('#fieldSetProfile').prop("disabled", false);
   
             updateEmp(hiddenValue);
        }
    });

    //cancel the modal
    $("#btnCloseModal").click(function (event) {
        $(".modal").hide();
    });




});


//refresh the list of employees
$("#btnRefreshAllEmp").click(function (event) {
   
    getData();
});

/*----------functions----------*/
function generateForm(paramBool){
   let myForm = '';
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
   
        $("#modal-card-body").append(myForm);
        getDataEmp(hiddenValue,paramBool);
    
   
   
       
    
   

}

function getDataEmp(idEmployee,boolOk){
    
    myUrl = urlApi + idEmployee.toString();

    $.ajax({
        url: myUrl,
        type: "GET",
        cache: false,
        async: false,

        success: function (response) {
            if (boolOk===true){
                $('#sai_firstname').val(response.name);
                $('#sai_lastname').val(response.last_name);
                $('#sai_job').val(response.job_title);
                $('#sai_email').val(response.email);
          
        
            }else{
                $('#sai_firstname').val(this.val());
                $('#sai_lastname').val(this.val());
                $('#sai_job').val(this.val());
                $('#sai_email').val(this.val());
            }
     



          
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

function deleteEmp(myId) {
    myUrl = urlApi + myId.toString();

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
  
}

function updateEmp(myId){
    myUrl = urlApi + myId.toString();




    $.ajax({
        type: "PUT",
        url: myUrl,
        data: {
            "id": myId,
            "name": $('#sai_firstname').val(),
            "last_name": $('#sai_lastname').val(),
            "job_title": $('#sai_job').val(),
            "email": $('#sai_email').val()
            

    
        },
        async: false,
        success: function ($mockData) {
              $('.modal').hide();
            getData();
          
        },
        error: function (request, error) {
            console.log("ERROR:" + error);
        }
    });
   
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
            $('#tableData').empty();// empty table before load it
            $.each(response, function (key, value) {
               
                $('#tableData').append("<tbody><tr>\
                            <td>"+ value.id + "</td>\
                            <td>"+ value.name + "</td>\
                            <td>"+ value.last_name + "</td>" +
                    `<td><a href="" onclick='setHiddenId(` + value.id + `)' class="btnProfileUser mr-5"><i class="fa-solid fa-circle-info"></a></i>` +
                    `<a href="" onclick='setHiddenId(` + value.id + `)' class="btnDeleteEmp"><i class="fa-solid fa-user-xmark"></a></i>` + "</td>" +
                    "</tr></tbody");

            })


        }


    });

}
