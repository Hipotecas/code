
# InstantiationService

> Before reading this article, you should know same basic knowledge about [Dependency Injection](../../base/dependency-injection.md)


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
createInstance<T>(descriptor: SyncDescriptor0<T>): T;
	createInstance<Ctor extends new (...args: any[]) => any, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;
	createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: any[]): any {
		let _trace: Trace;
		let result: any;
		if (ctorOrDescriptor instanceof SyncDescriptor) {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor.ctor);
			result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest), _trace);
		} else {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor);
			result = this._createInstance(ctorOrDescriptor, rest, _trace);
		}
		_trace.stop();
		return result;
	}


private _createInstance<T>(ctor: any, args: any[] = [], _trace: Trace): T {
		// arguments defined by service decorators
    // to get service dependencies injected into the constructor
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

The `createChild` function creates a child of this service which inherits all current services and adds/overwrites the given services which set this its parent.

```ts
createChild(services: ServiceCollection): IInstantiationService {
  return new InstantiationService(services, this._strict, this, this._enableTracing);
}
```

### _createInstance

A private method that is used to create an instance of a class based on the provided descriptor. It will first get all the service dependencies of the constructor which was injected into the service and then create the instance. [_getOrCreateServiceInstance](#_getOrCreateServiceInstance) will get the current dependency from the service collection or create a new one if it doesn't exist. If the service doesn't exist and the instantiation service is in strict mode, it will throw an error.

Second it will check for argument mismatches, adjust static args if needed.

Finally, it will create the instance. when the constructor is called, the service dependencies will be injected into the constructor. It use [Reflect.construct](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) to create the instance which like the [new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) operator to create an instance.


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

### _getOrCreateServiceInstance

The `_getOrCreateServiceInstance` function is used to get or create a service instance based on the provided service identifier.

Optionally, it will add an edge to the global graph if the global graph and global graph implicit dependency are set (get by `String(id)`).

Then it may get the service instance or descriptor from the service collection by [_getServiceInstanceOrDescriptor](#_getServiceInstanceOrDescriptor). If it is a descriptor, it will create a new instance of the service by using [_safeCreateAndCacheServiceInstance](#_safeCreateAndCacheServiceInstance). Otherwise, it will return the service instance.

```ts
protected _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>, _trace: Trace): T {
  if (this._globalGraph && this._globalGraphImplicitDependency) {
    this._globalGraph.insertEdge(this._globalGraphImplicitDependency, String(id));
  }
  const thing = this._getServiceInstanceOrDescriptor(id);
  if (thing instanceof SyncDescriptor) {
    return this._safeCreateAndCacheServiceInstance(id, thing, _trace.branch(id, true));
  } else {
    _trace.branch(id, false);
    return thing;
  }
}
```

### _getServiceInstanceOrDescriptor

This will get the service instance or descriptor from the service collection. If it doesn't exist and the instantiation service has a parent, it will get the service instance or descriptor from the parent.
Otherwise, it will return the service instance or descriptor.

```ts
private _getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
  const instanceOrDesc = this._services.get(id);
  if (!instanceOrDesc && this._parent) {
    return this._parent._getServiceInstanceOrDescriptor(id);
  } else {
    return instanceOrDesc;
  }
}
```


### _safeCreateAndCacheServiceInstance

This function will check if the service is already being instantiated. If it is, it will throw an error. Otherwise, it will add the service identifier to the set and create a new instance of the service by using [_createAndCacheServiceInstance](#_createAndCacheServiceInstance). Finally delete it from the set list.


```ts
private _safeCreateAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {
		if (this._activeInstantiations.has(id)) {
			throw new Error(`illegal state - RECURSIVELY instantiating service '${id}'`);
		}
		this._activeInstantiations.add(id);
		try {
			return this._createAndCacheServiceInstance(id, desc, _trace);
		} finally {
			this._activeInstantiations.delete(id);
		}
	}

```

### _createAndCacheServiceInstance

The function create and cache service instance based on the provided service identifier and descriptor. First It uses a graph data structure to check for cyclic dependencies. If it finds a cyclic dependency, it will throw an error. Then it will check all exists dependencies and if they need to create them first. All of the service dependencies will be added to the global graph if the global graph is set. And if it is a desripctor, it will push to the local stack. Second it will loop the stack to repeat check for this still being a service sync desciptor. That's because instantiating a dependency might have side-effect and recursively trigger instantiation so that some dependencies are now fullfulled already.


```ts
	private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {

		type Triple = { id: ServiceIdentifier<any>; desc: SyncDescriptor<any>; _trace: Trace };
		const graph = new Graph<Triple>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc, _trace }];
		while (stack.length) {
			const item = stack.pop()!;
			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (const dependency of _util.getServiceDependencies(item.desc.ctor)) {

				const instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc) {
					this._throwIfStrict(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`, true);
				}

				// take note of all service dependencies
				this._globalGraph?.insertEdge(String(item.id), String(dependency.id));

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc, _trace: item._trace.branch(dependency.id, true) };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// Repeat the check for this still being a service sync descriptor. That's because
				// instantiating a dependency might have side-effect and recursively trigger instantiation
				// so that some dependencies are now fullfilled already.
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(data.id);
				if (instanceOrDesc instanceof SyncDescriptor) {
					// create instance and overwrite the service collections
					const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportsDelayedInstantiation, data._trace);
					this._setServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}
		return <T>this._getServiceInstanceOrDescriptor(id);
	}

```

### _createServiceInstance

This function will create a new instance of the service. If the service doesn't support delayed instantiation, it will create a new instance of the service by [_createInstance](#createinstance). Otherwise, it will create a new instantiation service and return a proxy object that's backed by an idle value. That strategy is to instantiate services in our idle time or when actually needed but not when injected into a consumer.

```ts
private _createServiceInstance<T>(id: ServiceIdentifier<T>, ctor: any, args: any[] = [], supportsDelayedInstantiation: boolean, _trace: Trace): T {
		if (!supportsDelayedInstantiation) {
			// eager instantiation
			return this._createInstance(ctor, args, _trace);

		} else {
			const child = new InstantiationService(undefined, this._strict, this, this._enableTracing);
			child._globalGraphImplicitDependency = String(id);

			// Return a proxy object that's backed by an idle value. That
			// strategy is to instantiate services in our idle time or when actually
			// needed but not when injected into a consumer

			// return "empty events" when the service isn't instantiated yet
			const earlyListeners = new Map<string, LinkedList<Parameters<Event<any>>>>();

			const idle = new IdleValue<any>(() => {
				const result = child._createInstance<T>(ctor, args, _trace);

				// early listeners that we kept are now being subscribed to
				// the real service
				for (const [key, values] of earlyListeners) {
					const candidate = <Event<any>>(<any>result)[key];
					if (typeof candidate === 'function') {
						for (const listener of values) {
							candidate.apply(result, listener);
						}
					}
				}
				earlyListeners.clear();

				return result;
			});
			return <T>new Proxy(Object.create(null), {
				get(target: any, key: PropertyKey): any {

					if (!idle.isInitialized) {
						// looks like an event
						if (typeof key === 'string' && (key.startsWith('onDid') || key.startsWith('onWill'))) {
							let list = earlyListeners.get(key);
							if (!list) {
								list = new LinkedList();
								earlyListeners.set(key, list);
							}
							const event: Event<any> = (callback, thisArg, disposables) => {
								const rm = list!.push([callback, thisArg, disposables]);
								return toDisposable(rm);
							};
							return event;
						}
					}

					// value already exists
					if (key in target) {
						return target[key];
					}

					// create value
					const obj = idle.value;
					let prop = obj[key];
					if (typeof prop !== 'function') {
						return prop;
					}
					prop = prop.bind(obj);
					target[key] = prop;
					return prop;
				},
				set(_target: T, p: PropertyKey, value: any): boolean {
					idle.value[p] = value;
					return true;
				},
				getPrototypeOf(_target: T) {
					return ctor.prototype;
				}
			});
		}
	}

```
