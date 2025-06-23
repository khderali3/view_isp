import { useEffect, useState } from "react";
 
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import Select from 'react-select';


const UsersSearchInputGlopal = ({ handleUserIdChange, userId, lable, ph }) => {
  const [users, setUsers] = useState([]); // store clients list
  const [customFetch] = useCustomFetchMutation();

  // Fetch clients data from API
  const fetchUsersList = async () => {
    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/`,
        method: "GET",
      });

      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Run the fetch on component mount
  useEffect(() => {
    fetchUsersList();
  }, []);

  // Prepare options for the dropdown
  const options = users.map(user => ({
    value: user.id,

    label: `${user.email} ${ (user.is_staff || user.is_superuser) ? '- staff' : '' }`,


  }));

  // Determine the selected value based on userId
  const selectedOption = options.filter(option => option.value === userId);

  return (
  <> 

<label htmlFor="users-select">
  {/* Search Users Members: */}
{lable}
</label>

<Select
  inputId="users-select" // Links the label to the input for accessibility
  options={options}
  onChange={(selected) => handleUserIdChange(selected?.value)} // Pass the selected value or `null` to the handler
  value={selectedOption} // Ensure that the selected value is highlighted
  isSearchable 
  placeholder={ph}
  isClearable 
/>

</>


 
  );
};

export default UsersSearchInputGlopal;
