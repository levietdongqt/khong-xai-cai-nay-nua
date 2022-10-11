var app = angular.module("myApp", [
    "ngRoute",
    "ngStorage",
    'ui.bootstrap'

]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "intro.html" })
        .when("/list/:keyWord", { templateUrl: "list-products.html" })
        .when("/product/:id", { templateUrl: "product.html" })
        .when("/cart", { templateUrl: "cart.html" })
        .when("/about", { templateUrl: "about-us.html" })
        .when("/compare", { templateUrl: "compare.html" })
        .when("/contact", { templateUrl: "contact.html" })
        .otherwise({redirectTo: "/"});
        
});
app.controller('myctr', function ($scope, $http, $localStorage, $filter, $location,$routeParams) {

    $http.get('json/data-main.json')
        .then(function (response) {
            var data = response.data;
            $scope.datalist = data;
        });
    $http.get('json/brand.json')
        .then(function (response) {
            var data = response.data;
            $scope.databrand = data;
        });
    $http.get('json/banner.json')
        .then(function (response) {
            var data = response.data;
            $scope.databanner = data;
        });

    /*---> index.html <----*/

    // Hàm dùng cho menu
    $scope.activePath = null;
    $scope.$on('$routeChangeSuccess', function () {
        $scope.activePath = $location.path();
        console.log($location.path());
    })
    //The load_info get infomation use for filter in list-product.html <----*/  
    
   
    $scope.load_info = function (info, search, dem) {
        if (dem == 1)  // This mean: user click on search
         {
            info = undefined;   //info is undefined then the absolute filter returns the same value as the original array
            $scope.show_banner = false;
        }
        else  // This mean: user click on menu
        {
            $scope.search = "";
            $scope.show_banner = true;
        }
        $localStorage.show_banner=$scope.show_banner;
        $scope.filtered = $filter('filter')($scope.datalist, info, true); //absolute filter in datalist
        $scope.filtered1 = $filter('filter')($scope.filtered, search);  //filter tương đối cho ô tìm kiếm
        $localStorage.filtered1=$scope.filtered1;
        if ($scope.filtered1 == "") 
        {
            $scope.noResult = true;
        }
        else
            $scope.noResult = false;
        $scope.load = info;   //use to show key-word in listproduct
        $localStorage.load=info;
        $scope.show_Search = search;    //Use to show key-word search in listproduct
        
        //call  funtion for pagination 
        $scope.pagination_list(1);
    }
    $scope.show_cart1 = function () {
        $scope.calculate_sum();
        if ($scope.sum == 0)
            $scope.show_cart = false;
        else
            $scope.show_cart = true;
        console.log("show_cart" + $scope.show_cart);
    }
    /*--->End index.html <----*/
    /*---> List-Product.html <----*/
    // The get_index function find the index of the product in the JSON file
    
    $scope.get_index = function (index) {      
        $scope.index = $scope.datalist.findIndex(item => item.Img.ID === index); //tìm index bên trong Img.ID của datalist và trả về chỉ số của item.Img.ID=index trong datalist
        // $scope.index=index;
        $localStorage.index=$scope.index;
        console.log("Index: " + $scope.index);
    };
    //The big_img get soure of big image in product.htmt (Have to put this in anywhere link to product.html) 
    console.log($routeParams);
    
    $scope.big_img = function (img) {
        $scope.img = img;
        $localStorage.img=img;
        $scope.show_price = false;
        console.log(img);
    }
    // Start code pagination
    // $scope.data_pagination = [];
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;
    $scope.pagination_list = function (currentPage) {
        $scope.pagination_number = $scope.filtered1.length;
        // console.log("page: " + currentPage)        
        var index_begin = ((currentPage - 1) * $scope.itemsPerPage);
        var index_end = index_begin + $scope.itemsPerPage;
        $scope.data_pagination = $scope.filtered1.slice(index_begin, index_end);
        // $localStorage.filtered1=$scope.data_pagination
    }; //end pagination
    if($localStorage.filtered1 != undefined)
    {
        $scope.filtered1 =$localStorage.filtered1;
        $scope.load=$localStorage.load;
        $scope.show_banner=$localStorage.show_banner;
        $scope.index=$localStorage.index;
        $scope.img=$localStorage.img;
        $scope.pagination_list(1);
        console.log('save data');
    }
    // End List-Product.html
    /*---> Product.html <----*/
    // The product_price use to calculate price in product.html
    $scope.product_price = function (price, number1) {
        $scope.price = price * number1;
        console.log($scope.price);
        $scope.show_price = true;
    }
    $scope.small_img = function (img) {
        $scope.img = img;
    }

    // Hàm add to cart <----*/       
    if ($localStorage.local_data1 == undefined) {
        $scope.datacart = [];
        $scope.sum = 0;
        console.log("first_load");
    }
    else {
        $scope.datacart = $localStorage.local_data1;
        $scope.sum = $localStorage.sum1;
        if ($scope.sum == 0)
            $scope.show_cart = false;
        else
            $scope.show_cart = true;
    }
    $scope.add_cart = function (index, number) {
        console.log("Index in datalist: " + index);
        // lọc sản phẩm mới thêm vào đã có sẵn trong datacart hay k?
        let y = $scope.datacart.findIndex(item => item.ID === $scope.datalist[index].Img.ID);
        console.log("index of new item in datacart: " + y);
        if (y == -1 && $scope.show_price == true) {
            alert("The item has been added to the cart. \n Please check your cart!! \n Thank you!! ");
            $scope.datacart.push($scope.datalist[index].Img);
            let x = $scope.datacart.length - 1; //x là index của sản phẩm mới thêm vào cart ( luôn là phần tử cuối mảng  )
            console.log("Last index of datacart: " + x);
            $scope.datacart[x].Quantity = number;
            $scope.datacart[x].Total = number * $scope.datacart[x].Price;
            $localStorage.local_data1 = $scope.datacart;
            $scope.calculate_sum();
            console.log("sum" + $localStorage.sum1)
            console.log($localStorage.local_data1);
        }
        else {
            if ($scope.show_price) {
                alert("The quanitity has been changed inside the cart. \n Please check your cart!! \n Thank you!! ");
                $scope.datacart[y].Quantity += number;
                $scope.datacart[y].Total = $scope.datacart[y].Quantity * $scope.datacart[y].Price;
                $scope.calculate_sum();
                $localStorage.local_data1 = $scope.datacart;
            }
            else
                alert("Please choose quanitity!!!");
        }

    }
    // End Product.html <----*/ 

    /*---> cart.html <----*/
    // The calculate_sum use to calculate prices of all procduct in cart.html
    $scope.calculate_sum = function () {
        $scope.sum = 0;
        angular.forEach($scope.datacart, function (value, key) {
            $scope.sum += value.Total;
        })
        $localStorage.sum1 = $scope.sum;
    }
    //Hàm Cart_submit 
    $scope.cart_submit = function () {
        alert("We have received a response from you. \n We will respond to your email as soon as possible. !");
        $scope.deleteCart();
        location.replace("index.html")
       
    }
    //The change_price adjusts price when change quantity in cart
    $scope.change_price = function (index) {
        $scope.datacart[index].Total = $scope.datacart[index].Quantity * $scope.datacart[index].Price;
        console.log("index of current item in datacart:" + index);
        $scope.calculate_sum();
    }
    // Hàm xóa hàng
    $scope.deleteRow = function (i) {
        $scope.datacart.splice(i, 1);
        $scope.calculate_sum();
    };
    //Hàm xoá tất cả sản phẩm
    $scope.deleteCart = function () {
        $localStorage.local_data1 = [];
        $scope.datacart = [];
        $localStorage.sum1 = 0;
        $scope.sum = 0;
    }
    /*--->End cart.html <----*/
    /*---> Compare.html  <----*/
    // The left side
    $scope.get_brand_left = function () {
        let e = document.getElementById('brand');
        $scope.compare = e.options[e.selectedIndex].value;
        $scope.show_compare = false;
    }
    $scope.get_item_left = function () {
        let e = document.getElementById('item');
        $scope.item = e.options[e.selectedIndex].value;
        $scope.check_compare = true;
    }
    $scope.filter_item_left = function () {
        if ($scope.check_compare == true) {
            $scope.show_compare = true;
        }
    }
    //The right side
    $scope.get_brand_right = function () {
        let e = document.getElementById('brand1');
        $scope.compare1 = e.options[e.selectedIndex].value;
        $scope.show_compare1 = false;
    }
    $scope.get_item_right = function () {
        let e = document.getElementById('item1');
        $scope.item1 = e.options[e.selectedIndex].value;
        $scope.check_compare1 = true;
    }
    $scope.filter_item_right = function () {
        if ($scope.check_compare1 == true) {
            $scope.show_compare1 = true;
        }
    }


    /*---> About-us.html <----*/
    $scope.menu_ab = function (ab) {
        $scope.ab = ab;
        $scope.show_about = false;

        $scope.show_Policy = false;
        $scope.show_Terms = false;
        $scope.show_GUARANTEE = false;
        $scope.show_Payments = false;

        if (ab == "about-us")
            $scope.show_about = true;
        if (ab == "Policy")
            $scope.show_Policy = true;
        if (ab == "Terms")
            $scope.show_Terms = true;
        if (ab == "GUARANTEE")
            $scope.show_GUARANTEE = true;
        if (ab == "Payments")
            $scope.show_Payments = true;
    }
    /*--->  <----*/

});


