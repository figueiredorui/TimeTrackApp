'use strict';

//-------------------------------------------------------------
//     CONSTANTS
//-------------------------------------------------------------
app.constant('AppSettings', {
    UrlBase: 'http://timetrack.jboxsolutions.com/',
    //UrlBase: 'http://localhost/timetrack/',
});

//-------------------------------------------------------------
//     ROUTES
//-------------------------------------------------------------
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "app/common/views/menu.html",
          controller: 'AppCtrl'
      })
      .state('app.login', {
          url: "/login",
          views: {
              'menuContent': {
                  templateUrl: "app/home/views/login2.html",
                  controller: 'LoginCtrl'
              }
          }
      })
      .state('app.home', {
          url: "/home",
          views: {
              'menuContent': {
                  templateUrl: "app/home/views/home.html",
                  controller: 'AppCtrl'
              }
          }
      })
      .state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "app/home/views/about.html",
                    controller: 'AppCtrl'
                }
            }
      })
      .state('app.timeentrylist', {
          url: "/timeentrylist",
          views: {
              'menuContent': {
                  templateUrl: "app/timeentry/views/timeentryList.html",
                  controller: 'TimeEntryListCtrl'
              }
          }
      })
      .state('app.timeentryedit', {
          url: "/timeentrylist/:id",
          views: {
              'menuContent': {
                  templateUrl: "app/timeentry/views/timeentryEdit.html",
                  controller: 'TimeEntryCtrl'
              }
          }
      })
      .state('app.timeentryNew', {
          url: "/timeentryNew",
          views: {
              'menuContent': {
                  templateUrl: "app/timeentry/views/timeentryNew.html",
                  controller: 'TimeEntryCtrl'
              }
          }
      })
      .state('app.todo', {
        url: "/todo",
        views: {
            'menuContent': {
                templateUrl: "app/todo/views/todo.html",
                controller: 'ToDoCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});

//-------------------------------------------------------------
//     CONFIG
//-------------------------------------------------------------
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.defaults.cache = false;
});

//-------------------------------------------------------------
//     RUN
//-------------------------------------------------------------
app.run(function ($rootScope, $state, authService) {

    authService.LoadAuthData();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name != 'app.login' && authService.AuthData != null && authService.AuthData.isAuth == false) {
            event.preventDefault();
            $state.go('app.login');
        }

        if (toState.name == 'app.login' && authService.AuthData != null && authService.AuthData.isAuth == true) {
            event.preventDefault();
            $state.go('app.home');
        }
    });

});

//-------------------------------------------------------------
//     DIRECTIVES
//-------------------------------------------------------------
app.directive('onlyDecimal', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});