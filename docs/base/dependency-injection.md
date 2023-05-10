
# Dependency Injection

Dependency injection is basically providing the objects that an object needs (its dependencies) instead of having it construct them itself. It's a very useful techinque for testing, since it allows dependencies to be mocked or stubbed out.

Dependencies can be injected into objects by many means (e.g. constructor injection, setter injection, etc.). In VS Code, we use constructor injection. The dependencies are passed into the constructor and we don't need to `new` the construct.

Dependency Injection is a software design pattern that allows us to develop loosely coupled code. The main idea behind dependency injection is that a class should not configure its dependencies statically but should be configured from the outside.

Before that. You should know the typescript decorator, please read the article [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) First.



## Dependency Service

I use the test code in VS Code to explain it [instantiationService.test.ts](https://github.com/microsoft/vscode/blob/main/src/vs/platform/instantiation/test/common/instantiationService.test.ts#L52).

```ts
const IService1 = createDecorator<IService1>('service1');

interface IService1 {
	readonly _serviceBrand: undefined;
	c: number;
}

class Service1 implements IService1 {
	declare readonly _serviceBrand: undefined;
	c = 1;
}

interface IDependentService {
	readonly _serviceBrand: undefined;
	name: string;
}

class DependentService implements IDependentService {
	declare readonly _serviceBrand: undefined;
	constructor(@IService1 service: IService1) {
		assert.strictEqual(service.c, 1);
	}

	name = 'farboo';
}
```

`IDependentService` interface is defined with a property `name` and `_serviceBrand`. The interface is implemented by the `DependentService` class, which takes a constructor paramter `service` annotated with the `@IService1` decorator. This means that when an instance of `DependentService` is created, a concrete implementation of `IService1` must be provided.

So what happened when using `@IService1` decorator.  It is called [Parameter Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators). The expression for the parameter decorator will be called as a function at runtime, with the following three arguments:
1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The ordinal index of the parameter in the function's parameter list.

IService1 is defined by `createDecorator` function, which is used to create a decorator function.

The function take the parameter as the identifier of the service. The function will return the cached service if the service is already created. Otherwise, it will create a new service and store it into the cache.
otherwise, it will create a new function and store it into the cache. the function will store the service into the target property, and it can be used to decorator the parameter.


```ts
export namespace _util {

	export const serviceIds = new Map<string, ServiceIdentifier<any>>();

	export const DI_TARGET = '$di$target';
	export const DI_DEPENDENCIES = '$di$dependencies';

	export function getServiceDependencies(ctor: any): { id: ServiceIdentifier<any>; index: number }[] {
		return ctor[DI_DEPENDENCIES] || [];
	}
}

function storeServiceDependency(id: Function, target: Function, index: number): void {
	if ((target as any)[_util.DI_TARGET] === target) {
		(target as any)[_util.DI_DEPENDENCIES].push({ id, index });
	} else {
		(target as any)[_util.DI_DEPENDENCIES] = [{ id, index }];
		(target as any)[_util.DI_TARGET] = target;
	}
}

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
  // cache the service
	if (_util.serviceIds.has(serviceId)) {
		return _util.serviceIds.get(serviceId)!;
	}
  // define the paramter decorator
  // and use the storeServiceDependency to store the service into the target property
	const id = <any>function (target: Function, key: string, index: number): any {
		if (arguments.length !== 3) {
			throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
		}
		storeServiceDependency(id, target, index);
	};

	id.toString = () => serviceId;

	_util.serviceIds.set(serviceId, id);
	return id;
}
```

And the DependentService is compiled at runtime. If a decorator was created by the same identifier. the dependency will push to the ` $di$dependencies ` array.

```ts
DependentService['$di$target'] = DependentService
DependentService['$di$dependencies'] = [
  { id: 'service1', index: 0 }
]
```

## Service Collection

Service Collection is used to store the service. it uses the `ServiceIdentifier` as the key, and the service as the value. The service can be a instance or a `SyncDescriptor`.

```ts
export class ServiceCollection {

	private _entries = new Map<ServiceIdentifier<any>, any>();

	constructor(...entries: [ServiceIdentifier<any>, any][]) {
		for (const [id, service] of entries) {
			this.set(id, service);
		}
	}

	set<T>(id: ServiceIdentifier<T>, instanceOrDescriptor: T | SyncDescriptor<T>): T | SyncDescriptor<T> {
		const result = this._entries.get(id);
		this._entries.set(id, instanceOrDescriptor);
		return result;
	}

	has(id: ServiceIdentifier<any>): boolean {
		return this._entries.has(id);
	}

	get<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		return this._entries.get(id);
	}
}
```

Create a service collection:

```ts
const IService1 = createDecorator<IService1>('service1');
const collection = new ServiceCollection();
// or collection.set(Iservice1, new SyncDescriptor<IService1>(Service1))
collection.set(IService1, new Service1());
```

In vscode, some services are not dependent on other services, so they can be created by the `new` operator. Such as logging service(ILogService). When services are dependent on other services, which need to be encapsulated by `SyncDescriptor`. Such as the `IUndoRedoService` service.

## SyncDescriptor

`SyncDescriptor` is used to store the service constructor, the static arguments and create the service instance immediately or delay the instantiation.


```ts
export class SyncDescriptor<T> {

	readonly ctor: any;
	readonly staticArguments: any[];
	readonly supportsDelayedInstantiation: boolean;

	constructor(ctor: new (...args: any[]) => T, staticArguments: any[] = [], supportsDelayedInstantiation: boolean = false) {
		this.ctor = ctor;
		this.staticArguments = staticArguments;
    // whether to deplay the instantiation
		this.supportsDelayedInstantiation = supportsDelayedInstantiation;
	}
}
```





## Links

- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)
- [Dependency Injection Demystified](https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified)
- [what-is-dependency-injection](https://stackoverflow.com/questions/130794/what-is-dependency-injection)
