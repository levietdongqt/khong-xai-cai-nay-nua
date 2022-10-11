function kiemtra(){
    /*khai báo biến idsv = value của input id sinh viên bằng id */
   
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var error = "";

    


        // xét dữ liệu first name
    if (fname==""){
        // alert('Enter First name');
        error += "Enter First Name";
        document.getElementById('error').innerHTML= error;
        document.getElementById('fname').focus();
        return false ;
    }

        // xét dữ liệu last name 
    if (lname==""){
        // alert('Enter Last name');
        error += "Enter Last Name";
        document.getElementById('error').innerHTML= error;
        document.getElementById('lname').focus();
        return false ;
    }

    /*xét dữ liệu email*/
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!filter.test(email)) { 
        // alert('Hay nhap dia chi email hop le.\nExample@gmail.com');
        error += "Email invalidate";
        document.getElementById('error').innerHTML= error;
        document.getElementById('email').focus();
        return false;
    }
    
   
    if (phone==""){
        // alert('Pleads Enter Phone');
        error += "Pleas enter phonenumber";
        document.getElementById('error').innerHTML= error;
        document.getElementById('phone').focus();
        return false ;
    }
    
     
    /* dữ liệu thoả hết các điều kiện sẽ xuất ra thông báo */
    else {
        error == "";
        document.getElementById('error').innerHTML= error;
        alert("We have received a response from you. \n We will respond to your email as soon as possible. !");  
    return true;
}
}


