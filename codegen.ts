import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql", // WAIS backend GraphQL Federation endpoint
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        defaultScalarType: "unknown",
        scalars: {
          DateTime: "string",
          Decimal: "string",
          UUID: "string",
        },
      },
    },
    "src/gql/schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
