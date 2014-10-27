'use strict';

app.controller('TimeEntryListCtrl', function ($scope, $state, $ionicLoading, $ionicPopover, TimeEntryService) {
    $scope.timeentrylist = [];
    $scope.searchKey = '';

    $scope.refreshList = refreshList;
    $scope.addTimeEntry = addTimeEntry;
    $scope.clearSearch = clearSearch;

    init();

    function init()
    {
        refreshList();
    }

    function refreshList() {

        $ionicLoading.show({ template: 'Loading data...' });

        TimeEntryService.getTimeEntries()
            .success(function (response) {
                $scope.timeentrylist = response;
                $ionicLoading.hide();
            })
            .error(function (error) {
                $scope.errorMsg = error.Message;
                $ionicLoading.hide();
            })
            .finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    function addTimeEntry() {
        $state.go('app.timeentryNew');
    }

    function clearSearch() {
        $scope.searchKey = '';
    }

    $ionicPopover.fromTemplateUrl('templates/timeEntryList-popover.html', { scope: $scope })
                    .then(function (popover) {
                        $scope.popover = popover;
                    });

})

app.controller('TimeEntryCtrl', function ($scope, $state, $stateParams, $ionicLoading, $ionicPopover, common, TimeEntryService) {

    $scope.TimeEntry = null;

    $scope.saveTimeEntry = saveTimeEntry;
    $scope.deleteTimeEntry = deleteTimeEntry;

    $scope.errorMsg = '';

    init();

    function init() {

        $ionicLoading.show({ template: 'Loading...' });

        var id = $stateParams.id;

        if (id == null) {
            newTimeEntry();
        }
        else {
            getTimeEntry(id);
            initToolbarMenu();
        }

        var promises = [loadCustomers(), loadTasks()];
        common.activateController(promises, 'TimeEntryCtrl')
            .then(function () { $ionicLoading.hide(); });
    }

    function getTimeEntry(id) {


        TimeEntryService.getTimeEntry(id)
                    .success(function (response) {
                        $scope.TimeEntry = response;
                        $scope.TimeEntry.Date = dateToString2(response.Date);
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                    });
    }

    function newTimeEntry() {
        $scope.TimeEntry = {
            TimeEntryID: 0,
            Date: dateToString(new Date()),
            CustomerName: '',
            EmployeeName: '',
            TaskDescription: '',
            Hours: '',
        };
    }

    function loadCustomers() {

        TimeEntryService.getCustomers()
                    .success(function (response) {
                        $scope.Customers = response;
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                    });
    }

    function loadTasks() {

        TimeEntryService.getTasks()
                    .success(function (response) {
                        $scope.Tasks = response;
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                    });
    }

    function saveTimeEntry(isValid) {

        isValid = true;
        // check to make sure the form is completely valid
        if (isValid) {

            $ionicLoading.show({ template: 'Saving ...' });
            $scope.errorMsg = '';
            var timeEntry = $scope.TimeEntry;

            if (timeEntry.TimeEntryID == 0) {

                TimeEntryService.addTimeEntry(timeEntry)
                    .success(function (response) {
                        newTimeEntry();
                        $ionicLoading.hide();
                        $ionicLoading.show({ template: 'Entry saved.', noBackdrop: true, duration: 800 });
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                        $ionicLoading.hide();
                    });
            }
            else {

                TimeEntryService.updateTimeEntry(timeEntry)
                    .success(function (response) {
                        $ionicLoading.hide();
                        $state.go('app.timeentrylist')
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                        $ionicLoading.hide();
                    });
            }
        }
    }

    function deleteTimeEntry() {

        $ionicLoading.show({ template: 'Deleting ...' });
        $scope.errorMsg = '';
        var timeEntry = $scope.TimeEntry;


        TimeEntryService.deleteTimeEntry(timeEntry.TimeEntryID)
            .success(function (response) {
                $ionicLoading.hide();
                $scope.popover.hide();
                $state.go('app.timeentrylist')
            })
            .error(function (error) {
                $scope.errorMsg = error.Message;
                $ionicLoading.hide();
                $scope.popover.hide();
            });
    };

    function initToolbarMenu() {

        $ionicPopover.fromTemplateUrl('templates/timeEntry-popover.html', { scope: $scope })
                        .then(function (popover) {
                            $scope.popover = popover;
                        });
    }

});

function dateToString(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0! 
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    //var dateStr = dd + '/' + mm + '/' + yyyy;
    var dateStr = yyyy + '-' + mm + '-' + dd;

    return dateStr;
}

function dateToString2(dateStr) {

    var from = dateStr.split("T");
    return from[0];
}
