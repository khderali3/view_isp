

export default  {

    projectType : {
        projectTypeSection : {
            section_title : "قسم أنواع المشاريع",

            form : {
                title : 'العنوان',
                details : 'التفاصيل',
                title_ar : 'العنوان (عربي)',
                details_ar : "التفاصيل (عربي)",
                edit : 'تعديل',
                modal_msg : "هل فعلاً تريد حفظ التعديلات؟",
                cancel :'إلغاء الأمر',
                edit : 'تعديل',
                update: 'حفظ التغيرات',
                updating: 'جاري التعديل',
            }

        },

            list_table : {
                title : 'قائمة أنواع المشاريع',

                project_name : 'إسم المشروع' ,
                project_name_ar : 'إسم المشروع (عربي)',
                actions : 'الإجراءات',
                edit : 'تعديل',
                delete : 'حذف'
        },
        form_add_or_edit : {
            project_name : 'إسم المشروع',
            project_name_hint : 'إسم المشروع - تلميح',
            details : 'تفاصيل',
            project_name_ar : 'اسم المشروع (عربي)',
            project_name_hint_ar : 'إسم المشروع - تلميح (عربي)',
            details_ar : 'تفاصيل (عربي)',
            Published :'إعلان على الموقع',
            auto_clone_template : 'تركيب تلقائي لقالب الخطوات',
            search_template_lable: 'يرجى اختيار القالب',
            search_template_ph : 'يرجى إختيار القالب',
            main_image :'الصورة الرئيسية',
            current_image : 'الصورة الحالية',

            extra_images : 'صور إضافية',
            Attachments : 'إرفاق ملفات',
            cancel : 'إلغاء الأمر',
            update : 'حفظ التغييرات',
            add : 'إضافة',
            edit_project_type : 'تعديل نوع المشروع'

        } 

    },
        projectflow_template : {
        main_page : {
            page_title : 'قوالب خطوات المشاريع',
            add_new_template : "إنشاء قالب جديد",
            template_name : 'إسم القالب',
            search_ph : 'البحث بإسم القالب',
            results : "نتائج البحث عن",
            id : 'الرقم',
            show_steps_to_client : 'إظهار الخطوات للعميل',
            steps_process_strategy : 'إستراتيجية معالجة الخطوات',
            manual_start_mode : 'نمط التشغيل اليدوي',
        },

        add_or_edit_template_form : {
            add_title : ' إضافة قالب جديد ',
            edit_title : ' تعديل إعدادات القالب',



            template_name : 'إسم القالب',
            template_name_des : "أدخل إسم للقالب",

            steps_process_strategy : 'إستراتيجية معالجة الخطوات',
            steps_process_strategy_des : "'تلقائي' : الخطوة التالية سوف تبدأ تلقائياً بمجرد إنتهاء الخطوة السابقة , 'يدوي': الطاقم او العميل يجب أن يشغل كل خطوة يدوياً",

            manual_start_mode : 'نمط التشغيل اليدوي',
            manual_start_mode_des : 'تسلسلي : يمكن تشغيل الخطوة فقط في حالة إنتهاء الخطوة السابقة , غير تسلسلي : يمكن تشغيل الخطوة حتى لو الخطوة السابقة غير منتهية',

            auto_start_first_step : "تشغيل الخطوة الأولى بشكل تلقائي ",
            auto_start_first_step_des : "في حال كان مفعل سيتم تشغيل الخطوة الأولى تلقائياً بمجر تركيب القالب على مشروع العميل",

            show_steps_to_client : 'إظهار الخطوات للعميل',
            show_steps_to_client_des : "إختر إمكانية إظهار الخطوات للعميل.",

            show_steps_status_logs_to_client : 'إظهار سجلات حالات الخطوات للعميل',
            show_steps_status_logs_to_client_des : "  إظهار سجلات حالات الخطوات للعميل",




            submit : 'إرسال',
            edit_save_btn : 'حفظ التغييرات'

        }




    },

    template_details : {
        mini_nav : {
            Project_Flow_Template : ' قوالب الخطوات',
            Template_Details : 'تفاصيل القالب'
        },
        detail : 'تفاصيل ',
        Template_ID : 'الرقم',
        Template_Name : 'إسم القالب ',
        Steps_Process_Strategy : 'إستراتيجية بدء الخطوات',
        Manual_Start_Mode : 'نمط البدء اليدوي',
        Auto_Start_First_Step :  "بدء الخطوة الأولى بشكل تلقائي ",
        Show_Steps_To_Client : 'إظهار الخطوات للعميل',
        Show_Step_Status_Logs_To_Client  : 'إظهار سجلات حالات الخطوات للعميل',
  

        Add_New_Step : 'إضافة خطوة جديدة',
        Edit : 'تعديل',
        Delete : 'حذف',
        modal_msg : 'هل فعلاً تريد حذف هذا القالب؟'


    },
    template_step : {
            more_info : 'معلومات أكثر',
            Add_New_Sub_Step : 'إضافة خطوة فرعية',
            Edit : 'تعديل',
            Delete : 'حذف',
            move_up : 'تحريك للأعلى',
            move_down : 'تحريك للأسفل',
            Step_ID : 'الرقم',
            Show_To_Client : 'إظهار للعميل',
            Start_Process_Strategy : 'إستراتيجية بدء الخطوة',
            Allowed_Process_By : 'المسؤول عن المعالجة',
            Allowed_Process_Groups : 'المجموعات المسؤولة عن المعالجة',
            Show_Status_Logs_To_Client : 'إظهار سجلات حالات الخطوة للعميل',
            Step_Title :'إسم الخطوة',
            Step_Details : 'تفاصيل الخطوة',
            del_modal_msg : 'هل فعلاً تريد حذف هذه الخطوة؟'

     },
    notes : {
        notes_title : 'ملاحظات',
        no_notes_available : "لا يوجد ملاحظات",
    },
    single_note : {
        delete : "حذف",
        modal_msg : 'هل فعلاً تريد حذف هذه الملاحظة؟'
    },
    add_step_or_sub_step_note : {
        input_ph : 'أكتب ملاحظتك هنا',
        add_btn : 'إضافة'
    },
    template_sub_step : {
        more_info : 'معلومات أكثر',
        Edit : 'تعديل',
        Delete : 'حذف',
        move_up : 'تحريك للأعلى',
        move_down : 'تحريك للأسفل',
        sub_Step_ID : 'الرقم',
        Show_To_Client : 'إظهار للعميل',
        Start_Process_Strategy : 'إستراتيجية بدء الخطوة',
        Allowed_Process_By : 'المسؤول عن المعالجة',
        Allowed_Process_Groups : 'المجموعات المسؤولة عن المعالجة',
        Show_Status_Logs_To_Client : 'إظهار سجلات حالات الخطوة للعميل',
        sub_Step_Title :'إسم الخطوة الفرعية',
        sub_Step_Details : 'تفاصيل الخطوة الفرعية',
        del_modal_msg : 'هل فعلاً تريد حذف هذه الخطوة الفرعية ؟'
    },

     template_comments : {
        title : "التعليقات & الملاحظات",
        Delete : "حذف",
        modal_msg : 'هل تريد فعلاً حذف هذا التعليق؟.'
     },
    tepmlate_add_or_edit_step : {
        title : "إضافة خطوة لقالب",
        edit_title : "تعديل خطوة قالب", 

        step_name : 'إسم الخطوة',
        step_name_des : 'قم بإدخال إسم لهذه الخطوة.',

        Step_Details : 'تفاصيل الخطوة',
        Step_Details_des :  'قم بإدخال تفاصيل هذه الخطوة',
       
        step_name_ar :'إسم الخطوة (عربي)',
        step_name_ar_des :  'قم بإدخال إسم لهذه الخطوة باللغة العربية',
       
        Step_Details_ar : 'تفاصيل الخطوة (عربي)',
        Step_Details_ar_des :  'قم بإدخال تفاصيل هذه الخطوة باللغة العربية',
       
        Allowed_Process_By :  'المسؤول عن المعالجة',
        Allowed_Process_By_des :   ' قم بإختيار المسؤول عن معالجة هذه الخطوة.',

        Select_Groups : ' إختر المجموعات ',

        Start_Process_Strategy : 'إستراتيجية بدء الخطوة',

        Start_Process_Strategy_des : ' إختر إستراتيجية البدء لهذه الخطوة',

        Show_Status_Logs_To_Client :  'إظهار سجلات حالات الخطوة للعميل',
        Show_Status_Logs_To_Client_des : ' حدد اذا كنت تسمح للعميل بمشاهدة سجلات حالات هذه الخطوة.',
        Show_To_Client : 'إظهار للعميل',
        Show_To_Client_des : ' حدد إذا كنت تسمح للعميل بمشاهدة هذه الخطوة',
        Submit : 'إرسال',
        save_changes : 'حفظ التغييرات',


        Select_Option : 'يرجى الإختيار',
        any_staff :  'أي موظف في طاقم العمل',
        specific_staff_group : 'مجموعات محددة من طاقم العمل',

        client: 'العميل',
        manual : 'يدوي',
        auto : 'تلقائي',
        inherit_from_project_flow : 'الوراثة من الإعدادات الرئيسية',
        yes : 'نعم',
        no : 'لا'

     },


    tepmlate_add_or_edit_sub_step : {
        title : "إضافة خطوة فرعية لقالب",
        edit_title : "تعديل خطوة فرعية لقالب", 

        step_name : 'إسم الخطوة الفرعية',
        step_name_des : 'قم بإدخال إسم لهذه الخطوة الفرعية.',

        Step_Details : 'تفاصيل الخطوة الفرعية',
        Step_Details_des :  'قم بإدخال تفاصيل هذه الخطوة الفرعية',
       
        step_name_ar :'إسم الخطوة الفرعية (عربي)',
        step_name_ar_des :  'قم بإدخال إسم لهذه الخطوة الفرعية  باللغة العربية',
       
        Step_Details_ar : 'تفاصيل الخطوة الفرعية (عربي)',
        Step_Details_ar_des :  'قم بإدخال تفاصيل هذه الخطوة الفرعية باللغة العربية',
       
        Allowed_Process_By :  'المسؤول عن المعالجة',
        Allowed_Process_By_des :   ' قم بإختيار المسؤول عن معالجة هذه الخطوة الفرعية.',

        Select_Groups : ' إختر المجموعات ',

        Start_Process_Strategy : 'إستراتيجية بدء الخطوة',

        Start_Process_Strategy_des : ' إختر إستراتيجية البدء لهذه الخطوة',

        Show_Status_Logs_To_Client :  'إظهار سجلات حالات الخطوة للعميل',
        Show_Status_Logs_To_Client_des : ' حدد اذا كنت تسمح للعميل بمشاهدة سجلات حالات هذه الخطوة.',
        Show_To_Client : 'إظهار للعميل',
        Show_To_Client_des : ' حدد إذا كنت تسمح للعميل بمشاهدة هذه الخطوة',
        Submit : 'إرسال',
        save_changes : 'حفظ التغييرات',


        Select_Option : 'يرجى الإختيار',
        any_staff :  'أي موظف في طاقم العمل',
        specific_staff_group : 'مجموعات محددة من طاقم العمل',

        client: 'العميل',
        manual : 'يدوي',
        auto : 'تلقائي',
        inherit_from_project_flow : 'الوراثة من الإعدادات الرئيسية',
        yes : 'نعم',
        no : 'لا'

     },


    projectflow : {
            main_page : {
                page_title : 'مشاريع العملاء',
                add_new_projectflow : "إضافة مشروع جديد",

                search_form : {
                    project_type_name : ' نوع المشروع',
                    project_type_name_ph : 'البحث حسب نوع المشروع',
                    ProjectFlow_Status : 'حالة المشروع',
                    ProjectFlow_Status_ph : 'البحث حسب حالة المشروع',

                    all : 'الكل',
                    pending : 'قيد الإنتظار',
                    wait_customer_action : 'بإنتظار إجراء من العميل',
                    in_progress : 'قيد العمل',
                    completed : 'منتهي',
                    canceled : 'ملغى',






                    projectFlow_user : 'إسم العميل',
                    projectFlow_user_ph : 'البحث حسب إسم العميل',
                    project_id : 'رقم المشروع',
                    project_id_ph : 'البحث حسب رقم المشروع',
                    results : "النتائج",
                },
                project_type_name : 'نوع المشروع',

                id : 'الرقم',
                Created : ' تاريخ الإنشاء ',
                Latest_Activity : 'آخر تحديث',
                Status : 'الحالة',
                User : 'إسم العميل'
 
            },

            add_new_projectflow : {
                title : 'إضافة مشروع لعميل ',
                select_project_type_label : 'يرجى إختيار نوع المشروع',
                Select_Project_Type : 'إختر نوع المشروع',
                Select_ProjectFlow_User : 'إختر العميل',
                Description : 'تفاصيل',
                Description_ph : "يرجى كتابة تفاصيل عن بيئة المشروع ",

                contact_phone_no : 'رقم هاتف التواصل',
                contact_phone_no_ph : 'يرجى كتابة رقم هاتف للتواصل عليه عند الحاجة',
                project_address :  'مكان تنفيذ المشروع',
                project_address_ph : 'يرجى كتابة عنوان المكان الذي تريد تنفيذ المشروع به. ',





                submit : 'إرسال'
            },
            projectflow_details : {

                mini_nav : {
                    ProjectFlow : ' مشاريع العملاء ',
                    projectflow_Details : 'تفاصيل المشروع'
                },

                details_btn : 'تفاصيل ',

                More_Info : 'تفاصيل أكثر ',
                projectflow_id : 'الرقم',

                Is_Template_Cloned : 'هل تم تركيب القالب',
                Template_Cloned_Name : 'إسم القالب المركب',

                Steps_Process_Strategy : 'إستراتيجية بدء الخطوات',
                Manual_Start_Mode : 'نمط البدء اليدوي',
                Auto_Start_First_Step :  "بدء الخطوة الأولى بشكل تلقائي ",
                Show_Steps_To_Client : 'إظهار الخطوات للعميل',
                Show_Step_Status_Logs_To_Client  : 'إظهار سجلات حالات الخطوات للعميل',
        

                Contact_phone : 'هاتف التواصل',
                Project_Address : 'مكان تنفيذ المشروع',
                created_ip_address : 'عنوان الآي بي للعميل',



                Add_New_Step : 'إضافة خطوة جديدة',
                Edit : 'تعديل',
                Delete : 'حذف',
                modal_msg : 'هل فعلاً تريد حذف هذا المشروع',


            ButtonCloneTemplate : {

                Clone_Template : 'تركيب القالب',
                Re_Clone_Template : 'إعادة تركيب القالب',
                
                Select_Template : 'يرجى إختيار القالب',

                note : "ملاحظة : في حال إختيار إعادة تركيب القالب كافة الخطوات سيتم حذفها وإعادة إنشاؤها من جديد.",
                Cancel : 'إلغاء الأمر',
                Clone :'تركيب'

            },

            CancelProjectFlowOrReOpen : {
 
                re_open_title :'إعادة فتح المشروع وتغيير الحالة لآخر حالة كان بها قبل الإغلاق.',
                close_title : 'إلغاء المشروع',
                re_open_btn_label : 'إعادة فتح المشروع',
                close_btn_lable :  'إلغاء المشروع',
            },

            Project_Type : "نوع المشروع",
            Requester : 'منشئ المشروع',
            Related_User : ' العميل',
            Created : 'تاريخ الإنشاء',
            Latest_activity : 'آخر تحديث',
            status :'الحالة',
            Progress : 'نسبة الإنجاز',

            ViewProductInstalledButton : {
                btn_name : 'عرض المنتجات التي تم تركيبها',
                title : 'قائمة بالمنتجات المركبة ',
                Product_Name : 'إسم المنتج',
                Serial_Number :'الرقم التسلسلي',
                Note : 'ملاحظات',
                Private_Note : 'ملاحظات خاصة',
                No_products_installed : 'لايوجد منتجات مركبة',
                Edit : 'تعديل',
                Close : 'إغلاق',
            }

            },

            projectflow_step : {
                    more_info : 'معلومات أكثر',
                    Add_New_Sub_Step : 'إضافة خطوة فرعية',
                    Edit : 'تعديل',
                    Delete : 'حذف',
                    move_up : 'تحريك للأعلى',
                    move_down : 'تحريك للأسفل',
                    Step_ID : 'الرقم',
                    Show_To_Client : 'إظهار للعميل',
                    Start_Process_Strategy : 'إستراتيجية بدء الخطوة',
                    Allowed_Process_By : 'المسؤول عن المعالجة',
                    Allowed_Process_Groups : 'المجموعات المسؤولة عن المعالجة',
                    Show_Status_Logs_To_Client : 'إظهار سجلات حالات الخطوة للعميل',
                    Step_Title :'إسم الخطوة',
                    Step_Details : 'تفاصيل الخطوة',
                    del_modal_msg : 'هل فعلاً تريد حذف هذه الخطوة؟',

                    step_status : 'حالة الخطوة',
                    Start_Process_Date :'تاريخ بدء المعالجة',
                    End_Process_Date : 'تاريخ إنتهاء المعالجة',
                    Change_Step_Status_Logs : 'سجلات حالات الخطوة',
                    step_status_logs : {
                        status_changed_from : 'تم تغيير الحالة من',
                        user_changed_status_from : 'قام بتغيير حالة الخطوة من',
                        to : 'إلى'
                    },

                    add_note : {
                        input_ph : 'أكتب ملاحظتك هنا',
                        btn_label : 'أضف ملاحظة'
                    }


            },


            projectflow_sub_step : {
                    more_info : 'معلومات أكثر',
 
                    Edit : 'تعديل',
                    Delete : 'حذف',
                    move_up : 'تحريك للأعلى',
                    move_down : 'تحريك للأسفل',
                    Step_ID : 'الرقم',
                    Show_To_Client : 'إظهار للعميل',
                    Start_Process_Strategy : 'إستراتيجية بدء الخطوة',
                    Allowed_Process_By : 'المسؤول عن المعالجة',
                    Allowed_Process_Groups : 'المجموعات المسؤولة عن المعالجة',
                    Show_Status_Logs_To_Client : 'إظهار سجلات حالات الخطوة للعميل',
                    Step_Title :' إسم الخطوة الفرعية',
                    Step_Details : 'تفاصيل الخطوة الفرعية',
                    del_modal_msg : 'هل فعلاً تريد حذف هذه الخطوة الفرعية',

                    step_status : 'حالة الخطوة',
                    Start_Process_Date :'تاريخ بدء المعالجة',
                    End_Process_Date : 'تاريخ إنتهاء المعالجة',
                    Change_Step_Status_Logs : 'سجلات حالات الخطوة',
                    step_status_logs : {
                        status_changed_from : 'تم تغيير الحالة من',
                        user_changed_status_from : 'قام بتغيير حالة الخطوة من',
                        to : 'إلى'
                    },

                    add_note : {
                        input_ph : 'أكتب ملاحظتك هنا',
                        btn_label : 'أضف ملاحظة'
                    }


            },

            projectflow_notes : {
                title : ' الملاحظات & التعليقات ',
                auto_created_msg :" تم إنشاء التعليق بشكل آلي ",
                Delete : 'حذف',
                delete_msg : 'هل فعلا تريد حذف هلا التعليق ؟ ',
                add_note : {
                    cant_add_note : "لا تستطيع إضافة تعليق / ملاحظة لهذا المشروع لأن حالته "
                }
            },


            edit_projectflow : { 
                title : 'تعديل إعدادات المشروع',
                steps_process_strategy : 'إستراتيجية معالجة الخطوات',
                steps_process_strategy_des : "'تلقائي' : الخطوة التالية سوف تبدأ تلقائياً بمجرد إنتهاء الخطوة السابقة , 'يدوي': الطاقم او العميل يجب أن يشغل كل خطوة يدوياً",
                manual_start_mode : 'نمط التشغيل اليدوي',
                manual_start_mode_des : 'تسلسلي : يمكن تشغيل الخطوة فقط في حالة إنتهاء الخطوة السابقة , غير تسلسلي : يمكن تشغيل الخطوة حتى لو الخطوة السابقة غير منتهية',
    
                projectflow_status : 'حالة المشروع',
                // projectflow_status_des : '  Note: The status updates automatically based on workflow steps . Use this dropdown to manually override it if needed.',
                projectflow_status_des : " ملاحظة : الحالة يتم تحديثها تلقائياً بالإعتماد على معالجة الخطوات , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",

    
                auto_start_first_step : "تشغيل الخطوة الأولى بشكل تلقائي ",
                auto_start_first_step_des : "في حال كان مفعل سيتم تشغيل الخطوة الأولى تلقائياً بمجر تركيب القالب على مشروع العميل",
                show_steps_to_client : 'إظهار الخطوات للعميل',
                show_steps_to_client_des : "إختر إمكانية إظهار الخطوات للعميل.",
                show_steps_status_logs_to_client : 'إظهار سجلات حالات الخطوات للعميل',
                show_steps_status_logs_to_client_des : "  إظهار سجلات حالات الخطوات للعميل",
                edit_save_btn : 'حفظ التغييرات'

            },

            projectflow_add_or_edit_step : {
                title : "إضافة خطوة للمشروع ",
                edit_title : "تعديل الخطوة ", 

                step_name : 'إسم الخطوة',
                step_name_des : 'قم بإدخال إسم لهذه الخطوة.',

                Step_Details : 'تفاصيل الخطوة',
                Step_Details_des :  'قم بإدخال تفاصيل هذه الخطوة',
            
                step_name_ar :'إسم الخطوة (عربي)',
                step_name_ar_des :  'قم بإدخال إسم لهذه الخطوة باللغة العربية',
            
                Step_Details_ar : 'تفاصيل الخطوة (عربي)',
                Step_Details_ar_des :  'قم بإدخال تفاصيل هذه الخطوة باللغة العربية',
            
                Allowed_Process_By :  'المسؤول عن المعالجة',
                Allowed_Process_By_des :   ' قم بإختيار المسؤول عن معالجة هذه الخطوة.',

                Select_Groups : ' إختر المجموعات ',

                Start_Process_Strategy : 'إستراتيجية بدء الخطوة',

                Start_Process_Strategy_des : ' إختر إستراتيجية البدء لهذه الخطوة',

                Show_Status_Logs_To_Client :  'إظهار سجلات حالات الخطوة للعميل',
                Show_Status_Logs_To_Client_des : ' حدد اذا كنت تسمح للعميل بمشاهدة سجلات حالات هذه الخطوة.',
                Show_To_Client : 'إظهار للعميل',
                Show_To_Client_des : ' حدد إذا كنت تسمح للعميل بمشاهدة هذه الخطوة',
                Submit : 'إرسال',
                save_changes : 'حفظ التغييرات',



                status_label : 'الحالة ',
                step_status_des : "   الحالة يتم تحديثها تلقائياً بالإعتماد على معالجة الخطوات , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",

                Start_Process_Date :'تاريخ بدء المعالجة',
                Start_Process_Date_des : "   تاريخ بدء المعالجة يتم تحديثها تلقائياً بالإعتماد على بدء معالجة الخطوة , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",

                End_Process_Date : 'تاريخ إنتهاء المعالجة',
                End_Process_Date_des :  "   تاريخ إنتهاء المعالجة يتم تحديثها تلقائياً بالإعتماد على إنتهاء معالجة الخطوة , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",


                

                    
                    




                Select_Option : 'يرجى الإختيار',
                any_staff :  'أي موظف في طاقم العمل',
                specific_staff_group : 'مجموعات محددة من طاقم العمل',

                client: 'العميل',
                manual : 'يدوي',
                auto : 'تلقائي',
                inherit_from_project_flow : 'الوراثة من الإعدادات الرئيسية للمشروع',
                yes : 'نعم',
                no : 'لا'

            },

            projectflow_add_or_edit_sub_step : {
                title : "إضافة خطوة فرعية ",
                edit_title : "تعديل خطوة فرعية ", 

                step_name : 'إسم الخطوة الفرعية',
                step_name_des : 'قم بإدخال إسم لهذه الخطوة الفرعية.',

                Step_Details : 'تفاصيل الخطوة الفرعية',
                Step_Details_des :  'قم بإدخال تفاصيل هذه الخطوة الفرعية',
            
                step_name_ar :'إسم الخطوة الفرعية (عربي)',
                step_name_ar_des :  'قم بإدخال إسم لهذه الخطوة الفرعية  باللغة العربية',
            
                Step_Details_ar : 'تفاصيل الخطوة الفرعية (عربي)',
                Step_Details_ar_des :  'قم بإدخال تفاصيل هذه الخطوة الفرعية باللغة العربية',
            
                Allowed_Process_By :  'المسؤول عن المعالجة',
                Allowed_Process_By_des :   ' قم بإختيار المسؤول عن معالجة هذه الخطوة الفرعية.',

                Select_Groups : ' إختر المجموعات ',

                Start_Process_Strategy : 'إستراتيجية بدء الخطوة',

                Start_Process_Strategy_des : ' إختر إستراتيجية البدء لهذه الخطوة',


                status_label : 'الحالة ',
                step_status_des : "   الحالة يتم تحديثها تلقائياً بالإعتماد على معالجة الخطوات , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",

                Start_Process_Date :'تاريخ بدء المعالجة',
                Start_Process_Date_des : "   تاريخ بدء المعالجة يتم تحديثها تلقائياً بالإعتماد على بدء معالجة الخطوة , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",

                End_Process_Date : 'تاريخ إنتهاء المعالجة',
                End_Process_Date_des :  "   تاريخ إنتهاء المعالجة يتم تحديثها تلقائياً بالإعتماد على إنتهاء معالجة الخطوة , وتستطيع تغييرها يدوياً في حال رغبت بذلك. ",


                




                Show_Status_Logs_To_Client :  'إظهار سجلات حالات الخطوة للعميل',
                Show_Status_Logs_To_Client_des : ' حدد اذا كنت تسمح للعميل بمشاهدة سجلات حالات هذه الخطوة.',
                Show_To_Client : 'إظهار للعميل',
                Show_To_Client_des : ' حدد إذا كنت تسمح للعميل بمشاهدة هذه الخطوة',
                Submit : 'إرسال',
                save_changes : 'حفظ التغييرات',


                Select_Option : 'يرجى الإختيار',
                any_staff :  'أي موظف في طاقم العمل',
                specific_staff_group : 'مجموعات محددة من طاقم العمل',

                client: 'العميل',
                manual : 'يدوي',
                auto : 'تلقائي',
                inherit_from_project_flow : 'الوراثة من الإعدادات الرئيسية',
                yes : 'نعم',
                no : 'لا'

            },
 
    },


    installed_product_type : {
        list_items : {
            title : 'قائمة بأنواع منتجات المشاريع',
            Product_Type_Name : 'إسم المنتج',
            Product_Type_Name_ar : 'إسم المنتج (عربي)',
            Private_Note : 'ملاحظة خاصة',
            actions : 'الإجراءات',
            edit :'تعديل',
            delete : 'حذف',
            No_product_available : 'لايوجد منتجات مركبة',

        },

        add_or_edit_new_project : {
            edit_title : 'تعديل المنتج',

            Product_Type_Name : 'إسم المنتج',
            Product_Type_Name_ar : 'إسم المنتج (عربي)',
            Private_Note : 'ملاحظة خاصة',
            add_item : 'إضافة',
            cancel : 'إلغاء الأمر',
            update : 'حفظ التغييرات'
            
        }
        
    },


    Statistics : {

    }









}