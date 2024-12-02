export function processTicket(ticket: Record<string, any>): string {
    let serial = '';
    const ticketSerial = ticket['ticket_serial'];
  
    if (ticketSerial) {
      Object.entries(ticketSerial).forEach(([key, value], index) => {
        serial += `"${key}":"${value}"${key === 's' ? '' : ','}`;
      });
    }
  
    // Wrap in curly braces to form a valid JSON-like string
    serial = `{${serial}}`;
  
    console.log('Event:', event);
    console.log('Serial:', serial);
  
    return serial;
  }