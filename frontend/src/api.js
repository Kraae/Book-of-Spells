import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class DnDApi {
    // the token for interactive with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${DnDApi.token}` };
        const params = (method === "get")
            ? data
            : {};
        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    //Registers the new user

    static async register(data) {
        // { username, password, firstName, lastName, email }
        let res = await this.request('auth/register', data, 'post')
        return res.token
    }

    //Login the user if username/password are both correct

    static async login(data) {
        let res = await this.request('auth/token', data, 'post')
        return res.token
    }

    // Get the current user

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`)
        return res.user
    }

    // Edit the current user 

    static async editCurrentUser(username, data) {
        let res = await this.request(`users/${username}`, data, 'patch')
        return res.user
    }

}


export default DnDApi