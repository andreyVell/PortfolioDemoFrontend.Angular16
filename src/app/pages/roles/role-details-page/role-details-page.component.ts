import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AvetonRole } from 'src/app/models/AvetonRole/AvetonRole';
import { AvetonRoleAccess } from 'src/app/models/AvetonRole/AvetonRoleAccess';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AccessService } from 'src/app/services/access.service';
import { AvetonRoleService } from 'src/app/services/aveton-role.service';

@Component({
  selector: 'app-role-details-page',
  templateUrl: './role-details-page.component.html',
  styleUrls: ['./role-details-page.component.css']
})
export class RoleDetailsPageComponent extends ComponentWithAccessSegregation {
  private readonly roleId: string;
  public isRoleUpdating: boolean = false;
  public role: AvetonRole = new AvetonRole();
  public detailsPageTitle: string = 'Роли';
  public accesses: { [key: string]: AvetonRoleAccess[] } = {};
  public displayNames: { displayName: string, entityName: string, isPrevObjectIsParent: boolean, toolTip: string}[]
    = [
      {
        displayName: 'Проекты',
        entityName: 'Project',
        isPrevObjectIsParent: false,
        toolTip: '',
      },
      {
        displayName: 'Этапы',
        entityName: 'ProjectStage',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Ответственные лица',
        entityName: 'StageManager',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Исполнители',
        entityName: 'DivisionContractor',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Отчёты',
        entityName: 'StageReport',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Прикреплённые файлы',
        entityName: 'StageReportAttachedFile',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Клиенты (Заказчики)',
        entityName: 'Client',
        isPrevObjectIsParent: false,
        toolTip: 'Заказчики на странице подробностей проекта',
      },
      {
        displayName: 'Юр. лица',
        entityName: 'Organization',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Физ. лица',
        entityName: 'Person',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Чаты',
        entityName: 'Chat',
        isPrevObjectIsParent: false,
        toolTip: '',
      },
      {
        displayName: 'Сообщения',
        entityName: 'ChatMessage',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Роли',
        entityName: 'AvetonRole',
        isPrevObjectIsParent: false,
        toolTip: '',
      },
      {
        displayName: 'Пользователи системы',
        entityName: 'AvetonUser',
        isPrevObjectIsParent: true,
        toolTip: 'Данные сотрудника для входа в систему',
      },
      {
        displayName: 'Сотрудники',
        entityName: 'Employee',
        isPrevObjectIsParent: false,
        toolTip: '',
      },
      {
        displayName: 'Места работы',
        entityName: 'Job',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Должности',
        entityName: 'Position',
        isPrevObjectIsParent: true,
        toolTip: '',
      },
      {
        displayName: 'Подразделения',
        entityName: 'Division',
        isPrevObjectIsParent: true,
        toolTip: '',
      }      
    ];

  constructor(
    private avetonRoleService: AvetonRoleService,
    protected override accessService: AccessService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title
  ) {
    super(accessService);
    this.roleId = activateRoute.snapshot.params['roleId'];
    this.PopulateRole();
  }

  public BackPageClick() {
    this.router.navigate(['Employees/Roles']);
  }

  public SaveRole() {
    this.isRoleUpdating = true;
    this.avetonRoleService.Update(this.role)
      .subscribe({
        next: (response: ApiResponseSuccessfullUpdate) => {
          this.role.updatedOn = response.updatedOn;
          this.role.updatedByUser = response.updatedByUser;
          this.detailsPageTitle = this.role.name;
          this.titleService.setTitle(this.role.name + ' - Роли');
          this.isRoleUpdating = false;
          this.snackBar.open(
            "Роль обновлена",
            "Ок",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4000,
              panelClass: ['snack-bar-success']
            });
        },
        error: (err: any) => {
          this.isRoleUpdating = false;
        }
      })
  }

  private PopulateRole() {
    this.avetonRoleService.Get(this.roleId)
      .subscribe({
        next: (response: AvetonRole) => {
          this.role = response;
          this.GroupAccesses(this.role.accesses);
          this.detailsPageTitle = this.role.name;
          this.titleService.setTitle(this.role.name + ' - Роли');
        }
      })
  }

  private GroupAccesses(array: Array<AvetonRoleAccess>) {
    array.forEach((ara: AvetonRoleAccess) => {
      if (typeof this.accesses[ara.entityName] !== "undefined") {
        this.accesses[ara.entityName].push(ara);
      }
      else {
        this.accesses[ara.entityName] = new Array<AvetonRoleAccess>();
        this.accesses[ara.entityName].push(ara);
      }
    });
    for (let key in this.accesses) {
      this.accesses[key] = this.accesses[key].sort((a, b) => a.entityAction - b.entityAction);
    }
  }
}
