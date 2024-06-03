import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { JwtModule } from "@auth0/angular-jwt";

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HttpErrorHandlerInterceptor } from './interceptors/http-error-handler.interceptor';
import { NavigationMenuComponent } from './components/navigation/navigation-menu/navigation-menu.component';
import { NavigationHeaderComponent } from './components/navigation/navigation-header/navigation-header.component';
import { EmployeesPageComponent } from './pages/employees/employees-page/employees-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { WarehousePageComponent } from './pages/warehouse-page/warehouse-page.component';
import { RolesPageComponent } from './pages/roles/roles-page/roles-page.component';
import { EmployeesMenuComponent } from './components/navigation/employees-menu/employees-menu.component';
import { DivisionsPageComponent } from './pages/divisions-page/divisions-page.component';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import { AvetonRoleCreatorComponent } from './components/aveton-role/aveton-role-creator/aveton-role-creator.component';
import { ConfirmationDialogComponent } from './components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { RoleDetailsPageComponent } from './pages/roles/role-details-page/role-details-page.component';
import { DivisionCreatorComponent } from './components/division/division-creator/division-creator.component';
import { DivisionEditorComponent } from './components/division/division-editor/division-editor.component';
import { PositionCreatorComponent } from './components/position/position-creator/position-creator.component';
import { PositionEditorComponent } from './components/position/position-editor/position-editor.component';
import { EmployeeDetailsPageComponent } from './pages/employees/employee-details-page/employee-details-page.component';
import { EmployeePersonalInfoComponent } from './components/employees/employee-personal-info/employee-personal-info.component';
import { EmployeeRolesComponent } from './components/employees/employee-roles/employee-roles.component';
import { PositionSelectorComponent } from './components/position/position-selector/position-selector.component';
import { DivisionSelectorComponent } from './components/division/division-selector/division-selector.component';
import { AvetonRoleSelectorComponent } from './components/aveton-role/aveton-role-selector/aveton-role-selector.component';
import { EmployeeCreatorComponent } from './components/employees/employee-creator/employee-creator.component';
import { PersonalAccountPageComponent } from './pages/personal-account-page/personal-account-page.component';
import { PersonCreatorComponent } from './components/client/person-creator/person-creator.component';
import { PersonEditorComponent } from './components/client/person-editor/person-editor.component';
import { OrganizationCreatorComponent } from './components/client/organization-creator/organization-creator.component';
import { OrganizationEditorComponent } from './components/client/organization-editor/organization-editor.component';
import { ProjectCardComponent } from './components/project/project-card/project-card.component';
import { ProjectCreatorComponent } from './components/project/project-creator/project-creator.component';
import { ProjectDetailsPageComponent } from './pages/projects/project-details-page/project-details-page.component';
import { ProjectDetailsMainInfoComponent } from './components/project/projectDetails/project-details-main-info/project-details-main-info.component';
import { ProjectDetailsStagesComponent } from './components/project/projectDetails/project-details-stages/project-details-stages.component';
import { EmployeeSelectorComponent } from './components/employees/employee-selector/employee-selector.component';
import { ClientSelectorComponent } from './components/client/client-selector/client-selector.component';
import { ProjectStageCreatorComponent } from './components/projectStage/project-stage-creator/project-stage-creator.component';
import { ProjectStageDetailsPageComponent } from './pages/project-stage/project-stage-details-page/project-stage-details-page.component';
import { ProjectStageReportCreatorComponent } from './components/projectStage/project-stage-report-creator/project-stage-report-creator.component';
import { ProjectStageReportDetailsComponent } from './components/projectStage/project-stage-report-details/project-stage-report-details.component';
import { ClientViewLoginPageComponent } from './pages/client-view/client-view-login-page/client-view-login-page.component';
import { ClientViewMainComponent } from './pages/client-view/client-view-main-page/client-view-main-page.component';
import { ClientNavigationHeaderComponent } from './components/client-view/client-navigation-header/client-navigation-header.component';
import { ClientViewProjectDetailsComponent } from './pages/client-view/client-view-project-details-page/client-view-project-details-page.component';
import { ClientProjectCardComponent } from './components/client-view/client-project-card/client-project-card.component';
import { ClientProjectDetailsInfoComponent } from './components/client-view/client-project-details-info/client-project-details-info.component';
import { ClientProjectDetailsStagesComponent } from './components/client-view/client-project-details-stages/client-project-details-stages.component';
import { ClientViewProjectStageDetailsComponent } from './pages/client-view/client-view-project-stage-details-page/client-view-project-stage-details-page.component';
import { ClientProjectStageReportDetailsComponent } from './components/client-view/client-project-stage-report-details/client-project-stage-report-details.component';
import { SmallProjectCardComponent } from './components/project/small-project-card/small-project-card.component';
import { ClientSmallProjectCardComponent } from './components/client-view/client-small-project-card/client-small-project-card.component';
import { LoadingIndicationComponent } from './components/_common-ui-components/_loading-indication/loading-indication.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { ActiveChatComponent } from './components/chat/active-chat/active-chat.component';
import { ChatInListComponent } from './components/chat/chat-in-list/chat-in-list.component';
import { ChatCreatorComponent } from './components/chat/chat-creator/chat-creator.component';
import { ScrollEndTrackerDirective } from './directives/scroll-end-tracker.directive';
import { IsElementInViewTrackerDirective } from './directives/is-element-in-view-tracker.directive';
import { AvetonBadgeDirective } from './directives/aveton-badge.directive';
import { ClientViewChatsPageComponent } from './pages/client-view/client-view-chats-page/client-view-chats-page.component';
import { ClientActiveChatComponent } from './components/client-view/client-active-chat/client-active-chat.component';
import { ClientChatInListComponent } from './components/client-view/client-chat-in-list/client-chat-in-list.component';
import { AvetonAutosizeInputDirective } from './directives/aveton-autosize-input.directive';
import { SelectedLocalFilesVisualizerComponent } from './components/_common-ui-components/selected-local-files-visualizer/selected-local-files-visualizer.component';
import { FilesVisualizerComponent } from './components/_common-ui-components/files-visualizer/files-visualizer.component';
import { ImageViewerComponent } from './components/_common-ui-components/image-viewer/image-viewer.component';
import { ChatDetailsComponent } from './components/chat/chat-details/chat-details.component';
import { PotentialChatMembersSelectorComponent } from './components/chat/potential-chat-members-selector/potential-chat-members-selector.component';
import { IsChatMessageRenderedDirective } from './directives/is-chat-message-rendered.directive';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    NavigationMenuComponent,
    NavigationHeaderComponent,
    EmployeesPageComponent,
    ProjectsPageComponent,
    ClientsPageComponent,
    WarehousePageComponent,
    RolesPageComponent,
    EmployeesMenuComponent,
    DivisionsPageComponent,
    PositionsPageComponent,
    AvetonRoleCreatorComponent,
    ConfirmationDialogComponent,
    RoleDetailsPageComponent,
    DivisionCreatorComponent,
    DivisionEditorComponent,
    PositionCreatorComponent,
    PositionEditorComponent,
    EmployeeDetailsPageComponent,
    EmployeePersonalInfoComponent,
    EmployeeRolesComponent,
    PositionSelectorComponent,
    DivisionSelectorComponent,
    AvetonRoleSelectorComponent,
    EmployeeCreatorComponent,
    PersonalAccountPageComponent,
    PersonCreatorComponent,
    PersonEditorComponent,
    OrganizationCreatorComponent,
    OrganizationEditorComponent,
    ProjectCardComponent,
    ProjectCreatorComponent,
    ProjectDetailsPageComponent,
    ProjectDetailsMainInfoComponent,
    ProjectDetailsStagesComponent,
    EmployeeSelectorComponent,
    ClientSelectorComponent,
    ProjectStageCreatorComponent,
    ProjectStageDetailsPageComponent,
    ProjectStageReportCreatorComponent,
    ProjectStageReportDetailsComponent,
    ClientViewLoginPageComponent,
    ClientViewMainComponent,
    ClientNavigationHeaderComponent,
    ClientViewProjectDetailsComponent,
    ClientProjectCardComponent,
    ClientProjectDetailsInfoComponent,
    ClientProjectDetailsStagesComponent,
    ClientViewProjectStageDetailsComponent,
    ClientProjectStageReportDetailsComponent,
    SmallProjectCardComponent,
    ClientSmallProjectCardComponent,
    LoadingIndicationComponent,
    ChatsPageComponent,
    ActiveChatComponent,
    ChatInListComponent,
    ChatCreatorComponent,
    ScrollEndTrackerDirective,
    IsElementInViewTrackerDirective,
    AvetonBadgeDirective,
    ClientViewChatsPageComponent,
    ClientActiveChatComponent,
    ClientChatInListComponent,
    AvetonAutosizeInputDirective,
    SelectedLocalFilesVisualizerComponent,
    FilesVisualizerComponent,
    ImageViewerComponent,
    ChatDetailsComponent,
    PotentialChatMembersSelectorComponent,
    IsChatMessageRenderedDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTreeModule,
    MatProgressBarModule,
    MatRippleModule,
    MatTooltipModule,
    MatProgressSpinnerModule
    // JwtModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorHandlerInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
