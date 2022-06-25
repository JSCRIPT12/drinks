import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { getEnvVars } from '~/utils/env.server';
import { primeContentCache } from '~/utils/prime-content-cache.server';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  if (
    request.headers.get('Content-Type') !==
    'application/vnd.contentful.management.v1+json'
  ) {
    return new Response(null, { status: 415 });
  }

  const { CONTENTFUL_WEBHOOK_TOKEN } = getEnvVars();
  if (
    request.headers.get('X-Contentful-Webhook-Token') !==
    CONTENTFUL_WEBHOOK_TOKEN
  ) {
    return new Response(null, { status: 401 });
  }

  await primeContentCache();
  return new Response(null, { status: 204 });
};

export const loader: LoaderFunction = async () => {
  return new Response(null, { status: 405 });
};
