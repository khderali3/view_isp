'use client'

import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
import Link from "next/link";

import { useLocale } from "next-intl";



import { useProjectStatus } from "@/app/public_utils/hooks";




export const ProjectFlowStatisticsComponent = () => {


    const getProjectStatus = useProjectStatus()



    const locale = useLocale()
    const [customFetch] = useCustomFetchMutation();

    const [data, setData] = useState({
        pending: 0,
        wait_customer_action: 0,
        in_progress: 0,
        completed: 0,
        canceled: 0,
        all: 0
    });

    

    const getprojectStatusBadgeColors = (status) => {
    switch (status) {
        case 'pending':
        return 'bg-secondary bg-opacity-10 text-secondary';
        case 'wait_customer_action':
        return 'bg-warning bg-opacity-10 text-warning';
        case 'in_progress':
        return 'bg-info bg-opacity-10 text-info';
        case 'completed':
        return 'bg-success bg-opacity-10 text-success';
        case 'canceled':
        return 'bg-danger bg-opacity-10 text-danger';
        default:
        return 'bg-light text-muted';
    }
    };

    const getColorClass = (status) => {
    switch (status) {
        case 'pending':
        return 'secondary';
        case 'wait_customer_action':
        return 'warning';
        case 'in_progress':
        return 'info';
        case 'completed':
        return 'success';
        case 'canceled':
        return 'danger';
        default:
        return 'light';
    }
    };


    

    const fetchData = async () => {
        try {
        const response = await customFetch({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/status_counts/`,
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
        <h3 className="mb-4 fw-bold text-primary">📊 {locale === 'ar' ? ' مشاريع العملاء' : 'Client Projectflows'}</h3>
        <div className="row g-4">
            {Object.keys(data).map((key) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={key}>
                <Link
                href={`/staff/projectFlow/projectFlow?status=${key}`}
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
                    <h6 className="text-uppercase mb-2"> {getProjectStatus(key)} </h6>
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
