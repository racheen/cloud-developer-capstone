import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const postTable = process.env.POSTS_TABLE

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const userId = getUserId(event);
  
  try {
    const result = await docClient.query({
        TableName: postTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
    .promise();

    const items = result.Items

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
  } catch(e) {
    logger.error('failed to get', e);
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: e
      })
    }
  }
  // TODO: Get all TODO items for a current user
  // DONE
}
