$(document).ready(function() {
    var class_name = getUrlParameter('class_name');
    var acc_type = '';
    var username = '';

    $('.info_message').hide();

    if(document.cookie){  // if cookie exists
      var returnValue = readCookie('cookieUsername');
      if(returnValue != false){
        // if already logged in
        username = returnValue;
        var acc_type = readCookie('cookieAccType');
        $('#if_already_user h4').append(username);
      }
    }


    $('#classes_list h2').append(class_name);

    $('#id_submit').on("click", function() {
        var lesson_no = $('#lesson_no').val();
        var lesson_title = $('#lesson_title').val();
        var lesson_body = $('#lesson_body').val();

        if(lesson_no != '' && lesson_title != '' && lesson_body != ''){
          if(isNaN(lesson_no) ==  true){
            //if lesson number is not a decimal
            var html  = '<p> Enter a number in the Lesson Number field. </p>';
            $('.info_message').html(html);
            return false;
          }else{
            //if lesson number is a decimal
            $.ajax({
                url: '/add_lesson',
                method: 'POST',
                data: {
                    lesson_no: lesson_no,
                    lesson_title: lesson_title,
                    lesson_body: lesson_body,
                    class_name : class_name
                },
                success: function fn_success_submit(data) {
                    var html = '';
                    $('#lesson_no').val('');
                    $('#lesson_title').val('');
                    $('#lesson_body').val('');
                    if(data == 'success'){
                      html = '<p>Lesson '+ lesson_title +' Added Successfully</p>';
                      $('.info_message').show();
                      $('.info_message').html(html);
                    }
                }
            });
          }
        }else{
          var html = '<p>Enter the mandatory fields.</p>';
          $('.info_message').show();
          $('.info_message').html(html);
          return false;
        }
    });
});
