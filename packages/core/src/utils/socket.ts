import { getMetadataStorage } from '@penguin/metadata';

export abstract class SocketUtils {
    static modules = getMetadataStorage().getBuiltModuleMetadata();
    static events: {
        [key: string]: {
            name: string;
            parent: string;
            methodName: string;
        };
    } = {};

    static build() {
        for (const module of SocketUtils.modules) {
            const events = getMetadataStorage().getGroupEventMetadata(
                module.name
            );
            for (const event of events) {
                SocketUtils.events[event.name] = {
                    ...event,
                };
            }
        }
    }

    static find(name: string) {
        return SocketUtils.events[name];
    }
}
