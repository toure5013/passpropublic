import axios, { AxiosResponse, AxiosError } from "axios";
import { configService } from "./configService";

// Définir une interface pour les réponses courantes si nécessaire
interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

class UserService {
  private static readonly baseURL = configService.apiBaseUrl; // Remplacez par votre URL

  static async login(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users/signIn`,
        data
      );
      console.log("Data Login ::::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteAccount(data: Record<string, any>, userUuid: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users/deleteAccount/${userUuid}`,
        data
      );
      console.log("Data deleteAccount ::::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async register(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users`,
        data
      );
      console.log("Data Register ::::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateInfos(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateUserInfos(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.patch(
        `${this.baseURL}/api/users`,
        data
      );
      console.log("Update User Infos ::::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateSecretCode(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users/updateSecret`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async searchUserByPhoneNumber(phoneNumber: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${this.baseURL}/api/users/info/${phoneNumber}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getCommunes(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${this.baseURL}/api/district`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async sendOtp(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users/resendOtp`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async checkOTP(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/users/checkOtp`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async activate(
    data: Record<string, any>,
    userInfos?: Record<string, any>
  ): Promise<ApiResponse> {
    const userUuid = localStorage.getItem("user_uuid"); // Stockage simulé
    console.log("UUID", userUuid);

    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${this.baseURL}/api/checkTicket/activate`,
        { data, user_uuid: userUuid, user: userInfos }
      );
      console.log("Activation response ::::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getUserInfos(phoneNumber: string): Promise<void> {
    const response = await this.searchUserByPhoneNumber(phoneNumber);

    if (response.success) {
      // Simulation de mise à jour de variables globales
      console.log("User Info updated successfully.");
    }
  }

  private static handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error ::::", error.response.data);
      return error.response.data;
    } else {
      console.error("Unknown Error ::::", error);
      return { success: false, message: "An unknown error occurred." };
    }
  }
}

export default UserService;
