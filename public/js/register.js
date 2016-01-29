$(document).ready(function() {
  $('.info_message').hide();
    $('#btn_create').on('click', function() {
        var acc_type = $("#acc_type").val();
        var first_name = $("#first_name").val();
        var last_name = $("#last_name").val();
        var street_address = $("#street_address").val();
        var city = $("#city").val();
        var state = $("#state").val();
        var zip = $("#zip").val();
        var email = $("#email").val();
        var username = $("#username").val();
        var password = $("#password").val();
        var confirm_password = $("#confirm_password").val();

        if(email.length == 0 || username.length == 0 || first_name.length == 0 || last_name.length == 0){
            console.log('Enter the mandatory fields...');
            var html = '<p>Enter the mandatory fields </p>';
            $('.info_message').html(html);
            return false;
        }
        if(password.length > 0){
          console.log('pwd not nul...');
          if(password != confirm_password){
            // passwords are not equal
            console.log('pawds.... nopt equal');
            var html = '<p>Passwords doesnt match. Please try again.</p>';
            $('.info_message').show();
            $(".info_message").html(html);
            return false;
          }
        }else{
          console.log('pwd field is null');
          var html = '<p> Enter the password field </p>'
          $('.info_message').show();
          $(".info_message").html(html);
          return false;
        }

        $.ajax({
            url: '/user_registration',
            method: 'POST',
            data: {
                acc_type: acc_type,
                first_name: first_name,
                last_name: last_name,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
                email: email,
                username: username,
                password: password
            },
            success: function success_register(data) {
                if (data == 'success') {
                    window.location.href =
                        '/?data=' + data;
                }
            }
        });
    });

});
