  extend(app,
   {exercise:{ 
      controllers : { 'MainCtrl':
                function($scope,$state,$location) {

                  // initialize parse with the hardcoded keys
                  app.database.init.default_init();

                  $scope.goLogin = function() {
                    $scope.isLogin = true;
                    $location.path('/login');
                    //$state.transitionTo('login',{});
                  }

                  $scope.goHome = function() {
                    $scope.isLogin = false; //probably not necessary
                    $location.path('/home');
                    //$state.transitionTo('home',{});
                  }

                  $scope.isActive = function(route) {
                      return $state.includes(route);
                  }
                  
                  $scope.logout = function() {
                    Parse.User.logOut();
                    $scope.user == null;
                    $state.transitionTo('login',{});
                    //$location.path('/');
                  }
                                    
                 
                  $scope.isLogin = false;

                  if (  ($scope.user == null) && (!$state.is('login')) ) {
                      $scope.goLogin();
                  } 
              
              },
              'LoginCtrl':
                  function($scope, $state,$routeParams, $location, $http) {
                $scope.title = 'Inspection Login';
                $scope.hideHeader = true;
                $scope.username = '';
                $scope.password = '';
                $scope.isError = false;
                $scope.errorMsg = '';
                $scope.infoMsg = '';
                
                // if we're running this, we're indeed at a login
                $scope.$parent.isLogin = true;

                $scope.login = function() {
                  
                  Parse.User.logIn($scope.username,$scope.password).then(
                    function(user){
                      $scope.$apply(function() {
                        user.fetch().then( function() {
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
                function($scope,$state,$location,$routeParams) {
                  $scope.goList = function() {
                    $state.transitionTo('home.list', {})
                  }
                  $scope.goUpdate = function() {
                    $state.transitionTo('home.update', {})
                    
                  }
                  $scope.goAssets = function() {
                    $state.transitionTo('home.assets', {})
                  }

                  if ($state.is('home')) {
                    $scope.goCompleted();
                  }
                },
              'HomeListCtrl':
                function($scope,$state,$location,$routeParams) {
                  

                },
              'HomeNewCtrl':
                function($scope,$state,ReportTemplate) {
                  
                },
              'HomeNewCtrl':
                function($scope,$state,ReportTemplate) {
                  
                }
            
          } // controllers
    } // exercise
    
   }
);

