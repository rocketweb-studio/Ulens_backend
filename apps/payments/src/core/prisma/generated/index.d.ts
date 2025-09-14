/**
 * Client
 **/

import * as runtime from "./runtime/library.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Transaction
 *
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>;
/**
 * Model Subscription
 *
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>;
/**
 * Model Plan
 *
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>;

/**
 * Enums
 */
export namespace $Enums {
	export const TransactionStatus: {
		PENDING: "PENDING";
		SUCCESS: "SUCCESS";
		FAILED: "FAILED";
		EXPIRED: "EXPIRED";
	};

	export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

	export const TransactionProvider: {
		STRIPE: "STRIPE";
		PAYPAL: "PAYPAL";
	};

	export type TransactionProvider = (typeof TransactionProvider)[keyof typeof TransactionProvider];
}

export type TransactionStatus = $Enums.TransactionStatus;

export const TransactionStatus: typeof $Enums.TransactionStatus;

export type TransactionProvider = $Enums.TransactionProvider;

export const TransactionProvider: typeof $Enums.TransactionProvider;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Transactions
 * const transactions = await prisma.transaction.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
	ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
	const U = "log" extends keyof ClientOptions
		? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
			? Prisma.GetEvents<ClientOptions["log"]>
			: never
		: never,
	ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
	[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

	/**
	 * ##  Prisma Client ʲˢ
	 *
	 * Type-safe database client for TypeScript & Node.js
	 * @example
	 * ```
	 * const prisma = new PrismaClient()
	 * // Fetch zero or more Transactions
	 * const transactions = await prisma.transaction.findMany()
	 * ```
	 *
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
	 */

	constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
	$on<V extends U>(eventType: V, callback: (event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

	/**
	 * Connect with the database
	 */
	$connect(): $Utils.JsPromise<void>;

	/**
	 * Disconnect from the database
	 */
	$disconnect(): $Utils.JsPromise<void>;

	/**
	 * Executes a prepared raw query and returns the number of affected rows.
	 * @example
	 * ```
	 * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
	 */
	$executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

	/**
	 * Executes a raw query and returns the number of affected rows.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
	 */
	$executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

	/**
	 * Performs a prepared raw query and returns the `SELECT` data.
	 * @example
	 * ```
	 * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
	 */
	$queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

	/**
	 * Performs a raw query and returns the `SELECT` data.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
	 */
	$queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

	/**
	 * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
	 * @example
	 * ```
	 * const [george, bob, alice] = await prisma.$transaction([
	 *   prisma.user.create({ data: { name: 'George' } }),
	 *   prisma.user.create({ data: { name: 'Bob' } }),
	 *   prisma.user.create({ data: { name: 'Alice' } }),
	 * ])
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
	 */
	$transaction<P extends Prisma.PrismaPromise<any>[]>(
		arg: [...P],
		options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
	): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

	$transaction<R>(
		fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
		options?: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel },
	): $Utils.JsPromise<R>;

	$extends: $Extensions.ExtendsHook<
		"extends",
		Prisma.TypeMapCb<ClientOptions>,
		ExtArgs,
		$Utils.Call<
			Prisma.TypeMapCb<ClientOptions>,
			{
				extArgs: ExtArgs;
			}
		>
	>;

	/**
	 * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Transactions
	 * const transactions = await prisma.transaction.findMany()
	 * ```
	 */
	get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Subscriptions
	 * const subscriptions = await prisma.subscription.findMany()
	 * ```
	 */
	get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Plans
	 * const plans = await prisma.plan.findMany()
	 * ```
	 */
	get plan(): Prisma.PlanDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
	export import DMMF = runtime.DMMF;

	export type PrismaPromise<T> = $Public.PrismaPromise<T>;

	/**
	 * Validator
	 */
	export import validator = runtime.Public.validator;

	/**
	 * Prisma Errors
	 */
	export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
	export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
	export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
	export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
	export import PrismaClientValidationError = runtime.PrismaClientValidationError;

	/**
	 * Re-export of sql-template-tag
	 */
	export import sql = runtime.sqltag;
	export import empty = runtime.empty;
	export import join = runtime.join;
	export import raw = runtime.raw;
	export import Sql = runtime.Sql;

	/**
	 * Decimal.js
	 */
	export import Decimal = runtime.Decimal;

	export type DecimalJsLike = runtime.DecimalJsLike;

	/**
	 * Metrics
	 */
	export type Metrics = runtime.Metrics;
	export type Metric<T> = runtime.Metric<T>;
	export type MetricHistogram = runtime.MetricHistogram;
	export type MetricHistogramBucket = runtime.MetricHistogramBucket;

	/**
	 * Extensions
	 */
	export import Extension = $Extensions.UserArgs;
	export import getExtensionContext = runtime.Extensions.getExtensionContext;
	export import Args = $Public.Args;
	export import Payload = $Public.Payload;
	export import Result = $Public.Result;
	export import Exact = $Public.Exact;

	/**
	 * Prisma Client JS version: 6.14.0
	 * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
	 */
	export type PrismaVersion = {
		client: string;
	};

	export const prismaVersion: PrismaVersion;

	/**
	 * Utility Types
	 */

	export import JsonObject = runtime.JsonObject;
	export import JsonArray = runtime.JsonArray;
	export import JsonValue = runtime.JsonValue;
	export import InputJsonObject = runtime.InputJsonObject;
	export import InputJsonArray = runtime.InputJsonArray;
	export import InputJsonValue = runtime.InputJsonValue;

	/**
	 * Types of the values used to represent different kinds of `null` values when working with JSON fields.
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	namespace NullTypes {
		/**
		 * Type of `Prisma.DbNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class DbNull {
			private DbNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.JsonNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class JsonNull {
			private JsonNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.AnyNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class AnyNull {
			private AnyNull: never;
			private constructor();
		}
	}

	/**
	 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const DbNull: NullTypes.DbNull;

	/**
	 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const JsonNull: NullTypes.JsonNull;

	/**
	 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const AnyNull: NullTypes.AnyNull;

	type SelectAndInclude = {
		select: any;
		include: any;
	};

	type SelectAndOmit = {
		select: any;
		omit: any;
	};

	/**
	 * Get the type of the value, that the Promise holds.
	 */
	export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

	/**
	 * Get the return type of a function which returns a Promise.
	 */
	export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>;

	/**
	 * From T, pick a set of properties whose keys are in the union K
	 */
	type Prisma__Pick<T, K extends keyof T> = {
		[P in K]: T[P];
	};

	export type Enumerable<T> = T | Array<T>;

	export type RequiredKeys<T> = {
		[K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
	}[keyof T];

	export type TruthyKeys<T> = keyof {
		[K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
	};

	export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

	/**
	 * Subset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
	 */
	export type Subset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	};

	/**
	 * SelectSubset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
	 * Additionally, it validates, if both select and include are present. If the case, it errors.
	 */
	export type SelectSubset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & (T extends SelectAndInclude ? "Please either choose `select` or `include`." : T extends SelectAndOmit ? "Please either choose `select` or `omit`." : {});

	/**
	 * Subset + Intersection
	 * @desc From `T` pick properties that exist in `U` and intersect `K`
	 */
	export type SubsetIntersection<T, U, K> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & K;

	type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

	/**
	 * XOR is needed to have a real mutually exclusive union type
	 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
	 */
	type XOR<T, U> = T extends object ? (U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U) : T;

	/**
	 * Is T a Record?
	 */
	type IsObject<T> = T extends Array<any>
		? False
		: T extends Date
			? False
			: T extends Uint8Array
				? False
				: T extends bigint
					? False
					: T extends object
						? True
						: False;

	/**
	 * If it's T[], return T
	 */
	export type UnEnumerate<T> = T extends Array<infer U> ? U : T;

	/**
	 * From ts-toolbelt
	 */

	type __Either<O extends object, K extends Key> = Omit<O, K> &
		{
			// Merge all but K
			[P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
		}[K];

	type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

	type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

	type _Either<O extends object, K extends Key, strict extends Boolean> = {
		1: EitherStrict<O, K>;
		0: EitherLoose<O, K>;
	}[strict];

	type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;

	export type Union = any;

	type PatchUndefined<O extends object, O1 extends object> = {
		[K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
	} & {};

	/** Helper Types for "Merge" **/
	export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

	export type Overwrite<O extends object, O1 extends object> = {
		[K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
	} & {};

	type _Merge<U extends object> = IntersectOf<
		Overwrite<
			U,
			{
				[K in keyof U]-?: At<U, K>;
			}
		>
	>;

	type Key = string | number | symbol;
	type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
	type AtStrict<O extends object, K extends Key> = O[K & keyof O];
	type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
	export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
		1: AtStrict<O, K>;
		0: AtLoose<O, K>;
	}[strict];

	export type ComputeRaw<A> = A extends Function
		? A
		: {
				[K in keyof A]: A[K];
			} & {};

	export type OptionalFlat<O> = {
		[K in keyof O]?: O[K];
	} & {};

	type _Record<K extends keyof any, T> = {
		[P in K]: T;
	};

	// cause typescript not to expand types and preserve names
	type NoExpand<T> = T extends unknown ? T : never;

	// this type assumes the passed object is entirely optional
	type AtLeast<O extends object, K extends string> = NoExpand<
		O extends unknown ? (K extends keyof O ? { [P in K]: O[P] } & O : O) | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O) : never
	>;

	type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

	export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
	/** End Helper Types for "Merge" **/

	export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

	/**
  A [[Boolean]]
  */
	export type Boolean = True | False;

	// /**
	// 1
	// */
	export type True = 1;

	/**
  0
  */
	export type False = 0;

	export type Not<B extends Boolean> = {
		0: 1;
		1: 0;
	}[B];

	export type Extends<A1, A2> = [A1] extends [never]
		? 0 // anything `never` is false
		: A1 extends A2
			? 1
			: 0;

	export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

	export type Or<B1 extends Boolean, B2 extends Boolean> = {
		0: {
			0: 0;
			1: 1;
		};
		1: {
			0: 1;
			1: 1;
		};
	}[B1][B2];

	export type Keys<U extends Union> = U extends unknown ? keyof U : never;

	type Cast<A, B> = A extends B ? A : B;

	export const type: unique symbol;

	/**
	 * Used by group by
	 */

	export type GetScalarType<T, O> = O extends object
		? {
				[P in keyof T]: P extends keyof O ? O[P] : never;
			}
		: never;

	type FieldPaths<T, U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">> = IsObject<T> extends True ? U : T;

	type GetHavingFields<T> = {
		[K in keyof T]: Or<Or<Extends<"OR", K>, Extends<"AND", K>>, Extends<"NOT", K>> extends True
			? // infer is only needed to not hit TS limit
				// based on the brilliant idea of Pierre-Antoine Mills
				// https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
				T[K] extends infer TK
				? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
				: never
			: {} extends FieldPaths<T[K]>
				? never
				: K;
	}[keyof T];

	/**
	 * Convert tuple to union
	 */
	type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
	type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
	type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

	/**
	 * Like `Pick`, but additionally can also accept an array of keys
	 */
	type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;

	/**
	 * Exclude all keys with underscores
	 */
	type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

	export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

	type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;

	export const ModelName: {
		Transaction: "Transaction";
		Subscription: "Subscription";
		Plan: "Plan";
	};

	export type ModelName = (typeof ModelName)[keyof typeof ModelName];

	export type Datasources = {
		db?: Datasource;
	};

	interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
		returns: Prisma.TypeMap<this["params"]["extArgs"], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>;
	}

	export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
		globalOmitOptions: {
			omit: GlobalOmitOptions;
		};
		meta: {
			modelProps: "transaction" | "subscription" | "plan";
			txIsolationLevel: Prisma.TransactionIsolationLevel;
		};
		model: {
			Transaction: {
				payload: Prisma.$TransactionPayload<ExtArgs>;
				fields: Prisma.TransactionFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.TransactionFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					findFirst: {
						args: Prisma.TransactionFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					findMany: {
						args: Prisma.TransactionFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
					};
					create: {
						args: Prisma.TransactionCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					createMany: {
						args: Prisma.TransactionCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
					};
					delete: {
						args: Prisma.TransactionDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					update: {
						args: Prisma.TransactionUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					deleteMany: {
						args: Prisma.TransactionDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.TransactionUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
					};
					upsert: {
						args: Prisma.TransactionUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
					};
					aggregate: {
						args: Prisma.TransactionAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateTransaction>;
					};
					groupBy: {
						args: Prisma.TransactionGroupByArgs<ExtArgs>;
						result: $Utils.Optional<TransactionGroupByOutputType>[];
					};
					count: {
						args: Prisma.TransactionCountArgs<ExtArgs>;
						result: $Utils.Optional<TransactionCountAggregateOutputType> | number;
					};
				};
			};
			Subscription: {
				payload: Prisma.$SubscriptionPayload<ExtArgs>;
				fields: Prisma.SubscriptionFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					findFirst: {
						args: Prisma.SubscriptionFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					findMany: {
						args: Prisma.SubscriptionFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
					};
					create: {
						args: Prisma.SubscriptionCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					createMany: {
						args: Prisma.SubscriptionCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
					};
					delete: {
						args: Prisma.SubscriptionDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					update: {
						args: Prisma.SubscriptionUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					deleteMany: {
						args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
					};
					upsert: {
						args: Prisma.SubscriptionUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
					};
					aggregate: {
						args: Prisma.SubscriptionAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateSubscription>;
					};
					groupBy: {
						args: Prisma.SubscriptionGroupByArgs<ExtArgs>;
						result: $Utils.Optional<SubscriptionGroupByOutputType>[];
					};
					count: {
						args: Prisma.SubscriptionCountArgs<ExtArgs>;
						result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number;
					};
				};
			};
			Plan: {
				payload: Prisma.$PlanPayload<ExtArgs>;
				fields: Prisma.PlanFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.PlanFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					findFirst: {
						args: Prisma.PlanFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					findMany: {
						args: Prisma.PlanFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>[];
					};
					create: {
						args: Prisma.PlanCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					createMany: {
						args: Prisma.PlanCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>[];
					};
					delete: {
						args: Prisma.PlanDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					update: {
						args: Prisma.PlanUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					deleteMany: {
						args: Prisma.PlanDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.PlanUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.PlanUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>[];
					};
					upsert: {
						args: Prisma.PlanUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PlanPayload>;
					};
					aggregate: {
						args: Prisma.PlanAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregatePlan>;
					};
					groupBy: {
						args: Prisma.PlanGroupByArgs<ExtArgs>;
						result: $Utils.Optional<PlanGroupByOutputType>[];
					};
					count: {
						args: Prisma.PlanCountArgs<ExtArgs>;
						result: $Utils.Optional<PlanCountAggregateOutputType> | number;
					};
				};
			};
		};
	} & {
		other: {
			payload: any;
			operations: {
				$executeRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$executeRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
				$queryRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$queryRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
			};
		};
	};
	export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>;
	export type DefaultPrismaClient = PrismaClient;
	export type ErrorFormat = "pretty" | "colorless" | "minimal";
	export interface PrismaClientOptions {
		/**
		 * Overwrites the datasource url from your schema.prisma file
		 */
		datasources?: Datasources;
		/**
		 * Overwrites the datasource url from your schema.prisma file
		 */
		datasourceUrl?: string;
		/**
		 * @default "colorless"
		 */
		errorFormat?: ErrorFormat;
		/**
		 * @example
		 * ```
		 * // Shorthand for `emit: 'stdout'`
		 * log: ['query', 'info', 'warn', 'error']
		 *
		 * // Emit as events only
		 * log: [
		 *   { emit: 'event', level: 'query' },
		 *   { emit: 'event', level: 'info' },
		 *   { emit: 'event', level: 'warn' }
		 *   { emit: 'event', level: 'error' }
		 * ]
		 *
		 * / Emit as events and log to stdout
		 * og: [
		 *  { emit: 'stdout', level: 'query' },
		 *  { emit: 'stdout', level: 'info' },
		 *  { emit: 'stdout', level: 'warn' }
		 *  { emit: 'stdout', level: 'error' }
		 *
		 * ```
		 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
		 */
		log?: (LogLevel | LogDefinition)[];
		/**
		 * The default values for transactionOptions
		 * maxWait ?= 2000
		 * timeout ?= 5000
		 */
		transactionOptions?: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		};
		/**
		 * Global configuration for omitting model fields by default.
		 *
		 * @example
		 * ```
		 * const prisma = new PrismaClient({
		 *   omit: {
		 *     user: {
		 *       password: true
		 *     }
		 *   }
		 * })
		 * ```
		 */
		omit?: Prisma.GlobalOmitConfig;
	}
	export type GlobalOmitConfig = {
		transaction?: TransactionOmit;
		subscription?: SubscriptionOmit;
		plan?: PlanOmit;
	};

	/* Types for Logging */
	export type LogLevel = "info" | "query" | "warn" | "error";
	export type LogDefinition = {
		level: LogLevel;
		emit: "stdout" | "event";
	};

	export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

	export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T["level"] : T>;

	export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

	export type QueryEvent = {
		timestamp: Date;
		query: string;
		params: string;
		duration: number;
		target: string;
	};

	export type LogEvent = {
		timestamp: Date;
		message: string;
		target: string;
	};
	/* End Types for Logging */

	export type PrismaAction =
		| "findUnique"
		| "findUniqueOrThrow"
		| "findMany"
		| "findFirst"
		| "findFirstOrThrow"
		| "create"
		| "createMany"
		| "createManyAndReturn"
		| "update"
		| "updateMany"
		| "updateManyAndReturn"
		| "upsert"
		| "delete"
		| "deleteMany"
		| "executeRaw"
		| "queryRaw"
		| "aggregate"
		| "count"
		| "runCommandRaw"
		| "findRaw"
		| "groupBy";

	// tested in getLogLevel.test.ts
	export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

	/**
	 * `PrismaClient` proxy available in interactive transactions.
	 */
	export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

	export type Datasource = {
		url?: string;
	};

	/**
	 * Count Types
	 */

	/**
	 * Count Type PlanCountOutputType
	 */

	export type PlanCountOutputType = {
		Subscription: number;
	};

	export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		Subscription?: boolean | PlanCountOutputTypeCountSubscriptionArgs;
	};

	// Custom InputTypes
	/**
	 * PlanCountOutputType without action
	 */
	export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the PlanCountOutputType
		 */
		select?: PlanCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * PlanCountOutputType without action
	 */
	export type PlanCountOutputTypeCountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		where?: SubscriptionWhereInput;
	};

	/**
	 * Models
	 */

	/**
	 * Model Transaction
	 */

	export type AggregateTransaction = {
		_count: TransactionCountAggregateOutputType | null;
		_avg: TransactionAvgAggregateOutputType | null;
		_sum: TransactionSumAggregateOutputType | null;
		_min: TransactionMinAggregateOutputType | null;
		_max: TransactionMaxAggregateOutputType | null;
	};

	export type TransactionAvgAggregateOutputType = {
		amount: number | null;
	};

	export type TransactionSumAggregateOutputType = {
		amount: number | null;
	};

	export type TransactionMinAggregateOutputType = {
		id: string | null;
		amount: number | null;
		currency: string | null;
		stripeSubscriptionId: string | null;
		status: $Enums.TransactionStatus | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		provider: $Enums.TransactionProvider | null;
		userId: string | null;
	};

	export type TransactionMaxAggregateOutputType = {
		id: string | null;
		amount: number | null;
		currency: string | null;
		stripeSubscriptionId: string | null;
		status: $Enums.TransactionStatus | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		provider: $Enums.TransactionProvider | null;
		userId: string | null;
	};

	export type TransactionCountAggregateOutputType = {
		id: number;
		amount: number;
		currency: number;
		stripeSubscriptionId: number;
		status: number;
		createdAt: number;
		expiresAt: number;
		provider: number;
		userId: number;
		_all: number;
	};

	export type TransactionAvgAggregateInputType = {
		amount?: true;
	};

	export type TransactionSumAggregateInputType = {
		amount?: true;
	};

	export type TransactionMinAggregateInputType = {
		id?: true;
		amount?: true;
		currency?: true;
		stripeSubscriptionId?: true;
		status?: true;
		createdAt?: true;
		expiresAt?: true;
		provider?: true;
		userId?: true;
	};

	export type TransactionMaxAggregateInputType = {
		id?: true;
		amount?: true;
		currency?: true;
		stripeSubscriptionId?: true;
		status?: true;
		createdAt?: true;
		expiresAt?: true;
		provider?: true;
		userId?: true;
	};

	export type TransactionCountAggregateInputType = {
		id?: true;
		amount?: true;
		currency?: true;
		stripeSubscriptionId?: true;
		status?: true;
		createdAt?: true;
		expiresAt?: true;
		provider?: true;
		userId?: true;
		_all?: true;
	};

	export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Transaction to aggregate.
		 */
		where?: TransactionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Transactions to fetch.
		 */
		orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: TransactionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Transactions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Transactions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Transactions
		 **/
		_count?: true | TransactionCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: TransactionAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: TransactionSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: TransactionMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: TransactionMaxAggregateInputType;
	};

	export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
		[P in keyof T & keyof AggregateTransaction]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateTransaction[P]>
			: GetScalarType<T[P], AggregateTransaction[P]>;
	};

	export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		where?: TransactionWhereInput;
		orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[];
		by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum;
		having?: TransactionScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: TransactionCountAggregateInputType | true;
		_avg?: TransactionAvgAggregateInputType;
		_sum?: TransactionSumAggregateInputType;
		_min?: TransactionMinAggregateInputType;
		_max?: TransactionMaxAggregateInputType;
	};

	export type TransactionGroupByOutputType = {
		id: string;
		amount: number;
		currency: string;
		stripeSubscriptionId: string | null;
		status: $Enums.TransactionStatus;
		createdAt: Date;
		expiresAt: Date | null;
		provider: $Enums.TransactionProvider;
		userId: string;
		_count: TransactionCountAggregateOutputType | null;
		_avg: TransactionAvgAggregateOutputType | null;
		_sum: TransactionSumAggregateOutputType | null;
		_min: TransactionMinAggregateOutputType | null;
		_max: TransactionMaxAggregateOutputType | null;
	};

	type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<TransactionGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof TransactionGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], TransactionGroupByOutputType[P]>
					: GetScalarType<T[P], TransactionGroupByOutputType[P]>;
			}
		>
	>;

	export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			amount?: boolean;
			currency?: boolean;
			stripeSubscriptionId?: boolean;
			status?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			provider?: boolean;
			userId?: boolean;
		},
		ExtArgs["result"]["transaction"]
	>;

	export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			amount?: boolean;
			currency?: boolean;
			stripeSubscriptionId?: boolean;
			status?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			provider?: boolean;
			userId?: boolean;
		},
		ExtArgs["result"]["transaction"]
	>;

	export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			amount?: boolean;
			currency?: boolean;
			stripeSubscriptionId?: boolean;
			status?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			provider?: boolean;
			userId?: boolean;
		},
		ExtArgs["result"]["transaction"]
	>;

	export type TransactionSelectScalar = {
		id?: boolean;
		amount?: boolean;
		currency?: boolean;
		stripeSubscriptionId?: boolean;
		status?: boolean;
		createdAt?: boolean;
		expiresAt?: boolean;
		provider?: boolean;
		userId?: boolean;
	};

	export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
		"id" | "amount" | "currency" | "stripeSubscriptionId" | "status" | "createdAt" | "expiresAt" | "provider" | "userId",
		ExtArgs["result"]["transaction"]
	>;

	export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "Transaction";
		objects: {};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				amount: number;
				currency: string;
				stripeSubscriptionId: string | null;
				status: $Enums.TransactionStatus;
				createdAt: Date;
				expiresAt: Date | null;
				provider: $Enums.TransactionProvider;
				userId: string;
			},
			ExtArgs["result"]["transaction"]
		>;
		composites: {};
	};

	type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>;

	type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		TransactionFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: TransactionCountAggregateInputType | true;
	};

	export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Transaction"]; meta: { name: "Transaction" } };
		/**
		 * Find zero or one Transaction that matches the filter.
		 * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
		 * @example
		 * // Get one Transaction
		 * const transaction = await prisma.transaction.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends TransactionFindUniqueArgs>(
			args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>,
		): Prisma__TransactionClient<
			$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
		 * @example
		 * // Get one Transaction
		 * const transaction = await prisma.transaction.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(
			args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__TransactionClient<
			$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Transaction that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
		 * @example
		 * // Get one Transaction
		 * const transaction = await prisma.transaction.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends TransactionFindFirstArgs>(
			args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>,
		): Prisma__TransactionClient<
			$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Transaction that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
		 * @example
		 * // Get one Transaction
		 * const transaction = await prisma.transaction.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(
			args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__TransactionClient<
			$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Transactions that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Transactions
		 * const transactions = await prisma.transaction.findMany()
		 *
		 * // Get first 10 Transactions
		 * const transactions = await prisma.transaction.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends TransactionFindManyArgs>(
			args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;

		/**
		 * Create a Transaction.
		 * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
		 * @example
		 * // Create one Transaction
		 * const Transaction = await prisma.transaction.create({
		 *   data: {
		 *     // ... data to create a Transaction
		 *   }
		 * })
		 *
		 */
		create<T extends TransactionCreateArgs>(
			args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>,
		): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Create many Transactions.
		 * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
		 * @example
		 * // Create many Transactions
		 * const transaction = await prisma.transaction.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Transactions and returns the data saved in the database.
		 * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
		 * @example
		 * // Create many Transactions
		 * const transaction = await prisma.transaction.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Transactions and only return the `id`
		 * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(
			args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Delete a Transaction.
		 * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
		 * @example
		 * // Delete one Transaction
		 * const Transaction = await prisma.transaction.delete({
		 *   where: {
		 *     // ... filter to delete one Transaction
		 *   }
		 * })
		 *
		 */
		delete<T extends TransactionDeleteArgs>(
			args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>,
		): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Update one Transaction.
		 * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
		 * @example
		 * // Update one Transaction
		 * const transaction = await prisma.transaction.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends TransactionUpdateArgs>(
			args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>,
		): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Delete zero or more Transactions.
		 * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
		 * @example
		 * // Delete a few Transactions
		 * const { count } = await prisma.transaction.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Transactions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Transactions
		 * const transaction = await prisma.transaction.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Transactions and returns the data updated in the database.
		 * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
		 * @example
		 * // Update many Transactions
		 * const transaction = await prisma.transaction.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Transactions and only return the `id`
		 * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(
			args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Create or update one Transaction.
		 * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
		 * @example
		 * // Update or create a Transaction
		 * const transaction = await prisma.transaction.upsert({
		 *   create: {
		 *     // ... data to create a Transaction
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Transaction we want to update
		 *   }
		 * })
		 */
		upsert<T extends TransactionUpsertArgs>(
			args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>,
		): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Count the number of Transactions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
		 * @example
		 * // Count the number of Transactions
		 * const count = await prisma.transaction.count({
		 *   where: {
		 *     // ... the filter for the Transactions we want to count
		 *   }
		 * })
		 **/
		count<T extends TransactionCountArgs>(
			args?: Subset<T, TransactionCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any> ? (T["select"] extends true ? number : GetScalarType<T["select"], TransactionCountAggregateOutputType>) : number
		>;

		/**
		 * Allows you to perform aggregations operations on a Transaction.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>;

		/**
		 * Group by Transaction.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TransactionGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends TransactionGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake ? { orderBy: TransactionGroupByArgs["orderBy"] } : { orderBy?: TransactionGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors,
		): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Transaction model
		 */
		readonly fields: TransactionFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Transaction.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}>
		extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Transaction model
	 */
	interface TransactionFieldRefs {
		readonly id: FieldRef<"Transaction", "String">;
		readonly amount: FieldRef<"Transaction", "Float">;
		readonly currency: FieldRef<"Transaction", "String">;
		readonly stripeSubscriptionId: FieldRef<"Transaction", "String">;
		readonly status: FieldRef<"Transaction", "TransactionStatus">;
		readonly createdAt: FieldRef<"Transaction", "DateTime">;
		readonly expiresAt: FieldRef<"Transaction", "DateTime">;
		readonly provider: FieldRef<"Transaction", "TransactionProvider">;
		readonly userId: FieldRef<"Transaction", "String">;
	}

	// Custom InputTypes
	/**
	 * Transaction findUnique
	 */
	export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter, which Transaction to fetch.
		 */
		where: TransactionWhereUniqueInput;
	};

	/**
	 * Transaction findUniqueOrThrow
	 */
	export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter, which Transaction to fetch.
		 */
		where: TransactionWhereUniqueInput;
	};

	/**
	 * Transaction findFirst
	 */
	export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter, which Transaction to fetch.
		 */
		where?: TransactionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Transactions to fetch.
		 */
		orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Transactions.
		 */
		cursor?: TransactionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Transactions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Transactions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Transactions.
		 */
		distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
	};

	/**
	 * Transaction findFirstOrThrow
	 */
	export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter, which Transaction to fetch.
		 */
		where?: TransactionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Transactions to fetch.
		 */
		orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Transactions.
		 */
		cursor?: TransactionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Transactions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Transactions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Transactions.
		 */
		distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
	};

	/**
	 * Transaction findMany
	 */
	export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter, which Transactions to fetch.
		 */
		where?: TransactionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Transactions to fetch.
		 */
		orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Transactions.
		 */
		cursor?: TransactionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Transactions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Transactions.
		 */
		skip?: number;
		distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
	};

	/**
	 * Transaction create
	 */
	export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * The data needed to create a Transaction.
		 */
		data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
	};

	/**
	 * Transaction createMany
	 */
	export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to create many Transactions.
		 */
		data: TransactionCreateManyInput | TransactionCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Transaction createManyAndReturn
	 */
	export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * The data used to create many Transactions.
		 */
		data: TransactionCreateManyInput | TransactionCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Transaction update
	 */
	export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * The data needed to update a Transaction.
		 */
		data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
		/**
		 * Choose, which Transaction to update.
		 */
		where: TransactionWhereUniqueInput;
	};

	/**
	 * Transaction updateMany
	 */
	export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to update Transactions.
		 */
		data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>;
		/**
		 * Filter which Transactions to update
		 */
		where?: TransactionWhereInput;
		/**
		 * Limit how many Transactions to update.
		 */
		limit?: number;
	};

	/**
	 * Transaction updateManyAndReturn
	 */
	export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * The data used to update Transactions.
		 */
		data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>;
		/**
		 * Filter which Transactions to update
		 */
		where?: TransactionWhereInput;
		/**
		 * Limit how many Transactions to update.
		 */
		limit?: number;
	};

	/**
	 * Transaction upsert
	 */
	export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * The filter to search for the Transaction to update in case it exists.
		 */
		where: TransactionWhereUniqueInput;
		/**
		 * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
		 */
		create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
		/**
		 * In case the Transaction was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
	};

	/**
	 * Transaction delete
	 */
	export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
		/**
		 * Filter which Transaction to delete.
		 */
		where: TransactionWhereUniqueInput;
	};

	/**
	 * Transaction deleteMany
	 */
	export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Transactions to delete
		 */
		where?: TransactionWhereInput;
		/**
		 * Limit how many Transactions to delete.
		 */
		limit?: number;
	};

	/**
	 * Transaction without action
	 */
	export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Transaction
		 */
		select?: TransactionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Transaction
		 */
		omit?: TransactionOmit<ExtArgs> | null;
	};

	/**
	 * Model Subscription
	 */

	export type AggregateSubscription = {
		_count: SubscriptionCountAggregateOutputType | null;
		_min: SubscriptionMinAggregateOutputType | null;
		_max: SubscriptionMaxAggregateOutputType | null;
	};

	export type SubscriptionMinAggregateOutputType = {
		id: string | null;
		userId: string | null;
		planId: string | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		stripeSubscriptionId: string | null;
		isAutoRenewal: boolean | null;
	};

	export type SubscriptionMaxAggregateOutputType = {
		id: string | null;
		userId: string | null;
		planId: string | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		stripeSubscriptionId: string | null;
		isAutoRenewal: boolean | null;
	};

	export type SubscriptionCountAggregateOutputType = {
		id: number;
		userId: number;
		planId: number;
		createdAt: number;
		expiresAt: number;
		stripeSubscriptionId: number;
		isAutoRenewal: number;
		_all: number;
	};

	export type SubscriptionMinAggregateInputType = {
		id?: true;
		userId?: true;
		planId?: true;
		createdAt?: true;
		expiresAt?: true;
		stripeSubscriptionId?: true;
		isAutoRenewal?: true;
	};

	export type SubscriptionMaxAggregateInputType = {
		id?: true;
		userId?: true;
		planId?: true;
		createdAt?: true;
		expiresAt?: true;
		stripeSubscriptionId?: true;
		isAutoRenewal?: true;
	};

	export type SubscriptionCountAggregateInputType = {
		id?: true;
		userId?: true;
		planId?: true;
		createdAt?: true;
		expiresAt?: true;
		stripeSubscriptionId?: true;
		isAutoRenewal?: true;
		_all?: true;
	};

	export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Subscription to aggregate.
		 */
		where?: SubscriptionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Subscriptions to fetch.
		 */
		orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: SubscriptionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Subscriptions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Subscriptions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Subscriptions
		 **/
		_count?: true | SubscriptionCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: SubscriptionMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: SubscriptionMaxAggregateInputType;
	};

	export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
		[P in keyof T & keyof AggregateSubscription]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateSubscription[P]>
			: GetScalarType<T[P], AggregateSubscription[P]>;
	};

	export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		where?: SubscriptionWhereInput;
		orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[];
		by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum;
		having?: SubscriptionScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: SubscriptionCountAggregateInputType | true;
		_min?: SubscriptionMinAggregateInputType;
		_max?: SubscriptionMaxAggregateInputType;
	};

	export type SubscriptionGroupByOutputType = {
		id: string;
		userId: string;
		planId: string;
		createdAt: Date;
		expiresAt: Date;
		stripeSubscriptionId: string | null;
		isAutoRenewal: boolean;
		_count: SubscriptionCountAggregateOutputType | null;
		_min: SubscriptionMinAggregateOutputType | null;
		_max: SubscriptionMaxAggregateOutputType | null;
	};

	type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<SubscriptionGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof SubscriptionGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
					: GetScalarType<T[P], SubscriptionGroupByOutputType[P]>;
			}
		>
	>;

	export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			planId?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			stripeSubscriptionId?: boolean;
			isAutoRenewal?: boolean;
			plan?: boolean | PlanDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["subscription"]
	>;

	export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			planId?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			stripeSubscriptionId?: boolean;
			isAutoRenewal?: boolean;
			plan?: boolean | PlanDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["subscription"]
	>;

	export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			planId?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			stripeSubscriptionId?: boolean;
			isAutoRenewal?: boolean;
			plan?: boolean | PlanDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["subscription"]
	>;

	export type SubscriptionSelectScalar = {
		id?: boolean;
		userId?: boolean;
		planId?: boolean;
		createdAt?: boolean;
		expiresAt?: boolean;
		stripeSubscriptionId?: boolean;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
		"id" | "userId" | "planId" | "createdAt" | "expiresAt" | "stripeSubscriptionId" | "isAutoRenewal",
		ExtArgs["result"]["subscription"]
	>;
	export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		plan?: boolean | PlanDefaultArgs<ExtArgs>;
	};
	export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		plan?: boolean | PlanDefaultArgs<ExtArgs>;
	};
	export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		plan?: boolean | PlanDefaultArgs<ExtArgs>;
	};

	export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "Subscription";
		objects: {
			plan: Prisma.$PlanPayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				userId: string;
				planId: string;
				createdAt: Date;
				expiresAt: Date;
				stripeSubscriptionId: string | null;
				isAutoRenewal: boolean;
			},
			ExtArgs["result"]["subscription"]
		>;
		composites: {};
	};

	type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>;

	type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		SubscriptionFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: SubscriptionCountAggregateInputType | true;
	};

	export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Subscription"]; meta: { name: "Subscription" } };
		/**
		 * Find zero or one Subscription that matches the filter.
		 * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
		 * @example
		 * // Get one Subscription
		 * const subscription = await prisma.subscription.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends SubscriptionFindUniqueArgs>(
			args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<
			$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
		 * @example
		 * // Get one Subscription
		 * const subscription = await prisma.subscription.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(
			args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<
			$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Subscription that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
		 * @example
		 * // Get one Subscription
		 * const subscription = await prisma.subscription.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends SubscriptionFindFirstArgs>(
			args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<
			$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Subscription that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
		 * @example
		 * // Get one Subscription
		 * const subscription = await prisma.subscription.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(
			args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<
			$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Subscriptions that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Subscriptions
		 * const subscriptions = await prisma.subscription.findMany()
		 *
		 * // Get first 10 Subscriptions
		 * const subscriptions = await prisma.subscription.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends SubscriptionFindManyArgs>(
			args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;

		/**
		 * Create a Subscription.
		 * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
		 * @example
		 * // Create one Subscription
		 * const Subscription = await prisma.subscription.create({
		 *   data: {
		 *     // ... data to create a Subscription
		 *   }
		 * })
		 *
		 */
		create<T extends SubscriptionCreateArgs>(
			args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Create many Subscriptions.
		 * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
		 * @example
		 * // Create many Subscriptions
		 * const subscription = await prisma.subscription.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Subscriptions and returns the data saved in the database.
		 * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
		 * @example
		 * // Create many Subscriptions
		 * const subscription = await prisma.subscription.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Subscriptions and only return the `id`
		 * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(
			args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Delete a Subscription.
		 * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
		 * @example
		 * // Delete one Subscription
		 * const Subscription = await prisma.subscription.delete({
		 *   where: {
		 *     // ... filter to delete one Subscription
		 *   }
		 * })
		 *
		 */
		delete<T extends SubscriptionDeleteArgs>(
			args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Update one Subscription.
		 * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
		 * @example
		 * // Update one Subscription
		 * const subscription = await prisma.subscription.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends SubscriptionUpdateArgs>(
			args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Delete zero or more Subscriptions.
		 * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
		 * @example
		 * // Delete a few Subscriptions
		 * const { count } = await prisma.subscription.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Subscriptions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Subscriptions
		 * const subscription = await prisma.subscription.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Subscriptions and returns the data updated in the database.
		 * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
		 * @example
		 * // Update many Subscriptions
		 * const subscription = await prisma.subscription.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Subscriptions and only return the `id`
		 * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(
			args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Create or update one Subscription.
		 * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
		 * @example
		 * // Update or create a Subscription
		 * const subscription = await prisma.subscription.upsert({
		 *   create: {
		 *     // ... data to create a Subscription
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Subscription we want to update
		 *   }
		 * })
		 */
		upsert<T extends SubscriptionUpsertArgs>(
			args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>,
		): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Count the number of Subscriptions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
		 * @example
		 * // Count the number of Subscriptions
		 * const count = await prisma.subscription.count({
		 *   where: {
		 *     // ... the filter for the Subscriptions we want to count
		 *   }
		 * })
		 **/
		count<T extends SubscriptionCountArgs>(
			args?: Subset<T, SubscriptionCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any> ? (T["select"] extends true ? number : GetScalarType<T["select"], SubscriptionCountAggregateOutputType>) : number
		>;

		/**
		 * Allows you to perform aggregations operations on a Subscription.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>;

		/**
		 * Group by Subscription.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SubscriptionGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends SubscriptionGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake ? { orderBy: SubscriptionGroupByArgs["orderBy"] } : { orderBy?: SubscriptionGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors,
		): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Subscription model
		 */
		readonly fields: SubscriptionFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Subscription.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}>
		extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		plan<T extends PlanDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, PlanDefaultArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Subscription model
	 */
	interface SubscriptionFieldRefs {
		readonly id: FieldRef<"Subscription", "String">;
		readonly userId: FieldRef<"Subscription", "String">;
		readonly planId: FieldRef<"Subscription", "String">;
		readonly createdAt: FieldRef<"Subscription", "DateTime">;
		readonly expiresAt: FieldRef<"Subscription", "DateTime">;
		readonly stripeSubscriptionId: FieldRef<"Subscription", "String">;
		readonly isAutoRenewal: FieldRef<"Subscription", "Boolean">;
	}

	// Custom InputTypes
	/**
	 * Subscription findUnique
	 */
	export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter, which Subscription to fetch.
		 */
		where: SubscriptionWhereUniqueInput;
	};

	/**
	 * Subscription findUniqueOrThrow
	 */
	export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter, which Subscription to fetch.
		 */
		where: SubscriptionWhereUniqueInput;
	};

	/**
	 * Subscription findFirst
	 */
	export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter, which Subscription to fetch.
		 */
		where?: SubscriptionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Subscriptions to fetch.
		 */
		orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Subscriptions.
		 */
		cursor?: SubscriptionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Subscriptions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Subscriptions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Subscriptions.
		 */
		distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[];
	};

	/**
	 * Subscription findFirstOrThrow
	 */
	export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter, which Subscription to fetch.
		 */
		where?: SubscriptionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Subscriptions to fetch.
		 */
		orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Subscriptions.
		 */
		cursor?: SubscriptionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Subscriptions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Subscriptions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Subscriptions.
		 */
		distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[];
	};

	/**
	 * Subscription findMany
	 */
	export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter, which Subscriptions to fetch.
		 */
		where?: SubscriptionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Subscriptions to fetch.
		 */
		orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Subscriptions.
		 */
		cursor?: SubscriptionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Subscriptions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Subscriptions.
		 */
		skip?: number;
		distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[];
	};

	/**
	 * Subscription create
	 */
	export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Subscription.
		 */
		data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>;
	};

	/**
	 * Subscription createMany
	 */
	export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to create many Subscriptions.
		 */
		data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Subscription createManyAndReturn
	 */
	export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * The data used to create many Subscriptions.
		 */
		data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Subscription update
	 */
	export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Subscription.
		 */
		data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>;
		/**
		 * Choose, which Subscription to update.
		 */
		where: SubscriptionWhereUniqueInput;
	};

	/**
	 * Subscription updateMany
	 */
	export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to update Subscriptions.
		 */
		data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>;
		/**
		 * Filter which Subscriptions to update
		 */
		where?: SubscriptionWhereInput;
		/**
		 * Limit how many Subscriptions to update.
		 */
		limit?: number;
	};

	/**
	 * Subscription updateManyAndReturn
	 */
	export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * The data used to update Subscriptions.
		 */
		data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>;
		/**
		 * Filter which Subscriptions to update
		 */
		where?: SubscriptionWhereInput;
		/**
		 * Limit how many Subscriptions to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Subscription upsert
	 */
	export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Subscription to update in case it exists.
		 */
		where: SubscriptionWhereUniqueInput;
		/**
		 * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
		 */
		create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>;
		/**
		 * In case the Subscription was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>;
	};

	/**
	 * Subscription delete
	 */
	export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		/**
		 * Filter which Subscription to delete.
		 */
		where: SubscriptionWhereUniqueInput;
	};

	/**
	 * Subscription deleteMany
	 */
	export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Subscriptions to delete
		 */
		where?: SubscriptionWhereInput;
		/**
		 * Limit how many Subscriptions to delete.
		 */
		limit?: number;
	};

	/**
	 * Subscription without action
	 */
	export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
	};

	/**
	 * Model Plan
	 */

	export type AggregatePlan = {
		_count: PlanCountAggregateOutputType | null;
		_avg: PlanAvgAggregateOutputType | null;
		_sum: PlanSumAggregateOutputType | null;
		_min: PlanMinAggregateOutputType | null;
		_max: PlanMaxAggregateOutputType | null;
	};

	export type PlanAvgAggregateOutputType = {
		price: number | null;
	};

	export type PlanSumAggregateOutputType = {
		price: number | null;
	};

	export type PlanMinAggregateOutputType = {
		id: string | null;
		title: string | null;
		description: string | null;
		stripeProductId: string | null;
		stripePlanId: string | null;
		price: number | null;
		currency: string | null;
		interval: string | null;
		createdAt: Date | null;
	};

	export type PlanMaxAggregateOutputType = {
		id: string | null;
		title: string | null;
		description: string | null;
		stripeProductId: string | null;
		stripePlanId: string | null;
		price: number | null;
		currency: string | null;
		interval: string | null;
		createdAt: Date | null;
	};

	export type PlanCountAggregateOutputType = {
		id: number;
		title: number;
		description: number;
		stripeProductId: number;
		stripePlanId: number;
		price: number;
		currency: number;
		interval: number;
		createdAt: number;
		_all: number;
	};

	export type PlanAvgAggregateInputType = {
		price?: true;
	};

	export type PlanSumAggregateInputType = {
		price?: true;
	};

	export type PlanMinAggregateInputType = {
		id?: true;
		title?: true;
		description?: true;
		stripeProductId?: true;
		stripePlanId?: true;
		price?: true;
		currency?: true;
		interval?: true;
		createdAt?: true;
	};

	export type PlanMaxAggregateInputType = {
		id?: true;
		title?: true;
		description?: true;
		stripeProductId?: true;
		stripePlanId?: true;
		price?: true;
		currency?: true;
		interval?: true;
		createdAt?: true;
	};

	export type PlanCountAggregateInputType = {
		id?: true;
		title?: true;
		description?: true;
		stripeProductId?: true;
		stripePlanId?: true;
		price?: true;
		currency?: true;
		interval?: true;
		createdAt?: true;
		_all?: true;
	};

	export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Plan to aggregate.
		 */
		where?: PlanWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Plans to fetch.
		 */
		orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: PlanWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Plans from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Plans.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Plans
		 **/
		_count?: true | PlanCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: PlanAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: PlanSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: PlanMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: PlanMaxAggregateInputType;
	};

	export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
		[P in keyof T & keyof AggregatePlan]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregatePlan[P]>
			: GetScalarType<T[P], AggregatePlan[P]>;
	};

	export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		where?: PlanWhereInput;
		orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[];
		by: PlanScalarFieldEnum[] | PlanScalarFieldEnum;
		having?: PlanScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: PlanCountAggregateInputType | true;
		_avg?: PlanAvgAggregateInputType;
		_sum?: PlanSumAggregateInputType;
		_min?: PlanMinAggregateInputType;
		_max?: PlanMaxAggregateInputType;
	};

	export type PlanGroupByOutputType = {
		id: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt: Date;
		_count: PlanCountAggregateOutputType | null;
		_avg: PlanAvgAggregateOutputType | null;
		_sum: PlanSumAggregateOutputType | null;
		_min: PlanMinAggregateOutputType | null;
		_max: PlanMaxAggregateOutputType | null;
	};

	type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<PlanGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof PlanGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], PlanGroupByOutputType[P]>
					: GetScalarType<T[P], PlanGroupByOutputType[P]>;
			}
		>
	>;

	export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			title?: boolean;
			description?: boolean;
			stripeProductId?: boolean;
			stripePlanId?: boolean;
			price?: boolean;
			currency?: boolean;
			interval?: boolean;
			createdAt?: boolean;
			Subscription?: boolean | Plan$SubscriptionArgs<ExtArgs>;
			_count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["plan"]
	>;

	export type PlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			title?: boolean;
			description?: boolean;
			stripeProductId?: boolean;
			stripePlanId?: boolean;
			price?: boolean;
			currency?: boolean;
			interval?: boolean;
			createdAt?: boolean;
		},
		ExtArgs["result"]["plan"]
	>;

	export type PlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
		{
			id?: boolean;
			title?: boolean;
			description?: boolean;
			stripeProductId?: boolean;
			stripePlanId?: boolean;
			price?: boolean;
			currency?: boolean;
			interval?: boolean;
			createdAt?: boolean;
		},
		ExtArgs["result"]["plan"]
	>;

	export type PlanSelectScalar = {
		id?: boolean;
		title?: boolean;
		description?: boolean;
		stripeProductId?: boolean;
		stripePlanId?: boolean;
		price?: boolean;
		currency?: boolean;
		interval?: boolean;
		createdAt?: boolean;
	};

	export type PlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
		"id" | "title" | "description" | "stripeProductId" | "stripePlanId" | "price" | "currency" | "interval" | "createdAt",
		ExtArgs["result"]["plan"]
	>;
	export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		Subscription?: boolean | Plan$SubscriptionArgs<ExtArgs>;
		_count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type PlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {};
	export type PlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {};

	export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "Plan";
		objects: {
			Subscription: Prisma.$SubscriptionPayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				title: string;
				description: string;
				stripeProductId: string;
				stripePlanId: string;
				price: number;
				currency: string;
				interval: string;
				createdAt: Date;
			},
			ExtArgs["result"]["plan"]
		>;
		composites: {};
	};

	type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>;

	type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		PlanFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: PlanCountAggregateInputType | true;
	};

	export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Plan"]; meta: { name: "Plan" } };
		/**
		 * Find zero or one Plan that matches the filter.
		 * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
		 * @example
		 * // Get one Plan
		 * const plan = await prisma.plan.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends PlanFindUniqueArgs>(
			args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;

		/**
		 * Find one Plan that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
		 * @example
		 * // Get one Plan
		 * const plan = await prisma.plan.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(
			args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Find the first Plan that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanFindFirstArgs} args - Arguments to find a Plan
		 * @example
		 * // Get one Plan
		 * const plan = await prisma.plan.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends PlanFindFirstArgs>(
			args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;

		/**
		 * Find the first Plan that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
		 * @example
		 * // Get one Plan
		 * const plan = await prisma.plan.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(
			args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Find zero or more Plans that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Plans
		 * const plans = await prisma.plan.findMany()
		 *
		 * // Get first 10 Plans
		 * const plans = await prisma.plan.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends PlanFindManyArgs>(
			args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;

		/**
		 * Create a Plan.
		 * @param {PlanCreateArgs} args - Arguments to create a Plan.
		 * @example
		 * // Create one Plan
		 * const Plan = await prisma.plan.create({
		 *   data: {
		 *     // ... data to create a Plan
		 *   }
		 * })
		 *
		 */
		create<T extends PlanCreateArgs>(
			args: SelectSubset<T, PlanCreateArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Create many Plans.
		 * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
		 * @example
		 * // Create many Plans
		 * const plan = await prisma.plan.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Plans and returns the data saved in the database.
		 * @param {PlanCreateManyAndReturnArgs} args - Arguments to create many Plans.
		 * @example
		 * // Create many Plans
		 * const plan = await prisma.plan.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Plans and only return the `id`
		 * const planWithIdOnly = await prisma.plan.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(
			args?: SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Delete a Plan.
		 * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
		 * @example
		 * // Delete one Plan
		 * const Plan = await prisma.plan.delete({
		 *   where: {
		 *     // ... filter to delete one Plan
		 *   }
		 * })
		 *
		 */
		delete<T extends PlanDeleteArgs>(
			args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Update one Plan.
		 * @param {PlanUpdateArgs} args - Arguments to update one Plan.
		 * @example
		 * // Update one Plan
		 * const plan = await prisma.plan.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends PlanUpdateArgs>(
			args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Delete zero or more Plans.
		 * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
		 * @example
		 * // Delete a few Plans
		 * const { count } = await prisma.plan.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Plans.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Plans
		 * const plan = await prisma.plan.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Plans and returns the data updated in the database.
		 * @param {PlanUpdateManyAndReturnArgs} args - Arguments to update many Plans.
		 * @example
		 * // Update many Plans
		 * const plan = await prisma.plan.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Plans and only return the `id`
		 * const planWithIdOnly = await prisma.plan.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends PlanUpdateManyAndReturnArgs>(
			args: SelectSubset<T, PlanUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;

		/**
		 * Create or update one Plan.
		 * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
		 * @example
		 * // Update or create a Plan
		 * const plan = await prisma.plan.upsert({
		 *   create: {
		 *     // ... data to create a Plan
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Plan we want to update
		 *   }
		 * })
		 */
		upsert<T extends PlanUpsertArgs>(
			args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>,
		): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;

		/**
		 * Count the number of Plans.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanCountArgs} args - Arguments to filter Plans to count.
		 * @example
		 * // Count the number of Plans
		 * const count = await prisma.plan.count({
		 *   where: {
		 *     // ... the filter for the Plans we want to count
		 *   }
		 * })
		 **/
		count<T extends PlanCountArgs>(
			args?: Subset<T, PlanCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any> ? (T["select"] extends true ? number : GetScalarType<T["select"], PlanCountAggregateOutputType>) : number
		>;

		/**
		 * Allows you to perform aggregations operations on a Plan.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>;

		/**
		 * Group by Plan.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PlanGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends PlanGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake ? { orderBy: PlanGroupByArgs["orderBy"] } : { orderBy?: PlanGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors,
		): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Plan model
		 */
		readonly fields: PlanFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Plan.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}>
		extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		Subscription<T extends Plan$SubscriptionArgs<ExtArgs> = {}>(
			args?: Subset<T, Plan$SubscriptionArgs<ExtArgs>>,
		): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Plan model
	 */
	interface PlanFieldRefs {
		readonly id: FieldRef<"Plan", "String">;
		readonly title: FieldRef<"Plan", "String">;
		readonly description: FieldRef<"Plan", "String">;
		readonly stripeProductId: FieldRef<"Plan", "String">;
		readonly stripePlanId: FieldRef<"Plan", "String">;
		readonly price: FieldRef<"Plan", "Float">;
		readonly currency: FieldRef<"Plan", "String">;
		readonly interval: FieldRef<"Plan", "String">;
		readonly createdAt: FieldRef<"Plan", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Plan findUnique
	 */
	export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter, which Plan to fetch.
		 */
		where: PlanWhereUniqueInput;
	};

	/**
	 * Plan findUniqueOrThrow
	 */
	export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter, which Plan to fetch.
		 */
		where: PlanWhereUniqueInput;
	};

	/**
	 * Plan findFirst
	 */
	export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter, which Plan to fetch.
		 */
		where?: PlanWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Plans to fetch.
		 */
		orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Plans.
		 */
		cursor?: PlanWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Plans from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Plans.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Plans.
		 */
		distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[];
	};

	/**
	 * Plan findFirstOrThrow
	 */
	export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter, which Plan to fetch.
		 */
		where?: PlanWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Plans to fetch.
		 */
		orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Plans.
		 */
		cursor?: PlanWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Plans from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Plans.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Plans.
		 */
		distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[];
	};

	/**
	 * Plan findMany
	 */
	export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter, which Plans to fetch.
		 */
		where?: PlanWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Plans to fetch.
		 */
		orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Plans.
		 */
		cursor?: PlanWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Plans from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Plans.
		 */
		skip?: number;
		distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[];
	};

	/**
	 * Plan create
	 */
	export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Plan.
		 */
		data: XOR<PlanCreateInput, PlanUncheckedCreateInput>;
	};

	/**
	 * Plan createMany
	 */
	export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to create many Plans.
		 */
		data: PlanCreateManyInput | PlanCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Plan createManyAndReturn
	 */
	export type PlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * The data used to create many Plans.
		 */
		data: PlanCreateManyInput | PlanCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Plan update
	 */
	export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Plan.
		 */
		data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>;
		/**
		 * Choose, which Plan to update.
		 */
		where: PlanWhereUniqueInput;
	};

	/**
	 * Plan updateMany
	 */
	export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * The data used to update Plans.
		 */
		data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>;
		/**
		 * Filter which Plans to update
		 */
		where?: PlanWhereInput;
		/**
		 * Limit how many Plans to update.
		 */
		limit?: number;
	};

	/**
	 * Plan updateManyAndReturn
	 */
	export type PlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * The data used to update Plans.
		 */
		data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>;
		/**
		 * Filter which Plans to update
		 */
		where?: PlanWhereInput;
		/**
		 * Limit how many Plans to update.
		 */
		limit?: number;
	};

	/**
	 * Plan upsert
	 */
	export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Plan to update in case it exists.
		 */
		where: PlanWhereUniqueInput;
		/**
		 * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
		 */
		create: XOR<PlanCreateInput, PlanUncheckedCreateInput>;
		/**
		 * In case the Plan was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>;
	};

	/**
	 * Plan delete
	 */
	export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
		/**
		 * Filter which Plan to delete.
		 */
		where: PlanWhereUniqueInput;
	};

	/**
	 * Plan deleteMany
	 */
	export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Filter which Plans to delete
		 */
		where?: PlanWhereInput;
		/**
		 * Limit how many Plans to delete.
		 */
		limit?: number;
	};

	/**
	 * Plan.Subscription
	 */
	export type Plan$SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Subscription
		 */
		select?: SubscriptionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Subscription
		 */
		omit?: SubscriptionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SubscriptionInclude<ExtArgs> | null;
		where?: SubscriptionWhereInput;
		orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[];
		cursor?: SubscriptionWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[];
	};

	/**
	 * Plan without action
	 */
	export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Plan
		 */
		select?: PlanSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Plan
		 */
		omit?: PlanOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PlanInclude<ExtArgs> | null;
	};

	/**
	 * Enums
	 */

	export const TransactionIsolationLevel: {
		ReadUncommitted: "ReadUncommitted";
		ReadCommitted: "ReadCommitted";
		RepeatableRead: "RepeatableRead";
		Serializable: "Serializable";
	};

	export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

	export const TransactionScalarFieldEnum: {
		id: "id";
		amount: "amount";
		currency: "currency";
		stripeSubscriptionId: "stripeSubscriptionId";
		status: "status";
		createdAt: "createdAt";
		expiresAt: "expiresAt";
		provider: "provider";
		userId: "userId";
	};

	export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];

	export const SubscriptionScalarFieldEnum: {
		id: "id";
		userId: "userId";
		planId: "planId";
		createdAt: "createdAt";
		expiresAt: "expiresAt";
		stripeSubscriptionId: "stripeSubscriptionId";
		isAutoRenewal: "isAutoRenewal";
	};

	export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];

	export const PlanScalarFieldEnum: {
		id: "id";
		title: "title";
		description: "description";
		stripeProductId: "stripeProductId";
		stripePlanId: "stripePlanId";
		price: "price";
		currency: "currency";
		interval: "interval";
		createdAt: "createdAt";
	};

	export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum];

	export const SortOrder: {
		asc: "asc";
		desc: "desc";
	};

	export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

	export const QueryMode: {
		default: "default";
		insensitive: "insensitive";
	};

	export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

	export const NullsOrder: {
		first: "first";
		last: "last";
	};

	export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

	/**
	 * Field references
	 */

	/**
	 * Reference to a field of type 'String'
	 */
	export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String">;

	/**
	 * Reference to a field of type 'String[]'
	 */
	export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String[]">;

	/**
	 * Reference to a field of type 'Float'
	 */
	export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float">;

	/**
	 * Reference to a field of type 'Float[]'
	 */
	export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float[]">;

	/**
	 * Reference to a field of type 'TransactionStatus'
	 */
	export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "TransactionStatus">;

	/**
	 * Reference to a field of type 'TransactionStatus[]'
	 */
	export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "TransactionStatus[]">;

	/**
	 * Reference to a field of type 'DateTime'
	 */
	export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "DateTime">;

	/**
	 * Reference to a field of type 'DateTime[]'
	 */
	export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "DateTime[]">;

	/**
	 * Reference to a field of type 'TransactionProvider'
	 */
	export type EnumTransactionProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "TransactionProvider">;

	/**
	 * Reference to a field of type 'TransactionProvider[]'
	 */
	export type ListEnumTransactionProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "TransactionProvider[]">;

	/**
	 * Reference to a field of type 'Boolean'
	 */
	export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Boolean">;

	/**
	 * Reference to a field of type 'Int'
	 */
	export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int">;

	/**
	 * Reference to a field of type 'Int[]'
	 */
	export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int[]">;

	/**
	 * Deep Input Types
	 */

	export type TransactionWhereInput = {
		AND?: TransactionWhereInput | TransactionWhereInput[];
		OR?: TransactionWhereInput[];
		NOT?: TransactionWhereInput | TransactionWhereInput[];
		id?: StringFilter<"Transaction"> | string;
		amount?: FloatFilter<"Transaction"> | number;
		currency?: StringFilter<"Transaction"> | string;
		stripeSubscriptionId?: StringNullableFilter<"Transaction"> | string | null;
		status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus;
		createdAt?: DateTimeFilter<"Transaction"> | Date | string;
		expiresAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null;
		provider?: EnumTransactionProviderFilter<"Transaction"> | $Enums.TransactionProvider;
		userId?: StringFilter<"Transaction"> | string;
	};

	export type TransactionOrderByWithRelationInput = {
		id?: SortOrder;
		amount?: SortOrder;
		currency?: SortOrder;
		stripeSubscriptionId?: SortOrderInput | SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		provider?: SortOrder;
		userId?: SortOrder;
	};

	export type TransactionWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: TransactionWhereInput | TransactionWhereInput[];
			OR?: TransactionWhereInput[];
			NOT?: TransactionWhereInput | TransactionWhereInput[];
			amount?: FloatFilter<"Transaction"> | number;
			currency?: StringFilter<"Transaction"> | string;
			stripeSubscriptionId?: StringNullableFilter<"Transaction"> | string | null;
			status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus;
			createdAt?: DateTimeFilter<"Transaction"> | Date | string;
			expiresAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null;
			provider?: EnumTransactionProviderFilter<"Transaction"> | $Enums.TransactionProvider;
			userId?: StringFilter<"Transaction"> | string;
		},
		"id"
	>;

	export type TransactionOrderByWithAggregationInput = {
		id?: SortOrder;
		amount?: SortOrder;
		currency?: SortOrder;
		stripeSubscriptionId?: SortOrderInput | SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		provider?: SortOrder;
		userId?: SortOrder;
		_count?: TransactionCountOrderByAggregateInput;
		_avg?: TransactionAvgOrderByAggregateInput;
		_max?: TransactionMaxOrderByAggregateInput;
		_min?: TransactionMinOrderByAggregateInput;
		_sum?: TransactionSumOrderByAggregateInput;
	};

	export type TransactionScalarWhereWithAggregatesInput = {
		AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[];
		OR?: TransactionScalarWhereWithAggregatesInput[];
		NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Transaction"> | string;
		amount?: FloatWithAggregatesFilter<"Transaction"> | number;
		currency?: StringWithAggregatesFilter<"Transaction"> | string;
		stripeSubscriptionId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null;
		status?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus;
		createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string;
		expiresAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null;
		provider?: EnumTransactionProviderWithAggregatesFilter<"Transaction"> | $Enums.TransactionProvider;
		userId?: StringWithAggregatesFilter<"Transaction"> | string;
	};

	export type SubscriptionWhereInput = {
		AND?: SubscriptionWhereInput | SubscriptionWhereInput[];
		OR?: SubscriptionWhereInput[];
		NOT?: SubscriptionWhereInput | SubscriptionWhereInput[];
		id?: StringFilter<"Subscription"> | string;
		userId?: StringFilter<"Subscription"> | string;
		planId?: StringFilter<"Subscription"> | string;
		createdAt?: DateTimeFilter<"Subscription"> | Date | string;
		expiresAt?: DateTimeFilter<"Subscription"> | Date | string;
		stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null;
		isAutoRenewal?: BoolFilter<"Subscription"> | boolean;
		plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>;
	};

	export type SubscriptionOrderByWithRelationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		planId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		stripeSubscriptionId?: SortOrderInput | SortOrder;
		isAutoRenewal?: SortOrder;
		plan?: PlanOrderByWithRelationInput;
	};

	export type SubscriptionWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: SubscriptionWhereInput | SubscriptionWhereInput[];
			OR?: SubscriptionWhereInput[];
			NOT?: SubscriptionWhereInput | SubscriptionWhereInput[];
			userId?: StringFilter<"Subscription"> | string;
			planId?: StringFilter<"Subscription"> | string;
			createdAt?: DateTimeFilter<"Subscription"> | Date | string;
			expiresAt?: DateTimeFilter<"Subscription"> | Date | string;
			stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null;
			isAutoRenewal?: BoolFilter<"Subscription"> | boolean;
			plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>;
		},
		"id"
	>;

	export type SubscriptionOrderByWithAggregationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		planId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		stripeSubscriptionId?: SortOrderInput | SortOrder;
		isAutoRenewal?: SortOrder;
		_count?: SubscriptionCountOrderByAggregateInput;
		_max?: SubscriptionMaxOrderByAggregateInput;
		_min?: SubscriptionMinOrderByAggregateInput;
	};

	export type SubscriptionScalarWhereWithAggregatesInput = {
		AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[];
		OR?: SubscriptionScalarWhereWithAggregatesInput[];
		NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Subscription"> | string;
		userId?: StringWithAggregatesFilter<"Subscription"> | string;
		planId?: StringWithAggregatesFilter<"Subscription"> | string;
		createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
		expiresAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
		stripeSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null;
		isAutoRenewal?: BoolWithAggregatesFilter<"Subscription"> | boolean;
	};

	export type PlanWhereInput = {
		AND?: PlanWhereInput | PlanWhereInput[];
		OR?: PlanWhereInput[];
		NOT?: PlanWhereInput | PlanWhereInput[];
		id?: StringFilter<"Plan"> | string;
		title?: StringFilter<"Plan"> | string;
		description?: StringFilter<"Plan"> | string;
		stripeProductId?: StringFilter<"Plan"> | string;
		stripePlanId?: StringFilter<"Plan"> | string;
		price?: FloatFilter<"Plan"> | number;
		currency?: StringFilter<"Plan"> | string;
		interval?: StringFilter<"Plan"> | string;
		createdAt?: DateTimeFilter<"Plan"> | Date | string;
		Subscription?: SubscriptionListRelationFilter;
	};

	export type PlanOrderByWithRelationInput = {
		id?: SortOrder;
		title?: SortOrder;
		description?: SortOrder;
		stripeProductId?: SortOrder;
		stripePlanId?: SortOrder;
		price?: SortOrder;
		currency?: SortOrder;
		interval?: SortOrder;
		createdAt?: SortOrder;
		Subscription?: SubscriptionOrderByRelationAggregateInput;
	};

	export type PlanWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: PlanWhereInput | PlanWhereInput[];
			OR?: PlanWhereInput[];
			NOT?: PlanWhereInput | PlanWhereInput[];
			title?: StringFilter<"Plan"> | string;
			description?: StringFilter<"Plan"> | string;
			stripeProductId?: StringFilter<"Plan"> | string;
			stripePlanId?: StringFilter<"Plan"> | string;
			price?: FloatFilter<"Plan"> | number;
			currency?: StringFilter<"Plan"> | string;
			interval?: StringFilter<"Plan"> | string;
			createdAt?: DateTimeFilter<"Plan"> | Date | string;
			Subscription?: SubscriptionListRelationFilter;
		},
		"id"
	>;

	export type PlanOrderByWithAggregationInput = {
		id?: SortOrder;
		title?: SortOrder;
		description?: SortOrder;
		stripeProductId?: SortOrder;
		stripePlanId?: SortOrder;
		price?: SortOrder;
		currency?: SortOrder;
		interval?: SortOrder;
		createdAt?: SortOrder;
		_count?: PlanCountOrderByAggregateInput;
		_avg?: PlanAvgOrderByAggregateInput;
		_max?: PlanMaxOrderByAggregateInput;
		_min?: PlanMinOrderByAggregateInput;
		_sum?: PlanSumOrderByAggregateInput;
	};

	export type PlanScalarWhereWithAggregatesInput = {
		AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[];
		OR?: PlanScalarWhereWithAggregatesInput[];
		NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Plan"> | string;
		title?: StringWithAggregatesFilter<"Plan"> | string;
		description?: StringWithAggregatesFilter<"Plan"> | string;
		stripeProductId?: StringWithAggregatesFilter<"Plan"> | string;
		stripePlanId?: StringWithAggregatesFilter<"Plan"> | string;
		price?: FloatWithAggregatesFilter<"Plan"> | number;
		currency?: StringWithAggregatesFilter<"Plan"> | string;
		interval?: StringWithAggregatesFilter<"Plan"> | string;
		createdAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string;
	};

	export type TransactionCreateInput = {
		id?: string;
		amount: number;
		currency: string;
		stripeSubscriptionId?: string | null;
		status?: $Enums.TransactionStatus;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		provider: $Enums.TransactionProvider;
		userId: string;
	};

	export type TransactionUncheckedCreateInput = {
		id?: string;
		amount: number;
		currency: string;
		stripeSubscriptionId?: string | null;
		status?: $Enums.TransactionStatus;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		provider: $Enums.TransactionProvider;
		userId: string;
	};

	export type TransactionUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		amount?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		provider?: EnumTransactionProviderFieldUpdateOperationsInput | $Enums.TransactionProvider;
		userId?: StringFieldUpdateOperationsInput | string;
	};

	export type TransactionUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		amount?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		provider?: EnumTransactionProviderFieldUpdateOperationsInput | $Enums.TransactionProvider;
		userId?: StringFieldUpdateOperationsInput | string;
	};

	export type TransactionCreateManyInput = {
		id?: string;
		amount: number;
		currency: string;
		stripeSubscriptionId?: string | null;
		status?: $Enums.TransactionStatus;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		provider: $Enums.TransactionProvider;
		userId: string;
	};

	export type TransactionUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		amount?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		provider?: EnumTransactionProviderFieldUpdateOperationsInput | $Enums.TransactionProvider;
		userId?: StringFieldUpdateOperationsInput | string;
	};

	export type TransactionUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		amount?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		provider?: EnumTransactionProviderFieldUpdateOperationsInput | $Enums.TransactionProvider;
		userId?: StringFieldUpdateOperationsInput | string;
	};

	export type SubscriptionCreateInput = {
		id?: string;
		userId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
		plan: PlanCreateNestedOneWithoutSubscriptionInput;
	};

	export type SubscriptionUncheckedCreateInput = {
		id?: string;
		userId: string;
		planId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
		plan?: PlanUpdateOneRequiredWithoutSubscriptionNestedInput;
	};

	export type SubscriptionUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		planId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	export type SubscriptionCreateManyInput = {
		id?: string;
		userId: string;
		planId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	export type SubscriptionUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		planId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	export type PlanCreateInput = {
		id?: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt?: Date | string;
		Subscription?: SubscriptionCreateNestedManyWithoutPlanInput;
	};

	export type PlanUncheckedCreateInput = {
		id?: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt?: Date | string;
		Subscription?: SubscriptionUncheckedCreateNestedManyWithoutPlanInput;
	};

	export type PlanUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Subscription?: SubscriptionUpdateManyWithoutPlanNestedInput;
	};

	export type PlanUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Subscription?: SubscriptionUncheckedUpdateManyWithoutPlanNestedInput;
	};

	export type PlanCreateManyInput = {
		id?: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt?: Date | string;
	};

	export type PlanUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PlanUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type StringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type FloatFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatFilter<$PrismaModel> | number;
	};

	export type StringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type EnumTransactionStatusFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus;
	};

	export type DateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type DateTimeNullableFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
	};

	export type EnumTransactionProviderFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionProvider | EnumTransactionProviderFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionProviderFilter<$PrismaModel> | $Enums.TransactionProvider;
	};

	export type SortOrderInput = {
		sort: SortOrder;
		nulls?: NullsOrder;
	};

	export type TransactionCountOrderByAggregateInput = {
		id?: SortOrder;
		amount?: SortOrder;
		currency?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		provider?: SortOrder;
		userId?: SortOrder;
	};

	export type TransactionAvgOrderByAggregateInput = {
		amount?: SortOrder;
	};

	export type TransactionMaxOrderByAggregateInput = {
		id?: SortOrder;
		amount?: SortOrder;
		currency?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		provider?: SortOrder;
		userId?: SortOrder;
	};

	export type TransactionMinOrderByAggregateInput = {
		id?: SortOrder;
		amount?: SortOrder;
		currency?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		provider?: SortOrder;
		userId?: SortOrder;
	};

	export type TransactionSumOrderByAggregateInput = {
		amount?: SortOrder;
	};

	export type StringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type FloatWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedFloatFilter<$PrismaModel>;
		_min?: NestedFloatFilter<$PrismaModel>;
		_max?: NestedFloatFilter<$PrismaModel>;
	};

	export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTransactionStatusFilter<$PrismaModel>;
		_max?: NestedEnumTransactionStatusFilter<$PrismaModel>;
	};

	export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedDateTimeNullableFilter<$PrismaModel>;
		_max?: NestedDateTimeNullableFilter<$PrismaModel>;
	};

	export type EnumTransactionProviderWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionProvider | EnumTransactionProviderFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionProviderWithAggregatesFilter<$PrismaModel> | $Enums.TransactionProvider;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTransactionProviderFilter<$PrismaModel>;
		_max?: NestedEnumTransactionProviderFilter<$PrismaModel>;
	};

	export type BoolFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolFilter<$PrismaModel> | boolean;
	};

	export type PlanScalarRelationFilter = {
		is?: PlanWhereInput;
		isNot?: PlanWhereInput;
	};

	export type SubscriptionCountOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		planId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		isAutoRenewal?: SortOrder;
	};

	export type SubscriptionMaxOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		planId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		isAutoRenewal?: SortOrder;
	};

	export type SubscriptionMinOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		planId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		stripeSubscriptionId?: SortOrder;
		isAutoRenewal?: SortOrder;
	};

	export type BoolWithAggregatesFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedBoolFilter<$PrismaModel>;
		_max?: NestedBoolFilter<$PrismaModel>;
	};

	export type SubscriptionListRelationFilter = {
		every?: SubscriptionWhereInput;
		some?: SubscriptionWhereInput;
		none?: SubscriptionWhereInput;
	};

	export type SubscriptionOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type PlanCountOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		description?: SortOrder;
		stripeProductId?: SortOrder;
		stripePlanId?: SortOrder;
		price?: SortOrder;
		currency?: SortOrder;
		interval?: SortOrder;
		createdAt?: SortOrder;
	};

	export type PlanAvgOrderByAggregateInput = {
		price?: SortOrder;
	};

	export type PlanMaxOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		description?: SortOrder;
		stripeProductId?: SortOrder;
		stripePlanId?: SortOrder;
		price?: SortOrder;
		currency?: SortOrder;
		interval?: SortOrder;
		createdAt?: SortOrder;
	};

	export type PlanMinOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		description?: SortOrder;
		stripeProductId?: SortOrder;
		stripePlanId?: SortOrder;
		price?: SortOrder;
		currency?: SortOrder;
		interval?: SortOrder;
		createdAt?: SortOrder;
	};

	export type PlanSumOrderByAggregateInput = {
		price?: SortOrder;
	};

	export type StringFieldUpdateOperationsInput = {
		set?: string;
	};

	export type FloatFieldUpdateOperationsInput = {
		set?: number;
		increment?: number;
		decrement?: number;
		multiply?: number;
		divide?: number;
	};

	export type NullableStringFieldUpdateOperationsInput = {
		set?: string | null;
	};

	export type EnumTransactionStatusFieldUpdateOperationsInput = {
		set?: $Enums.TransactionStatus;
	};

	export type DateTimeFieldUpdateOperationsInput = {
		set?: Date | string;
	};

	export type NullableDateTimeFieldUpdateOperationsInput = {
		set?: Date | string | null;
	};

	export type EnumTransactionProviderFieldUpdateOperationsInput = {
		set?: $Enums.TransactionProvider;
	};

	export type PlanCreateNestedOneWithoutSubscriptionInput = {
		create?: XOR<PlanCreateWithoutSubscriptionInput, PlanUncheckedCreateWithoutSubscriptionInput>;
		connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionInput;
		connect?: PlanWhereUniqueInput;
	};

	export type BoolFieldUpdateOperationsInput = {
		set?: boolean;
	};

	export type PlanUpdateOneRequiredWithoutSubscriptionNestedInput = {
		create?: XOR<PlanCreateWithoutSubscriptionInput, PlanUncheckedCreateWithoutSubscriptionInput>;
		connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionInput;
		upsert?: PlanUpsertWithoutSubscriptionInput;
		connect?: PlanWhereUniqueInput;
		update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutSubscriptionInput, PlanUpdateWithoutSubscriptionInput>, PlanUncheckedUpdateWithoutSubscriptionInput>;
	};

	export type SubscriptionCreateNestedManyWithoutPlanInput = {
		create?:
			| XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
			| SubscriptionCreateWithoutPlanInput[]
			| SubscriptionUncheckedCreateWithoutPlanInput[];
		connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[];
		createMany?: SubscriptionCreateManyPlanInputEnvelope;
		connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
	};

	export type SubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
		create?:
			| XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
			| SubscriptionCreateWithoutPlanInput[]
			| SubscriptionUncheckedCreateWithoutPlanInput[];
		connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[];
		createMany?: SubscriptionCreateManyPlanInputEnvelope;
		connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
	};

	export type SubscriptionUpdateManyWithoutPlanNestedInput = {
		create?:
			| XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
			| SubscriptionCreateWithoutPlanInput[]
			| SubscriptionUncheckedCreateWithoutPlanInput[];
		connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[];
		upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
		createMany?: SubscriptionCreateManyPlanInputEnvelope;
		set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
		updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[];
		deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[];
	};

	export type SubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
		create?:
			| XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
			| SubscriptionCreateWithoutPlanInput[]
			| SubscriptionUncheckedCreateWithoutPlanInput[];
		connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[];
		upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
		createMany?: SubscriptionCreateManyPlanInputEnvelope;
		set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[];
		update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
		updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[];
		deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[];
	};

	export type NestedStringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type NestedFloatFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatFilter<$PrismaModel> | number;
	};

	export type NestedStringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus;
	};

	export type NestedDateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
	};

	export type NestedEnumTransactionProviderFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionProvider | EnumTransactionProviderFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionProviderFilter<$PrismaModel> | $Enums.TransactionProvider;
	};

	export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type NestedIntFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntFilter<$PrismaModel> | number;
	};

	export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedFloatFilter<$PrismaModel>;
		_min?: NestedFloatFilter<$PrismaModel>;
		_max?: NestedFloatFilter<$PrismaModel>;
	};

	export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type NestedIntNullableFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableFilter<$PrismaModel> | number | null;
	};

	export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTransactionStatusFilter<$PrismaModel>;
		_max?: NestedEnumTransactionStatusFilter<$PrismaModel>;
	};

	export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedDateTimeNullableFilter<$PrismaModel>;
		_max?: NestedDateTimeNullableFilter<$PrismaModel>;
	};

	export type NestedEnumTransactionProviderWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TransactionProvider | EnumTransactionProviderFieldRefInput<$PrismaModel>;
		in?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TransactionProvider[] | ListEnumTransactionProviderFieldRefInput<$PrismaModel>;
		not?: NestedEnumTransactionProviderWithAggregatesFilter<$PrismaModel> | $Enums.TransactionProvider;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTransactionProviderFilter<$PrismaModel>;
		_max?: NestedEnumTransactionProviderFilter<$PrismaModel>;
	};

	export type NestedBoolFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolFilter<$PrismaModel> | boolean;
	};

	export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedBoolFilter<$PrismaModel>;
		_max?: NestedBoolFilter<$PrismaModel>;
	};

	export type PlanCreateWithoutSubscriptionInput = {
		id?: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt?: Date | string;
	};

	export type PlanUncheckedCreateWithoutSubscriptionInput = {
		id?: string;
		title: string;
		description: string;
		stripeProductId: string;
		stripePlanId: string;
		price: number;
		currency: string;
		interval: string;
		createdAt?: Date | string;
	};

	export type PlanCreateOrConnectWithoutSubscriptionInput = {
		where: PlanWhereUniqueInput;
		create: XOR<PlanCreateWithoutSubscriptionInput, PlanUncheckedCreateWithoutSubscriptionInput>;
	};

	export type PlanUpsertWithoutSubscriptionInput = {
		update: XOR<PlanUpdateWithoutSubscriptionInput, PlanUncheckedUpdateWithoutSubscriptionInput>;
		create: XOR<PlanCreateWithoutSubscriptionInput, PlanUncheckedCreateWithoutSubscriptionInput>;
		where?: PlanWhereInput;
	};

	export type PlanUpdateToOneWithWhereWithoutSubscriptionInput = {
		where?: PlanWhereInput;
		data: XOR<PlanUpdateWithoutSubscriptionInput, PlanUncheckedUpdateWithoutSubscriptionInput>;
	};

	export type PlanUpdateWithoutSubscriptionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PlanUncheckedUpdateWithoutSubscriptionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		stripeProductId?: StringFieldUpdateOperationsInput | string;
		stripePlanId?: StringFieldUpdateOperationsInput | string;
		price?: FloatFieldUpdateOperationsInput | number;
		currency?: StringFieldUpdateOperationsInput | string;
		interval?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SubscriptionCreateWithoutPlanInput = {
		id?: string;
		userId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionUncheckedCreateWithoutPlanInput = {
		id?: string;
		userId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionCreateOrConnectWithoutPlanInput = {
		where: SubscriptionWhereUniqueInput;
		create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>;
	};

	export type SubscriptionCreateManyPlanInputEnvelope = {
		data: SubscriptionCreateManyPlanInput | SubscriptionCreateManyPlanInput[];
		skipDuplicates?: boolean;
	};

	export type SubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
		where: SubscriptionWhereUniqueInput;
		update: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>;
		create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>;
	};

	export type SubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
		where: SubscriptionWhereUniqueInput;
		data: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>;
	};

	export type SubscriptionUpdateManyWithWhereWithoutPlanInput = {
		where: SubscriptionScalarWhereInput;
		data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutPlanInput>;
	};

	export type SubscriptionScalarWhereInput = {
		AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[];
		OR?: SubscriptionScalarWhereInput[];
		NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[];
		id?: StringFilter<"Subscription"> | string;
		userId?: StringFilter<"Subscription"> | string;
		planId?: StringFilter<"Subscription"> | string;
		createdAt?: DateTimeFilter<"Subscription"> | Date | string;
		expiresAt?: DateTimeFilter<"Subscription"> | Date | string;
		stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null;
		isAutoRenewal?: BoolFilter<"Subscription"> | boolean;
	};

	export type SubscriptionCreateManyPlanInput = {
		id?: string;
		userId: string;
		createdAt: Date | string;
		expiresAt: Date | string;
		stripeSubscriptionId?: string | null;
		isAutoRenewal?: boolean;
	};

	export type SubscriptionUpdateWithoutPlanInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	export type SubscriptionUncheckedUpdateWithoutPlanInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	export type SubscriptionUncheckedUpdateManyWithoutPlanInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
		isAutoRenewal?: BoolFieldUpdateOperationsInput | boolean;
	};

	/**
	 * Batch Payload for updateMany & deleteMany & createMany
	 */

	export type BatchPayload = {
		count: number;
	};

	/**
	 * DMMF
	 */
	export const dmmf: runtime.BaseDMMF;
}
