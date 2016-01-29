$(document).ready(function() {
    var username = '';
    var acc_type = '';

    if(document.cookie){  // if cookie exists
      var returnValue = readCookie('cookieUsername');
      if(returnValue != false){
        username = returnValue;
        var acc_type = readCookie('cookieAccType');
        $('#user_div h4').append(username);
        $('#id_heading').html('<h2>Classes of '+ username +'</h2>')
        if(acc_type == 'instructor'){
          $('#link_add_class').show();
        }else{
          $('#link_add_class').hide();
        }
      }
    }


    $.get('/api/myclass',function(data){
      var classNames = [];
      classNames =  Object.keys(data);
      if(classNames.length != 0){
        var html = '';
        for(var i = 0; i < classNames.length; i++){
          var className = classNames[i].split(':');
          html = '<tr><td>'+ (i+1) +'</td><td>'+ className[1] +'</td>';
          html += '<td><a href="/view_lessons?classname=' + className[1] + '" data-id='+className[1]+'>View Lessons</td>';
          if(acc_type == 'instructor'){
            html += '<td><a href="/add_lesson?classname=' + className[1] + '" data-id='+ className[1]+'>Add Lesson</td>'
          }
          html +='</tr>';
          $('#id_class_list').append(html);
        }
      }else{
        $('#id_class_list').remove();
        $('.div_table').append('<p>No Classes To Display</p>');
      }
    });
});
