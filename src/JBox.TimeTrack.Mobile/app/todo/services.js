'use strict';

app.service("ToDoService", function ($http, AppSettings) {

    var urlBase = AppSettings.UrlBase + 'api/ToDo';

    this.getAll = function () {
        return $http.get(urlBase + '');
    }

    this.getToDo = function (id) {
        return $http.get(urlBase + '/' + id);
    }

    this.addToDo = function (todo) {
        return $http.post(urlBase, todo);
    }

    this.updateToDo = function (todo) {
        return $http.put(urlBase, todo);
    }

    this.deleteToDo = function (id) {
        return $http.delete(urlBase + '/' + id);
    }
    
});