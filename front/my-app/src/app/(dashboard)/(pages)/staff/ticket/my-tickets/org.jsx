'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
// import getTicketStatusColor from "../../_components/jsx/tickets/ticket_status_colors";
import AssignTicketModal from "@/app/(dashboard)/_components/jsx/tickets/assigin_ticket/assign_ticket_modal";



import getTicketStatusColor from "@/app/(site)/_components/jsx/tickets/ticket_status_colors";
import { useRouter } from 'next/navigation';


// import { useCustomFetchMutation } from "../../_components/redux/features/siteApiSlice";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useRef } from "react";

import UsersSearchInput from "@/app/(dashboard)/_components/jsx/tickets/input_search_users/page";

 

const Page = () => {

  const formatDate = (dateString) => {
    if (dateString) {
        return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    }
  };


  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/my_tickets/`
  const [customFetch] = useCustomFetchMutation();

  const isFetching = useRef(false);
  const isInitialLoad = useRef(true);
  const [data, setData] = useState([]); // Store the ticket data
  const [nextPage, setNextPage] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [status, setStatus] = useState('all'); // Ticket status state
  const [userId, setUserId] = useState('all'); // Ticket status state
  const router = useRouter();

	const [assigningTicketId, setAssiningTicketId] = useState(null)

  const [reloadFlag , setReloadFlag] = useState(false)

  const reloadComponentMethod = () => {
    setReloadFlag((prev) => !prev); // Toggle state to trigger a reload
  };


 

  const handleUserIdChange = (selectedValue) => {
    if(selectedValue){
      setUserId(selectedValue);
    } else{
      setUserId('all');
    }
    
    console.log(selectedValue); // This will now log the selected user ID
  };

  const handleAddRequest = () => {
    router.push('/staff/ticket/newticket');  
  };


 








  const fetchData = async (pageUrl) => {
    setLoading(true);
    try {
      const response = await customFetch({
        url: pageUrl,
        method: 'GET', // Only use 'GET' for fetching data
        headers: {
          'Content-Type': 'application/json',
        }, 
      });
 
      if(response && response.data ){

        setNextPage(response.data.next_page_url);
        // setData(prevData => [...prevData, ...response.data.results]);
   
        const newData = response.data.results;
  
        // Merge existing data with new data and remove duplicates based on ticket.id
        setData(prevData => {
          const combinedData = [...prevData, ...newData];
          const uniqueData = combinedData.reduce((acc, current) => {
            // Check if the ticket.id is already in the accumulator
            const isDuplicate = acc.find(item => item.id === current.id);
            if (!isDuplicate) {
              acc.push(current);
            }
            return acc;
          }, []);
          
          return uniqueData;
  
  
        });

  
      } else {
        console.log(response)
      }
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };


 


  useEffect(() => {

    // Skip the effect on the initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Mark the initial load as complete
      return;
    }
  
  
      // Function to perform search after delay
      const performSearch = () => {
        const queryParams = new URLSearchParams({
          search: searchQuery,
          status,
          userId,
        });
  
        // Construct the full URL with query parameters
        const searchUrl = `${baseUrl}?${queryParams.toString()}`;
        setData([]); // Clear previous data for a new search
        setNextPage(null); // Reset pagination
        fetchData(searchUrl); // Fetch with new search criteria
      };
  
      // Set a timeout to delay the search request
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 1000); // 3-second delay
  
      // Clear timeout if user updates input or status within 3 seconds
      return () => clearTimeout(timeoutId);
    // }, [searchQuery, status, userId]);

    // return () => {
    //   clearTimeout(timeoutId); // Clear the timeout if the component is unmounted or before re-running
    //   setReloadComponent(false); // Optionally reset the reloadComponent state
    // };

  }, [searchQuery, status, userId, reloadFlag]);




useEffect(() => {
  console.log('reload  Component is changed to ', reloadFlag)
}, [reloadFlag]);



  const handleScroll = () => {
    if (isFetching.current) return;

    // Check if scrolling has reached the bottom and there is more data to fetch
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && 
      !loading && 
      nextPage !== null 
  
    ) {
      isFetching.current = true; // Prevents further scroll triggers
      fetchData(nextPage).then(() => {
        isFetching.current = false; // Allow new scroll triggers after fetch completes
      });
  }};
  

  // Attach and detach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);

    };
  }, [loading, nextPage]); // Dependencies: loading and nextPage
  



 
  useEffect(() => {
    if (isFetching.current) return;
    fetchData(baseUrl).then(() => {
      isFetching.current = false; // Allow new featch  after fetch completes
      
    });
  }, [ ]);



    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
 
    const handleStatusChange = (e) => {
      setStatus(e.target.value);
    };






    return (

        <div> 
        <div className="app-content-header">


          <div className="container-fluid">


            <div className="row">
              <div className="col-sm-6">
                <h3 className="mb-0">Main Index Page </h3>
              </div>

              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-end">
                  <li className="breadcrumb-item">
                    <a href="#">Docs</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Site Managment
                  </li>
                </ol>
              </div>
            </div>
          </div>

        </div>

        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}

<div className="  mt-1 mb-5 pb-5 ms-2  me-2 ">
 
 
<div className="row">
<div className="col-12 col-md-6  ">
  <h1 className="mb-2">Tickets</h1>
</div>
<div className="col-12 col-md-6 d-flex justify-content-md-end">
  <button type="button" onClick={handleAddRequest} className="btn btn-outline-secondary">Add a new Request</button>
</div>
</div>


  <hr />
  <div className=" ">
    <div className="  mb-3">
      <div
        className="container-fluid"
         
      >
        <form className="pb-2">
          <div className="row ">






            <div className="col-md-5 col-12 pt-2">
              <label htmlFor="search_words"> Search in Subject / Ticket Body </label>
              <input
                type="text"
                className="form-control  "
                id="search_words"
                placeholder="search here"
                aria-describedby="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-md-5 col-12 pt-2">
            <label htmlFor="search_words"> Search Per Ticket Status </label>

              <select
                className="form-select  "
                aria-label="Default select example"
                value={status}
                onChange={handleStatusChange}

              >
                <option value={'all'}>all status</option>
                <option value={'open'}>Open</option>
                <option value={'wait_customer_reply'}>wait_customer_reply</option>
                <option value={'replied_by_staff'}>replied_by_staff</option>
                <option value={'replied_by_customer'}>replied_by_customer</option>
                <option value={'solved'}>solved</option>
              </select>
            </div>


            <div className="col-md-5 col-12 pt-2">

              <UsersSearchInput handleUserIdChange={handleUserIdChange} userId={userId}/>

            </div>

          </div>

          <h4 className="text-muted mt-2">{searchQuery && `results for : ${searchQuery}` }</h4>


        </form>
      </div>
    </div>
  </div>


  <table className="table table-striped d-none d-md-table ">
    <thead>
      <tr>
        <th scope="col">Subject</th>
        <th scope="col">ID</th>
        <th scope="col">Created</th>
        <th scope="col">Latest activity</th>
        <th scope="col">Status</th>
        <th scope="col"> Assigned </th>
      </tr>
    </thead>
    <tbody>
      {data?.map((ticket) => (
        <tr key={`table_${ticket.id}`}>
          <td>
            {/* <Link href="/ticket/">{ticket.ticket_subject}</Link> */}
            <Link href={`/staff/ticket/ticketDetails/${ticket.ticket_slog}`}  >
              {ticket.ticket_subject.length > 25 
              ? `${ticket.ticket_subject.slice(0, 25)}...` 
              : ticket.ticket_subject
              }
           </Link>


          </td>
          <td>#{ticket.id}</td>
          <td>{formatDate(ticket.ticket_created_date)}</td>
          <td>{formatDate(ticket.latest_activity)}</td>
          <td>
            <span className={`badge ${getTicketStatusColor(ticket.ticket_status)}`}>
              {ticket.ticket_status}
            </span>
          </td>
          <td>
            {!ticket?.ticket_assigned_to ? 
              <Link href="/#"
              
              data-bs-toggle="modal"
              data-bs-target="#assign_ticket_to_staff"
              onClick={ ()=> { setAssiningTicketId( ticket.id  )}   }             
              >Assign </Link>
              :
              ticket?.ticket_assigned_to?.fullname
            }
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Loading Indicator */}
  {loading && (
    <div className="text-center mt-4">
      <p>Loading data...</p>
    </div>
  )}



  {/* Card View for smaller screens */}
    <div className="d-block d-md-none">
    {data.map((ticket) => (
      <div className="card mb-3" key={`card_${ticket.id}`}>
        <div className="card-body">
          <p>
            <strong>Subject:</strong> 
            
            {/* {ticket.ticket_subject} */}
            <Link className="ms-2" href={`/staff/ticket/ticketDetails/${ticket.ticket_slog}`}  >
              {ticket.ticket_subject.length > 25 
              ? `${ticket.ticket_subject.slice(0, 25)}...` 
              : ticket.ticket_subject
              }
           </Link>

          </p>
          <p>
            <strong>ID:</strong> #{ticket.id}
          </p>
          <p>
            <strong>Created:</strong> {formatDate(ticket.ticket_created_date)}
          </p>
          <p>
            <strong>Latest activity:</strong>{" "}
            {formatDate(ticket.latest_activity)}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${getTicketStatusColor(ticket.ticket_status)}`}>
              {ticket.ticket_status}
            </span>
          </p>
          <p>
          <strong>Assigned: </strong>
          {!ticket?.ticket_assigned_to ? 
                <Link href="/#"
                
                data-bs-toggle="modal"
                data-bs-target="#assign_ticket_to_staff"
                onClick={ ()=> { setAssiningTicketId( ticket.id  )}   }             
                >Assign </Link>
                :
                ticket?.ticket_assigned_to?.fullname
              }
           </p>
        </div>
      </div>
    ))}
  </div>

   
</div>
 

<AssignTicketModal setReloadComponent={reloadComponentMethod} 
                  assigningTicketId={assigningTicketId} 
                  setAssiningTicketId={setAssiningTicketId}   
                  />


{ /*  end  sections   */}

          </div>
          

        </div>
      </div>


    )
}

export default Page