module App.Services {

    interface IUser {
        isAuthenticated: boolean;
    }

    class User implements IUser {
        isAuthenticated: boolean;
    }

    export interface IAuthService {
        user: IUser;
        login(email: string, password: string): ng.IPromise<boolean>;
        logout(): ng.IPromise<boolean>;
        redirectToLogin(): void;
    }

    interface ILoginStatus {
        status: boolean;
    }

    class LoginStatus implements ILoginStatus {
        status: boolean;
    }

    class AuthService implements IAuthService {
        private serviceBase: string;
        user: User;

        constructor(private $http: ng.IHttpService,
            private $routeScope: ng.IRootScopeService) {
            this.serviceBase = '/api/dataservice/';
            this.user = new User();
        }


        login(email: string, password: string): ng.IPromise<boolean> {
            return this.$http.post(this.serviceBase + 'login', { userLogin: { username: email, password: password } })
                .then((response: { data: { status: boolean } }): boolean => {
                    this.changeAuth(response.data.status);
                    return response.data.status;
                });
        }

        logout(): ng.IPromise<boolean> {
            return this.$http.post(this.serviceBase + 'logout', null)
                .then((response: { data: { status: boolean } }): boolean => {
                    this.changeAuth(!response.data.status);
                    return response.data.status;
                });
        }

        redirectToLogin(): void {
            this.$routeScope.$broadcast('redirectToLogin', null);
        }

        private changeAuth(loggedIn: boolean): void {
            this.user.isAuthenticated = loggedIn;
            this.$routeScope.$broadcast('loginStatusChanged', loggedIn);
        }

    }

    factory.$inject = ['$http', '$rootScope'];
    function factory($http: ng.IHttpService,
        $routeScope: ng.IRootScopeService): IAuthService {
        return new AuthService($http, $routeScope);
    }

    angular.module('customersApp')
        .factory('authService', factory);
}