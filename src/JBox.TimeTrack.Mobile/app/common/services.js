'use strict';

app.provider('commonConfig', function () {
    this.config = {
        // These are the properties we need to set
        //controllerActivateSuccessEvent: '',
        //spinnerToggleEvent: ''
    };

    this.$get = function () {
        return {
            config: this.config
        };
    };
});

app.factory('common', function ($q, $rootScope, commonConfig) {
    var throttles = {};

    var service = {
        // generic
        activateController: activateController,
    };

    return service;

    function activateController(promises, controllerId) {
        return $q.all(promises).then(function (eventArgs) {
            var data = { controllerId: controllerId };
            $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
        });
    }

    function $broadcast() {
        return $rootScope.$broadcast.apply($rootScope, arguments);
    }
});

app.factory('authService', function ($http, $window, AppSettings) {

    var urlBase = AppSettings.UrlBase + 'token';
    var authService = {};

    authService.AuthData = {
        isAuth: false,
        userName: '',
        token: ''
    };

    authService.login = function (loginData) {

        var data = 'grant_type=password&username=' + loginData.username + '&password=' + loginData.password;

        return $http.post(urlBase, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .success(function (data, status, headers, config) {

                        authService.AuthData.isAuth = true;
                        authService.AuthData.userName = loginData.username;
                        authService.AuthData.token = data.access_token;

                        $window.localStorage.setItem('AuthData', JSON.stringify(authService.AuthData));

                    })
                    .error(function (data, status, headers, config) {
                        
                        authService.AuthData.isAuth = false;
                        authService.AuthData.userName = loginData.username;
                        authService.AuthData.token = null;

                        $window.localStorage.setItem('AuthData', JSON.stringify(authService.AuthData));

                    });

    };

    authService.logout = function () {
        
        authService.AuthData.isAuth = false;
        authService.AuthData.userName = '';
        authService.AuthData.token = null;

        $window.localStorage.removeItem('AuthData');

    };

    authService.LoadAuthData = function () {

        var authData = JSON.parse($window.localStorage.getItem('AuthData'));
        if (authData) {
            authService.AuthData.isAuth = authData.isAuth;
            authService.AuthData.userName = authData.userName;
            authService.AuthData.token = authData.token;
        }
        else
        {
            authService.AuthData.isAuth = false;
            authService.AuthData.userName = '';
            authService.AuthData.token = null;

            $window.localStorage.setItem('AuthData', JSON.stringify(authService.AuthData));
        }

    };

    return authService;
});

app.factory('authInterceptor', function ($window, $q, $injector) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = JSON.parse($window.localStorage.getItem('AuthData'));
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }
        else {
           // $injector.get('$state').transitionTo('app.login');
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            $injector.get('authService').AuthData.isAuth = false;
            $injector.get('$state').transitionTo('app.login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
});

