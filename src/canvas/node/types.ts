/**
 * A ServiceDefinition represents a Microservice, Database, or more in the canvas.
 */
export type ServiceDefinition = {
  id: string;
  name: string;
  type: "Microservice" | "Database" | "Other";
  dockerImage: string;
  description: string;
  ports: string[];
  environmentVariables: string[];
};
