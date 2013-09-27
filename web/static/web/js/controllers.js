  extend(app,
   {exercise:{ 
      controllers : { 'MainCtrl':
                function($scope,$state,$location,Help) {

                  // initialize parse with the hardcoded keys
                  app.database.init.default_init();

                  $scope.goLogin = function() {
                    $scope.isLogin = true;
                    $state.transitionTo('login',{});
                  }

                  $scope.goHome = function() {
                    $scope.isLogin = false; //probably not necessary
                    $state.transitionTo('home',{});
                  }

                  $scope.goList = function() {
                    $scope.isLogin = false; //probably not necessary
                    $state.transitionTo('home.list',{});
                  }

                  $scope.goNew = function() {
                    $scope.isLogin = false; //probably not necessary
                    $state.transitionTo('home.new',{});
                  }

                  $scope.goUpdate = function(obj) {
                    $scope.isLogin = false; //probably not necessary
                    $state.transitionTo('home.update',{objectId:obj.id});
                  }

                  $scope.isActive = function(route) {
                      return $state.includes(route);
                  }
                  
                  $scope.logout = function() {
                    Parse.User.logOut();
                    $scope.user = null;
                    $state.transitionTo('login',{});
                  }
                                    
                  $scope.getRecent = function() {
                    $scope.last_help_entry = null;
                    Help.query(function(obj) {
                        // !!!You must always do a $scope.$apply in a parse callback for changes to be 
                        //    noticed by Angular
                        $scope.$apply(function() {
                          $scope.last_help_entry = obj[0];
                        });
                      }, // end anonymouse function
                      {}, // end filterVals
                      {'limit':1,'order_by':'createdAt','order_dir':'desc'} // end options
                    ); // end Help.query()
                  }

                  $scope.isLogin = false;
                  $scope.user = Parse.User.current();

                  $scope.$watch('user',function() {
                    if ($scope.user != null) {
                      if ($scope.last_help_entry == null) {
                        $scope.getRecent();
                      }
                    }
                  });

                  if ($location.path() == '') {
                    if ($scope.user == null) {
                      $state.transitionTo('login',{});
                    } else {
                      $state.transitionTo('home',{});
                    }
                  }

                  


              
              },
              'LoginCtrl':
                  function($scope, $state) {
                $scope.title = 'Inspection Login';
                $scope.hideHeader = true;
                $scope.username = '';
                $scope.password = '';
                $scope.isError = false;
                $scope.errorMsg = '';
                $scope.infoMsg = '';
                
                if ( ($scope.$parent.user != null) && (!$scope.$parent.isActive('home')) ) {
                    $scope.$parent.goHome();
                }

                // if we're running this, we're indeed at a login
                $scope.$parent.isLogin = true;

                $scope.login = function() {
                  
                  Parse.User.logIn($scope.username,$scope.password).then(
                    function(user){

                      $scope.$apply(function() {
                        user.fetch().then( function() {
                          if ($scope.$parent == null) {
                            // not sure why this happens. 
                            return;
                          }
                          $scope.$parent.user = user;
                          $scope.$parent.goHome();                          
                        });
                      });
                      
                    },
                    function(err){
                      $scope.$apply(function() {
                        if (err.code == -1) {
                          $scope.isError = true;
                          $scope.errorMsg = 'Data connection not available. Login must be done in online mode';
                        } else {
                          $scope.isError = true;
                          $scope.errorMsg = 'Invalid username or password';
                          $scope.password = '';
                        }

                        console.log('Error '+JSON.stringify(err));
                      });
                    }
                  );
                }

              },
            'HomeCtrl':
                function($scope,$state,$location) {
                  if (  ($scope.$parent.user == null) && (!$state.is('login')) ) {
                      $scope.$parent.goLogin();
                  }

                  $scope.goList = function() {
                    $state.transitionTo('home.list', {})
                  }
                  $scope.goUpdate = function() {
                    $state.transitionTo('home.update', {})
                    
                  }
                  $scope.goNew = function() {
                    $state.transitionTo('home.new', {})
                  }

                
                },
              'HomeListCtrl':
                function($scope,$state,$location,$routeParams) {
                  

                },
              'HomeNewCtrl':
                function($scope,$state) {
                  
                },
              'HomeNewCtrl':
                function($scope,$state) {
                  
                },
              'HomeUpdateCtrl':
                function($scope,$state,$stateParams) {
                  $scope.object_id = $stateParams.objectId ? $stateParams.objectId : null;
                  
                }
                
            
          } // controllers
    } // exercise
    
   }
);

