import { useEffect, useState } from "react";
 import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
 
import Select from 'react-select';


const StaffUsersSearchInput = ({ handleUserIdChange, userId, isOtherUser, input_lable='',  input_ph=''}) => {
  const [staffUsers, setStaffUsers] = useState([]); // store clients list
  const [customFetch] = useCustomFetchMutation();

  // Fetch clients data from API
  const fetchUsersList = async () => {
    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/staff/`,
        method: "GET",
      });

      if (response && response.data) {
        setStaffUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Run the fetch on component mount
  useEffect(() => {
    fetchUsersList();
  }, [ ]);


  

 
  // Determine the selected value based on userId



  const options = staffUsers.map(user => ({
    value: user.id,
    // label: user.email
    label: `${user.email}${user.departments.length > 0 ? ` - [${user.departments.join(', ')}]` : ''}`, // Add departments only if they exist


  }));


  const selectedOption = options.filter(option => option.value === userId);


  return (
 
    <> 

    <label htmlFor="staff-select">{input_lable} : </label>
    
    <Select
      inputId="staff-select" // Links the label to the input for accessibility
      options={options}
      onChange={(selected) => handleUserIdChange(selected?.value)} // Pass the selected value or `null` to the handler
      value={selectedOption} // Ensure that the selected value is highlighted
      isSearchable
      placeholder={input_ph}
      isClearable={true}
      isDisabled={!isOtherUser}
    />
    
    </>
  );
};

export default StaffUsersSearchInput;
