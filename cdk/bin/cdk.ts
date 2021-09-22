#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {KafkaStoreAppStack} from '../lib/cdk-stack';

const app = new cdk.App();
new KafkaStoreAppStack(app, 'KafkaStoreApp', {
});
