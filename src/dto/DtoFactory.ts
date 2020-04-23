import { AuthRequest } from "./api/AuthRequest";
import { AuthResponse } from "./api/AuthResponse";
import { FriendsCheckRequest } from "./api/FriendsCheckRequest";
import { FriendsCheckResponse } from "./api/FriendsCheckResponse";
import { CheckFriendsRequest } from "./lj/CheckFriendsRequest";
import { CheckFriendsResponse } from "./lj/CheckFriendsResponse";
import { BaseRequest } from "./lj/IBaseRequest";
import { LoginRequest } from "./lj/LoginRequest";
import { LoginResponse } from "./lj/LoginResponse";

export class DtoFactory {
    public static loginRequest(baseRequest: BaseRequest, authRequest: AuthRequest): LoginRequest {
        return {
            ...baseRequest,
            username: authRequest.username,
            getmoods: (authRequest.last_mood_id || null),
            getpickws: (authRequest.get_picture_keywords ? "1" : "0"),
            getpickwurls: (authRequest.get_picture_urls ? "1" : "0")
        };
    }
    
    public static checkFriendsRequest(baseRequest: BaseRequest, friendsCheckRequest: FriendsCheckRequest): CheckFriendsRequest {
        return {
            ...baseRequest,
            lastupdate: (friendsCheckRequest.last_update || ""),
            mask: (friendsCheckRequest.mask || 0)
        };
    }

    public static friendsCheckResponse(checkFriendsResponse: CheckFriendsResponse): FriendsCheckResponse {
        return checkFriendsResponse;
    }

    public static authResponse(loginResponse: LoginResponse): AuthResponse {
        const response: AuthResponse = {
            jwt: "",
            journals: loginResponse.usejournals
        };
        if (loginResponse.pickws) {
            response.picture_keywords = loginResponse.pickws;
        }
        if (loginResponse.defaultpicurl) {
            response.default_picture_url = loginResponse.defaultpicurl;
            response.picture_urls = loginResponse.pickwurls;
        }
        if (loginResponse.friendgroups && loginResponse.friendgroups.length > 0) {
            response.friend_groups = loginResponse.friendgroups.map((fg) => {
                return {
                    id: fg.id,
                    name: fg.name,
                    sortorder: fg.sortorder,
                    public: fg.public ? true : false
                };
            });
        }
        if (loginResponse.moods) {
            response.moods = loginResponse.moods;
        }
        return response;
    }
}
