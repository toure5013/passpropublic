import axios, { AxiosResponse } from "axios";
import { configService } from "./config";

class PaiementService {
  private static readonly baseURL = configService.apiBaseUrl; // Remplacez par votre URL
 // Remplacez par votre URL

  // Méthode pour effectuer un cashout
  static async cashout(
    userUuid: string,
    number: string,
    platform: string,
    amount: number
  ): Promise<any> {
    const formData = new FormData();
    formData.append("user_uuid", userUuid);
    formData.append("number_to_debit", number);
    formData.append("platform", platform);
    formData.append("amount", amount.toString());

    console.log({
      user_uuid: userUuid,
      number_to_debit: number,
      platform: platform,
      amount: amount,
    });

    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/paiement/init`,
        formData
      );
      console.log("Cashout Response :::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Méthode pour vérifier une transaction
  static async checkTransaction(
    partnerTransactionId: string
  ): Promise<any> {
    console.log("Checking Transaction :::", {
      partnerTransactionId: partnerTransactionId,
    });

    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/paiement/checkTransactionStatus/${partnerTransactionId}`
      );
      console.log("Transaction Status Response :::", response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Méthode pour obtenir les historiques
  static async getHistoriques(userUuid: string): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/paiement/latestTransaction/${userUuid}`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Méthode pour obtenir les historiques des bonus
  static async getBonusHistoriques(userUuid: string): Promise<AxiosResponse> {
    console.log(
      `Fetching Bonus History ::: ${this.baseURL}/api/gifts/history/${userUuid}`
    );

    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/gifts/history/${userUuid}`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Gestion des erreurs
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response :::", error.response.data);
      throw error.response;
    } else {
      console.error("Unknown Error :::", error);
      throw new Error("An unknown error occurred.");
    }
  }
}

export default PaiementService;
