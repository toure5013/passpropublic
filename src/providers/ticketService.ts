import axios, { AxiosResponse } from "axios";

class TicketService {
  private static readonly baseURL = "https://your-base-url.com"; // Remplacez par votre URL

  // Obtenir des informations sur un ticket
  static async getTicketInfos(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/tickets/passOrder`,
        data
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Acheter un ticket
  static async buyTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/ticket/buy`,
        data
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Partager un ticket
  static async shareTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/tickets/giveProperty`,
        data
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Déclarer un ticket perdu
  static async setTicketLost(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/setTicketLost`,
        data
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Authentifier un ticket
  static async authenticateMyTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/tickets/authenticateMyTicket`,
        data
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Récupérer les tickets d'un utilisateur
  static async getMyTickets(
    userUuid: string,
    eventTypeId?: number
  ): Promise<AxiosResponse> {
    const url = `${this.baseURL}/api/users/${userUuid}/tickets${
      eventTypeId ? `?event_type_id=${eventTypeId}` : ""
    }`;
    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Obtenir les types d'événements avec leurs premiers événements
  static async getEventTypesWithFirstEvents(): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/eventTypeWithBaseEvent`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Gestion centralisée des erreurs
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

export default TicketService;
