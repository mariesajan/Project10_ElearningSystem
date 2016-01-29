$(document).ready(function() {
  var acc_type = '';
  var username = '';

  if(document.cookie){  // if cookie exists
    var returnValue = readCookie('cookieUsername');
    if(returnValue != false){
      // if already logged in
      username = returnValue;
      var acc_type = readCookie('cookieAccType');
      $('#user_div h4').append(username);
    }
  }

  $('.info_message').hide();

  $('#btn_submit_class').on('click', function() {
      var class_name = $('#class_name').val();
      var class_description = $('#class_description').val();

      if(class_name != '' && class_description != ''){
        $.ajax({
            url: '/admin/add_class',
            method: 'POST',
            data: {
                class_name: class_name,
                class_description: class_description
            },
            success: function fn_success_addclass(data) {
                $('#class_name').val('');
                $('#class_description').val('');
                var html = '';

                if (data == 1) {
                  html = '<p>Class '+class_name +' added successfully<p>';
                }else if(data == 0){
                  html = '<p>Class '+class_name +' updated successfully<p>';
                }
                
                $('.info_message').show();
                $('.info_message').html(html);
            }
        });
      }else{
          var html = '<p> Please enter all the fields </p>';
          $('.info_message').show();
          $('.info_message').html(html);
          return false;
      }
    });
});
