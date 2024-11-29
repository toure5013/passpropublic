import axios, { AxiosResponse, AxiosError } from "axios";
import { configService } from "./configService";

class EventService {
  private static readonly baseURL = configService.apiBaseUrl; // Remplacez par votre URL
  // Remplacez par votre URL

  static async getEventByTypeId(
    event_type_id?: number
  ): Promise<AxiosResponse> {
    try {
      const url = event_type_id
        ? `${this.baseURL}/api/events?event_type_id=${event_type_id}`
        : `${this.baseURL}/api/events`;
      console.log("Event Type ID ::::", event_type_id);

      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getEventTypes(): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/eventTypes`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getPubs(): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/pubs`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async searchEvents(key: string): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/events?search=${key}`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getSellers(eventId: string): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/api/events/${eventId}/sellers`
      );
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError(error: unknown): AxiosResponse {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error ::::", error.response.data);
      throw error.response;
    } else {
      console.error("Unknown Error ::::", error);
      throw new Error("An unknown error occurred.");
    }
  }

  // Method to get event types along with the first event
  static async getEventTypesWithFirstEvents(): Promise<AxiosResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/eventTypeWithBaseEvent`
      );
      return response;
    } catch (error: any) {
      console.error("Error: ", error?.response?.data);
      return error.response;
    }
  }

  // Method to get event types along with the first event
  static async getAllEvents(): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseURL}/api/events`);
      return response;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      throw error.response;
    }
  }
}

export default EventService;
