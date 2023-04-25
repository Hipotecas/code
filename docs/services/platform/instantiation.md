
# InstantiationService

The instantiation service is the main service that is used to create instances of classes.

```ts
export interface IInstantiationService {

	readonly _serviceBrand: undefined;

	/**
	 * Synchronously creates an instance that is denoted by the descriptor
	 */
	createInstance<T>(descriptor: descriptors.SyncDescriptor0<T>): T;
	createInstance<Ctor extends new (...args: any[]) => any, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;

	/**
	 * Calls a function with a service accessor.
	 */
	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;

	/**
	 * Creates a child of this service which inherits all current services
	 * and adds/overwrites the given services.
	 */
	createChild(services: ServiceCollection): IInstantiationService;
}
```

## Introduction

### constructor

The `InstantiationService` constructor takes a `ServiceCollection` as its first argument. This is a map of service identifiers to their implementations. It will set the `InstantiationService` as the `IInstantiationService` service in the collection. And it will take a graph to track the service dependencies when `_enableTracing` is true.



```ts
this._services.set(IInstantiationService, this);
```





### createInstance

The `createInstance` can be called synchronously to create an instance of a class based on the provided descriptor. Alternatively, it can also take a constructor function and its non-service-related arguments to create an instance.

```ts
private _createInstance<T>(ctor: any, args: any[] = [], _trace: Trace): T {

		// arguments defined by service decorators
		const serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
		const serviceArgs: any[] = [];
		for (const dependency of serviceDependencies) {
			const service = this._getOrCreateServiceInstance(dependency.id, _trace);
			if (!service) {
				this._throwIfStrict(`[createInstance] ${ctor.name} depends on UNKNOWN service ${dependency.id}.`, false);
			}
			serviceArgs.push(service);
		}

		const firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;

		// check for argument mismatches, adjust static args if needed
		if (args.length !== firstServiceArgPos) {
			console.trace(`[createInstance] First service dependency of ${ctor.name} at position ${firstServiceArgPos + 1} conflicts with ${args.length} static arguments`);

			const delta = firstServiceArgPos - args.length;
			if (delta > 0) {
				args = args.concat(new Array(delta));
			} else {
				args = args.slice(0, firstServiceArgPos);
			}
		}

		// now create the instance
		return Reflect.construct<any, T>(ctor, args.concat(serviceArgs));
	}
```

### invokeFunction

The `invokeFunction` function is used to provide a way to call functions that require access to services provided by the dependency injection container. It allows these services to be injected into the function without needing to explicitly pass them as parameters.

### createChild

The `createChild` function creates a child of this service which inherits all current services and adds/overwrites the given services.

```ts
createChild(services: ServiceCollection): IInstantiationService {
  return new InstantiationService(services, this._strict, this, this._enableTracing);
}
```
