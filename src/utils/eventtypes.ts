export type MyCustomEventTicketPrice = {
    id: number;
    event_id: number;
    price_label: string;
    price: number;
  };
  
export type MyCustomEventType = {
    id?: number;
    name?: string;
};
  
export type MyCustomEventPlace = {
    id?: number;
    district_id?: number;
    place?: string;
    description?: string | null;
    longitude?: string;
    latitude?: string;
    map_link?: string;
    created_at?: string;
    updated_at?: string;
  };
  
export type MyCustomEvent = {
    id: number;
    event_name: string;
    event_enterprise_name?: string;
    event_type_id?: number;
    description?: string | null;
    event_ticket_img?: string;
    event_date: string;
    event_cover?: string;
    event_hour?: string;
    event_place_id?: number;
    event_localization: string;
    event_commune?: string;
    event_room?: string;
    event_room_capacity: string;
    event_longitude?: string;
    event_latitude?: string;
    payment_online?: string;
    payment_on_delivery?: string;
    ticket_physic?: string;
    ticket_virtual?: string;
    observation?: string | null;
    recommandation?: string | null;
    status?: number;
    created_at?: string;
    updated_at?: string;
    ticket_prices: MyCustomEventTicketPrice[];
    event_type?: MyCustomEventType;
    event_place?: MyCustomEventPlace;
  };
  