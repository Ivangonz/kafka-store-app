import * as cdk from "@aws-cdk/core";
import * as apiGateway from "@aws-cdk/aws-apigatewayv2";
import * as apiIntegrations from "@aws-cdk/aws-apigatewayv2-integrations";
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

    const orderImport = new NodejsFunction(this, "OrderConsumer", {
      runtime: Runtime.NODEJS_14_X,
      handler: "post",
      entry: join(__dirname, "../../src/order-import-consumer.ts"),
      bundling: {
        target: "node14",
        externalModules: ["aws-sdk"],
      },
    });

    const orderApi = new apiGateway.HttpApi(this, "OrderImportApi");
    new cdk.CfnOutput(this, "ApiUrl", { value: orderApi.url! });
    orderApi.addRoutes({
      path: "api/order/import",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiIntegrations.LambdaProxyIntegration({
        handler: orderImport,
      }),
    });

    orderTable.grantWriteData(orderImport);
  }
}
