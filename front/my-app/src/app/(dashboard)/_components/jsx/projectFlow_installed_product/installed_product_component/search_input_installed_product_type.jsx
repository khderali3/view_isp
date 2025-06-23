import { useEffect, useState } from "react";
 
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import Select from 'react-select';


export const FormSearchInput = ({url, handleobjectIdChange, objectId, lable, ph }) => {
  const [dataObjects, setDataObjects] = useState([]);  
  const [customFetch] = useCustomFetchMutation();

 
  const fetchDataList = async () => {
    try {
      const response = await customFetch({
        // url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/?no_pagination=true`,
        url: url ,
        method: "GET",
      });

      if (response && response.data) {
        setDataObjects(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 
  useEffect(() => {
    fetchDataList();
  }, []);

 
    const options = dataObjects.map(object => ({
    value: object.id,
    label: `${object.id} - ${object.product_name}`,

    }));

 
    const selectedOption = options.filter(option => option.value === objectId);

    return (
    <> 

    <label htmlFor="users-select">
 
    {lable}
    </label>

    <Select
    inputId="users-select"  
    options={options}
    onChange={(selected) => handleobjectIdChange(selected?.value)} 
    value={selectedOption}  
    isSearchable
 
    placeholder={ph}
    isClearable 
    />

    </>


    
    );
};

