import { isDevMode } from "@angular/core";

export class BackendApiEndpoints {
    private static backend_api_url: string = isDevMode() ? 'https://localhost:7276/api' : 'api';

    private static _endpoints: { [key: string]: any } = {
        "JobDivision": {
            "GetAll": this.backend_api_url + '/JobDivision',
            "Page": this.backend_api_url + '/JobDivision/Page',
            "Get": this.backend_api_url + '/JobDivision',
            "Delete": this.backend_api_url + '/JobDivision',
            "Create": this.backend_api_url + '/JobDivision',
            "Update": this.backend_api_url + '/JobDivision',
        }
    }

    public static GetAll(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["GetAll"] !== "undefined") {
            return this._endpoints[typeName]["GetAll"];
        }
        else {
            return this.backend_api_url + '/' + typeName;
        }
    }
    public static Page(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["Page"] !== "undefined") {
            return this._endpoints[typeName]["Page"];
        }
        else {
            return this.backend_api_url + '/' + typeName + '/Page';
        }
    }
    public static Get(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["Get"] !== "undefined") {
            return this._endpoints[typeName]["Get"];
        }
        else {
            return this.backend_api_url + '/' + typeName;
        }
    }
    public static Create(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["Create"] !== "undefined") {
            return this._endpoints[typeName]["Create"];
        }
        else {
            return this.backend_api_url + '/' + typeName;
        }
    }
    public static Update(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["Update"] !== "undefined") {
            return this._endpoints[typeName]["Update"];
        }
        else {
            return this.backend_api_url + '/' + typeName;
        }
    }
    public static Delete(typeName: string): string {
        if (typeof this._endpoints[typeName] !== "undefined" && typeof this._endpoints[typeName]["Delete"] !== "undefined") {
            return this._endpoints[typeName]["Delete"];
        }
        else {
            return this.backend_api_url + '/' + typeName;
        }
    }

    public static user_authentication_endpoint: string = this.backend_api_url + '/Authentication';
    public static client_authentication_endpoint: string = this.backend_api_url + '/ClientsView/Login';
    public static get_parent_divisions_endpoint: string = this.backend_api_url + '/Divisions/ParentDivisions';
    public static get_curent_user_employee_endpoint: string = this.backend_api_url + '/CurrentUser/Employee';
    public static get_curent_user_employee_short_info_endpoint: string = this.backend_api_url + '/CurrentUser/EmployeeShortInfo';
    public static get_curent_user_accesses_endpoint: string = this.backend_api_url + '/CurrentUser/GetAccesses';
    public static get_all_stages_for_project_endpoint: string = this.backend_api_url + '/ProjectStages/GetAllForProject';
    public static get_nested_list_divisions_endpoint: string = this.backend_api_url + '/Divisions/NestedList';
    public static get_client_view_projects_page_endpoint: string = this.backend_api_url + '/ClientsView/Projects/Page';
    public static get_client_view_project_details_page_endpoint: string = this.backend_api_url + '/ClientsView/ProjectDetails';
    public static get_client_view_project_stages_endpoint: string = this.backend_api_url + '/ClientsView/GetAllStagesForProject';
    public static get_client_view_project_name_for_stage_endpoint: string = this.backend_api_url + '/ClientsView/GetProjectName';
    public static get_client_view_project_stage_details_endpoint: string = this.backend_api_url + '/ClientsView/GetProjectStageDetails';
    public static get_client_view_stage_report_attached_file_content_endpoint: string = this.backend_api_url + '/ClientsView/GetStageReportAttachedFileContent';
    public static create_client_view_chat_message_endpoint: string = this.backend_api_url + '/ClientsView/ChatMessages';
    public static get_client_view_more_messages_for_chat_endpoint: string = this.backend_api_url + '/ClientsView/ChatMessages/LoadMoreMessages';
    public static get_client_view_chats_page_endpoint: string = this.backend_api_url + '/ClientsView/Chats/Page';
    public static get_client_view_chat_endpoint: string = this.backend_api_url + '/ClientsView/Chats';
    public static create_chat_message_endpoint: string = this.backend_api_url + '/ChatMessages';
    public static chats_hub_endpoint: string = this.backend_api_url + '/ChatsHub';
    public static get_potential_chat_members_endpoint: string = this.backend_api_url + '/ChatMembers/PotentialMembersPage';
    public static get_chat_for_interlocutor_endpoint: string = this.backend_api_url + '/Chats/ChatForInterlocutor';
    public static get_more_messages_for_chat_endpoint: string = this.backend_api_url + '/ChatMessages/LoadMoreMessages';

    public static get_child_divisions_endpoint(divisionId: string): string {
        return this.backend_api_url + `/Divisions/${divisionId}/ChildDivisions`;
    }

    public static aveton_user_get_all_roles_endpoint(avetonUserId: string): string {
        return this.backend_api_url + `/AvetonUsers/${avetonUserId}/GetAllRoles`;
    }

    public static delete_aveton_user_role_endpoint(avetonUserId: string, avetonRoleId: string): string {
        return this.backend_api_url + `/AvetonUsers/${avetonUserId}/DeleteRole/${avetonRoleId}`;
    }

    public static add_selected_role_to_user_endpoint(avetonUserId: string, avetonRoleId: string): string {
        return this.backend_api_url + `/AvetonUsers/${avetonUserId}/AddRole/${avetonRoleId}`;
    }

    public static get_project_name_of_project_stage_endpoint(projectStageId: string): string {
        return this.backend_api_url + `/ProjectStages/${projectStageId}/GetProjectName`;
    }

    public static get_attached_file_content_endpoint(stageReportAttachedFileId: string): string {
        return this.backend_api_url + `/StageReportAttachedFiles/${stageReportAttachedFileId}/FileContent`;
    }

    public static get_employee_small_avatar_endpoint(employeeId: string): string {
        return this.backend_api_url + `/Employees/${employeeId}/EmployeeSmallAvatar`;
    }

    public static get_employee_big_avatar_endpoint(employeeId: string): string {
        return this.backend_api_url + `/Employees/${employeeId}/EmployeeBigAvatar`;
    }
    public static get_chat_small_avatar_endpoint(chatId: string): string {
        return this.backend_api_url + `/Chats/${chatId}/ChatSmallAvatar`;
    }
    public static get_chat_big_avatar_endpoint(chatId: string): string {
        return this.backend_api_url + `/Chats/${chatId}/ChatBigAvatar`;
    }
    public static get_chat_member_small_avatar_endpoint(chatMemberId: string): string {
        return this.backend_api_url + `/ChatMembers/${chatMemberId}/SmallAvatar`;
    }
    public static view_chat_message_endpoint(chatMessageId: string, viewById: string): string {
        return this.backend_api_url + `/ChatMessages/${chatMessageId}/ViewBy/${viewById}`;
    }

    public static get_client_view_chat_member_small_avatar_endpoint(chatMemberId: string): string {
        return this.backend_api_url + `/ClientsView/ChatMembers/${chatMemberId}/SmallAvatar`;
    }

    public static client_view_view_chat_message_endpoint(chatMessageId: string, viewById: string): string {
        return this.backend_api_url + `/ClientsView/ChatMessages/${chatMessageId}/ViewBy/${viewById}`;
    }
    public static get_client_view_chat_small_avatar_endpoint(chatId: string): string {
        return this.backend_api_url + `/ClientsView/Chats/${chatId}/ChatSmallAvatar`;
    }

    public static get_chat_message_attached_file_content_endpoint(chatMessageAttachedFileId: string): string {
        return this.backend_api_url + `/ChatMessages/${chatMessageAttachedFileId}/FileContent`;
    }

    public static get_client_view_chat_message_attached_file_content_endpoint(chatMessageAttachedFileId: string): string {
        return this.backend_api_url + `/ClientsView/ChatMessages/AttachedFiles/${chatMessageAttachedFileId}/FileContent`;
    }

    public static get_chat_member_delete_from_chat_endpoint(chatId: string, chatMemberId: string): string {
        return this.backend_api_url + `/Chats/${chatId}/DeleteChatMember/${chatMemberId}`;
    }

    public static add_chat_members_to_chat_endpoint(chatId: string): string {
        return this.backend_api_url + `/Chats/${chatId}/AddChatMembers`;
    }
}