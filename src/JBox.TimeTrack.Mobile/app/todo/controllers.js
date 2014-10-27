'use strict';

app.controller('ToDoCtrl', function ($scope, $state, $ionicNavBarDelegate, $ionicLoading, ToDoService) {

    $ionicNavBarDelegate.showBackButton(false);

    $scope.todos = [];
    $scope.todo = null;

    $scope.refreshList = refreshList;
    $scope.addTodo = addTodo;
    $scope.changeComplete = changeComplete;
    $scope.deleteToDo = deleteToDo;

    init();

    function init() {
        newToDo();
        refreshList();
    };

    function refreshList() {

        $ionicLoading.show({ template: 'Loading data...' });

        ToDoService.getAll()
            .success(function (response) {
                $scope.todos = response;
            })
            .error(function (error) {
                $scope.errorMsg = error.Message;
            })
            .finally(function () {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    function addTodo() {
        var todo = $scope.todo;

        ToDoService.addToDo(todo)
                    .success(function (response) {

                        $scope.todos.push({ ToDoID: response.ToDoID, Title: response.Title, IsComplete: response.IsComplete });

                        newToDo();
                        $ionicLoading.show({ template: 'ToDo saved.', noBackdrop: true, duration: 800 });
                    })
                    .error(function (error) {
                        $scope.errorMsg = error.Message;
                    });
    }

    function changeComplete(todo) {
        todo.IsComplete = !todo.IsComplete;

        ToDoService.updateToDo(todo)
            .success(function (response) {

            })
            .error(function (error) {
                $scope.errorMsg = error.Message;
            });

    };

    function deleteToDo(todo) {

        $ionicLoading.show({ template: 'Deleting ...' });
        $scope.errorMsg = '';

        ToDoService.deleteToDo(todo.ToDoID)
            .success(function (response) {
                $ionicLoading.hide();
                $scope.refreshList();
            })
            .error(function (error) {
                $scope.errorMsg3 = error.Message;
                $ionicLoading.hide();
            });
    };

    function newToDo() {
        $scope.todo = { ToDoID: 0, Title: '', IsComplete: false };
    };

})



