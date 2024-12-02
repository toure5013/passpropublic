import axios, { AxiosResponse } from 'axios';
import { configService } from '../configService';

class promoterUserService {
  private static readonly baseURL = configService.apiBaseUrl;

  static async login(data: Record<string, any>): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/sign-in`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      return error.response?.data;
    }
  }

  static async searchUserByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/users/info/${phoneNumber}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      return error.response?.data;
    }
  }

  static async activate(userUuid:string, data: Record<string, any>, userInfos?: any): Promise<any> {
    try {
      if (!userUuid) {
        throw new Error('User UUID not found');
      }

      const formData = {
        data,
        user_uuid: userUuid,
        user: userInfos,
      };

      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/checkTicket/activate`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Activation error ----', error.response?.data);
      return error.response?.data;
    }
  }
}

export default promoterUserService;
