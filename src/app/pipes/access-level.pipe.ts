import { Pipe, PipeTransform } from '@angular/core';


export interface Role {
  name: String;
  access_level: Number;
  viewValue: String;
}

@Pipe({
  name: 'accessLevel'
})
export class AccessLevelPipe implements PipeTransform {

  transform(roles: any[], user_access: number): Role[] {
    user_access === 4 ? user_access = 4 : user_access -= 1;
    const filteredRoles = roles.filter( (rol) => rol.access_level <= user_access);

    return filteredRoles;
  }

}
