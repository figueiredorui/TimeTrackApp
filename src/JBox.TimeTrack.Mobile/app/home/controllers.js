'use strict';

app.controller('AppCtrl', function ($scope, $state, $ionicNavBarDelegate, authService) {

    $ionicNavBarDelegate.showBackButton(false);

    $scope.addTimeEntry = addTimeEntry;
    $scope.logoff = logoff;

    init();

    function init() {
    };

    function addTimeEntry() {
        $state.go('app.timeentryNew');
    };

    function logoff() {
        authService.logout();
        $state.go('app.login');
    };
})

app.controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $ionicNavBarDelegate, authService) {

    $ionicNavBarDelegate.showBackButton(false);

    $scope.loginData = { username: '', password: '' };
    $scope.loginData.username = authService.AuthData.userName;
    $scope.errorMsg = '';

    $scope.doLogin = doLogin;

    init();

    function init() {
    };

    function doLogin() {
        var loginData = $scope.loginData;

        $ionicLoading.show({
            template: 'Login...'
        });

        authService.login(loginData)
                    .success(function (data, status) {
                        $ionicLoading.hide();
                        $scope.errorMsg = '';
                        $state.transitionTo('app.home', { location: 'replace' });
                    })
                    .error(function (data, status) {
                        $ionicLoading.hide();
                        $scope.errorMsg = data.error_description;
                        $ionicPopup.alert({ title: 'Login', template: data.error_description });
                    });

    };

})


