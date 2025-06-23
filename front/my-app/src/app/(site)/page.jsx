import { getLocale } from 'next-intl/server';
import Link from 'next/link';

const Home = async () => {
  const locale = await getLocale();

  // Helper function for translations inline
  const t = (en, ar) => (locale === 'ar' ? ar : en);

  return (
    <section id="home" className="h-100">
      <div className="home-section d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center g-4">

            {/* Ticket System Card */}
            <div className="col-md-6 col-lg-5">
              <Link href="/tickets" className="text-decoration-none">
                <div className="custom-card text-center">
                  <i className="bi bi-ticket-perforated-fill icon-primary mb-3"></i>
                  <h5 className="card-title">{t('Ticketing System', 'نظام التذاكر')}</h5>
                  <p className="card-text">{t('Manage your  tickets   .', 'قم بإدارة  التذاكر الخاصة بك  .')}</p>
                </div>
              </Link>
            </div>

            {/* ProjectFlow System Card */}
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
  );
};

export default Home;
