'use strict';

app.service("TimeEntryService", function ($http, AppSettings) {

    var urlBase = AppSettings.UrlBase + 'api/TimeEntry';


    this.getCustomers = function () {
        return $http.get(urlBase + '/Customers');
    }

    this.getTasks = function () {
        return $http.get(urlBase + '/Tasks');
    }

    this.getTimeEntries = function () {
        return $http.get(urlBase + '');
    }

    this.getTimeEntry = function (id) {
        return $http.get(urlBase + '/' + id);
    }

    this.addTimeEntry = function (expense) {
        return $http.post(urlBase, expense);
    }

    this.updateTimeEntry = function (expense) {
        return $http.put(urlBase, expense);
    }

    this.deleteTimeEntry = function (id) {
        return $http.delete(urlBase + '/' + id);
    }

    
});