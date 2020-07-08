
class AuthStore {
    static TOKEN_NAME = 'token';

    static isLoggedIn() {
        return localStorage.getItem(this.TOKEN_NAME) !== null;
    }

    static saveToken(token) {
        localStorage.setItem(this.TOKEN_NAME, token);
    }

    static removeToken() {
        localStorage.removeItem(this.TOKEN_NAME);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_NAME)
    }
	static getBearer(){
		return "Bearer "+localStorage.getItem(this.TOKEN_NAME)
	}
}

export default new AuthStore;