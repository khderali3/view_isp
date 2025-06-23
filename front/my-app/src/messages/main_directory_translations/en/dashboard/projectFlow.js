

export default  {

    projectType : {
        projectTypeSection : {
            section_title : "Project Type Section",
            form : { 
                title : 'Title',
                details : 'Details',
                title_ar : 'Title (Ar)',
                details_ar : "Details (Ar)",
                edit : 'Edit',
                modal_msg : "are you sure you wana update project type secion data?",
                cancel :'cancel',
                edit : 'Edit',
                update: 'Update',
                updating: 'Updating..',

            }

        },
            list_table : {
                title : 'List item Project Type',
                project_name : 'Project Name' ,
                project_name_ar : 'Project Name (Ar)',
                actions : 'Actions',
                edit : 'Edit',
                delete : 'Delete'
        },

        form_add_or_edit : {
            project_name : 'Project Name',
            project_name_hint : 'Project Name Hint',
            details : 'Details',
            project_name_ar : 'Project Name (Ar)',
            project_name_hint_ar : 'Project Name Hint (Ar)',
            details_ar : 'Details (Ar)',
            Published :'Published',
            auto_clone_template : 'Auto Clone Template',
            search_template_lable: 'Select projectFlow Template',
            search_template_ph : 'Please Select projectFlow Template',
            main_image :'Main Image',
            current_image : 'Current Image',
            extra_images : 'Extra Images',
            Attachments : 'Attachments',
            cancel : 'Cancel',
            update : 'Update',
            add : 'Add Item',
            edit_project_type : 'Edit Project Type'
           
        }
    },

    projectflow_template : {
        main_page : {
            page_title : 'ProjectFlow Templates',
            add_new_template : "Add New Template",
            template_name : 'Template Name',
            search_ph : 'Search By Template Name',
            results : "Results Search for template name",
            id : 'ID',
            show_steps_to_client : 'Show Steps To Client',
            steps_process_strategy : 'steps Process Strategy',
            manual_start_mode : 'Manual Start Mode',
        },
        add_or_edit_template_form : {
            add_title : ' Add New ProjectFlow Template ',
            edit_title : ' Edit ProjectFlow Template ',
            template_name : 'Template Name',
            template_name_des : "Enter a name for this template.",

            steps_process_strategy : 'steps Process Strategy',
            steps_process_strategy_des : "Auto: The next step starts automatically when the previous step is complete. Manual: Staff must manually start each step.",


            manual_start_mode : 'Manual Start Mode',
            manual_start_mode_des : 'Serialized: A step can only start if the previous one is completed. Non-Serialized: Steps can start in any order.',



            auto_start_first_step : "Auto Start First Step ",
            auto_start_first_step_des : "If enabled, the first step will automatically change to 'In Progress' when the template is cloned (steps and settings are copied) to the project flow.",
           
            show_steps_to_client : 'Show Steps To Client',
            show_steps_to_client_des : "Choose whether clients can see project steps.",

            show_steps_status_logs_to_client : 'Show Steps Status Logs To Client',
            show_steps_status_logs_to_client_des : "Choose whether clients can see step status logs.",

            submit : 'Submit',
            edit_save_btn : 'Save Changes'

        }
    },
    template_details : {
        mini_nav : {
            Project_Flow_Template : ' ProjectFlow Template',
            Template_Details : 'Template Details'
        },
        detail : ' Details',
        Template_ID : 'Template ID',
        Template_Name : 'Template Name ',
        Steps_Process_Strategy : ' Steps Process Strategy',
        Manual_Start_Mode : 'Manual Start Mode',
        Auto_Start_First_Step : ' Auto Start First Step' ,
        Show_Steps_To_Client :'Show Steps To Client',
        Show_Step_Status_Logs_To_Client : 'Show Step Status Logs To Client',
        Add_New_Step : 'Add New Step',
        Edit : 'Edit',
        Delete : 'Delete',
        modal_msg : 'are you sure you want to delete this template?'
    },
    
    template_step : {
        more_info : 'More Info',
        Add_New_Sub_Step : 'Add New Sub-Step',
        Edit : 'Edit',
        Delete : 'Delete',
        move_up : 'Move Up',
        move_down : 'Move Down',
        Step_ID : 'Step ID',
        Show_To_Client : 'Show To Client',
        Start_Process_Strategy : 'Start Process Strategy',
        Allowed_Process_By : 'Allowed Process By',
        Allowed_Process_Groups : 'Allowed Process Groups',
        Show_Status_Logs_To_Client : 'Show Status Logs To Client',
        Step_Title :'Step Name',
        Step_Details : 'Step Details',
        del_modal_msg : 'are you sure you want to delete this step ?'

     },
     notes : {
        notes_title : 'Notes',
        no_notes_available : "No notes available",
     },
     single_note : {
        delete : "Delete",
        modal_msg : 'are you sure you want to delete this note ?'
     },
     add_step_or_sub_step_note : {
        input_ph : 'Write your note here',
        add_btn : 'Add Note'
     },

    template_sub_step : {
        more_info : 'More Info',        
        Edit : 'Edit',
        Delete : 'Delete',
        move_up : 'Move Up',
        move_down : 'Move Down',
        sub_Step_ID : 'Sub-Step ID',
        Show_To_Client : 'Show To Client',
        Start_Process_Strategy : 'Start Process Strategy',
        Allowed_Process_By : 'Allowed Process By',
        Allowed_Process_Groups : 'Allowed Process Groups',
        Show_Status_Logs_To_Client : 'Show Status Logs To Client',
        sub_Step_Title :'Sub-Step Name',
        sub_Step_Details : 'Sub-Step Details',
        del_modal_msg : 'are you sure you want to delete this sub-step ?'
     },

     template_comments : {
        title : "Comments & Notes",
        Delete : "Delete",
        modal_msg : 'are you sure you want to delete this comment ?'
     },

     tepmlate_add_or_edit_step : {
        title : "Add New Step Template",
        edit_title : "Edit Step Template", 
        step_name : 'Step Name',
        step_name_des : 'Enter a name for this Step.',

        Step_Details : 'Step Details',
        Step_Details_des :  'Enter a Details for this Step.',
       
        step_name_ar :'Step Name (Ar)',
        step_name_ar_des :  'Enter a name for this Step in Arabic.',
       
        Step_Details_ar : 'Step Details (Ar)',
        Step_Details_ar_des :  'Enter a Details for this Step in Arabic.',
       
        Allowed_Process_By : 'Allowed Process By',
        Allowed_Process_By_des :   ' Choose who is allowed to process this step: any staff member, a specific staff group, or the client.',

        Select_Groups : ' Select Groups',

        Start_Process_Strategy : 'Start Process Strategy',

        Start_Process_Strategy_des :  ' Inherit From Template: Uses the predefined process from the project template. Auto: The  step starts automatically when the previous step is complete. Manual: Staff must manually start each step.',



         
        Show_Status_Logs_To_Client : 'Show Status Logs To Client',
        Show_Status_Logs_To_Client_des : ' Choose whether clients can see step status logs.',
        Show_To_Client : 'Show To Client',
        Show_To_Client_des : ' Choose whether clients can see this step.',
        Submit : 'Submit',
        save_changes : 'Save Changes',





        Select_Option : 'Select Option',
        any_staff : 'Any Staff',
        specific_staff_group :  'Specific Staff Groups',
        client :'Client',

        manual : 'Manual',
        auto : 'Auto',
        inherit_from_project_flow : 'Inherit From projectFlow',
        yes : 'Yes',
        no : 'No'
    },

    tepmlate_add_or_edit_sub_step : {
        title : "Add New Sub-Step Template",
        edit_title : "Edit Sub-Step Template", 
        step_name : 'Sub-Step Name',
        step_name_des : 'Enter a name for this Sub-Step.',

        Step_Details : 'Sub-Step Details',
        Step_Details_des :  'Enter a Details for this Sub-Step.',
       
        step_name_ar :'Sub-Step Name (Ar)',
        step_name_ar_des :  'Enter a name for this Sub-Step in Arabic.',
       
        Step_Details_ar : 'Sub-Step Details (Ar)',
        Step_Details_ar_des :  'Enter a Details for this Sub-Step in Arabic.',
       
        Allowed_Process_By : 'Allowed Process By',
        Allowed_Process_By_des :   ' Choose who is allowed to process this Sub-Step: any staff member, a specific staff group, or the client.',

        Select_Groups : ' Select Groups',

        Start_Process_Strategy : 'Start Process Strategy',

        Start_Process_Strategy_des :  ' Inherit From Template: Uses the predefined process from the project template. Auto: The  Sub-Step starts automatically when the previous step is complete. Manual: Staff must manually start each step.',



         
        Show_Status_Logs_To_Client : 'Show Status Logs To Client',
        Show_Status_Logs_To_Client_des : ' Choose whether clients can see this Sub-Step status logs.',
        Show_To_Client : 'Show To Client',
        Show_To_Client_des : ' Choose whether clients can see this Sub-Step.',
        Submit : 'Submit',
        save_changes : 'Save Changes',





        Select_Option : 'Select Option',
        any_staff : 'Any Staff',
        specific_staff_group :  'Specific Staff Groups',
        client :'Client',

        manual : 'Manual',
        auto : 'Auto',
        inherit_from_project_flow : 'Inherit From projectFlow',
        yes : 'Yes',
        no : 'No'
    },






    projectflow : {
            main_page : {
                page_title : 'ProjectFlows Clinets',
                add_new_projectflow : "Add New ProjectFlow",

                search_form : {
                    project_type_name : 'ProjectType Name',
                    project_type_name_ph : 'Search By ProjectType Name',
                    ProjectFlow_Status : 'ProjectFlow Status',
                    ProjectFlow_Status_ph : 'Search By ProjectFlow Status',
                    all : 'All',
                    pending : 'Pending',
                    wait_customer_action : 'Wait Customer Action',
                    in_progress : 'In Progress',
                    completed : 'Completed',
                    canceled : 'Canceled',
                    projectFlow_user : 'ProjectFlow User',
                    projectFlow_user_ph : 'Search By ProjectFlow User',
                    project_id : 'ProjectFlow ID',
                    project_id_ph : 'Search By ProjectFlow ID',
                   
                },
                project_type_name : 'ProjectType Name',

                id : 'ID',
                Created : 'Created',
                Latest_Activity : 'Latest Activity',
                Status : 'Status',
                User : 'User'
 
            },
            add_new_projectflow : {
                title : 'Add New ProjectFlow',
                select_project_type_label : 'Please select Project Type',
                Select_Project_Type : 'Select Project Type',
                Select_ProjectFlow_User : 'Select ProjectFlow User',
                Description : 'Description',
                Description_ph : "Please enter the details of this project environment",
                
                contact_phone_no : 'Contact Phone number',
                contact_phone_no_ph : 'write contact phone number please ',
                project_address :  'Project Address',
                project_address_ph : 'write the address where you want to implemet this project ',







                submit : 'Submit'
            },

        projectflow_details : {

            mini_nav : {
                ProjectFlow : ' ProjectFlow ',
                projectflow_Details : 'ProjectFlow Details'
            },

            details_btn : 'Details',
            More_Info : 'More Info',
            projectflow_id : 'ProjectFlow ID',
            Is_Template_Cloned : 'Is Template Cloned',
            Template_Cloned_Name : 'Template Cloned Name',

            Contact_phone : 'Contact phone',
            Project_Address : 'Project Address',
            created_ip_address : 'Client IP Address',





 
            Steps_Process_Strategy : ' Steps Process Strategy',
            Manual_Start_Mode : 'Manual Start Mode',
            Auto_Start_First_Step : ' Auto Start First Step' ,
            Show_Steps_To_Client :'Show Steps To Client',
            Show_Step_Status_Logs_To_Client : 'Show Step Status Logs To Client',
            Add_New_Step : 'Add New Step',
            Edit : 'Edit',
            Delete : 'Delete',
            modal_msg : 'are you sure you want to delete this projectFlow?',

            ButtonCloneTemplate : {

                Clone_Template : 'Clone Template',
                Re_Clone_Template : 'Re-Clone Template',
                Select_Template : 'Select Template',
                note : "Note: for 'Re-Clone Template'  all steps Data will be lost.",
                Cancel : 'Cancel',
                Clone :'Clone'

            },
            CancelProjectFlowOrReOpen : {

                re_open_title :'re-open the projectflow and change status to latest status before close it .',
                close_title : 'Close this ProjectFlow',
                re_open_btn_label : 'Re-Open ProjectFlow',
                close_btn_lable :  'Cancel ProjectFlow',
            },

            Project_Type : "Project Type",
            Requester : 'Requester',
            Related_User : ' Related User',
            Created : 'Created',
            Latest_activity : 'Latest activity',
            status :'Status',
            Progress : 'Progress',

            ViewProductInstalledButton : {
                btn_name : 'View Installed Products',
                title : 'Installed Product List',
                Product_Name : 'Product Name',
                Serial_Number :'Serial Number',
                Note : 'Note',
                Private_Note : 'Private Note',
                No_products_installed : 'No products installed',
                Edit : 'Edit',
                Close : 'Close',
            },


 





        },
 
        projectflow_step : {
            more_info : 'More Info',
            Add_New_Sub_Step : 'Add New Sub-Step',
            Edit : 'Edit',
            Delete : 'Delete',
            move_up : 'Move Up',
            move_down : 'Move Down',
            Step_ID : 'Step ID',
            Show_To_Client : 'Show To Client',
            Start_Process_Strategy : 'Start Process Strategy',
            Allowed_Process_By : 'Allowed Process By',
            Allowed_Process_Groups : 'Allowed Process Groups',
            Show_Status_Logs_To_Client : 'Show Status Logs To Client',
            Step_Title :'Step Name',
            Step_Details : 'Step Details',
            del_modal_msg : 'are you sure you want to delete this step ?',

            step_status : 'Step Status',
            Start_Process_Date :'Start Process Date',
            End_Process_Date : 'End Process Date',
            Change_Step_Status_Logs : 'Change Step Status Logs',
            step_status_logs : {
                status_changed_from : 'status changed from',
                user_changed_status_from : 'changed status from',
                to : 'To'
            },
            add_note : {
                input_ph : 'Write your note here',
                btn_label : 'Add Note'
            }


        },

        projectflow_sub_step : {
            more_info : 'More Info',
 
            Edit : 'Edit',
            Delete : 'Delete',
            move_up : 'Move Up',
            move_down : 'Move Down',
            Step_ID : 'Sub-Step ID',
            Show_To_Client : 'Show To Client',
            Start_Process_Strategy : 'Start Process Strategy',
            Allowed_Process_By : 'Allowed Process By',
            Allowed_Process_Groups : 'Allowed Process Groups',
            Show_Status_Logs_To_Client : 'Show Status Logs To Client',
            Step_Title :'Sub-Step Name',
            Step_Details : 'Sub-Step Details',
            del_modal_msg : 'are you sure you want to delete this sub-step ?',

            step_status : 'Sub-Step Status',
            Start_Process_Date :'Start Process Date',
            End_Process_Date : 'End Process Date',
            Change_Step_Status_Logs : 'Change Step Status Logs',
            step_status_logs : {
                status_changed_from : 'status changed from',
                user_changed_status_from : 'changed status from',
                to : 'To'
            },
            add_note : {
                input_ph : 'Write your note here',
                btn_label : 'Add Note'
            }


        },

        projectflow_notes : {
            title : 'Comments & Notes',
            auto_created_msg : 'Generated By System',
            Delete : 'Delete',
            delete_msg : 'are you sure you want to delete this Comment ?',
            add_note : {
                cant_add_note : "You can't add new comment/note for this project because it's"
            }
            
        },


        edit_projectflow : {
            title : 'Edit ProjectFlow Settings',
            steps_process_strategy : 'steps Process Strategy',
            steps_process_strategy_des : "Auto: The next step starts automatically when the previous step is complete. Manual: Staff must manually start each step.",
            manual_start_mode : 'Manual Start Mode',
            manual_start_mode_des : 'Serialized: A step can only start if the previous one is completed. Non-Serialized: Steps can start in any order.',
            projectflow_status : 'ProjectFlow Status',

            projectflow_status_des : '  Note: The status updates automatically based on workflow steps process. Use this dropdown to manually override it if needed.',



            // auto_start_first_step : "Auto Start First Step ",
            // auto_start_first_step_des : "If enabled, the first step will automatically change to 'In Progress' when the template is cloned (steps and settings are copied) to the project flow.",
            
            
            
            
            show_steps_to_client : 'Show Steps To Client',
            show_steps_to_client_des : "Choose whether clients can see project steps.",
            show_steps_status_logs_to_client : 'Show Steps Status Logs To Client',
            show_steps_status_logs_to_client_des : "Choose whether clients can see step status logs.",
            edit_save_btn : 'Save Changes'
        },

        projectflow_add_or_edit_step : {
            title : "Add New projectFlow Step ",
            edit_title : "Edit Step ", 
            step_name : 'Step Name',
            step_name_des : 'Enter a name for this Step.',

            Step_Details : 'Step Details',
            Step_Details_des :  'Enter a Details for this Step.',
        
            step_name_ar :'Step Name (Ar)',
            step_name_ar_des :  'Enter a name for this Step in Arabic.',
        
            Step_Details_ar : 'Step Details (Ar)',
            Step_Details_ar_des :  'Enter a Details for this Step in Arabic.',
        
            Allowed_Process_By : 'Allowed Process By',
            Allowed_Process_By_des :   ' Choose who is allowed to process this step: any staff member, a specific staff group, or the client.',

            Select_Groups : ' Select Groups',

            Start_Process_Strategy : 'Start Process Strategy',

            Start_Process_Strategy_des :  ' Inherit From ProjectFlow Settings: Uses the predefined process from the projectFlow . Auto: The  step starts automatically when the previous step is complete. Manual: Staff must manually start each step.',


            status_label : 'Status',
            step_status_des : 'The status updates automatically based on workflow steps process. Use this dropdown to manually override it if needed.',

            Start_Process_Date :'Start Process Date',
            Start_Process_Date_des : "The Start Process Date is automatically updated based on the Start Process Action. You can override it if needed.",

            End_Process_Date : 'End Process Date',
            End_Process_Date_des : "The End Process Date is automatically updated based on the End Process Action. You can override it if needed.",



            
            Show_Status_Logs_To_Client : 'Show Status Logs To Client',
            Show_Status_Logs_To_Client_des : ' Choose whether clients can see step status logs.',
            Show_To_Client : 'Show To Client',
            Show_To_Client_des : ' Choose whether clients can see this step.',
            Submit : 'Submit',
            save_changes : 'Save Changes',





            Select_Option : 'Select Option',
            any_staff : 'Any Staff',
            specific_staff_group :  'Specific Staff Groups',
            client :'Client',

            manual : 'Manual',
            auto : 'Auto',
            inherit_from_project_flow : 'Inherit From projectFlow',
            yes : 'Yes',
            no : 'No'
        },


        projectflow_add_or_edit_sub_step : {
            title : "Add New Sub-Step ",
            edit_title : "Edit Sub-Step ", 
            step_name : 'Sub-Step Name',
            step_name_des : 'Enter a name for this Sub-Step.',

            Step_Details : 'Sub-Step Details',
            Step_Details_des :  'Enter a Details for this Sub-Step.',
        
            step_name_ar :'Sub-Step Name (Ar)',
            step_name_ar_des :  'Enter a name for this Sub-Step in Arabic.',
        
            Step_Details_ar : 'Sub-Step Details (Ar)',
            Step_Details_ar_des :  'Enter a Details for this Sub-Step in Arabic.',
        
            Allowed_Process_By : 'Allowed Process By',
            Allowed_Process_By_des :   ' Choose who is allowed to process this Sub-Step: any staff member, a specific staff group, or the client.',

            Select_Groups : ' Select Groups',

            Start_Process_Strategy : 'Start Process Strategy',

            Start_Process_Strategy_des :  ' Inherit From projectflow: Uses the predefined process from the projectflow settings. Auto: The  Sub-Step starts automatically when the previous step is complete. Manual: Staff must manually start each step.',

            status_label : 'Status',
            step_status_des : 'The status updates automatically based on workflow steps process. Use this dropdown to manually override it if needed.',

            Start_Process_Date :'Start Process Date',
            Start_Process_Date_des : "The Start Process Date is automatically updated based on the Start Process Action. You can override it if needed.",

            End_Process_Date : 'End Process Date',
            End_Process_Date_des : "The End Process Date is automatically updated based on the End Process Action. You can override it if needed.",



            
            Show_Status_Logs_To_Client : 'Show Status Logs To Client',
            Show_Status_Logs_To_Client_des : ' Choose whether clients can see this Sub-Step status logs.',
            Show_To_Client : 'Show To Client',
            Show_To_Client_des : ' Choose whether clients can see this Sub-Step.',
            Submit : 'Submit',
            save_changes : 'Save Changes',





            Select_Option : 'Select Option',
            any_staff : 'Any Staff',
            specific_staff_group :  'Specific Staff Groups',
            client :'Client',

            manual : 'Manual',
            auto : 'Auto',
            inherit_from_project_flow : 'Inherit From projectFlow',
            yes : 'Yes',
            no : 'No'
        },


    },



    installed_product_type : {
        list_items : {
            title : 'List items ProjectFlow  Product Type',
            Product_Type_Name : 'Product Type Name',
            Product_Type_Name_ar : 'Product Type Name (Ar)',
            Private_Note : 'Private Note',
            actions : 'Actions',
            edit :'Edit',
            delete : 'Delete',
            No_product_available : 'No product installed type available'
        },

        add_or_edit_new_project : {
            edit_title : 'Edit  Product Type',
            Product_Type_Name : 'Product Type Name',
            Product_Type_Name_ar : 'Product Type Name (Ar)',
            Private_Note : 'Private Note',
            add_item : 'Add Item',
            cancel : 'Cancel',
            update : 'Update'
        }
        
    },

    Statistics : {
        title : 'Projectflows Statistics',
        View : 'View',
        
    }



}