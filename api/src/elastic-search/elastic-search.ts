import { Client } from "@elastic/elasticsearch";
import { MappingProperty } from "@elastic/elasticsearch/lib/api/types";

export type ElasticSchema = Record<string, MappingProperty> | undefined;

// Instantiate the client with an API key
const elasticSearchClient = new Client({
  node: "https://localhost:9200",
  auth: {
    apiKey: process.env.ELASTIC_API!,
  },
  tls: {
    // might be required if it's a self-signed certificate
    ca: "./http_ca.crt",
    rejectUnauthorized: false,
  },
});

export default elasticSearchClient;
