import { EventMetadataOptions } from './declarations/Event.metadata';
import { FieldMetadataOptions } from './declarations/Field.metadata';
import { InputMetadataOptions } from './declarations/Input.metadata';
import { MethodMetadataOptions } from './declarations/Method.metadata';
import { MethodParamMetadataOptions } from './declarations/Method.param.metadata';
import {
    BuiltModuleMetadataOptions,
    ModuleOptions,
} from './declarations/Module.metadata';
import { ObjectMetadataOptions } from './declarations/Object.metadata';
import { PackageMetadataOptions } from './declarations/Package.metadata';
import { QueryMetadataOptions } from './declarations/Query.metadata';
import { RouteOptions } from './declarations/Route.metadata';

export class Metadata {
    routeMetadata: RouteOptions[] = [];
    moduleMetadata: ModuleOptions[] = [];
    eventMetadata: EventMetadataOptions[] = [];
    queryMetadata: QueryMetadataOptions[] = [];
    objectMetadata: ObjectMetadataOptions[] = [];
    fieldMetadata: FieldMetadataOptions[] = [];
    methodParamMetadata: MethodParamMetadataOptions[] = [];
    inputMetadata: InputMetadataOptions[] = [];
    packageMetadata: PackageMetadataOptions[] = [];
    builtModuleMetadata: BuiltModuleMetadataOptions[] = [];
    methodMetadata: MethodMetadataOptions[] = [];

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

    getGroupMethodMetadata(identifyer: string, root: string, kind: string) {
        return this.methodParamMetadata.filter(
            (m) =>
                m.parent === identifyer &&
                m.root === root &&
                m.parentKind === kind
        );
    }

    collectInputMetadata(options: InputMetadataOptions) {
        this.inputMetadata.push(options);
    }

    getInputMetadata() {
        return this.inputMetadata;
    }

    collectPackageMetadata(options: PackageMetadataOptions) {
        this.packageMetadata.push(options);
    }

    getPackageMetadata() {
        return this.packageMetadata;
    }

    collectBuiltModuleMetadata(options: BuiltModuleMetadataOptions) {
        this.builtModuleMetadata.push(options);
    }

    getBuiltModuleMetadata() {
        return this.builtModuleMetadata;
    }

    collectMethodMetadata(options: MethodMetadataOptions) {
        this.methodMetadata.push(options);
    }
}
