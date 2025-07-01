
import nav from './main_directory_translations/en/site/nav'; // Import nav.js
import footer from './main_directory_translations/en/site/footer';
import ticket from './main_directory_translations/en/site/ticket';
import account from "./main_directory_translations/en/site/account"

import staff_ticket from './main_directory_translations/en/dashboard/ticket';
import site_managment from './main_directory_translations/en/dashboard/site_managment';
import users_managment from './main_directory_translations/en/dashboard/users_managment';
import sidebar from './main_directory_translations/en/dashboard/sidebar';
import staff_nav from './main_directory_translations/en/dashboard/staff_nav';
import account_staff from './main_directory_translations/en/dashboard/account';
import projectFlow from './main_directory_translations/en/dashboard/projectFlow'
import logs from "./main_directory_translations/en/dashboard/logs"
import licenses from "./main_directory_translations/en/dashboard/licenses"

export default {

	common : {
		ip_address: "IP Address",
		staff : "Staff",
		
		pwa_prompt_msg : "Install View ISP App on your device for a better experience.",
		pwa_prompt_btn_install : "Install",
		pwa_prompt_btn_Dismiss : "Dismiss",


		offline_page : {
			You_are_offline : "You are offline",
			Check_your_internet : "Check your internet connection and try again.",
			CloudTechSKY : "CloudTechSKY",
			back_to_home : "Back To Home",

		},


		ticket_status : {
			all: 'all status',
			open: 'Open',
			wait_customer_reply: 'Wait customer reply',
			replied_by_staff: 'Replied by staff',
			replied_by_customer: 'Replied by customer',
			solved: 'Solved'
		},
		ticket_card: {
			related_user : "Related User",
			requester : "Requester",
			created : "Created",
			latest_activity : "Latest Activity",
			assigned_to : "Assigned to",
			id : "ID",
			status: 'Status',
			department: 'Department',
			priority_support: 'Priority Support',

			close_ticket : {
					btn_close_ticket : "Close Ticket",
					btn_close_ticket_loading : "loading..",
					modal_msg : "Are you sure you want to close the ticket?"
			},
			reopen_ticket : {
				btn_open_ticket : "re-Open the Ticket",
				btn_open_ticket_loading : "loading..",
				modal_msg : "Are you sure you want to open this ticket?"
			},
			delete_ticket : {
				btn_delete_ticket : "Delete Ticket",
				btn_delete_ticket_loading : "loading..",
				modal_msg : "Are you sure you want to delete this ticket?"
			},


			pending: "Pending..."
			

		},
		yes: "Yes",
		no: "No",

		custom_modal : {
				title : 'Confirm Submission',
				defautl_confirm_msg : "Are you sure you want to update Data?",
				yes: "Yes",
				deleting: "Deleting...",
				updating: "Updating...",
				cancel : "Cancel",

		},
	},

	site : {
		nav : nav,
		footer,
		ticket,
		account,
	
	},
	 

	dashboard : {
		ticket : staff_ticket,
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