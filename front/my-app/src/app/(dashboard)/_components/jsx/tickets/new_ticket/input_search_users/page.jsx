import { useEffect, useState } from "react";
import ReactDropdownSelect from "react-dropdown-select";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";


import { useLocale } from "next-intl";


const NewTicketUsersSearchInput = ({ handleUserIdChange, userId, label=""}) => {
  const [clients, setClients] = useState([]); // store clients list
  const [customFetch] = useCustomFetchMutation();


  const locale = useLocale()


  // Fetch clients data from API
  const fetchClientsList = async () => {
    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/`,
        method: "GET",
      });

      if (response && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Run the fetch on component mount
  useEffect(() => {
    fetchClientsList();
  }, []);

  // Prepare options for the dropdown
  const options = clients.map(client => ({
    value: client.id,
    // label: client.email,
    // label: `${client.email} ${ (client.is_staff || client.is_superuser) ? '- staff' : '' }`,
    label: `${client.email} ${client.is_staff || client.is_superuser ? 
      (locale === "ar" ? '- طاقم العمل' : '- staff') 
      : ''}`,

  }));

  // Determine the selected value based on userId
  const selectedOption = options.filter(option => option.value === userId);

  return (
    <div className="mb-3">
      <label htmlFor="user_filter">{label}</label>
      <ReactDropdownSelect
         id="user_filter"
        options={options}
        onChange={selected => handleUserIdChange(selected[0]?.value)} // Pass the selected value to the handler
        values={selectedOption} // Ensure that the selected value is highlighted
        // placeholder="Select a user"
        placeholder={locale === "ar" ? "إختر مستخدم"  :  "Select a user" }

        clearable={false} // Optional: set to true if you want to allow clearing the selection
      />
    </div>
  );
};

export default NewTicketUsersSearchInput;
