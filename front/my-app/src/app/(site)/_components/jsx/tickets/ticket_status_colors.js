

const getTicketStatusColor = (status) => {
    switch (status) {
      case 'wait_customer_reply':
        return 'bg-danger';
      case 'replied_by_staff':
        return 'bg-warning text-dark';
        case 'replied_by_customer':
            return 'bg-info text-dark';
        case 'solved':
            return 'bg-secondary';               

      default:
        return 'bg-success';
    }
  };

  export default getTicketStatusColor