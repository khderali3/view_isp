
import nav from './main_directory_translations/ar/site/nav'; // Import nav.js
import footer from './main_directory_translations/ar/site/footer';
import ticket from './main_directory_translations/ar/site/ticket';
import account from "./main_directory_translations/ar/site/account"


import staff_ticket from './main_directory_translations/ar/dashboard/ticket';
import site_managment from './main_directory_translations/ar/dashboard/site_managment';
import users_managment from './main_directory_translations/ar/dashboard/users_managment';
import sidebar from './main_directory_translations/ar/dashboard/sidebar';
import staff_nav from './main_directory_translations/ar/dashboard/staff_nav';
import account_staff from './main_directory_translations/ar/dashboard/account';
import projectFlow from './main_directory_translations/ar/dashboard/projectFlow'
import logs from "./main_directory_translations/ar/dashboard/logs"
import licenses from "./main_directory_translations/ar/dashboard/licenses"


export default {

	common : {	
		ip_address: "عنوان الأي بي",

		staff : "فريق العمل",

		pwa_prompt_msg : "قم بتنصيب تطبيق مزود خدمة الانترنت فيو على جهازك لأداء أفضل.",
		pwa_prompt_btn_install : "تنصيب",
		pwa_prompt_btn_Dismiss : "رفض",
	
		offline_page : {
			You_are_offline : "أنت غير متصل بالإنترنت",
			Check_your_internet : "يرجى التحقق من إتصالك بالإنترنت والمحاولة مجدداً.",
			CloudTechSKY : " كلاودتك سكاي",
			back_to_home : "العودة للرئيسية",

		},



		ticket_status : {
			all: 'كافة الحالات',
			open: 'مفتوحة',
			wait_customer_reply: 'بإنتظار رد العميل',
			replied_by_staff: 'تم الرد من قبل فريق العمل',
			replied_by_customer: 'تم الرد من قبل العميل',
			solved: 'محلولة'
		},
 
		ticket_card: {
			related_user : "المستخدم المعني",

			requester : "منشئ التذكرة",
			created : "تاريخ الإنشاء",
			latest_activity : "آخر تحديث",
			assigned_to : "مسندة إلى",
			id : "رقم التذكرة",
			status: 'حالة التذكرة',
			department: 'القسم',
			priority_support: 'الأولوية للدعم',
			close_ticket : {
				btn_close_ticket : "إغلاق التذكرة",
				btn_close_ticket_loading : "يرجى الإنتظار..",
				modal_msg : "هلا تريد فعلاً إغلاق هذه التذكرة؟",

			},
			reopen_ticket : {
				btn_open_ticket : "إعادة فتح التذكرة",
				btn_open_ticket_loading : "يرجى الإنتظار..",
				modal_msg : "هلا تريد فعلاً إعادة فتح هذه التذكرة؟" ,
			},

			delete_ticket : {
				btn_delete_ticket : "حذف التذكرة",
				btn_delete_ticket_loading : "يرجى الإنتظار..",
				modal_msg : "هلا تريد فعلاً حذف هذه التذكرة؟" ,
			},

			pending: "قيد الإنتظار..."

			 

 		},
		yes: "نعم",
		no: "لا",
		custom_modal : {
			title : 'تأكيد العملية',
			defautl_confirm_msg : "هل فعلاً تريد تحديث هذه البيانات؟",
			yes: "نعم",
			deleting: "جاري الحذف...",
			updating: "جاري التحديث...",
			cancel : "إلغاء الأمر",


		},
	},

	site : {
		nav : nav,
		footer,
		ticket,
		account,
	
	},
	 

	dashboard : {
		ticket: staff_ticket,
		site_managment,
		users_managment,
		sidebar,
		account: account_staff,
		nav : staff_nav,
		projectFlow,
		logs,
		licenses,
		
		
	}
}