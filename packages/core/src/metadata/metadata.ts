import { EventMetadataOptions } from './declarations/Event.metadata';
import { FieldMetadataOptions } from './declarations/Field.metadata';
import { MethodParamMetadataOptions } from './declarations/Method.param.metadata';
import { ModuleOptions } from './declarations/Module.metadata';
import { ObjectMetadataOptions } from './declarations/Object.metadata';
import { QueryMetadataOptions } from './declarations/Query.metadata';
import { RouteOptions } from './declarations/Route.metadata';

export class Metadata {
    private routeMetadata: RouteOptions[] = [];
    private moduleMetadata: ModuleOptions[] = [];
    private eventMetadata: EventMetadataOptions[] = [];
    private queryMetadata: QueryMetadataOptions[] = [];
    private objectMetadata: ObjectMetadataOptions[] = [];
    private fieldMetadata: FieldMetadataOptions[] = [];
    private methodParamMetadata: MethodParamMetadataOptions[] = [];

    collectRouteMetadata(options: RouteOptions) {
        this.routeMetadata.push(options);
    }

    getRouteMetadata() {
        return this.routeMetadata;
    }

    getGroupRouteMetadata(module: string) {
        return this.routeMetadata.filter((r) => r.parent === module);
    }

    collectModuleMetadata(options: ModuleOptions) {
        this.moduleMetadata.push(options);
    }

    getModuleMetadata(identifyer?: string) {
        if (identifyer) {
            return this.moduleMetadata.find((v) => v.name === identifyer);
        }
        return this.moduleMetadata;
    }

    getSingleModuleMetadata(module: string) {
        return this.moduleMetadata.find((m) => m.name === module);
    }

    collectEventMetadata(options: EventMetadataOptions) {
        this.eventMetadata.push(options);
    }

    getGroupEventMetadata(module: string) {
        return this.eventMetadata.filter((e) => e.parent === module);
    }

    collectQueryMetadata(options: QueryMetadataOptions) {
        this.queryMetadata.push(options);
    }

    getSingleQueryMetadata(name: string) {
        return this.queryMetadata.find((q) => q.name === name);
    }

    getQueryMetadata() {
        return this.queryMetadata;
    }

    collectObjectMetadata(options: ObjectMetadataOptions) {
        this.objectMetadata.push(options);
    }

    getSingleObjectMetadata(identifyer: string) {
        return this.objectMetadata.find((o) => o.name === identifyer);
    }

    getObjectMetadata() {
        return this.objectMetadata;
    }

    collectFieldMetadata(options: FieldMetadataOptions) {
        this.fieldMetadata.push(options);
    }

    getSingleFieldMetadata(identifyer: string) {
        return this.fieldMetadata.find((o) => o.name === identifyer);
    }

    getGroupFieldMetadata(identifyer: string) {
        return this.fieldMetadata.filter((o) => o.parent === identifyer);
    }

    collectMethodParamMetadata(options: MethodParamMetadataOptions) {
        this.methodParamMetadata.push(options);
    }

    getGroupMethodMetadata(identifyer: string) {
        return this.methodParamMetadata.filter((m) => m.parent === identifyer);
    }
}
