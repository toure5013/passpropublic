export type PromoterStatsType = {
    role: string;
    ticket_goal: number;
    ticket_sold: number;
    event_id: number;
    total_amount: number;
    ticket_price_info: {
      ticket_price_name: string;
      ticket_price_price: number;
      ticket_price_nb_activated: number;
    }[];
    details: any[]; // If details have a specific structure, define it instead of `any`.
    event: {
      id: number;
      event_name: string;
      event_enterprise_name: string;
      event_type_id: number;
      description: string | null;
      event_ticket_img: string | null;
      event_date: string;
      event_cover: string | null;
      event_hour: string;
      event_place_id: number;
      event_localization: string;
      event_commune: string;
      event_room: string;
      event_room_capacity: string;
      event_longitude: string | null;
      event_latitude: string | null;
      payment_online: string;
      payment_on_delivery: string;
      ticket_physic: string;
      ticket_virtual: string;
      observation: string | null;
      recommandation: string | null;
      status: number;
      created_at: string;
      updated_at: string;
      ticket_prices: {
        id: number;
        event_id: number;
        price_label: string;
        price: number;
      }[];
    };
  };
  