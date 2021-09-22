import * as cdk from "@aws-cdk/core";
import { RemovalPolicy } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
  TableEncryption,
} from "@aws-cdk/aws-dynamodb";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from "@aws-cdk/aws-lambda";
import { join } from "path";

export class KafkaStoreAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Database
     */
    const orderTable = new Table(this, "OrderTable", {
      partitionKey: { name: "pk", type: AttributeType.NUMBER },
      sortKey: { name: "sk", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      encryption: TableEncryption.AWS_MANAGED,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const sampleFunction = new NodejsFunction(this, "SampleFunction", {
      runtime: Runtime.NODEJS_14_X,
      handler: "handler",
      entry: join(__dirname, "../../src/sample-lambda.ts"),
      bundling: {
        target: "node14",
        externalModules: ["aws-sdk"],
      },
    });
  }
}
