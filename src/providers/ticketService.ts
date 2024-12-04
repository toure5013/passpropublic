import axios, { AxiosResponse } from "axios";
import { configService } from "./configService";

// Define the TicketService class
class TicketService {
  // Base URL from the config service
  private static readonly baseURL = configService.apiBaseUrl;

  // Method to get ticket information
  static async getTicketInfos(
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/tickets/passOrder`,
        data
      );
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
      const response = await axios.post(
        `${this.baseURL}/api/tickets/giveProperty`,
        data
      );
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to set a ticket as lost
  static async setTicketLost(
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/setTicketLost`,
        data
      );
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to authenticate a ticket
  static async authenticateMyTicket(
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/tickets/authenticateMyTicket`,
        data
      );
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to get a user's tickets based on event type ID
  static async getMyTickets(
    userUuid: string,
    event_type_id?: number
  ): Promise<AxiosResponse> {
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

  static async generateTicket({
    event_id,
    tel,
    event_ticket_price_id,
    quantity,
    user_uuid,
  }: {
    event_id: number;
    tel: string;
    event_ticket_price_id: number;
    quantity: number;
    user_uuid: string;
  }): Promise<AxiosResponse> {
    try {
      const payload = {
        event_id,
        user_uuid,
        quantity,
        tel,
        event_ticket_price_id,
      };

      const response = await axios.post(
        `${this.baseURL}/generate/ticket`,
        payload
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error generating ticket:",
        error?.response?.data || error.message
      );
      throw error.response || error; // Re-throw for the caller to handle
    }
  }


  /**
   * Update user's cart
   * @param tel User's phone number
   * @param cartData Cart data to update
   */
  static async updateUserCart(
    tel: string,
    cartData: Record<string, any>
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.put(
        `${this.baseURL}/api/users/cart/${tel}`,
        cartData
      );
      return response;
    } catch (error: any) {
      console.error("Error updating cart: ", error?.response?.data);
      return error.response;
    }
  }

  /**
   * Delete a specific cart item
   * @param tel User's phone number
   * @param id Cart ID
   */
  static async deleteCartItem(
    tel: string,
    id: number
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.delete(
        `${this.baseURL}/api/users/cart/${tel}/${id}`
      );
      return response;
    } catch (error: any) {
      console.error("Error deleting cart item: ", error?.response?.data);
      return error.response;
    }
  }

  /**
   * Get all carts for a user by phone number
   * @param tel User's phone number
   */
  static async getUserCarts(tel: string): Promise<AxiosResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/users/cart/${tel}`
      );
      return response;
    } catch (error: any) {
      console.error("Error fetching user carts: ", error?.response?.data);
      return error.response;
    }
  }
}

export default TicketService;
