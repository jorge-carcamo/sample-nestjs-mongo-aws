## Architecture
![image](https://user-images.githubusercontent.com/88357997/166248014-b2cec599-324b-4cc6-945c-1e6c8f43ebd9.png)


## Stack
- **Node**: 14.17.0
- **npm**: 6.14.6
- **NestJS**: 8.0.0
- **yarn**: 1.22.5
- **Serverless Framework**: 2.69.0

## Database
To test with databases on AWS, create a Mongo compatible **DocumentDB cluster** and assign it connection parameters like **Secrets Manager** secrets. The secret's mandatory keys must be the following: **uri**

Eventually, secrets can be encrypted with **Key Management Service**, this setup is transparent to source code and nothing needs to be added.

In the event that the connection to the database is with **SSL**, add the following lines of code in the **createMongooseOptions function** from the **src/config/database/database-config.service.ts**  file. The AWS public key is provided in the source code.

```
async createMongooseOptions(): Promise<MongooseModuleOptions> {
  let conn: MongooseModuleOptions = {
    uri: await this.getUri(),
    authMechanism: 'SCRAM-SHA-1',
    ssl: true,
    sslValidate: false,
    sslCA: 'rds-combined-ca-bundle.pem',
  };
  return conn;
}
```

## Environment Variables
To test locally looking at the database in AWS, define the following environment variables and settings according to type
database to test:

```
VAR_ARN_SECRET_MANAGER=Secrets ARN
VAR_KEY_KMS=KMS ARN with which the Secret is encrypted
VAR_COGNITO=Cognito userpool ARN
VAR_AWS_REGION=AWS account region
VAR_SG=VPC security group
VAR_SUBNET1=VPC private subnet 1
VAR_SUBNET2=VPC private subnet 2
```
