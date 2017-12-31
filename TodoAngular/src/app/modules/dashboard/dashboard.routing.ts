import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard.component';

const DASHBOARD_ROUTES: Routes = [
    {path: '', component: DashboardComponent},
];

export const DASHBOARD_ROUTING = RouterModule.forChild(DASHBOARD_ROUTES);
