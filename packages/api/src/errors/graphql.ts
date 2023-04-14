import { ASTNode, GraphQLError, GraphQLFormattedError, Source, SourceLocation } from 'graphql';

export class ElementalGraphQLError extends GraphQLError {
  public extensions: Record<string, any>;
  override readonly name!: string;
  readonly locations: ReadonlyArray<SourceLocation> | undefined;
  readonly path: ReadonlyArray<string | number> | undefined;
  readonly source: Source | undefined;
  readonly positions: ReadonlyArray<number> | undefined;
  readonly nodes: ReadonlyArray<ASTNode> | undefined;
  public originalError: Error | undefined;

  [key: string]: any;

  constructor(
    message: string,
    code?: string,
    extensions?: Record<string, any>,
  ) {
    super(message);

    // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ElementalGraphQLError' });
    }

    if (extensions?.extensions) {
      throw Error(
        'Pass extensions directly as the third argument of the ElementalGraphQLError constructor: `new ' +
          'ElementalGraphQLError(message, code, {myExt: value})`, not `new ElementalGraphQLError(message, code, ' +
          '{extensions: {myExt: value}})`',
      );
    }

    this.extensions = { ...extensions, code };
  }

  get [Symbol.toStringTag](): string {
    return this.name;
  }
}

// function toGraphQLError(error: ElementalGraphQLError): GraphQLError {
//   return new GraphQLError(
//     error.message,
//     {
//       nodes: error.nodes,
//       source: error.source,
//       positions: error.positions,
//       path: error.path,
//       originalError: error.originalError,
//       extensions: error.extensions,
//     }
//   );
// }


export class AuthenticationError extends ElementalGraphQLError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'UNAUTHENTICATED', extensions);

    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}

