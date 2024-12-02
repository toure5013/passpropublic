import axios, { AxiosResponse } from 'axios';
import { configService } from '../configService';

class PromoterEventService {
  private static readonly baseURL = configService.apiBaseUrl;

  static async getEvents(): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseURL}/api/events`);
      return response;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      throw error.response;
    }
  }

  static async getStatEvents(userUuid:string,): Promise<AxiosResponse> {
    const url = `${this.baseURL}/api/operator/${userUuid}/statistic`;

    console.log(url);
    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      throw error.response;
    }
  }

  static async getStatEventsByPDV(userUuid:string, eventId: string | number): Promise<AxiosResponse> {
    const url = `${this.baseURL}/api/operator/${userUuid}/pdv_statistic/${eventId}`;

    console.log('UUID :::::', userUuid);
    console.log('EventId :::::', eventId);

    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error: any) {
      console.error('Error ----', error.response?.data);
      throw error.response;
    }
  }
}

export default PromoterEventService;
