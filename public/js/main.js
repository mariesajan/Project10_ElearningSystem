$(document).ready(function() {
    var username = '', acc_type = '', html = '';
    var searchParam = window.location.search;
    var search = searchParam.split('=');
    if(document.cookie){  // if cookie exists
      var returnValue = readCookie('cookieUsername');
      if(returnValue != false){
        // if no cookieUsername
        username = returnValue;
      }
    }

    if (search[1] == 'success') {
        html = '<p>Registration is successful.Please Login.</p>';
        $('.info_message').html(html);
    }else if(search[1] == 'not_login'){
      html = '<p>Please Login.</p>';
      $('.info_message').html(html);
    }else if(search[1] == 'logged_out'){
      html = '<p>You are successfully logged out.</p>';
      $('.info_message').html(html);
    }else{
      $('.info_message').remove();
    }

    $.get('/api/allclasses',function(data){
        var html = '';
        if(data != 'error'){
            arrClassName = data[0];
            arrClassDesc = data[1];
            for(var i = 0; i < arrClassName.length; i++){
              var arrClassDescription = arrClassDesc[i].substring(0,150);
                html += '<div class="col-md-4 box-border-allclass box-border">';
                html +=  '<h4>' + arrClassName[i]+ '</h4>';
                html += '<p>'+ arrClassDescription + '</p>';
                html += '<button id="btn_register_class" data-id="' + arrClassName[i]+'"> Register</button>';
                html += '</div>';
            }
        }else{
          html = '<p>No Classes To Display</p>';
        }

        $('#id_latestClasses').append(html);
    });

    $("#id_latestClasses").on("click","#btn_register_class", function(){
      if(username != ''){
        //already logged in
        var class_name= $(this).data('id');
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
        }else {
            //not logged in
            window.location = '/?data=not_login';
        }
    });

    $('#btn_signup').on("click", function() {
        window.location = '/register';
    });
});
