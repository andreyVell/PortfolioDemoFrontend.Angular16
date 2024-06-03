import { AccessService } from "src/app/services/access.service";
import { AdaptiveComponent } from "../_AdaptiveComponent/AdaptiveComponent";

export class ComponentWithAccessSegregation extends AdaptiveComponent {    
    constructor(protected accessService: AccessService) {
        super();        
    }    

    public HasReadAccessTo(entityName: string) {
        return this.accessService.HasReadAccessTo(entityName);
    }

    public HasUpdateAccessTo(entityName: string) {
        return this.accessService.HasUpdateAccessTo(entityName);
    }

    public HasCreateAccessTo(entityName: string) {        
        return this.accessService.HasCreateAccessTo(entityName);
    }

    public HasDeleteAccessTo(entityName: string) {
        return this.accessService.HasDeleteAccessTo(entityName);
    }    
}