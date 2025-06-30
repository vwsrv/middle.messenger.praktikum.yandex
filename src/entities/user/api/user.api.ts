import { api } from '@/shared/lib/api';
import { IBaseResponse } from '@/shared/lib/api/models';
import { ISignInRequest, ISignUpRequest } from '@/entities/user/models/interfaces/auth';
import { IUserDataRequest, IUserDataResponse } from '@/entities/user/models/interfaces/user-data';
import { IUserAvatarRequest } from '@/entities/user/models/interfaces/user-avatar';
import { IUserPasswordRequest } from '@/entities/user/models/interfaces/user-password';
import { IFindUserRequest, IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

class UserApi {
  private static readonly AUTH_ENDPOINTS = {
    SIGN_UP: '/auth/signup',
    SIGN_IN: '/auth/signin',
    LOGOUT: '/auth/logout',
    USER: '/auth/user',
  };

  private static readonly PROFILE_ENDPOINTS = {
    PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    PASSWORD: '/user/password',
    SEARCH: '/user/search',
  };

  static async signUp(data: ISignUpRequest): Promise<IBaseResponse> {
    return api.post(UserApi.AUTH_ENDPOINTS.SIGN_UP, { data, withCredentials: true });
  }

  static async signIn(data: ISignInRequest): Promise<IBaseResponse> {
    return api.post(UserApi.AUTH_ENDPOINTS.SIGN_IN, { data, withCredentials: true });
  }

  static async logout(): Promise<IBaseResponse> {
    return api.post(UserApi.AUTH_ENDPOINTS.LOGOUT, { withCredentials: true });
  }

  static async getUser(): Promise<IUserDataResponse> {
    return api.get(UserApi.AUTH_ENDPOINTS.USER, { withCredentials: true });
  }

  static async updateProfile(data: IUserDataRequest): Promise<IBaseResponse> {
    return api.post(UserApi.PROFILE_ENDPOINTS.PROFILE, { data, withCredentials: true });
  }

  static async updateAvatar(data: IUserAvatarRequest): Promise<IBaseResponse> {
    return api.post(UserApi.PROFILE_ENDPOINTS.AVATAR, { data, withCredentials: true });
  }

  static async updatePassword(data: IUserPasswordRequest): Promise<IBaseResponse> {
    return api.post(UserApi.PROFILE_ENDPOINTS.PASSWORD, { data, withCredentials: true });
  }

  static async searchUser(data: IFindUserRequest): Promise<IFindUserResponse> {
    return api.post(UserApi.PROFILE_ENDPOINTS.SEARCH, { data, withCredentials: true });
  }
}

export default UserApi;
