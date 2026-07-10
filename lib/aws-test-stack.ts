import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class AwsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. HonoアプリをLambda関数として定義
    const honoFunction = new lambda.NodejsFunction(this, 'HonoHandler', {
      entry: 'src/index.ts', // プロジェクトルートからのパス
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    });

    // 2. API Gateway (HTTP API) を作成
    const httpApi = new apigwv2.HttpApi(this, 'HonoApi');

    // 3. API GatewayとLambdaを紐付ける
    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration('HonoIntegration', honoFunction),
    });

    // デプロイ後にURLを表示するための出力設定
    new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.apiEndpoint });
  }
}