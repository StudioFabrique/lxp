import fs from "fs";
import path from "path";
import { Client } from "@elastic/elasticsearch";
import { MappingProperty } from "@elastic/elasticsearch/lib/api/types";

export type ElasticSchema = Record<string, MappingProperty> | undefined;

// Instantiate the client with an API key

const elasticSearchClient = new Client({
  node: "https://localhost:9200/",
  auth: {
    apiKey: process.env.ELASTIC_API ?? "",
  },
  tls: {
    // might be required if it's a self-signed certificate
    ca: fs.readFileSync(path.resolve(__dirname, "./certs/http_ca.crt")),
    // Use http.p12 for client certificate and key
    /* cert: fs.readFileSync(path.resolve(__dirname, "./certs/http.p12")), */
    // Provide password for the http.p12 file if required

    rejectUnauthorized: false,
  },
});

export default elasticSearchClient;
