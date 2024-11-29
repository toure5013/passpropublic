export type MyCustomTicket = {
    id: number;
    event_id: number;
    event_ticket_price_id: number;
    user_public_id: number;
    ticket_serial: {
      ct: string;
      iv: string;
      s: string;
    };
    state: string;
    datation: string;
    nom: string;
    prenoms: string;
    tel: string;
    verification_code: string | null;
    activated_by: {
      id: number;
      uuid: string;
      name: string;
      surname: string;
      login: string;
      tel: string;
      mail: string | null;
      type: string;
      auto_filled: string;
      status: number;
      account_removed: number;
      removed_at: string | null;
      created_at: string;
      updated_at: string;
    };
    validated_by: string | null;
    activation_date: string;
    validation_date: string | null;
    count_validation: number;
    created_at: string;
    updated_at: string;
    event: {
      id: number;
      event_name: string;
      event_enterprise_name: string;
      event_type_id: number;
      description: string | null;
      event_ticket_img: string;
      event_date: string;
      event_cover: string;
      event_hour: string;
      event_place_id: number;
      event_localization: string;
      event_commune: string;
      event_room: string;
      event_room_capacity: string;
      event_longitude: string;
      event_latitude: string;
      payment_online: string;
      payment_on_delivery: string;
      ticket_physic: string;
      ticket_virtual: string;
      observation: string | null;
      recommandation: string | null;
      status: number;
      created_at: string;
      updated_at: string;
      event_type: {
        id: number;
        name: string;
      };
    };
    event_ticket_price: {
      id: number;
      price_label: string;
      price: number;
    };
  };
  