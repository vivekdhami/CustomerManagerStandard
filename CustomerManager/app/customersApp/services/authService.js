var App;
(function (App) {
    var Services;
    (function (Services) {
        var User = (function () {
            function User() {
            }
            return User;
        })();
        var LoginStatus = (function () {
            function LoginStatus() {
            }
            return LoginStatus;
        })();
        var AuthService = (function () {
            function AuthService($http, $routeScope) {
                this.$http = $http;
                this.$routeScope = $routeScope;
                this.serviceBase = '/api/dataservice/';
                this.user = new User();
            }
            AuthService.prototype.login = function (email, password) {
                var _this = this;
                return this.$http.post(this.serviceBase + 'login', { userLogin: { username: email, password: password } })
                    .then(function (response) {
                    _this.changeAuth(response.data.status);
                    return response.data.status;
                });
            };
            AuthService.prototype.logout = function () {
                var _this = this;
                return this.$http.post(this.serviceBase + 'logout', null)
                    .then(function (response) {
                    _this.changeAuth(!response.data.status);
                    return response.data.status;
                });
            };
            AuthService.prototype.redirectToLogin = function () {
                this.$routeScope.$broadcast('redirectToLogin', null);
            };
            AuthService.prototype.changeAuth = function (loggedIn) {
                this.user.isAuthenticated = loggedIn;
                this.$routeScope.$broadcast('loginStatusChanged', loggedIn);
            };
            return AuthService;
        })();
        factory.$inject = ['$http', '$rootScope'];
        function factory($http, $routeScope) {
            return new AuthService($http, $routeScope);
        }
        angular.module('customersApp')
            .factory('authService', factory);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
