/*----------variables------*/
let urlApi = 'https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/';
let  hiddenValue;


/*when page is ready and than all contents are loaded*/
$(document).ready(function () {

    getData();
  

    
    $(".btnDeleteUser").click(function(event) {
        event.preventDefault();
        info("notification is-danger","Warning","Are you sure you want to delete this user?","Yes (delete)");
    });


    $("#btnCancelModal").click(function(event) {
        event.preventDefault();
        $("#image-modal").hide(); 
    });
    
    $("#btnConfirmModal").click(function(event) {
        event.preventDefault();
        let btnTextConfirmModal=event.target.innerText;
      

        if(btnTextConfirmModal=="Yes (delete)"){
          deleteUser(hiddenValue);
        }

 
    });
    
    //cancel the modal
    $("#btnCloseModal").click(function(event) {
        $(".modal").hide();
    });
    
    
    $('#btnConfirmModal').click(function(event) {
        $(".modal").hide();
    });

});



/*----------functions----------*/


function info(classAlert,textTitreModal,textMessage,textButtonConfirm) {
$("#modal-card-head").removeClass();
$("#modal-card-head").addClass("modal-card-head "+classAlert);
$("#modal-card-title").text(textTitreModal);
$("#modal-card-body").text(textMessage);
$('#btnConfirmModal').text(textButtonConfirm);

    $(".modal").show(); 
}

function  deleteUser(myId){
    myUrl=urlApi+myId.toString();
    alert(myUrl);
    $.ajax({
        type:   "DELETE",
        url:    myUrl,
        data:   {"id": myId},
        async: false,
        success: function ($mockData) {
           getData();
        },
        error: function (request, error) {
            console.log ("ERROR:" + error);
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
function setHiddenId(myId){
    hiddenValue='';
    hiddenValue=myId;
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
                            <td>"+ value.last_name + "</td>"+
                            `<td><a href="" onclick='setHiddenId(`+value.id+`)' class="btnDeleteUser mr-5"><i class="fa-solid fa-user-xmark"></a></i>`+
                            `<a href="" onclick='setHiddenId(`+value.id+`)' class="btnDeleteUser"><i class="fa-solid fa-user-xmark"></a></i>`+"</td>"+
                            "</tr></tbody");
                            
            })
         
         
        }
   

    });

}
