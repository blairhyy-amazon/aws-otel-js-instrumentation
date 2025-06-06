// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { expect } from 'expect';
import { SqsUrlParser } from '../src/sqs-url-parser';

describe('SqsUrlParserTest', () => {
  it('testSqsClientSpanBasicUrls', async () => {
    validateQueueName('https://sqs.us-east-1.amazonaws.com/123412341234/Q_Name-5', 'Q_Name-5');
    validateQueueName('https://sqs.af-south-1.amazonaws.com/999999999999/-_ThisIsValid', '-_ThisIsValid');
    validateQueueName('http://sqs.eu-west-3.amazonaws.com/000000000000/FirstQueue', 'FirstQueue');
    validateQueueName('sqs.sa-east-1.amazonaws.com/123456781234/SecondQueue', 'SecondQueue');
  });

  it('testSqsClientSpanLegacyFormatUrls', () => {
    validateQueueName('https://ap-northeast-2.queue.amazonaws.com/123456789012/MyQueue', 'MyQueue');
    validateQueueName('http://cn-northwest-1.queue.amazonaws.com/123456789012/MyQueue', 'MyQueue');
    validateQueueName('http://cn-north-1.queue.amazonaws.com/123456789012/MyQueue', 'MyQueue');
    validateQueueName('ap-south-1.queue.amazonaws.com/123412341234/MyLongerQueueNameHere', 'MyLongerQueueNameHere');
    validateQueueName('https://queue.amazonaws.com/123456789012/MyQueue', 'MyQueue');
  });

  it('testSqsClientSpanCustomUrls', () => {
    validateQueueName('http://127.0.0.1:1212/123456789012/MyQueue', 'MyQueue');
    validateQueueName('https://127.0.0.1:1212/123412341234/RRR', 'RRR');
    validateQueueName('127.0.0.1:1212/123412341234/QQ', 'QQ');
    validateQueueName('https://amazon.com/123412341234/BB', 'BB');
  });

  it('testSqsClientSpanLongUrls', () => {
    const queueName: string = 'a'.repeat(80);
    validateQueueName('http://127.0.0.1:1212/123456789012/' + queueName, queueName);

    const queueNameTooLong: string = 'a'.repeat(81);
    validateQueueName('http://127.0.0.1:1212/123456789012/' + queueNameTooLong, undefined);
  });

  it('testClientSpanSqsInvalidOrEmptyUrls', () => {
    validateQueueName(undefined, undefined);
    validateQueueName('', undefined);
    validateQueueName(' ', undefined);
    validateQueueName('/', undefined);
    validateQueueName('//', undefined);
    validateQueueName('///', undefined);
    validateQueueName('//asdf', undefined);
    validateQueueName('/123412341234/as&df', undefined);
    validateQueueName('invalidUrl', undefined);
    validateQueueName('https://www.amazon.com', undefined);
    validateQueueName('https://sqs.us-east-1.amazonaws.com/123412341234/.', undefined);
    validateQueueName('https://sqs.us-east-1.amazonaws.com/12/Queue', undefined);
    validateQueueName('https://sqs.us-east-1.amazonaws.com/A/A', undefined);
    validateQueueName('https://sqs.us-east-1.amazonaws.com/123412341234/A/ThisShouldNotBeHere', undefined);
  });

  it('testGetAccountId', () => {
    validateAccountId(undefined, undefined);
    validateAccountId('', undefined);
    validateAccountId(' ', undefined);
    validateAccountId('/', undefined);
    validateAccountId('//', undefined);
    validateAccountId('///', undefined);
    validateAccountId('//asdf', undefined);
    validateAccountId('/123412341234/as&df', undefined);
    validateAccountId('invalidUrl', undefined);
    validateAccountId('https://www.amazon.com', undefined);
    validateAccountId('https://sqs.us-east-1.amazonaws.com/12341234/Queue', undefined);
    validateAccountId('https://sqs.us-east-1.amazonaws.com/1234123412xx/Queue', undefined);
    validateAccountId('https://sqs.us-east-1.amazonaws.com/1234123412xx', undefined);
  });
});

function validateAccountId(url: string | undefined, expectedAccountId: string | undefined): void {
  expect(SqsUrlParser.getAccountId(url)).toEqual(expectedAccountId);
}

function validateQueueName(url: string | undefined, expectedName: string | undefined): void {
  expect(SqsUrlParser.getQueueName(url)).toEqual(expectedName);
}
