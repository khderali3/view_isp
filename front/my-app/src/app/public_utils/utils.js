export const getErrorMessage = (errorData) => {
  if (!errorData) return "An error occurred"; // Default message if data is empty

  if (typeof errorData === "string") {
    return errorData; // Return the string directly
  }

  if (Array.isArray(errorData)) {
    return errorData.join(", "); // Convert list to a single message
  }

  if (typeof errorData === "object") {
    // If errorData is an object, return key-value pairs
    return Object.entries(errorData)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join(" | ");
  }

  return "An unexpected error occurred"; // Fallback message
};


 

   
export  const handleTimelineColler = (status) =>{

      if(status === 'pending') return ' bg-secondary'
      else if(status === 'wait_customer_action') return ' bg-warning '
      else if(status === 'in_progress') return ' bg-info '
      else if(status === 'completed') {return ' bg-success'}
      else if(status === 'canceled') return ' bg-danger'
 
  }
  
  




export  const getprojectStatusBadgeColors = (status) => {
    if(status === 'pending') return 'badge bg-secondary'
    else if(status === 'wait_customer_action') return 'badge bg-warning  text-dark'
    else if(status === 'in_progress') return 'badge bg-info  text-dark'
    else if(status === 'completed') {return 'badge bg-success'}
    else if(status === 'canceled') return 'badge bg-danger'

  }
  
 
  

