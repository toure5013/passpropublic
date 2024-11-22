import axios, { AxiosResponse, AxiosError } from "axios";

class OrderService {
  private static readonly baseURL = "https://your-base-url.com"; // Remplacez par votre URL

  // Création d'une commande
  static async createOrder(data: Record<string, any>): Promise<AxiosResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/tickets/passOrder`,
        formData
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Récupération des commandes d'un utilisateur
  static async getOrders(userUuid: string): Promise<AxiosResponse> {
    try {
      const url = `${this.baseURL}/api/tickets/getOrder/${userUuid}`;
      console.log("Request URL :::", url);

      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Gestion des erreurs
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error ::::", error.response.data);
      throw error.response;
    } else {
      console.error("Unknown Error ::::", error);
      throw new Error("An unknown error occurred.");
    }
  }
}

export default OrderService;
