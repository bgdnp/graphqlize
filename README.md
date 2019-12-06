# @bgdn/graphqlize

Write your GraphQL schema in typescript

## Table of contents

- [Introduction](#introduction)
- [Work in progress](#work-in-progress)
- [Instalation](#instalation)
- [Usage](#usage)
  - [Types](#types)
  - [Scalar types](#scalar-types)
  - [Interfaces](#interfaces)
  - [Unions](#unions)
  - [Resolvers](#resolvers)
    - [Resolver classes](#resolver-classes)
    - [Adding queries to resolver classes](#adding-queries-to-resolver-classes)
    - [Query parameters](#query-parameters)
    - [Field resolvers](#field-resolvers)
    - [Inline field resolvers](#inline-field-resolvers)
    - [Mutations](#mutations)
  - [Building schema](#building-schema)

## Introduction

Graphqlize is a library which provides wrapper around [graphql](https://www.npmjs.com/package/graphql) package and allows you too code your graphql schema using typescript. It is inspired by [type-graphql](https://typegraphql.ml/), and includes some changes which solves some problems I had with type-graphql.

## Work in progress:

This is the preliminary version of the package, so some things are not fully supported. This is the list of things currently in development:

- Types inheritance
- Subscriptions
- More options for createSchema
- Better error handling

Anyone is welcome to point out an issue or suggest feature or improvement.

## Installation

```
npm install --save @bgdn/graphqlize
```

## Usage

### Types

To create graphql type decorate a class with `@Type()` decorator factory. Also decorate properties with `@Field()` decorator factory.

> User.ts
>
> ```ts
> import { Type, Field, Int } from '@bgdn/graphqlize'
>
> @Type()
> export class User {
>   @Field()
>   name: string
>
>   @Field()
>   age: Int
> }
> ```

`@Type()` decorator factory accepts one parameter which can either be string representing the name of the type or configuration object. This parameter is optional and if not present name of the class will be used as type name. Configuration object accepts to properties:

- `name: string` - representing type name
- `interfaces: Function[]` - array of interfaces implemented by the type

For example, we change User class name to UserTypeDefinition, but we still want to use User for type name. And also we implement interface Person.

> User.ts
>
> ```ts
> import { Type, Field, Int } from '@bgdn/graphqlize'
> import { Person } from './Person'
>
> @Type({
>   name: 'User',
>   interfaces: [Person],
> })
> export class UserTypeDefinition {
>   @Field()
>   name: string
>
>   @Field()
>   age: Int
> }
> ```

Like types, fields also accept one parameter which can be type class or configuration options. Examples:

```ts
@Field()
user: User
```

can be written as

```ts
@Field(User)
user: any
```

For lists it is **mandatory** to always specify type as an array of type class as item, due to typescript's type metadata limitations. For example:

```ts
@Field([User])
users: User[]
```

When using configuration object, it has following properties:

- `type: Function | [Function]` - specify type, necessary only for lists
- `nullable: boolean` - set field as nullable, false by default
- `nullableList: boolean` - when using list, nullable set item in list to be nullable, but to set entire list as nullable use this property, false by default

Examples:

```ts
@Field({
  nullable: true,
})
name: string

// Will output: name: String

@Field({
  type: [Float],
  nullable: false,
  nullableList: true,
})
numbers: Float[]

// Will output: number: [Float!]
```

### Scalar types

For string and boolean you can use native javascript classes String or Boolean as types, or just set field type as `string` or `boolean`. Since typescript provide just Number class and graphql use Int and Float types, @bgdn/graphqlize provides classes for those types and also for ID. Just import and use them.

```ts
import { Int, Float, ID } from '@bgdn/graphqlize'
```

### Interfaces

Similar as type, interfaces are created using `@Interface()` decorator factory on a class.

> Person.ts
>
> ```ts
> import { Interface, Field } from '@bgdn/graphqlize'
>
> @Interface()
> export class Person {
>   @Field()
>   name: string
>
>   @Field()
>   age: Int
> }
> ```

As interfaces are defined as typescript classes they are extendable by types.

> User.ts
>
> ```ts
> import { Type, Field, Int } from '@bgdn/graphqlize'
> import { Person } from './Person'
>
> @Type({
>   interfaces: [Person],
> })
> export class User extends Person {
>   // fields name and age are inherited from person
>   // and will be added to User type
> }
> ```

Interfaces in graphql needs to resolve needs to be resolved to specific type. Use `@ResolveType()` method decorator to create a type resolver method. Type resolver method must return type class.

> Person.ts
>
> ```ts
> import { Interface, Field, ResolveType } from '@bgdn/graphqlize'
> import { User } from './User'
>
> @Interface()
> export class Person {
>   @Field()
>   name: string
>
>   @Field()
>   age: Int
>
>   @ResolveType()
>   resolveType() {
>     // some logic to define type
>     // in this basic example just return User type class
>     return User
>   }
> }
> ```

This is basic example. More about resolver methods in resolvers section.

### Unions

Unions, unlike interfaces, can't contain fields, instead they just requires a list of types to include in a union. Like interfaces, unions need `@ResolveType()` decorated type resolver.

> Entry.ts
>
> ```ts
> import { Union, ResolveType } from '@bgdn/graphqlize'
> import { Post } from './Post'
> import { Page } from './Page'
>
> @Union({
>   types: [Post, Page]
> })
> export class Entry {
>   @ResolveType()
>   resolveType() {
>     if (/* some condition */) {
>       return Post
>     } else {
>       return Page
>     }
>   }
> }
> ```

Besides types, Union configuration object can accept optional `name`. If name is ommited class name will be used.

### Resolvers

#### Resolver classes

Decorate a class with `@Resolver()` to declare it as resolver class. Decorator factory accepts type class as an argument to specify the type related to resolver.

> UserResolver.ts
>
> ```ts
> import { Resolver } from '@bgdn/graphqlize'
> import { User } from './User'
>
> @Resolver(User)
> export class UserResolver {}
> ```

#### Adding queries to resolver classes

Let's add our first query to the UserResolver. To do it decorate a method with `@Query()`.

> UserResolver.ts
>
> ```ts
> import { Resolver, Query } from '@bgdn/graphqlize'
> import { User } from './User'
>
> @Resolver(User)
> export class UserResolver {
>   @Query([User])
>   getUsers(): User[] {
>     let users: User[]
>     // ... some logic to populate users variable like
>     // users = db.getAllUsers()
>     return users
>   }
> }
> ```

Query decorator arguments are same as the fields. You can add type. It is mandatory for lists, but for non-list types can be omitted and return type will be used. Also it can accept config object like on fields to configure `nullable` and `nullableList`

#### Query parameters

Use `@Param('param_name')` decorator to add parameter as a query. Parameter name string is required.

> UserResolver.ts
>
> ```ts
> import { Resolver, Query, Param } from '@bgdn/graphqlize'
> import { User } from './User'
>
> @Resolver(User)
> export class UserResolver {
>   @Query([User])
>   getUsers(): User[] {
>     let users: User[]
>     // ... some logic to populate users variable like
>     // users = db.getAllUsers()
>     return users
>   }
>
>   @Query()
>   getUser(@Param('id') id: string): User {
>     let user: User
>     // user = db.getUserById(id)
>     return user
>   }
> }
> ```

#### Field resolvers

Use `FieldResolver()` to resolve resolve fields. For example if we want user name to be all caps.

> ```ts
> import { Resolver, Query, Param, FieldResolver, Parent } from '@bgdn/graphqlize'
> import { User } from './User'
>
> @Resolver(User)
> export class UserResolver {
>   @Query([User])
>   getUsers(): User[] {
>     let users: User[]
>     // ... some logic to populate users variable like
>     // users = db.getAllUsers()
>     return users
>   }
>
>   @Query()
>   getUser(@Param('id') id: string): User {
>     let user: User
>     // user = db.getUserById(id)
>     return user
>   }
>
>   @FieldResolver()
>   name(@Parent() parent: User): string {
>     return parent.name.toUpperCase()
>   }
> }
> ```

In the example above `@Parent()` is used to decorate function argument which is used to inject parent object. Besides `@Parent()` graphql context and info can be injected using `@Context()` and `@Info()`.

#### Inline field resolvers

Inline field resolvers are resolver functions added directly to type/interface definition. You can convert type property to method and you get the resolver function. Method return type becomes the field type. Change:

```ts
@Field()
name: string
```

To:

```ts
@Field()
name(): string {
  return 'Kiza Rok'
}
```

However, inline resolvers are not recommended way of adding resolver functions.

#### Mutations

Mutations are defined same as queries. just use `@Mutation()` instead of `@Query()`

### Building schema

After defining schema use `createSchema` function to build schema.

```ts
import { createSchema } from '@bgdn/graphqlize'
import { UserResolver } from './resolvers/UserResolver'

const schema = createSchema({
  resolvers: [UserResolver],
})

// ...use schema to create graphql endpoint
```
