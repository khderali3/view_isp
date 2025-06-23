import { useEffect, useState } from "react";
 
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import Select from 'react-select';


export const FormSearchInput = ({ handleobjectIdChange, objectId, lable, ph }) => {
  const [dataObjects, setDataObjects] = useState([]); // store clients list
  const [customFetch] = useCustomFetchMutation();

  // Fetch clients data from API
  const fetchDataList = async () => {
    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/?no_pagination=true`,
        method: "GET",
      });

      if (response && response.data) {
        setDataObjects(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Run the fetch on component mount
  useEffect(() => {
    fetchDataList();
  }, []);

  // Prepare options for the dropdown
    const options = dataObjects.map(object => ({
    value: object.id,
    label: `${object.id} - ${object.template_name}`,

    }));

  // Determine the selected value based on userId
    const selectedOption = options.filter(option => option.value === objectId);

    return (
    <> 

    <label htmlFor="users-select">
    {/* Search Users Members: */}
    {lable}
    </label>

    <Select
    inputId="users-select" // Links the label to the input for accessibility
    options={options}
    onChange={(selected) => handleobjectIdChange(selected?.value)} // Pass the selected value or `null` to the handler
    value={selectedOption} // Ensure that the selected value is highlighted
    isSearchable
    // placeholder="Search Users"
    placeholder={ph}
    isClearable 
    />

    </>


    
    );
};

