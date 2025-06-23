




import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
 import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";


export const ViewProductInstalledButton = ({ modal_id = "productInstalledModal", projectflow_id }) => {
  
  const router = useRouter()

    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_details.ViewProductInstalledButton')

    const [data, setData] = useState([])
 
    const [customFetch] = useCustomFetchMutation();

   // Fetch clients data from API
   const fetchDataList = async () => {
    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/installed_product/`,
        method: "GET",
      });

      if (response && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 
  // useEffect(() => {
  //   if(projectflow_id){
  //       fetchDataList();
  //   }
  // }, [projectflow_id, modal_id]);

  useEffect(() => {
    const modal = document.getElementById(modal_id);
  
    const handleModalShow = () => {
      if (projectflow_id) {
        fetchDataList();
      }
    };
  
    if (modal) {
      modal.addEventListener("show.bs.modal", handleModalShow);
    }
  
    return () => {
      if (modal) {
        modal.removeEventListener("show.bs.modal", handleModalShow);
      }
    };
  }, [projectflow_id, modal_id]);


  return (
    <div>
      {/* Button to trigger modal */}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary mt-2 small"
        data-bs-toggle="modal"
        data-bs-target={`#${modal_id}`}
      >
        {t('btn_name')}
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id={modal_id}
        tabIndex="-1"
        aria-labelledby={`${modal_id}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content small">
            <div className="modal-header py-2 px-3">
              <h6 className="modal-title fs-6" id={`${modal_id}Label`}>
               {t('title')}
              </h6>
              <button
                type="button"
                className="btn-close btn-sm"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body py-2 px-3">
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-striped mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="fw-normal">#</th>
                      <th className="fw-normal"> {t('Product_Name')}</th>
                      <th className="fw-normal">{t('Serial_Number')}</th>
                      <th className="fw-normal">{t('Note')}</th>
                      <th className="fw-normal">{t('Private_Note')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          {t('No_products_installed')}
                        </td>
                      </tr>
                    ) : (
                        data.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product?.product_info?.name}</td>
                          <td>{product.serial_number}</td>
                          <td>{product.note}</td>
                          <td>{product.private_note}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer py-2 px-3">
              <a    
              href={`/staff/projectFlow/${projectflow_id}/installed_product`}
              className="btn btn-link btn-sm p-0"
              onClick={(e) => {
                e.preventDefault();
                const modal = bootstrap.Modal.getInstance(document.getElementById(modal_id));
                modal.hide();
                setTimeout(() => router.push(`/staff/projectFlow/${projectflow_id}/installed_product`), 300);
              }}





              >{t('Edit')}</a>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
