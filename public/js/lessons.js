$(document).ready(function(){
  var acc_type = '';
  var username = '';

  if(document.cookie){  // if cookie exists
    var returnValue = readCookie('cookieUsername');
    if(returnValue != false){
      username = returnValue;
      var acc_type = readCookie('cookieAccType');
      $('#user_div h4').append(username);
      if(acc_type == 'instructor'){
        $('#link_add_class').show();
      }else{
        $('#link_add_class').hide();
      }
    }
  }

  if(window.location.search){
    //to get the classname to add lessons for it
    var className = getUrlParameter('class_name');
  }

  var url ='/view_lesson_details?classname='+className;
  $.get(url,function(data){
    $('#id_heading').html('<h2>Lessons of Class '+className+'</h2>')
    if(data.length > 0){
      var html='';
      for(var i = 0; i < data.length; i++){
        html += '<tr><td>'+ data[i].lesson_no +'</td><td>'+ data[i].lesson_title +'</td></tr>';
      }
      $('#id_lesson_list').append(html);

    }else{
      $('#id_lesson_list').empty();
      $('#id_heading').append('<p>No Lessons To Display</p>');
    }
  });

});
