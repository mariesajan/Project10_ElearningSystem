$(document).ready(function() {
    var arrClassName =[], arrClassDesc = [], username = '', acc_type= '';
    $('.info_message').hide();
    var acc_type = '';
    var username = '';
    if(document.cookie){  // if cookie exists
      var returnValue = readCookie('cookieUsername');
      if(returnValue != false){
        var acc_type = readCookie('cookieAccType');
        username = returnValue;
        $('#if_already_user h4').append(username);
        $('#link_login').hide();
        $("#id_div_login").hide();
        $('#link_home').show();

        if(acc_type == 'instructor'){
          $('#link_add_class').show();
        }else{
          $('#link_add_class').hide();
        }
      }
    }else{
      //cookie doesnt exists if user not logged in...
      $('#link_login').show();
      $("#if_already_user").hide();
      $('#link_home').hide();
    }


    $.get('/api/allclasses',function(data){
      var html = '';
      if(data != 'error'){
          arrClassName = data[0];
          arrClassDesc = data[1];
          for(var i = 0; i < arrClassName.length; i++){
              html += '<div class="box-border-allclass">';
              html +=  '<h4>' + arrClassName[i]+ '</h4>';
              html += '<p>'+ arrClassDesc[i] + '</p>';
              html += '<button id="btn_register_class" data-id="' + arrClassName[i]+'"> Register</button>';
              html += '</div>';
          }
      }else{
        html = '<p>No Classes To Display</p>';
      }

      $('#id_allClasses').append(html);
    });


    $("#id_allClasses").on("click","#btn_register_class", function(){
        var class_name= $(this).data('id');
        if(username != ''){
          $.ajax({
            url: '/register_class',
            type: 'POST',
            data: {
              class_name : class_name,
              username  : username
            },
            success: function fn_register_success(data){
                var html = '';
                $('.info_message').show();
                if(data == 'success'){
                  html = '<p>Registration for this class is successful</p>';
                  $('.info_message').html(html);
                }else if(data == 'error'){
                  html = '<p>You have already registered for this class</p>'
                  $('.info_message').html(html);
                }
            }
          });
        }else{
          window.location ='/?data=not_login';
        }
    });

});
