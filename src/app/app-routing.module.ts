import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AccessToLoginPageGuard } from './guards/access-to-login-page.guard';
import { EmployeesPageComponent } from './pages/employees/employees-page/employees-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { WarehousePageComponent } from './pages/warehouse-page/warehouse-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { RolesPageComponent } from './pages/roles/roles-page/roles-page.component';
import { DivisionsPageComponent } from './pages/divisions-page/divisions-page.component';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import { RoleDetailsPageComponent } from './pages/roles/role-details-page/role-details-page.component';
import { EmployeeDetailsPageComponent } from './pages/employees/employee-details-page/employee-details-page.component';
import { PersonalAccountPageComponent } from './pages/personal-account-page/personal-account-page.component';
import { ProjectDetailsPageComponent } from './pages/projects/project-details-page/project-details-page.component';
import { ProjectStageDetailsPageComponent } from './pages/project-stage/project-stage-details-page/project-stage-details-page.component';
import { ClientViewMainComponent } from './pages/client-view/client-view-main-page/client-view-main-page.component';
import { UserOnlyGuard } from './guards/user-only.guard';
import { ClientGuard } from './guards/client.guard';
import { ClientViewProjectDetailsComponent } from './pages/client-view/client-view-project-details-page/client-view-project-details-page.component';
import { ClientViewLoginPageComponent } from './pages/client-view/client-view-login-page/client-view-login-page.component';
import { ClientViewProjectStageDetailsComponent } from './pages/client-view/client-view-project-stage-details-page/client-view-project-stage-details-page.component';
import { EmployeesPageGuardGuard } from './guards/employees-page-guard.guard';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { ClientViewChatsPageComponent } from './pages/client-view/client-view-chats-page/client-view-chats-page.component';

const routes: Routes = [
  { path: 'Login', component: LoginPageComponent, title: "Вход - Аветон", canActivate: [AccessToLoginPageGuard] },
  { path: 'ClientView/Login', component: ClientViewLoginPageComponent, title: "Вход - Аветон", canActivate: [AccessToLoginPageGuard] },
  { path: '', component: MainPageComponent, title: "Главная - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'ClientView', component: ClientViewMainComponent, title: "Главная - Аветон", canActivate: [ClientGuard] },
  { path: 'ClientView/Project/Details/:projectId/:activeTab', component: ClientViewProjectDetailsComponent, canActivate: [ClientGuard] },
  { path: 'ClientView/Project/Stages/Details/:projectStageId', component: ClientViewProjectStageDetailsComponent, canActivate: [ClientGuard] },
  { path: 'ClientView/Chats', component: ClientViewChatsPageComponent, title: "Сообщения - Аветон", canActivate: [ClientGuard] },
  { path: 'ClientView/Chats/:chatId', component: ClientViewChatsPageComponent, title: "Сообщения - Аветон", canActivate: [ClientGuard] },
  { path: 'Projects', component: ProjectsPageComponent, title: "Проекты - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Projects/Details/:projectId/:activeTab', component: ProjectDetailsPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'Projects/Stages/Details/:projectStageId', component: ProjectStageDetailsPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'Warehouse', component: WarehousePageComponent, title: "Склад - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Clients', component: ClientsPageComponent, title: "Клиенты - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'PersonalAccount', component: PersonalAccountPageComponent, title: "Личный кабинет - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Employees', component: EmployeesPageComponent, title: "Сотрудники - Аветон", canActivate: [EmployeesPageGuardGuard] },
  { path: 'Employees/Details/:employeeId', component: EmployeeDetailsPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'Employees/Roles', component: RolesPageComponent, title: "Роли - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Employees/Roles/:roleId', component: RoleDetailsPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'Employees/Divisions', component: DivisionsPageComponent, title: "Подразделения - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Employees/Positions', component: PositionsPageComponent, title: "Должности - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Chats', component: ChatsPageComponent, title: "Сообщения - Аветон", canActivate: [UserOnlyGuard] },
  { path: 'Chats/:chatId', component: ChatsPageComponent, title: "Сообщения - Аветон", canActivate: [UserOnlyGuard] },
  //next navigations
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
