import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { ProjectButton } from './_components/jsx/button_project_details';

const Home = async () => {
  const locale = await getLocale();
 
  // Helper function for translations inline
  const t = (en, ar) => (locale === 'ar' ? ar : en);


  let res = ''
  let data= ''
  try {

    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/index/`,
     { cache: 'no-store',}  // Disable caching
    );
    data = await res.json();
  } catch (error) {
    
  }





  return (
    <>
    

    {/* <section id="home" className="h-100">
      <div className="home-section d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center g-4">

            <div className="col-md-6 col-lg-5">
              <Link href="/tickets" className="text-decoration-none">
                <div className="custom-card text-center">
                  <i className="bi bi-ticket-perforated-fill icon-primary mb-3"></i>
                  <h5 className="card-title">{t('Ticketing System', 'نظام التذاكر')}</h5>
                  <p className="card-text">{t('Manage your  tickets   .', 'قم بإدارة  التذاكر الخاصة بك  .')}</p>
                </div>
              </Link>
            </div>

            <div className="col-md-6 col-lg-5">
              <Link href="/projectflow" className="text-decoration-none">
                <div className="custom-card text-center">
                  <i className="bi bi-kanban-fill icon-primary mb-3"></i>
                  <h5 className="card-title">{t('ProjectFlows', ' مشاريعي')}</h5>
                  <p className="card-text">{t('Apply and track your projects .', ' تتبع مشاريعك بفعالية.')}</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>

 */}

    

  <section id="" className='   '> 

    <div className="projects-section  " id="Products">
      <div className="container">
        <div className="text text-center">
          <h3 className="fs-1 fw-bolder">
 
            {locale === "ar" ? data?.projects_type_section?.title_ar  : data?.projects_type_section?.title }

          </h3>
          <p className="fw-bold text-light">
 
            {locale === "ar" ? data?.projects_type_section?.title_hint_ar  : data?.projects_type_section?.title_hint }

          </p>
        </div>


        <div className="row justify-content-center row-cols-auto">
        { data?.projects_type_list?.map( i => 

          <div  key={i.id}  className="col-lg-4   mt-3 col-10 ">
            <div className="product-1 p-3  h-100  card ">
            {/* <img src="/Images/services.png" alt="" /> */}
            <img src={i.main_image } alt=""  className='  card-img-top   img-fluid' 
            style={{ objectFit: "contain", height: "200px" }}
            />


              <div className="  card-body  flex-grow-1 ">
                <h2 className="text-light fs-4 card-title">
                {/* {i.prod_name }  */}

                  {locale === "ar" ? i.project_name_ar : i.project_name}
                
                <br />
                {/* {i.prod_name_hint} */}

                {locale === "ar" ? i.project_name_hint_ar : i.project_name_hint}


                </h2>
                {/* <p className="fs-6">
                {i.prod_details}
                </p> */}
                <p className="fs-6 card-text ">
                  

                  {locale === "ar"  ? 

                  i?.project_description_ar?.length > 50 
                  ? `${i.project_description_ar.slice(0, 50)}...` 
                  : i.project_description_ar
                  
                  : 
                  
                  i?.project_description?.length > 50 
                    ? `${i.project_description.slice(0, 50)}...` 
                    : i.project_description

                  }

                  {/* {i.prod_details.length > 50 
                    ? `${i.prod_details.slice(0, 50)}...` 
                    : i.prod_details} */}


                </p>



              </div>
            <div className="but  text-center mt-auto card-footer  ">
              <ProjectButton slug={i.project_slog} text_button={ locale === "ar" ? "تفاصيل أكثر" : "More Detailse" } />
            </div>
            </div>
          </div>
            )} 


        </div>


        
      </div>
    </div>



  </section>



    
    
    </>








  );
};

export default Home;
