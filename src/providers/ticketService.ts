import axios, { AxiosResponse } from 'axios';
import { configService } from './configService';


// Define the TicketService class
class TicketService {
  // Base URL from the config service
  private static readonly baseURL = configService.apiBaseUrl;

  // Method to get ticket information
  static async getTicketInfos(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/tickets/passOrder`, data);
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to buy a ticket
  static async buyTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ticket/buy`, data);
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to share a ticket
  static async shareTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/tickets/giveProperty`, data);
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to set a ticket as lost
  static async setTicketLost(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/setTicketLost`, data);
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to authenticate a ticket
  static async authenticateMyTicket(data: Record<string, any>): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/tickets/authenticateMyTicket`, data);
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to get a user's tickets based on event type ID
  static async getMyTickets(userUuid: string,event_type_id?: number, ): Promise<AxiosResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/users/${userUuid}/tickets?event_type_id=${event_type_id}`
      );
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }
}

export default TicketService;
