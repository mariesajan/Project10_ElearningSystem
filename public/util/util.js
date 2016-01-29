$(document).ready(function(){
  $("#btn_login").on("click", function() {
    console.log('in util fn...');
      var username = $("#username").val();
      var password = $("#password").val();
      $.ajax({
          url: '/login',
          method: 'POST',
          data: {
              username: username,
              password: password
          },
          success: function success_login(data) {
              if (data.error) {
                  var html = '';
                  html = '<p>' + data.error +
                      '</p>';
                  $(".error").html(html);
              } else if (data.success) {
                  window.location =
                      '/home';
              }
          }
      });
  });
});


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


function readCookie(cookieName){
	var cookieArray = document.cookie.split(';');
  for(var i =0; i < cookieArray.length; i++){
  		var cookieVal = cookieArray[i].split('=');
      if(cookieVal[0].trim() == cookieName){
      	return cookieVal[1];
      }
  }
  return false;
}
