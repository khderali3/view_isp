'use client'

import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
import Link from "next/link";

import { useLocale } from "next-intl";



import { useTicketStatus } from "@/app/public_utils/hooks";




export const TicketStatisticsComponent = () => {


    const getTicketStatus = useTicketStatus()



    const locale = useLocale()
    const [customFetch] = useCustomFetchMutation();

    const [data, setData] = useState({
        open: 0,
        wait_customer_reply: 0,
        replied_by_staff: 0,
        replied_by_customer: 0,
        solved: 0,
        all: 0
    });


const getprojectStatusBadgeColors = (status) => {
  switch (status) {
    case 'wait_customer_reply':
      return 'bg-danger bg-opacity-10 text-danger';
    case 'replied_by_staff':
        return 'bg-warning bg-opacity-10 text-warning';
    case 'replied_by_customer':
      return 'bg-info bg-opacity-10  text-info';
    case 'solved':
      return 'bg-secondary bg-opacity-10 text-secondary';
    case 'open':
      return 'bg-success bg-opacity-10 text-success';
    default:
      return 'bg-light text-muted'; // default is light
  }
};

 

const getColorClass = (status) => {
  switch (status) {
    case 'wait_customer_reply':
      return 'danger';
    case 'replied_by_staff':
        return 'warning';
    case 'replied_by_customer':
      return 'info  ';
    case 'solved':
      return 'secondary';
    case 'open':
      return 'success';
    default:
      return 'light'; // default is light
  }
};
    

    const fetchData = async () => {
        try {
        const response = await customFetch({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/status_counts/`,
            method: "GET",
        });

        if (response && response.data) {
            setData(response.data);
        } else {
            toast.error(getErrorMessage(response?.error?.data));
        }
        } catch (error) {
        toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
        }
    };

  useEffect(() => {
    fetchData();
  }, []);



    return(

        <div className="container my-5">
        <h3 className="mb-4 fw-bold text-primary">📊 {locale === 'ar' ? ' تذاكر العملاء' : 'Client Tickets'}</h3>
        <div className="row g-4">
            {Object.keys(data).map((key) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={key}>
                <Link
                href={`/staff/ticket?status=${key}`}
                className="text-decoration-none"
                >
                <div
                    className={`card h-100 border-0 shadow-lg transition-transform hover-zoom`}
                    style={{ borderTop: `4px solid var(--bs-${getColorClass(key)})` }}
                >
                    <div
                    className={`card-body d-flex flex-column justify-content-center align-items-center text-center ${getprojectStatusBadgeColors(
                        key
                    )}`}
                    >
                    <h6 className="text-uppercase mb-2"> {getTicketStatus(key)} </h6>
                    <div className="display-5 fw-bold">{data?.[key]}</div>
                    </div>
                    <div className="card-footer bg-white border-top-0 text-center">
                    <span className="btn btn-outline-primary btn-sm">{ locale === 'ar' ? 'عرض' : 'View' }</span>
                    </div>
                </div>
                </Link>
            </div>
            ))}
        </div>
        </div>



    )
}
