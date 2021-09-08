import { DynamoDBClient, PutItemCommand, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({region: "us-west-2", endpoint: "http://127.0.0.1:8000"});

const params = {
    AttributeDefinitions: [
      {
        AttributeName: "Season", //ATTRIBUTE_NAME_1
        AttributeType: "N", //ATTRIBUTE_TYPE
      },
      {
        AttributeName: "Episode", //ATTRIBUTE_NAME_2
        AttributeType: "N", //ATTRIBUTE_TYPE
      },
    ],
    KeySchema: [
      {
        AttributeName: "Season", //ATTRIBUTE_NAME_1
        KeyType: "HASH",
      },
      {
        AttributeName: "Episode", //ATTRIBUTE_NAME_2
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "TEST_TABLE", //TABLE_NAME
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

const createTable = async () => {
    try {
        const data = await ddbClient.send(new CreateTableCommand(params));
        console.log("Table Created", data);
        return data;
    } catch (err) {
        console.log("Error: ", err);
    }
}

const listTables = async () => {
    try {
      const data = await ddbClient.send(new ListTablesCommand({}));
      console.log(data.TableNames.join("\n"));
      return data;
    } catch (err) {
      console.error(err);
    }
  };

createTable();
listTables();